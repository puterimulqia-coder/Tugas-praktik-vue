<template>
  <!--
    Indikator 8: Custom Element / Reusable Component
    Komponen badge untuk menampilkan level stok bahan ajar
  -->
  <span class="stok-badge" :class="kelasLevel" :title="pesanLevel">
    {{ ikonLevel }} {{ labelLevel }}
  </span>
</template>

<script>
export default {
  name: 'AppBadgeStok',

  // Indikator 8: Props (Property Template)
  props: {
    qty:    { type: Number, required: true },
    safety: { type: Number, required: true }
  },

  // Indikator 4: Computed Property
  computed: {
    /**
     * Menentukan level stok berdasarkan qty vs safety stock
     * Kategori: KRITIS | RENDAH | AMAN
     */
    levelStok() {
      const rasio = this.qty / this.safety
      if (this.qty === 0)  return 'kosong'
      if (rasio < 0.5)     return 'kritis'
      if (this.qty < this.safety) return 'rendah'
      return 'aman'
    },
    kelasLevel() {
      return {
        'stok-kosong': this.levelStok === 'kosong',
        'stok-kritis': this.levelStok === 'kritis',
        'stok-rendah': this.levelStok === 'rendah',
        'stok-aman':   this.levelStok === 'aman'
      }
    },
    ikonLevel() {
      return { kosong: '⛔', kritis: '🔴', rendah: '🟡', aman: '🟢' }[this.levelStok]
    },
    labelLevel() {
      return {
        kosong: 'Kosong',
        kritis: 'Kritis',
        rendah: 'Rendah',
        aman:   'Aman'
      }[this.levelStok]
    },
    pesanLevel() {
      return `Stok: ${this.qty} | Safety: ${this.safety}`
    }
  }
}
</script>

<style scoped>
.stok-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: .75rem;
  font-weight: 700;
}
.stok-aman   { background: #d5f5e3; color: #1e8449; }
.stok-rendah { background: #fef9e7; color: #b7770d; }
.stok-kritis { background: #fdecea; color: #c0392b; }
.stok-kosong { background: #ecf0f1; color: #5d6d7e; }
</style>
