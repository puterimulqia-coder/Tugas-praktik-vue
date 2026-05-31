<template>
  <div>
    <!-- Hero Banner -->
    <div class="hero-banner">
      <div class="hero-text">
        <h1 class="hero-title">Selamat Datang di SITTA</h1>
        <p class="hero-sub">
          Sistem Informasi Pemesanan &amp; Distribusi Bahan Ajar<br/>
          <strong>Universitas Terbuka</strong>
        </p>
        <div class="flex gap-3 mt-4 flex-wrap">
          <button class="btn btn-teal" @click="$emit('goTo', 'pesan')">🛒 Buat Pesanan</button>
          <button class="btn btn-outline" style="border-color:#fff;color:#fff" @click="$emit('goTo', 'stok')">📦 Lihat Stok</button>
        </div>
      </div>
      <div class="hero-art">📚</div>
    </div>

    <!-- Statistik Ringkas -->
    <div class="grid-3" style="margin-bottom:20px">
      <!-- Indikator 3: v-if / v-else-if / v-else pada ikon status -->
      <div
        v-for="stat in statistik"
        :key="stat.label"
        class="stat-card"
        :style="{ borderTopColor: stat.warna }"
      >
        <div class="stat-icon" :style="{ background: stat.warna }">{{ stat.ikon }}</div>
        <div>
          <div class="stat-angka">{{ stat.nilai }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- Peringatan Stok Rendah -->
    <!-- Indikator 3: v-show berdasarkan kondisi -->
    <div v-show="stokKritis.length > 0" class="alert-box alert-danger">
      <strong>⚠️ Peringatan Stok!</strong>
      Terdapat <strong>{{ stokKritis.length }}</strong> bahan ajar dengan stok di bawah safety stock.
      <span
        v-for="(item, i) in stokKritis"
        :key="item.kode"
      >{{ item.judul }}<span v-if="i < stokKritis.length - 1">, </span></span>
    </div>

    <!-- Stok Aman -->
    <div v-show="stokKritis.length === 0" class="alert-box alert-success">
      ✅ Semua stok bahan ajar dalam kondisi aman.
    </div>

    <!-- Tabel Ringkasan Stok -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">📦</div>
        <h2>Ringkasan Stok per Kategori</h2>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <!-- Indikator 6: v-for name-based index (object) -->
              <th v-for="(val, key) in headerTabel" :key="key">{{ val }}</th>
            </tr>
          </thead>
          <tbody>
            <!-- Indikator 6: v-for zero-based index pada array -->
            <tr v-for="(baris, idx) in ringkasanKategori" :key="baris.kategori">
              <td>{{ idx + 1 }}</td>
              <td><strong>{{ baris.kategori }}</strong></td>
              <td>{{ baris.jumlah }}</td>
              <!-- Indikator 7: Filter formatRupiah -->
              <td>{{ $filters.formatRupiah(baris.totalHarga) }}</td>
              <!-- Indikator 3: v-if / v-else-if / v-else -->
              <td>
                <span v-if="baris.ada_kritis" class="badge badge-danger">Ada Kritis</span>
                <span v-else-if="baris.ada_rendah" class="badge badge-warning">Ada Rendah</span>
                <span v-else class="badge badge-success">Aman</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppDashboard',

  props: {
    stok:  { type: Array, default: () => [] },
    paket: { type: Array, default: () => [] }
  },

  emits: ['goTo'],

  // Indikator 4: Computed Properties
  computed: {
    stokKritis() {
      return this.stok.filter(s => s.qty < s.safety)
    },

    statistik() {
      return [
        {
          label: 'Total Judul Bahan Ajar',
          nilai: this.stok.length,
          ikon:  '📖',
          warna: '#1B3A6B'
        },
        {
          label: 'Paket Tersedia',
          nilai: this.paket.length,
          ikon:  '🎁',
          warna: '#1ABC9C'
        },
        {
          label: 'Stok Perlu Perhatian',
          nilai: this.stokKritis.length,
          ikon:  '⚠️',
          warna: this.stokKritis.length > 0 ? '#E74C3C' : '#27AE60'
        }
      ]
    },

    // Indikator 6: name-based index – header tabel sebagai object
    headerTabel() {
      return {
        no:       'No.',
        kategori: 'Kategori',
        jumlah:   'Jumlah Judul',
        harga:    'Total Nilai Stok',
        status:   'Status'
      }
    },

    ringkasanKategori() {
      const map = {}
      this.stok.forEach(s => {
        if (!map[s.kategori]) {
          map[s.kategori] = { kategori: s.kategori, jumlah: 0, totalHarga: 0, ada_kritis: false, ada_rendah: false }
        }
        map[s.kategori].jumlah++
        map[s.kategori].totalHarga += s.harga * s.qty
        if (s.qty < s.safety * 0.5) map[s.kategori].ada_kritis = true
        else if (s.qty < s.safety)  map[s.kategori].ada_rendah = true
      })
      return Object.values(map)
    }
  }
}
</script>

<style scoped>
.hero-banner {
  background: linear-gradient(135deg, var(--navy-dk) 0%, var(--navy) 60%, #1a6fa0 100%);
  border-radius: 14px;
  padding: 36px 32px;
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;
}
.hero-title {
  font-family: var(--font-head);
  font-size: 1.9rem;
  color: #fff;
  margin-bottom: 8px;
}
.hero-sub { color: rgba(255,255,255,.8); line-height: 1.6; font-size: .95rem; }
.hero-art { font-size: 5rem; opacity: .5; }

.stat-card {
  background: #fff;
  border-radius: var(--radius);
  border-top: 4px solid var(--navy);
  padding: 20px;
  display: flex; align-items: center; gap: 14px;
  box-shadow: var(--shadow);
}
.stat-icon {
  width: 48px; height: 48px;
  border-radius: 10px;
  display: grid; place-items: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}
.stat-angka { font-family: var(--font-head); font-size: 1.8rem; color: var(--navy); }
.stat-label { font-size: .8rem; color: var(--muted); }

.alert-box {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: .9rem;
}
.alert-danger  { background: #fdecea; color: #922b21; border-left: 4px solid var(--red); }
.alert-success { background: #d5f5e3; color: #1e8449; border-left: 4px solid #27ae60; }
</style>
