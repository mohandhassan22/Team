  import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

    const SUPABASE_URL = "https://zbmpbhunlefkweugesip.supabase.co"; // استبدل
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpibXBiaHVubGVma3dldWdlc2lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjYzNzAsImV4cCI6MjA3NzI0MjM3MH0.u9qSSvF7Ets039VIOv8AoPSDYFFJp5wytB3TLoydK9c"; // استبدل
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const usernameEl = document.getElementById('username');
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) window.location.href = 'index.html';
    else usernameEl.textContent = currentUser;

    function toNumber(v) {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    }

    function calculateTotal() {
      const addFields = ['bss', 'wePayAdded'];
      const subFields = ['wePayWithdrawn', 'visaWithdrawn', 'otherWithdrawn', 'refund'];
      let total = 0;
      addFields.forEach(id => total += toNumber(document.getElementById(id).value));
      subFields.forEach(id => total -= toNumber(document.getElementById(id).value));
      document.getElementById('totalCash').value = total;
      return total;
    }

    ['bss','wePayAdded','wePayWithdrawn','visaWithdrawn','refund','otherWithdrawn'].forEach(id => {
      document.getElementById(id).addEventListener('input', calculateTotal);
    });

    window.saveCashEntry = async function(event) {
      event.preventDefault();
      const cashEntry = {
        user_id: currentUser,
        bss: Number(document.getElementById('bss').value),
        we_pay_added: Number(document.getElementById('wePayAdded').value),
        we_pay_withdrawn: Number(document.getElementById('wePayWithdrawn').value),
        visa_withdrawn: Number(document.getElementById('visaWithdrawn').value),
        refund: Number(document.getElementById('refund').value),
        other_withdrawn: Number(document.getElementById('otherWithdrawn').value),
        total: calculateTotal(),
        date: new Date().toLocaleString("ar-EG"),
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase.from("cash_entries").insert([cashEntry]);
      if (error) {
        console.error(error);
        alert("حدث خطأ أثناء الحفظ!");
      } else {
        alert("تم الحفظ بنجاح!");
        event.target.reset();
        calculateTotal();
      }
    };