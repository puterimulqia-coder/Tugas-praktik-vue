<template>
  <!--
    Indikator 8: Custom Element / Reusable Component
    Kartu visual untuk setiap paket bahan ajar
  -->
  <div class="kartu-paket" :class="{ featured: isFeatured }">
    <!-- Header kartu -->
    <div class="kartu-head">
      <span class="kartu-icon">🎁</span>
      <div>
        <!-- Indikator 2: Mustache & v-text -->
        <h3 class="kartu-nama">{{ paket.nama }}</h3>
        <code class="kartu-kode" v-text="paket.kode" />
      </div>
      <span v-if="isFeatured" class="badge badge-warning">⭐ Populer</span>
    </div>

    <!-- Isi paket: Indikator 6: v-for nested -->
    <ul class="kartu-isi">
      <li
        v-for="(kodeMK, idx) in paket.isi"
        :key="kodeMK"
        class="kartu-isi-item"
      >
        <span class="isi-nomor">{{ idx + 1 }}.</span>
        <span class="isi-kode">{{ kodeMK }}</span>
        <!-- Indikator 3: v-if mencari judul dari stok -->
        <span
          v-if="judulByKode(kodeMK)"
          class="isi-judul"
          v-text="judulByKode(kodeMK)"
        />
        <span v-else class="isi-judul text-muted">–</span>
      </li>
    </ul>

    <!-- Harga: Indikator 7: Filter formatRupiah -->
    <div class="kartu-footer">
      <span class="kartu-harga">{{ $filters.formatRupiah(paket.harga) }}</span>
      <button class="btn btn-teal btn-sm" @click="$emit('pilih', paket)">
        🛒 Pesan
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppKartuPaket',

  props: {
    paket:      { type: Object,  required: true },
    stok:       { type: Array,   default: () => [] },
    isFeatured: { type: Boolean, default: false }
  },

  emits: ['pilih'],

  methods: {
    judulByKode(kode) {
      const item = this.stok.find(s => s.kode === kode)
      return item ? item.judul : null
    }
  }
}
</script>

<style scoped>
.kartu-paket {
  background: #fff;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  transition: box-shadow .2s, border-color .2s;
}
.kartu-paket:hover {
  box-shadow: var(--shadow-lg);
  border-color: var(--teal);
}
.kartu-paket.featured {
  border-color: var(--amber);
  background: linear-gradient(135deg, #fff 70%, #fffbf0);
}
.kartu-head {
  display: flex; align-items: flex-start; gap: 12px;
  margin-bottom: 14px;
}
.kartu-icon { font-size: 1.8rem; }
.kartu-nama { font-family: var(--font-head); font-size: 1rem; color: var(--navy); }
.kartu-kode { font-size: .75rem; color: var(--muted); background: var(--bg); padding: 1px 6px; border-radius: 4px; }
.kartu-isi  { list-style: none; margin-bottom: 16px; }
.kartu-isi-item {
  display: flex; align-items: baseline; gap: 6px;
  padding: 5px 0;
  border-bottom: 1px dashed var(--border);
  font-size: .85rem;
}
.isi-nomor { color: var(--muted); font-size: .75rem; }
.isi-kode  { font-weight: 700; color: var(--navy); font-size: .8rem; min-width: 80px; }
.isi-judul { color: var(--text); }
.kartu-footer {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 12px; border-top: 2px solid var(--border);
}
.kartu-harga {
  font-family: var(--font-head);
  font-size: 1.15rem;
  color: var(--navy);
  font-weight: 700;
}
</style>
