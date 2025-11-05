import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://zbmpbhunlefkweugesip.supabase.co"; // استبدل
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibXBiaHVubGVma3dldWdlc2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYzNzAsImV4cCI6MjA3NzI0MjM3MH0.u9qSSvF7Ets039VIOv8AoPSDYFFJp5wytB3TLoydK9c"; // استبدل
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  alert("يجب تسجيل الدخول أولاً");
  window.location.href = "index.html";
}

document.getElementById('username').textContent = currentUser;

window.addEventListener("DOMContentLoaded", loadData);

async function loadData() {
  let { data, error } = await supabase
    .from("sales_data")
    .select("*")
    .order("inserted_at", { ascending: false });

  if (error) {
    console.error(error);
    alert("خطأ أثناء تحميل البيانات");
    return;
  }

  // المدير يشوف الكل، اليوزر يشوف نفسه فقط
  if (currentUser !== "Mohand") {
    data = data.filter((row) => row.user_id === currentUser);
  }

  const tbody = document.querySelector("#dailyTable tbody");
  tbody.innerHTML = data
    .map(
      (d) => `
      <tr>
        <td>${d.date}</td>
        <td>${d.lines || 0}</td>
        <td>${d.we_pay || 0}</td>
        <td>${d.adsl || 0}</td>
        <td>${d.fixed || 0}</td>
        <td>${d.data || 0}</td>
        <td>${d.egyption || 0}</td>
        <td>${d.foreign_count || 0}</td>
        <td>${d.user_id}</td>
      </tr>`
    )
    .join("");
}
