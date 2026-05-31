import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

// ================================================================
// GLOBAL FILTERS (Vue 3 pengganti Vue 2 filters)
// Penggunaan di template: {{ value | formatRupiah }}  →
//                         {{ $filters.formatRupiah(value) }}
// ================================================================
app.config.globalProperties.$filters = {
  /**
   * Filter 1: Format angka ke mata uang Rupiah
   */
  formatRupiah(value) {
    if (value === null || value === undefined) return '-'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  },

  /**
   * Filter 2: Format tanggal ISO ke format Indonesia
   */
  formatTanggal(value) {
    if (!value) return '-'
    return new Date(value).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  },

  /**
   * Filter 3: Format waktu datetime lengkap
   */
  formatWaktu(value) {
    if (!value) return '-'
    const [tgl, jam] = value.split(' ')
    const formatted = new Date(tgl).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
    return `${formatted} ${jam}`
  },

  /**
   * Filter 4: Konversi teks ke HURUF KAPITAL
   */
  hurupKapital(value) {
    return value ? value.toUpperCase() : ''
  },

  /**
   * Filter 5: Ringkas teks panjang dengan ellipsis
   */
  ringkas(value, panjang = 35) {
    if (!value) return ''
    return value.length > panjang ? value.substring(0, panjang) + '…' : value
  },

  /**
   * Filter 6: CSS class badge berdasarkan status pengiriman
   */
  kelasStatus(status) {
    const peta = {
      'Dalam Perjalanan': 'badge-warning',
      'Terkirim':         'badge-success',
      'Diproses':         'badge-info',
      'Dibatalkan':       'badge-danger'
    }
    return peta[status] || 'badge-secondary'
  }
}

app.mount('#app')
