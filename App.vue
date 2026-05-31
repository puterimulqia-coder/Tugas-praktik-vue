<template>
  <div id="sitta-app">
    <!-- ===== NAVBAR ===== -->
    <AppNavBar :activeTab="activeTab" @changeTab="handleChangeTab" />

    <!-- ===== MAIN CONTENT ===== -->
    <main class="main-content">
      <!-- Dashboard -->
      <AppDashboard
        v-if="activeTab === 'dashboard'"
        :stok="appData.stok"
        :paket="appData.paket"
        @goTo="handleChangeTab"
      />

      <!-- Stok Bahan Ajar -->
      <AppStokBahanAjar
        v-else-if="activeTab === 'stok'"
        :stok="appData.stok"
        :kategoriList="appData.kategoriList"
        :upbjjList="appData.upbjjList"
      />

      <!-- Form Pemesanan -->
      <AppFormPemesanan
        v-else-if="activeTab === 'pesan'"
        :paket="appData.paket"
        :upbjjList="appData.upbjjList"
        :pengirimanList="appData.pengirimanList"
        :stok="appData.stok"
      />

      <!-- Daftar Paket -->
      <AppDaftarPaket
        v-else-if="activeTab === 'paket'"
        :paket="appData.paket"
        :stok="appData.stok"
      />

      <!-- Tracking Pesanan -->
      <AppTrackingPesanan
        v-else-if="activeTab === 'tracking'"
        :trackingData="appData.tracking"
      />
    </main>

    <!-- ===== FOOTER ===== -->
    <footer class="app-footer">
      <span v-text="'© 2025 SITTA – Universitas Terbuka. Semua Hak Dilindungi.'" />
    </footer>
  </div>
</template>

<script>
import appData from './data/data.json'
import AppNavBar           from './components/AppNavBar.vue'
import AppDashboard        from './components/AppDashboard.vue'
import AppStokBahanAjar    from './components/AppStokBahanAjar.vue'
import AppFormPemesanan    from './components/AppFormPemesanan.vue'
import AppDaftarPaket      from './components/AppDaftarPaket.vue'
import AppTrackingPesanan  from './components/AppTrackingPesanan.vue'

export default {
  name: 'App',

  // ── Indikator 8: Pendaftaran Vue Component ──────────────────
  components: {
    AppNavBar,
    AppDashboard,
    AppStokBahanAjar,
    AppFormPemesanan,
    AppDaftarPaket,
    AppTrackingPesanan
  },

  data() {
    return {
      appData,           // semua dummy data dari JSON
      activeTab: 'dashboard'
    }
  },

  methods: {
    handleChangeTab(tab) {
      this.activeTab = tab
    }
  }
}
</script>

<style>
/* ================================================================
   GLOBAL STYLES
   ================================================================ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --navy:     #1B3A6B;
  --navy-dk:  #122847;
  --teal:     #1ABC9C;
  --teal-lt:  #d1f5ee;
  --amber:    #F39C12;
  --red:      #E74C3C;
  --blue-lt:  #2980B9;
  --bg:       #EEF2F7;
  --card:     #FFFFFF;
  --text:     #2C3E50;
  --muted:    #7F8C8D;
  --border:   #DCE3EC;
  --radius:   10px;
  --shadow:   0 2px 12px rgba(27,58,107,.10);
  --shadow-lg:0 6px 28px rgba(27,58,107,.16);
  --font-head:'Libre Baskerville', Georgia, serif;
  --font-body:'Nunito', sans-serif;
}

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

#sitta-app { display: flex; flex-direction: column; min-height: 100vh; }

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 20px;
  width: 100%;
}

/* ── Cards ── */
.card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 24px;
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 2px solid var(--border);
}
.card-header h2 {
  font-family: var(--font-head);
  font-size: 1.25rem;
  color: var(--navy);
}
.card-icon {
  width: 38px; height: 38px;
  background: var(--navy);
  border-radius: 8px;
  display: grid; place-items: center;
  color: #fff; font-size: 1.1rem;
}

/* ── Badges ── */
.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .03em;
}
.badge-success  { background: #d5f5e3; color: #1e8449; }
.badge-warning  { background: #fef9e7; color: #b7770d; }
.badge-danger   { background: #fdecea; color: #c0392b; }
.badge-info     { background: #d6eaf8; color: #1a6fa0; }
.badge-secondary{ background: #ecf0f1; color: #5d6d7e; }

/* ── Buttons ── */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 20px;
  border-radius: 8px;
  border: none; cursor: pointer;
  font-family: var(--font-body);
  font-size: .9rem; font-weight: 600;
  transition: all .18s;
}
.btn:active { transform: scale(.97); }
.btn-primary  { background: var(--navy);  color: #fff; }
.btn-primary:hover { background: var(--navy-dk); }
.btn-teal     { background: var(--teal);  color: #fff; }
.btn-teal:hover { background: #17a589; }
.btn-outline  { background: transparent; border: 2px solid var(--navy); color: var(--navy); }
.btn-outline:hover { background: var(--navy); color: #fff; }
.btn-danger   { background: var(--red);   color: #fff; }
.btn-danger:hover { background: #c0392b; }
.btn-sm { padding: 5px 12px; font-size: .8rem; }

/* ── Form controls ── */
.form-group { margin-bottom: 16px; }
.form-label {
  display: block;
  font-size: .85rem; font-weight: 600;
  color: var(--navy);
  margin-bottom: 5px;
}
.form-control {
  width: 100%;
  padding: 9px 13px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: .9rem;
  color: var(--text);
  background: #fff;
  transition: border-color .15s, box-shadow .15s;
}
.form-control:focus {
  outline: none;
  border-color: var(--teal);
  box-shadow: 0 0 0 3px rgba(26,188,156,.15);
}
.form-control.is-error { border-color: var(--red); }
.form-error { font-size: .78rem; color: var(--red); margin-top: 4px; }

/* ── Table ── */
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
thead th {
  background: var(--navy);
  color: #fff;
  padding: 11px 14px;
  text-align: left;
  font-size: .82rem;
  font-weight: 600;
  letter-spacing: .04em;
  white-space: nowrap;
}
thead th:first-child { border-radius: 8px 0 0 0; }
thead th:last-child  { border-radius: 0 8px 0 0; }
tbody tr { border-bottom: 1px solid var(--border); transition: background .12s; }
tbody tr:hover { background: #f0f7ff; }
tbody td { padding: 11px 14px; font-size: .875rem; }

/* ── Section title ── */
.section-title {
  font-family: var(--font-head);
  font-size: 1.7rem;
  color: var(--navy);
  margin-bottom: 4px;
}
.section-sub { color: var(--muted); font-size: .9rem; margin-bottom: 24px; }

/* ── Footer ── */
.app-footer {
  text-align: center;
  padding: 16px;
  font-size: .8rem;
  color: var(--muted);
  border-top: 1px solid var(--border);
}

/* ── Utility ── */
.text-muted    { color: var(--muted); }
.text-right    { text-align: right; }
.mt-4 { margin-top: 16px; }
.mb-0 { margin-bottom: 0; }
.flex { display: flex; }
.flex-wrap { flex-wrap: wrap; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 640px) {
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
  .main-content { padding: 20px 14px; }
}
</style>
