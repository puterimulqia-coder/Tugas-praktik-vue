<template>
  <div>
    <h1 class="section-title">🎁 Daftar Paket Bahan Ajar</h1>
    <p class="section-sub">Semua paket yang tersedia untuk dipesan melalui SITTA.</p>

    <!-- Indikator 6: v-for zero-based index pada array paket -->
    <div class="grid-2">
      <div
        v-for="(item, index) in paket"
        :key="item.kode"
      >
        <!--
          Indikator 8: Penggunaan custom component AppKartuPaket
          Indikator 4: v-bind props ke child component
        -->
        <AppKartuPaket
          :paket="item"
          :stok="stok"
          :is-featured="index === 0"
          @pilih="handlePilih"
        />
      </div>
    </div>

    <!-- Detail Paket yang Dipilih (Modal-like) -->
    <!-- Indikator 3: v-if untuk tampilkan detail -->
    <div v-if="paketDipilih" class="detail-overlay" @click.self="paketDipilih = null">
      <div class="detail-modal">
        <div class="modal-head">
          <h2>{{ paketDipilih.nama }}</h2>
          <button class="btn-close" @click="paketDipilih = null">✕</button>
        </div>

        <div class="modal-body">
          <p class="text-muted" style="margin-bottom:16px">
            Kode: <code>{{ paketDipilih.kode }}</code>
          </p>

          <h3 style="margin-bottom:12px;font-family:var(--font-head);color:var(--navy)">
            Isi Paket ({{ paketDipilih.isi.length }} Mata Kuliah)
          </h3>

          <!-- Indikator 6: v-for nested dengan detail stok -->
          <div
            v-for="(kode, i) in paketDipilih.isi"
            :key="kode"
            class="mk-detail-row"
          >
            <span class="mk-no">{{ i + 1 }}</span>
            <div class="mk-info">
              <strong>{{ kode }}</strong>
              <!-- Indikator 3: v-if cek stok ada atau tidak -->
              <template v-if="stokByKode(kode)">
                <span>{{ stokByKode(kode).judul }}</span>
                <div class="mk-meta">
                  <!-- Indikator 7: Filter formatRupiah -->
                  <span class="badge badge-info">{{ $filters.formatRupiah(stokByKode(kode).harga) }}</span>
                  <span class="badge badge-secondary">{{ stokByKode(kode).upbjj }}</span>
                  <!-- Indikator 8: AppBadgeStok custom component -->
                  <AppBadgeStok
                    :qty="stokByKode(kode).qty"
                    :safety="stokByKode(kode).safety"
                  />
                </div>
                <!-- Indikator 2: v-html -->
                <div class="mk-catatan" v-html="stokByKode(kode).catatanHTML" />
              </template>
              <span v-else class="text-muted">– Data stok tidak ditemukan</span>
            </div>
          </div>

          <div class="modal-footer">
            <div class="paket-harga-besar">
              {{ $filters.formatRupiah(paketDipilih.harga) }}
            </div>
            <button class="btn btn-teal" @click="paketDipilih = null">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Perbandingan Paket -->
    <div class="card" style="margin-top:24px">
      <div class="card-header">
        <div class="card-icon">📊</div>
        <h2>Perbandingan Paket</h2>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <!-- Indikator 6: v-for name-based object -->
              <th v-for="(val, key) in kolomPerbandingan" :key="key">{{ val }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(p, idx) in paket" :key="p.kode">
              <td>{{ idx + 1 }}</td>
              <td><code>{{ p.kode }}</code></td>
              <td><strong>{{ p.nama }}</strong></td>
              <td>{{ p.isi.length }} MK</td>
              <!-- Indikator 7: Filter formatRupiah -->
              <td class="text-right"><strong>{{ $filters.formatRupiah(p.harga) }}</strong></td>
              <td>
                <!-- Indikator 3: v-if ada stok kritis di paket ini -->
                <span v-if="adaStokKritis(p)" class="badge badge-danger">Ada Kritis</span>
                <span v-else class="badge badge-success">Stok Aman</span>
              </td>
              <td>
                <button class="btn btn-outline btn-sm" @click="handlePilih(p)">
                  👁 Detail
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
import AppKartuPaket from './AppKartuPaket.vue'
import AppBadgeStok  from './AppBadgeStok.vue'

export default {
  name: 'AppDaftarPaket',

  // Indikator 8: Registrasi custom component
  components: { AppKartuPaket, AppBadgeStok },

  props: {
    paket: { type: Array, default: () => [] },
    stok:  { type: Array, default: () => [] }
  },

  data() {
    return {
      paketDipilih: null
    }
  },

  computed: {
    // Indikator 6: name-based – kolom header sebagai object
    kolomPerbandingan() {
      return {
        no:     'No.',
        kode:   'Kode Paket',
        nama:   'Nama Paket',
        jumlah: 'Jumlah MK',
        harga:  'Harga',
        stok:   'Status Stok',
        aksi:   'Aksi'
      }
    }
  },

  methods: {
    handlePilih(p) {
      this.paketDipilih = p
    },

    stokByKode(kode) {
      return this.stok.find(s => s.kode === kode) || null
    },

    adaStokKritis(paket) {
      return paket.isi.some(kode => {
        const s = this.stok.find(x => x.kode === kode)
        return s && s.qty < s.safety
      })
    }
  }
}
</script>

<style scoped>
/* Modal/Overlay */
.detail-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 200; padding: 20px;
}
.detail-modal {
  background: #fff;
  border-radius: 14px;
  max-width: 600px; width: 100%;
  max-height: 85vh; overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,.25);
}
.modal-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px;
  border-bottom: 2px solid var(--border);
  position: sticky; top: 0; background: #fff;
}
.modal-head h2 { font-family: var(--font-head); color: var(--navy); }
.btn-close {
  width: 32px; height: 32px; border-radius: 50%;
  border: 1.5px solid var(--border);
  background: var(--bg); cursor: pointer;
  font-size: 1rem; display: grid; place-items: center;
}
.btn-close:hover { background: var(--red); color: #fff; border-color: var(--red); }
.modal-body { padding: 20px 24px; }

.mk-detail-row {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 12px; background: var(--bg);
  border-radius: 8px; margin-bottom: 10px;
}
.mk-no {
  width: 26px; height: 26px; border-radius: 50%;
  background: var(--navy); color: #fff;
  display: grid; place-items: center;
  font-size: .8rem; font-weight: 700; flex-shrink: 0;
}
.mk-info { flex: 1; }
.mk-info strong { display: block; color: var(--navy); font-size: .85rem; }
.mk-info > span { font-size: .875rem; display: block; margin-bottom: 6px; }
.mk-meta { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 6px; }
.mk-catatan { font-size: .78rem; color: var(--muted); margin-top: 4px; }

.modal-footer {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 16px; border-top: 2px solid var(--border); margin-top: 16px;
}
.paket-harga-besar {
  font-family: var(--font-head);
  font-size: 1.4rem; color: var(--navy); font-weight: 700;
}
</style>
