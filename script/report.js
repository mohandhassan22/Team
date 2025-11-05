import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://zbmpbhunlefkweugesip.supabase.co"; // استبدل
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibXBiaHVubGVma3dldWdlc2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYzNzAsImV4cCI6MjA3NzI0MjM3MH0.u9qSSvF7Ets039VIOv8AoPSDYFFJp5wytB3TLoydK9c"; // استبدل
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  alert("يجب تسجيل الدخول أولاً");
  window.location.href = "index.html";
}

let allData = [];

window.addEventListener("DOMContentLoaded", loadData);

async function loadData() {
  try {
    let { data, error } = await supabase
      .from("cash_entries")
      .select("*")
      .order("timestamp", { ascending: false });
    if (error) throw error;

    // لو المستخدم مش admin
    if (currentUser !== "Mohand") {
      data = data.filter((row) => row.user_id === currentUser);
    }

    allData = data;
    renderTable(data);
  } catch (err) {
    console.error(err);
    alert("حدث خطأ أثناء تحميل البيانات");
  }
}

function renderTable(data) {
  const tbody = document.querySelector("#cashTable tbody");
  tbody.innerHTML = data
    .map(
      (e) => `
    <tr>
      <td>${new Date(e.timestamp).toLocaleString("ar-EG")}</td>
      <td>${e.bss || 0}</td>
      <td>${e.we_pay_added || 0}</td>
      <td>${e.we_pay_withdrawn || 0}</td>
      <td>${e.visa_withdrawn || 0}</td>
      <td>${e.refund || 0}</td>
      <td>${e.other_withdrawn || 0}</td>
      <td>${e.total || 0}</td>
      <td>${e.user_id}</td>
    </tr>`
    )
    .join("");

  // إجمالي لو admin
  if (currentUser === "Mohand" && data.length) {
    const total = data.reduce((sum, e) => sum + (Number(e.total) || 0), 0);
    tbody.innerHTML += `
      <tr style="background:#f0f0f0;font-weight:bold">
        <td colspan="7">الإجمالي العام</td>
        <td>${total.toFixed(2)}</td>
        <td></td>
      </tr>`;
  }
}

window.filterByDate = function () {
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;

  if (!from || !to) {
    renderTable(allData);
    return;
  }

  const start = new Date(from);
  const end = new Date(to);
  end.setHours(23, 59, 59);

  const filtered = allData.filter((e) => {
    const t = new Date(e.timestamp);
    return t >= start && t <= end;
  });

  renderTable(filtered);
};

window.exportToExcel = async function () {
  try {
    let data = allData;
    if (currentUser !== "Mohand") {
      data = data.filter((row) => row.user_id === currentUser);
    }

    const excelData = data.map((d) => ({
      التاريخ: new Date(d.timestamp).toLocaleString("ar-EG"),
      BSS: d.bss || 0,
      "إضافة We Pay": d.we_pay_added || 0,
      "سحب We Pay": d.we_pay_withdrawn || 0,
      "سحب Visa": d.visa_withdrawn || 0,
      Refund: d.refund || 0,
      "سحوبات أخرى": d.other_withdrawn || 0,
      الإجمالي: d.total || 0,
      المستخدم: d.user_id,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "التقرير النقدي");

    const fileName = `كشف_نقدية_${currentUser}_${new Date()
      .toISOString()
      .split("T")[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error(error);
    alert("حدث خطأ أثناء تصدير البيانات");
  }
};
