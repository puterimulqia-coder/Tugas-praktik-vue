<template>
  <div>
    <h1 class="section-title">📍 Tracking Pesanan</h1>
    <p class="section-sub">Lacak status dan perjalanan kiriman bahan ajar Anda.</p>

    <!-- ── Form Pencarian ── -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">🔍</div>
        <h2>Lacak Nomor DO</h2>
      </div>

      <div class="search-row">
        <!-- Indikator 4: v-model two-way binding -->
        <input
          v-model="nomorDO"
          class="form-control"
          type="text"
          placeholder="Masukkan nomor DO (contoh: DO2025-0001)"
          style="flex:1"
          @keyup.enter="cariTracking"
          @input="resetHasil"
        />
        <!-- Indikator 4: @click event handler -->
        <button class="btn btn-primary" @click="cariTracking">
          🔍 Lacak
        </button>
        <button class="btn btn-outline" @click="resetCari">✕ Reset</button>
      </div>

      <!-- Contoh nomor DO -->
      <div class="contoh-do">
        <span class="text-muted" style="font-size:.8rem">Contoh nomor DO: </span>
        <button
          v-for="do_ in contohDO"
          :key="do_"
          class="btn btn-sm btn-outline"
          style="font-size:.78rem;padding:3px 10px"
          @click="pakaiContoh(do_)"
        >
          {{ do_ }}
        </button>
      </div>

      <!-- Pesan watcher -->
      <!-- Indikator 3: v-show untuk notifikasi watcher -->
      <div v-show="pesanWatcher" class="watcher-info mt-4">
        🔔 {{ pesanWatcher }}
      </div>
    </div>

    <!-- ── Hasil Tidak Ditemukan ── -->
    <!-- Indikator 3: v-if / v-else-if / v-else -->
    <div v-if="sudahCari && !hasilTracking" class="card">
      <div class="kosong-state">
        😔 Nomor DO <strong>"{{ nomorDO }}"</strong> tidak ditemukan.
        <br/><small class="text-muted">Pastikan nomor DO sudah benar.</small>
      </div>
    </div>

    <!-- ── Hasil Tracking ── -->
    <div v-else-if="hasilTracking" class="card">
      <div class="card-header">
        <div class="card-icon">📦</div>
        <h2>Detail Pesanan</h2>
        <!-- Indikator 7: Filter kelasStatus untuk badge -->
        <span
          class="badge"
          :class="$filters.kelasStatus(hasilTracking.status)"
          style="margin-left:auto; font-size:.85rem"
        >
          {{ hasilTracking.status }}
        </span>
      </div>

      <!-- Indikator 6: v-for name-based pada object tracking detail -->
      <div class="detail-grid-track">
        <div
          v-for="(nilai, kunci) in infoRingkas"
          :key="kunci"
          class="detail-track-item"
        >
          <!-- Indikator 7: Filter hurupKapital pada key -->
          <span class="dt-key">{{ $filters.hurupKapital(kunci) }}</span>
          <span class="dt-val">{{ nilai }}</span>
        </div>
      </div>

      <!-- ── Timeline Perjalanan ── -->
      <div style="margin-top:24px">
        <h3 class="timeline-title">🗓 Riwayat Perjalanan</h3>

        <!-- Indikator 6: v-for zero-based index pada array perjalanan -->
        <div class="timeline">
          <div
            v-for="(step, idx) in hasilTracking.perjalanan"
            :key="idx"
            class="timeline-item"
            :class="{ 'tl-last': idx === hasilTracking.perjalanan.length - 1 }"
          >
            <div class="tl-bullet">
              <!-- Indikator 3: v-if untuk ikon langkah terakhir -->
              <span v-if="idx === hasilTracking.perjalanan.length - 1">📍</span>
              <span v-else>✅</span>
            </div>
            <div class="tl-content">
              <!-- Indikator 7: Filter formatWaktu -->
              <div class="tl-waktu">{{ $filters.formatWaktu(step.waktu) }}</div>
              <!-- Indikator 2: v-text untuk keterangan -->
              <div class="tl-ket" v-text="step.keterangan" />
            </div>
          </div>
        </div>
      </div>

      <!-- Indikator 3: v-if cek status terkirim -->
      <div v-if="hasilTracking.status === 'Terkirim'" class="banner-terkirim">
        🎉 Paket telah berhasil diterima!
      </div>
      <div v-else class="banner-proses">
        🚚 Paket sedang dalam proses pengiriman.
      </div>
    </div>

    <!-- ── Placeholder sebelum cari ── -->
    <div v-else class="card kosong-state" style="padding:48px">
      📦 Masukkan nomor DO di atas untuk melacak pesanan Anda.
    </div>

    <!-- ── Semua Tracking (v-for pada object trackingData) ── -->
    <div class="card">
      <div class="card-header">
        <div class="card-icon">📋</div>
        <h2>Riwayat Semua Pesanan</h2>
        <span class="badge badge-info" style="margin-left:auto">
          {{ jumlahTracking }} pesanan
        </span>
      </div>

      <!-- Indikator 6: v-for name-based pada object trackingData -->
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th v-for="(v, k) in kolomTracking" :key="k">{{ v }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(data, noDO) in trackingData"
              :key="noDO"
              style="cursor:pointer"
              @click="pakaiContoh(noDO)"
            >
              <td><code>{{ noDO }}</code></td>
              <td>{{ data.nim }}</td>
              <td>{{ data.nama }}</td>
              <td>
                <span class="badge" :class="$filters.kelasStatus(data.status)">
                  {{ data.status }}
                </span>
              </td>
              <td>{{ data.ekspedisi }}</td>
              <!-- Indikator 7: Filter formatTanggal -->
              <td>{{ $filters.formatTanggal(data.tanggalKirim) }}</td>
              <!-- Indikator 7: Filter formatRupiah -->
              <td>{{ $filters.formatRupiah(data.total) }}</td>
              <td>
                <button class="btn btn-outline btn-sm" @click.stop="pakaiContoh(noDO)">
                  Lacak
                </button>
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
  name: 'AppTrackingPesanan',

  props: {
    trackingData: { type: Object, default: () => ({}) }
  },

  data() {
    return {
      nomorDO:      '',
      hasilTracking: null,
      sudahCari:     false,
      pesanWatcher:  ''
    }
  },

  // Indikator 5: WATCHER pada Tracking
  watch: {
    /**
     * Watcher 1: Amati nomorDO yang diketik
     * → beri feedback format
     */
    nomorDO(val) {
      if (!val) {
        this.pesanWatcher = ''
        return
      }
      if (/^DO\d{4}-\d{4}$/.test(val)) {
        this.pesanWatcher = `Format DO valid: "${val}". Tekan Enter atau klik Lacak.`
      } else {
        this.pesanWatcher = `Format DO: DO[TAHUN]-[4 digit] contoh: DO2025-0001`
      }
    },

    /**
     * Watcher 2: Pantau hasil tracking
     * → tampilkan notifikasi status
     */
    hasilTracking(val) {
      if (val && val.status === 'Dalam Perjalanan') {
        this.pesanWatcher = `Paket milik ${val.nama} sedang dalam perjalanan via ${val.ekspedisi}.`
      } else if (val && val.status === 'Terkirim') {
        this.pesanWatcher = `Paket milik ${val.nama} sudah berhasil terkirim! ✅`
      }
    }
  },

  // Indikator 4: Computed
  computed: {
    jumlahTracking() {
      return Object.keys(this.trackingData).length
    },

    contohDO() {
      return Object.keys(this.trackingData)
    },

    infoRingkas() {
      if (!this.hasilTracking) return {}
      return {
        'NIM':          this.hasilTracking.nim,
        'Nama':         this.hasilTracking.nama,
        'Ekspedisi':    this.hasilTracking.ekspedisi,
        'Tgl Kirim':    this.$filters.formatTanggal(this.hasilTracking.tanggalKirim),
        'Kode Paket':   this.hasilTracking.paket,
        'Total':        this.$filters.formatRupiah(this.hasilTracking.total)
      }
    },

    // Indikator 6: name-based – kolom tabel sebagai object
    kolomTracking() {
      return {
        noDO:     'No. DO',
        nim:      'NIM',
        nama:     'Nama',
        status:   'Status',
        ekspedisi:'Ekspedisi',
        tanggal:  'Tgl Kirim',
        total:    'Total',
        aksi:     'Aksi'
      }
    }
  },

  methods: {
    cariTracking() {
      this.sudahCari = true
      const key = this.nomorDO.trim().toUpperCase()
      this.hasilTracking = this.trackingData[key] || null
    },

    resetCari() {
      this.nomorDO = ''
      this.hasilTracking = null
      this.sudahCari = false
      this.pesanWatcher = ''
    },

    resetHasil() {
      if (this.sudahCari) {
        this.hasilTracking = null
        this.sudahCari = false
      }
    },

    pakaiContoh(noDO) {
      this.nomorDO = noDO
      this.cariTracking()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

<style scoped>
.search-row { display: flex; gap: 10px; flex-wrap: wrap; }
.contoh-do {
  display: flex; align-items: center; gap: 8px;
  margin-top: 10px; flex-wrap: wrap;
}
.watcher-info {
  background: #eaf4ff; border-left: 4px solid #2980B9;
  padding: 9px 13px; border-radius: 0 8px 8px 0;
  font-size: .85rem; color: #1a5276;
}
.kosong-state {
  text-align: center; padding: 40px;
  color: var(--muted); font-size: .95rem;
}
.detail-grid-track {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr));
  gap: 10px;
}
.detail-track-item {
  background: var(--bg); border-radius: 8px;
  padding: 10px 14px;
}
.dt-key { display: block; font-size: .7rem; font-weight: 700; color: var(--muted); margin-bottom: 2px; }
.dt-val { font-size: .9rem; font-weight: 600; color: var(--navy); }

/* Timeline */
.timeline-title {
  font-family: var(--font-head); color: var(--navy);
  font-size: 1rem; margin-bottom: 16px;
}
.timeline { position: relative; padding-left: 8px; }
.timeline::before {
  content: '';
  position: absolute; left: 22px; top: 0; bottom: 0;
  width: 2px; background: var(--border);
}
.timeline-item {
  display: flex; gap: 14px; align-items: flex-start;
  margin-bottom: 16px; position: relative;
}
.tl-bullet {
  width: 32px; height: 32px; flex-shrink: 0;
  background: #fff; border: 2px solid var(--border);
  border-radius: 50%;
  display: grid; place-items: center;
  font-size: .9rem; z-index: 1;
}
.tl-last .tl-bullet { border-color: var(--teal); background: var(--teal-lt); }
.tl-content { flex: 1; padding-top: 4px; }
.tl-waktu { font-size: .75rem; color: var(--muted); margin-bottom: 2px; }
.tl-ket { font-size: .875rem; font-weight: 600; color: var(--text); }

.banner-terkirim {
  margin-top: 16px; padding: 12px 16px;
  background: #d5f5e3; color: #1e8449;
  border-radius: 8px; font-weight: 600;
  border-left: 4px solid #27ae60;
}
.banner-proses {
  margin-top: 16px; padding: 12px 16px;
  background: #fef9e7; color: #b7770d;
  border-radius: 8px; font-weight: 600;
  border-left: 4px solid var(--amber);
}
</style>
