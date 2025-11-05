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

window.generatePackageFields = function (num) {
  const container = document.getElementById("packageContainer");
  container.innerHTML = "";
  for (let i = 1; i <= num; i++) {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>الباقة للخط ${i}:</label>
      <select id="package${i}" required>
          <option value="select package">Select pakage</option>
                        <option value="Super kix 25">Super kix 25</option>
                        <option value="Super kix 32">Super kix 32</option>
                        <option value="Super kix 45">Super kix 45</option>
                        <option value="Super kix 60">Super kix 60</option>
                        <option value="Super kix 85">Super kix 85</option>
                        <option value="Super kix 105">Super kix 105</option>
                        <option value="Super kix 130">Super kix 130</option>
                        <option value="New control Tazbeet 40">New control Tazbeet 40</option>
                        <option value="New control Tazbeet 50">New control Tazbeet 50</option>
                        <option value="New control Tazbeet 90">New control Tazbeet 90</option>
                        <option value="New control Tazbeet 145">New control Tazbeet 145</option>
                        <option value="We club 32">We club 32</option>
                        <option value="We club 50">We club 50</option>
                        <option value="We club 85">We club 85</option>
                        <option value="We club 130">We club 130</option>
                        <option value="We mix 215">We mix 215</option>
                        <option value="We mix 310">We mix 310</option>
                        <option value="Nitro 13">Nitro 13</option>
                        <option value="Nitro 25">Nitro 25</option>
                        <option value="Nitro 50">Nitro 50</option>
                        <option value="Nitro 90">Nitro 90</option>
                        <option value="Nitro 130">Nitro 130</option>
                        <option value="Nitro 260">Nitro 260</option>
                        <option value="Nitro 585">Nitro 585</option>
                        <option value="We gold 260">We gold 260</option>
                        <option value="We gold 525">We gold 525</option>
                        <option value="We gold 775">We gold 775</option>
                        <option value="We gold 1050">We gold 1050</option>
                        <option value="We gold 1300">We gold 1300</option>
                        <option value="We gold 2000">We gold 2000</option>
                        <option value="We Air 260">We Air 260</option>
                        <option value="We air 400">We air 400</option>
                        <option value="We air 600">We air 600</option>
                        <option value="We air 900">We air 900</option>
                        <option value="We air 1100">We air 1100</option>
                    </select>`;
    container.appendChild(div);
  }
};

document.getElementById("dataEntryForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const packages = [];
  document.querySelectorAll("select[id^='package']").forEach((el) => {
    packages.push(el.value);
  });

  const entry = {
    user_id: currentUser,
    date: new Date().toISOString().split("T")[0],
    lines: Number(document.getElementById("lines").value),
    we_pay: Number(document.getElementById("wePay").value),
    data: Number(document.getElementById("data").value),
    adsl: Number(document.getElementById("adsl").value),
    fixed: Number(document.getElementById("fixed").value),
    egyption: Number(document.getElementById("egyption").value),
    foreign_count: Number(document.getElementById("foreign").value),

    packages,
  };

  const { error } = await supabase.from("sales_data").insert([entry]);
  if (error) {
    console.error(error);
    alert("حدث خطأ أثناء الحفظ!");
  } else {
    alert("تم الحفظ بنجاح!");
    window.location.href = "sales-dashboard.html";
  }
});
