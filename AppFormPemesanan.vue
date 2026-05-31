<template>
  <div>
    <h1 class="section-title">🛒 Form Pemesanan Bahan Ajar</h1>
    <p class="section-sub">Isi formulir di bawah untuk memesan paket bahan ajar SITTA.</p>

    <!-- ── STEP INDICATOR ── -->
    <div class="step-bar">
      <div
        v-for="(step, i) in langkah"
        :key="step.id"
        class="step-item"
        :class="{ active: langkahAktif >= i, done: langkahAktif > i }"
      >
        <div class="step-circle">
          <span v-if="langkahAktif > i">✓</span>
          <span v-else>{{ i + 1 }}</span>
        </div>
        <span class="step-label">{{ step.label }}</span>
      </div>
    </div>

    <!-- ── Konfirmasi Sukses (v-if) ── -->
    <div v-if="pesanBerhasil" class="sukses-box">
      <div class="sukses-ikon">🎉</div>
      <h2>Pesanan Berhasil!</h2>
      <p>Nomor DO: <strong>{{ nomorDO }}</strong></p>
      <p>{{ $filters.formatTanggal(new Date().toISOString().split('T')[0]) }}</p>
      <div class="sukses-detail">
        <p><strong>Pemesan:</strong> {{ form.nim }} – {{ form.nama }}</p>
        <p><strong>Paket:</strong> {{ paketDipilih ? paketDipilih.nama : '-' }}</p>
        <p><strong>Pengiriman:</strong> {{ pengirimanDipilih ? pengirimanDipilih.nama : '-' }}</p>
        <p><strong>Total:</strong> {{ $filters.formatRupiah(totalBayar) }}</p>
      </div>
      <button class="btn btn-teal" @click="resetForm">🔄 Buat Pesanan Baru</button>
    </div>

    <div v-else class="grid-2" style="align-items:start">

      <!-- ── FORMULIR ── -->
      <div>
        <!-- Langkah 1: Data Pemesan -->
        <div class="card" v-show="langkahAktif >= 0">
          <div class="card-header">
            <div class="card-icon">👤</div>
            <h2>1. Data Pemesan</h2>
          </div>

          <!-- NIM: keyboard event @keyup.enter pindah ke nama -->
          <div class="form-group">
            <label class="form-label">NIM Mahasiswa <span class="req">*</span></label>
            <input
              ref="inputNim"
              v-model="form.nim"
              class="form-control"
              :class="{ 'is-error': error.nim }"
              type="text"
              maxlength="9"
              placeholder="Masukkan 9 digit NIM"
              @keyup.enter="$refs.inputNama.focus()"
              @input="validasiNim"
            />
            <!-- Indikator 3: v-show untuk pesan error -->
            <div v-show="error.nim" class="form-error">{{ error.nim }}</div>
            <!-- Indikator 2: Mustache – karakter counter -->
            <div class="char-hint">{{ form.nim.length }} / 9 digit</div>
          </div>

          <div class="form-group">
            <label class="form-label">Nama Lengkap <span class="req">*</span></label>
            <input
              ref="inputNama"
              v-model="form.nama"
              class="form-control"
              :class="{ 'is-error': error.nama }"
              type="text"
              placeholder="Nama sesuai KTM"
              @keyup.enter="$refs.inputAlamat.focus()"
              @blur="validasiNama"
            />
            <div v-show="error.nama" class="form-error">{{ error.nama }}</div>
          </div>

          <div class="form-group">
            <label class="form-label">Alamat Pengiriman <span class="req">*</span></label>
            <textarea
              ref="inputAlamat"
              v-model="form.alamat"
              class="form-control"
              rows="3"
              :class="{ 'is-error': error.alamat }"
              placeholder="Jalan, Kelurahan, Kecamatan, Kota, Kode Pos"
              @blur="validasiAlamat"
            />
            <div v-show="error.alamat" class="form-error">{{ error.alamat }}</div>
          </div>

          <!-- Indikator 4: v-model select + v-for UPBJJ -->
          <div class="form-group">
            <label class="form-label">UPBJJ Tujuan <span class="req">*</span></label>
            <select
              v-model="form.upbjj"
              class="form-control"
              :class="{ 'is-error': error.upbjj }"
              @change="validasiUpbjj"
            >
              <option value="">— Pilih UPBJJ —</option>
              <option v-for="kota in upbjjList" :key="kota" :value="kota">{{ kota }}</option>
            </select>
            <div v-show="error.upbjj" class="form-error">{{ error.upbjj }}</div>
          </div>
        </div>

        <!-- Langkah 2: Pilih Paket & Pengiriman -->
        <div class="card" v-show="langkahAktif >= 0">
          <div class="card-header">
            <div class="card-icon">🎁</div>
            <h2>2. Pilih Paket &amp; Pengiriman</h2>
          </div>

          <!-- Pilih Paket -->
          <div class="form-group">
            <label class="form-label">Paket Bahan Ajar <span class="req">*</span></label>
            <select
              v-model="form.paket"
              class="form-control"
              :class="{ 'is-error': error.paket }"
              @change="validasiPaket"
            >
              <option value="">— Pilih Paket —</option>
              <!-- Indikator 6: v-for pada array paket -->
              <option v-for="p in paket" :key="p.kode" :value="p.kode">
                {{ p.nama }} – {{ $filters.formatRupiah(p.harga) }}
              </option>
            </select>
            <div v-show="error.paket" class="form-error">{{ error.paket }}</div>
          </div>

          <!-- Info paket dipilih: Indikator 3: v-if -->
          <div v-if="paketDipilih" class="info-paket">
            <strong>📦 Isi Paket:</strong>
            <!-- Indikator 6: v-for nested pada isi paket -->
            <span
              v-for="(mk, i) in paketDipilih.isi"
              :key="mk"
            >{{ mk }}<span v-if="i < paketDipilih.isi.length - 1">, </span></span>
          </div>

          <!-- Pilih Pengiriman: v-for pada array pengiriman -->
          <div class="form-group">
            <label class="form-label">Metode Pengiriman <span class="req">*</span></label>
            <div class="radio-group">
              <label
                v-for="p in pengirimanList"
                :key="p.kode"
                class="radio-item"
                :class="{ checked: form.pengiriman === p.kode }"
              >
                <!-- Indikator 4: v-model radio button -->
                <input type="radio" v-model="form.pengiriman" :value="p.kode" />
                <span>{{ p.nama }}</span>
              </label>
            </div>
            <div v-show="error.pengiriman" class="form-error">{{ error.pengiriman }}</div>
          </div>

          <!-- Indikator 3: v-if / v-else-if untuk info pengiriman (watcher) -->
          <div v-if="infoWatcherPengiriman" class="watcher-info">
            🚚 {{ infoWatcherPengiriman }}
          </div>
          <div v-else-if="infoWatcherPaket" class="watcher-info">
            📦 {{ infoWatcherPaket }}
          </div>

          <!-- Catatan tambahan -->
          <div class="form-group">
            <label class="form-label">Catatan Tambahan</label>
            <!-- Indikator 4: v-model textarea -->
            <textarea v-model="form.catatan" class="form-control" rows="2" placeholder="Opsional..." />
            <!-- Indikator 7: Filter ringkas untuk preview -->
            <div class="char-hint" v-show="form.catatan">
              Preview: {{ $filters.ringkas(form.catatan, 60) }}
            </div>
          </div>
        </div>

        <!-- Tombol Submit -->
        <div class="flex gap-3">
          <button
            class="btn btn-primary"
            style="flex:1"
            :disabled="!formValid"
            :title="formValid ? 'Klik untuk submit' : 'Lengkapi semua field terlebih dahulu'"
            @click="submitPesanan"
          >
            ✅ Buat Pesanan
          </button>
          <button class="btn btn-outline" @click="resetForm">🔄 Reset</button>
        </div>
      </div>

      <!-- ── RINGKASAN PESANAN (sidebar) ── -->
      <div>
        <div class="card ringkasan-card">
          <div class="card-header">
            <div class="card-icon">🧾</div>
            <h2>Ringkasan Pesanan</h2>
          </div>

          <div class="ringkasan-baris">
            <span>NIM</span>
            <!-- Indikator 7: Filter hurupKapital -->
            <strong>{{ form.nim || '–' }}</strong>
          </div>
          <div class="ringkasan-baris">
            <span>Nama</span>
            <strong>{{ form.nama || '–' }}</strong>
          </div>
          <div class="ringkasan-baris">
            <span>UPBJJ</span>
            <strong>{{ form.upbjj || '–' }}</strong>
          </div>
          <div class="ringkasan-baris">
            <span>Paket</span>
            <strong>{{ paketDipilih ? $filters.ringkas(paketDipilih.nama, 25) : '–' }}</strong>
          </div>

          <!-- Indikator 3: v-if / v-else untuk stok tersedia -->
          <div v-if="paketDipilih" class="stok-check">
            <div
              v-for="mk in paketDipilih.isi"
              :key="mk"
              class="stok-check-item"
            >
              <span>{{ mk }}</span>
              <!-- Cek stok tersedia -->
              <span v-if="stokCukup(mk)" class="badge badge-success">✓ Tersedia</span>
              <span v-else class="badge badge-danger">✗ Stok Kurang</span>
            </div>
          </div>

          <div class="ringkasan-baris">
            <span>Pengiriman</span>
            <strong>{{ pengirimanDipilih ? pengirimanDipilih.nama : '–' }}</strong>
          </div>

          <div class="ringkasan-baris">
            <span>Harga Paket</span>
            <span>{{ paketDipilih ? $filters.formatRupiah(paketDipilih.harga) : '–' }}</span>
          </div>

          <div class="ringkasan-baris">
            <span>Ongkir</span>
            <span>{{ $filters.formatRupiah(biayaOngkir) }}</span>
          </div>

          <div class="ringkasan-total">
            <span>Total Bayar</span>
            <!-- Indikator 4: Computed property totalBayar -->
            <strong>{{ $filters.formatRupiah(totalBayar) }}</strong>
          </div>

          <!-- Indikator 3: v-show validitas form -->
          <div v-show="!formValid" class="hint-lengkap">
            ⚠️ Lengkapi semua field bertanda <span class="req">*</span>
          </div>
        </div>

        <!-- Indikator 4: v-bind style dinamis berdasarkan status form -->
        <div
          class="status-form"
          :style="{
            background: formValid ? '#d5f5e3' : '#fef9e7',
            borderColor: formValid ? '#27ae60' : '#f39c12',
            color: formValid ? '#1e8449' : '#b7770d'
          }"
        >
          <span v-if="formValid">✅ Form siap dikirim</span>
          <span v-else>📝 {{ jumlahErrorAktif }} field belum diisi</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppFormPemesanan',

  props: {
    paket:          { type: Array, default: () => [] },
    upbjjList:      { type: Array, default: () => [] },
    pengirimanList: { type: Array, default: () => [] },
    stok:           { type: Array, default: () => [] }
  },

  data() {
    return {
      form: {
        nim:        '',
        nama:       '',
        alamat:     '',
        upbjj:      '',
        paket:      '',
        pengiriman: '',
        catatan:    ''
      },
      error: {
        nim: '', nama: '', alamat: '', upbjj: '', paket: '', pengiriman: ''
      },
      langkahAktif:        0,
      pesanBerhasil:       false,
      nomorDO:             '',
      infoWatcherPaket:    '',
      infoWatcherPengiriman: '',
      langkah: [
        { id: 'data',   label: 'Data Pemesan' },
        { id: 'paket',  label: 'Pilih Paket' },
        { id: 'konfirm',label: 'Konfirmasi' }
      ]
    }
  },

  // Indikator 5: WATCHER 1 & 2 pada FormPemesanan
  watch: {
    /**
     * Watcher 1: Amati pilihan paket
     * → tampilkan informasi stok & harga saat paket berubah
     */
    'form.paket'(kode) {
      if (!kode) {
        this.infoWatcherPaket = ''
        return
      }
      const p = this.paket.find(x => x.kode === kode)
      if (p) {
        this.infoWatcherPaket =
          `Paket "${p.nama}" dipilih. Berisi ${p.isi.length} mata kuliah, harga ${this.$filters.formatRupiah(p.harga)}.`
      }
    },

    /**
     * Watcher 2: Amati metode pengiriman
     * → tampilkan estimasi waktu tiba
     */
    'form.pengiriman'(kode) {
      const eta = { REG: '3–5 hari kerja', EXP: '1–2 hari kerja' }
      if (kode && eta[kode]) {
        this.infoWatcherPengiriman =
          `Estimasi tiba: ${eta[kode]}. Pastikan alamat sudah benar.`
      } else {
        this.infoWatcherPengiriman = ''
      }
    },

    /**
     * Watcher 3: Pantau NIM - validasi otomatis
     */
    'form.nim'(val) {
      if (val.length === 9 && /^\d{9}$/.test(val)) {
        this.error.nim = ''
      }
    }
  },

  // Indikator 4: Computed Properties
  computed: {
    paketDipilih() {
      return this.paket.find(p => p.kode === this.form.paket) || null
    },
    pengirimanDipilih() {
      return this.pengirimanList.find(p => p.kode === this.form.pengiriman) || null
    },
    biayaOngkir() {
      return this.form.pengiriman === 'EXP' ? 25000 : 10000
    },
    totalBayar() {
      const hargaPaket = this.paketDipilih ? this.paketDipilih.harga : 0
      return hargaPaket + this.biayaOngkir
    },
    formValid() {
      return (
        this.form.nim.length === 9 &&
        /^\d{9}$/.test(this.form.nim) &&
        this.form.nama.trim().length >= 3 &&
        this.form.alamat.trim().length >= 10 &&
        this.form.upbjj !== '' &&
        this.form.paket !== '' &&
        this.form.pengiriman !== ''
      )
    },
    jumlahErrorAktif() {
      let j = 0
      if (this.form.nim.length < 9) j++
      if (this.form.nama.trim().length < 3) j++
      if (this.form.alamat.trim().length < 10) j++
      if (!this.form.upbjj) j++
      if (!this.form.paket) j++
      if (!this.form.pengiriman) j++
      return j
    }
  },

  methods: {
    // Indikator 4: Methods Property

    validasiNim() {
      if (!this.form.nim) {
        this.error.nim = 'NIM tidak boleh kosong.'
      } else if (!/^\d+$/.test(this.form.nim)) {
        this.error.nim = 'NIM hanya boleh angka.'
      } else if (this.form.nim.length !== 9) {
        this.error.nim = `NIM harus 9 digit (saat ini ${this.form.nim.length} digit).`
      } else {
        this.error.nim = ''
      }
    },

    validasiNama() {
      if (!this.form.nama.trim()) {
        this.error.nama = 'Nama tidak boleh kosong.'
      } else if (this.form.nama.trim().length < 3) {
        this.error.nama = 'Nama minimal 3 karakter.'
      } else {
        this.error.nama = ''
      }
    },

    validasiAlamat() {
      if (!this.form.alamat.trim()) {
        this.error.alamat = 'Alamat tidak boleh kosong.'
      } else if (this.form.alamat.trim().length < 10) {
        this.error.alamat = 'Alamat terlalu singkat (min. 10 karakter).'
      } else {
        this.error.alamat = ''
      }
    },

    validasiUpbjj() {
      this.error.upbjj = this.form.upbjj ? '' : 'Pilih UPBJJ tujuan.'
    },

    validasiPaket() {
      this.error.paket = this.form.paket ? '' : 'Pilih paket bahan ajar.'
    },

    validasiSemua() {
      this.validasiNim()
      this.validasiNama()
      this.validasiAlamat()
      this.validasiUpbjj()
      this.validasiPaket()
      if (!this.form.pengiriman) this.error.pengiriman = 'Pilih metode pengiriman.'
      else this.error.pengiriman = ''
    },

    submitPesanan() {
      this.validasiSemua()
      if (!this.formValid) return

      // Generate nomor DO
      const ts = Date.now().toString().slice(-4)
      this.nomorDO = `DO${new Date().getFullYear()}-${ts}`
      this.pesanBerhasil = true
      this.langkahAktif = 2
    },

    resetForm() {
      this.form = { nim: '', nama: '', alamat: '', upbjj: '', paket: '', pengiriman: '', catatan: '' }
      this.error = { nim: '', nama: '', alamat: '', upbjj: '', paket: '', pengiriman: '' }
      this.pesanBerhasil = false
      this.nomorDO = ''
      this.langkahAktif = 0
      this.infoWatcherPaket = ''
      this.infoWatcherPengiriman = ''
    },

    stokCukup(kode) {
      const item = this.stok.find(s => s.kode === kode)
      return item ? item.qty > 0 : false
    }
  }
}
</script>

<style scoped>
.req { color: var(--red); }
.char-hint { font-size: .75rem; color: var(--muted); margin-top: 4px; text-align: right; }

/* Step bar */
.step-bar {
  display: flex; gap: 0; margin-bottom: 28px;
  background: #fff; border-radius: 10px;
  box-shadow: var(--shadow); padding: 16px 24px;
  justify-content: space-around;
}
.step-item {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  opacity: .4; transition: opacity .2s;
}
.step-item.active { opacity: 1; }
.step-circle {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 2px solid var(--border);
  background: #fff;
  display: grid; place-items: center;
  font-weight: 700; font-size: .85rem;
  color: var(--muted);
  transition: all .2s;
}
.step-item.active .step-circle { border-color: var(--teal); color: var(--teal); background: var(--teal-lt); }
.step-item.done .step-circle   { background: var(--teal); border-color: var(--teal); color: #fff; }
.step-label { font-size: .75rem; font-weight: 600; color: var(--navy); }

/* Radio group */
.radio-group { display: flex; gap: 12px; flex-wrap: wrap; }
.radio-item {
  flex: 1; display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
  border: 2px solid var(--border);
  border-radius: 8px; cursor: pointer;
  transition: all .15s; font-size: .875rem;
}
.radio-item.checked { border-color: var(--teal); background: var(--teal-lt); }
.radio-item input { accent-color: var(--teal); }

/* Info watcher */
.watcher-info {
  background: #eaf4ff; border-left: 4px solid #2980B9;
  padding: 9px 13px; border-radius: 0 8px 8px 0;
  font-size: .85rem; color: #1a5276; margin-bottom: 14px;
}

/* Info paket */
.info-paket {
  background: var(--teal-lt); border-radius: 8px;
  padding: 10px 14px; font-size: .85rem;
  margin-bottom: 14px; color: #0e6655;
}

/* Ringkasan */
.ringkasan-card { position: sticky; top: 80px; }
.ringkasan-baris {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 0; border-bottom: 1px solid var(--border);
  font-size: .875rem;
}
.ringkasan-total {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 0;
  font-size: 1.1rem;
  font-family: var(--font-head);
  color: var(--navy);
}
.stok-check { margin: 10px 0; }
.stok-check-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 5px 8px; background: var(--bg); border-radius: 6px;
  margin-bottom: 4px; font-size: .8rem;
}
.status-form {
  margin-top: 12px; padding: 10px 14px;
  border-radius: 8px; border: 2px solid;
  font-size: .875rem; font-weight: 600;
  text-align: center;
  transition: all .3s;
}
.hint-lengkap { font-size: .78rem; color: var(--muted); margin-top: 10px; text-align: center; }

/* Sukses box */
.sukses-box {
  text-align: center; padding: 48px 32px;
  background: #fff; border-radius: 14px;
  box-shadow: var(--shadow-lg);
}
.sukses-ikon { font-size: 4rem; margin-bottom: 12px; }
.sukses-box h2 { font-family: var(--font-head); color: var(--navy); margin-bottom: 8px; }
.sukses-detail {
  background: var(--bg); border-radius: 8px;
  padding: 14px 20px; margin: 16px auto;
  max-width: 360px; text-align: left;
  font-size: .9rem; line-height: 2;
}
</style>
