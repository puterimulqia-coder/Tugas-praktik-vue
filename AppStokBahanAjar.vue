<template>
  <div>
    <h1 class="section-title">📦 Stok Bahan Ajar</h1>
    <p class="section-sub">Kelola dan pantau ketersediaan bahan ajar SITTA.</p>

    <!-- ── Filter & Pencarian ── -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">🔍</div>
        <h2>Filter &amp; Pencarian</h2>
        <!-- Indikator 3: v-show – tampilkan tombol reset hanya jika ada filter aktif -->
        <button v-show="adaFilter" class="btn btn-outline btn-sm" style="margin-left:auto" @click="resetFilter">
          ✖ Reset Filter
        </button>
      </div>

      <div class="grid-3">
        <!-- Indikator 4: v-model two-way binding – input pencarian -->
        <div class="form-group mb-0">
          <label class="form-label">Cari Judul / Kode</label>
          <input
            v-model="cariTeks"
            class="form-control"
            type="text"
            placeholder="Ketik judul atau kode..."
            @keyup.escape="cariTeks = ''"
          />
        </div>

        <!-- Indikator 4: v-model pada select – filter kategori -->
        <div class="form-group mb-0">
          <label class="form-label">Kategori MK</label>
          <select v-model="filterKategori" class="form-control">
            <option value="">— Semua Kategori —</option>
            <!-- Indikator 6: v-for array -->
            <option v-for="kat in kategoriList" :key="kat" :value="kat">{{ kat }}</option>
          </select>
        </div>

        <!-- Indikator 4: v-model pada select – filter UPBJJ -->
        <div class="form-group mb-0">
          <label class="form-label">UPBJJ</label>
          <select v-model="filterUpbjj" class="form-control">
            <option value="">— Semua UPBJJ —</option>
            <option v-for="kota in upbjjList" :key="kota" :value="kota">{{ kota }}</option>
          </select>
        </div>
      </div>

      <!-- Info watcher hasil pencarian -->
      <!-- Indikator 3: v-if / v-else -->
      <div v-if="pesanWatcher" class="watcher-info mt-4">
        🔔 {{ pesanWatcher }}
      </div>
    </div>

    <!-- ── Tabel Stok ── -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">📋</div>
        <h2>Daftar Bahan Ajar</h2>
        <span class="badge badge-info" style="margin-left:auto">
          {{ stokTerfilter.length }} item ditampilkan
        </span>
      </div>

      <!-- Indikator 3: v-if tidak ada hasil -->
      <div v-if="stokTerfilter.length === 0" class="kosong-state">
        😔 Tidak ada bahan ajar yang sesuai filter.
      </div>

      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <!-- Indikator 6: v-for name-based index (object) untuk header kolom -->
              <th v-for="(judul, key) in kolomTabel" :key="key">{{ judul }}</th>
            </tr>
          </thead>
          <tbody>
            <!-- Indikator 6: v-for zero-based index pada array stok -->
            <tr
              v-for="(item, index) in stokTerfilter"
              :key="item.kode"
              :class="{ 'row-kritis': item.qty < item.safety }"
            >
              <td>{{ index + 1 }}</td>
              <td><code>{{ item.kode }}</code></td>

              <!-- Indikator 2: Mustache biasa -->
              <td><strong>{{ item.judul }}</strong></td>

              <!-- Indikator 4: v-bind:class dinamis -->
              <td>
                <span
                  class="badge"
                  :class="kelasKategori(item.kategori)"
                  v-text="item.kategori"
                />
              </td>

              <!-- Indikator 4: v-bind:title untuk tooltip -->
              <td :title="`Lokasi rak: ${item.lokasiRak}`">{{ item.upbjj }}</td>
              <td>{{ item.lokasiRak }}</td>

              <!-- Indikator 7: Filter formatRupiah -->
              <td class="text-right"><strong>{{ $filters.formatRupiah(item.harga) }}</strong></td>

              <td class="text-right">
                <span :class="['qty-badge', item.qty < item.safety ? 'qty-rendah' : 'qty-aman']">
                  {{ item.qty }}
                </span>
                <small class="text-muted"> / {{ item.safety }}</small>
              </td>

              <!-- Indikator 8: Penggunaan AppBadgeStok (custom component) -->
              <td>
                <AppBadgeStok :qty="item.qty" :safety="item.safety" />
              </td>

              <!-- Indikator 2: v-html untuk render HTML dari data -->
              <td class="catatan-cell" v-html="item.catatanHTML" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Mode Object v-for (demonstrasi name-based) ── -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">📊</div>
        <h2>Detail Properti Stok (name-based v-for)</h2>
        <small class="text-muted" style="margin-left:auto">Pilih item untuk inspeksi</small>
      </div>

      <div class="flex gap-2 flex-wrap" style="margin-bottom:14px">
        <!-- Indikator 4: @click event handler -->
        <button
          v-for="item in stok"
          :key="item.kode"
          class="btn btn-sm"
          :class="selectedKode === item.kode ? 'btn-primary' : 'btn-outline'"
          @click="selectedKode = item.kode"
        >
          {{ item.kode }}
        </button>
      </div>

      <!-- Indikator 3: v-if untuk menampilkan detail -->
      <div v-if="selectedItem" class="detail-grid">
        <!-- Indikator 6: v-for name-based index pada object -->
        <div
          v-for="(nilai, kunci) in selectedItem"
          :key="kunci"
          class="detail-row"
        >
          <!-- Indikator 7: Filter hurupKapital -->
          <span class="detail-key">{{ $filters.hurupKapital(kunci) }}</span>
          <!-- Indikator 3: v-if nilai adalah string/number vs object -->
          <span v-if="typeof nilai !== 'object'" class="detail-val">{{ nilai }}</span>
          <span v-else class="detail-val text-muted">{{ JSON.stringify(nilai) }}</span>
        </div>
      </div>
      <div v-else class="kosong-state">👆 Pilih kode bahan ajar di atas</div>
    </div>
  </div>
</template>

<script>
import AppBadgeStok from './AppBadgeStok.vue'

export default {
  name: 'AppStokBahanAjar',

  // Indikator 8: Registrasi custom component
  components: { AppBadgeStok },

  props: {
    stok:         { type: Array, default: () => [] },
    kategoriList: { type: Array, default: () => [] },
    upbjjList:    { type: Array, default: () => [] }
  },

  data() {
    return {
      cariTeks:      '',
      filterKategori: '',
      filterUpbjj:   '',
      selectedKode:  null,
      pesanWatcher:  ''      // pesan dari watcher
    }
  },

  // Indikator 5: WATCHER 1 & 2
  watch: {
    /**
     * Watcher 1: Pantau perubahan teks pencarian
     * → tampilkan notifikasi jumlah hasil
     */
    cariTeks(baru, lama) {
      if (baru === '') {
        this.pesanWatcher = ''
        return
      }
      const jml = this.stokTerfilter.length
      if (jml === 0) {
        this.pesanWatcher = `Pencarian "${baru}" tidak menemukan hasil.`
      } else {
        this.pesanWatcher = `Pencarian "${baru}" menemukan ${jml} bahan ajar.`
      }
    },

    /**
     * Watcher 2: Pantau perubahan filter kategori
     * → reset pilihan item & tampilkan notifikasi
     */
    filterKategori(baru) {
      this.selectedKode = null
      if (baru) {
        this.pesanWatcher = `Filter aktif: Kategori "${baru}" – ${this.stokTerfilter.length} item ditemukan.`
      } else {
        this.pesanWatcher = ''
      }
    },

    /**
     * Watcher 3: Pantau filter UPBJJ (deep watch sebagai contoh)
     */
    filterUpbjj(baru) {
      this.selectedKode = null
      if (baru) {
        this.pesanWatcher = `Filter aktif: UPBJJ "${baru}" – ${this.stokTerfilter.length} item.`
      }
    }
  },

  // Indikator 4: Computed Properties
  computed: {
    adaFilter() {
      return this.cariTeks !== '' || this.filterKategori !== '' || this.filterUpbjj !== ''
    },

    stokTerfilter() {
      return this.stok.filter(item => {
        const cocokteks = !this.cariTeks ||
          item.judul.toLowerCase().includes(this.cariTeks.toLowerCase()) ||
          item.kode.toLowerCase().includes(this.cariTeks.toLowerCase())

        const cocokKat = !this.filterKategori || item.kategori === this.filterKategori
        const cocokUpbjj = !this.filterUpbjj  || item.upbjj === this.filterUpbjj

        return cocokteks && cocokKat && cocokUpbjj
      })
    },

    selectedItem() {
      return this.stok.find(s => s.kode === this.selectedKode) || null
    },

    // Indikator 6: name-based – header kolom sebagai object
    kolomTabel() {
      return {
        no:       'No.',
        kode:     'Kode',
        judul:    'Judul Bahan Ajar',
        kategori: 'Kategori',
        upbjj:    'UPBJJ',
        rak:      'Lokasi Rak',
        harga:    'Harga',
        stok:     'Stok / Safety',
        level:    'Level',
        catatan:  'Catatan'
      }
    }
  },

  methods: {
    resetFilter() {
      this.cariTeks = ''
      this.filterKategori = ''
      this.filterUpbjj = ''
      this.pesanWatcher = ''
    },

    kelasKategori(kat) {
      return {
        'MK Wajib':     'badge-info',
        'MK Pilihan':   'badge-secondary',
        'Praktikum':    'badge-warning',
        'Problem-Based':'badge-success'
      }[kat] || 'badge-secondary'
    }
  }
}
</script>

<style scoped>
.watcher-info {
  background: #eaf4ff;
  border-left: 4px solid #2980B9;
  padding: 10px 14px;
  border-radius: 0 8px 8px 0;
  font-size: .875rem;
  color: #1a5276;
}
.row-kritis { background: #fff8f8 !important; }
.kosong-state {
  text-align: center; padding: 40px;
  color: var(--muted); font-size: 1rem;
}
.qty-badge {
  display: inline-block;
  padding: 2px 8px; border-radius: 12px;
  font-weight: 700; font-size: .85rem;
}
.qty-aman   { background: #d5f5e3; color: #1e8449; }
.qty-rendah { background: #fdecea; color: #c0392b; }
.catatan-cell { font-size: .8rem; max-width: 160px; }
.detail-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 8px; }
.detail-row {
  display: flex; gap: 8px; align-items: baseline;
  padding: 7px 10px;
  background: var(--bg);
  border-radius: 6px;
}
.detail-key {
  font-size: .72rem; font-weight: 700;
  color: var(--navy); min-width: 80px;
}
.detail-val { font-size: .85rem; }
</style>
