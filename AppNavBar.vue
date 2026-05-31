<template>
  <!-- Indikator 8: Custom Vue Component – NavBar -->
  <header class="navbar">
    <div class="navbar-inner">
      <!-- Brand / Logo -->
      <div class="navbar-brand">
        <span class="brand-icon">📚</span>
        <div>
          <!-- Indikator 2: v-text directive -->
          <span class="brand-title" v-text="appName" />
          <span class="brand-sub" v-text="appSub" />
        </div>
      </div>

      <!-- Navigation tabs -->
      <nav class="navbar-nav">
        <!-- Indikator 6: v-for dengan zero-based index -->
        <button
          v-for="(tab, index) in tabs"
          :key="tab.id"
          class="nav-btn"
          :class="{ active: activeTab === tab.id }"
          :title="`Tab ke-${index + 1}: ${tab.label}`"
          :aria-current="activeTab === tab.id ? 'page' : undefined"
          @click="$emit('changeTab', tab.id)"
        >
          <!-- Indikator 2: Mustache {{ }} -->
          <span class="nav-icon">{{ tab.icon }}</span>
          <span class="nav-label">{{ tab.label }}</span>
        </button>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppNavBar',

  // Indikator 8: Props (Property Template)
  props: {
    activeTab: {
      type: String,
      required: true
    }
  },

  emits: ['changeTab'],

  data() {
    return {
      appName: 'SITTA',
      appSub:  'Sistem Bahan Ajar UT',
      tabs: [
        { id: 'dashboard', label: 'Dashboard',  icon: '🏠' },
        { id: 'stok',      label: 'Stok',       icon: '📦' },
        { id: 'paket',     label: 'Paket',      icon: '🎁' },
        { id: 'pesan',     label: 'Pesan',      icon: '🛒' },
        { id: 'tracking',  label: 'Tracking',   icon: '📍' }
      ]
    }
  }
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, var(--navy-dk) 0%, var(--navy) 100%);
  box-shadow: 0 4px 18px rgba(0,0,0,.22);
  position: sticky; top: 0; z-index: 100;
}
.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.navbar-brand {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 0;
}
.brand-icon { font-size: 1.7rem; }
.brand-title {
  display: block;
  font-family: var(--font-head);
  font-size: 1.25rem;
  color: #fff;
  letter-spacing: .02em;
}
.brand-sub {
  display: block;
  font-size: .72rem;
  color: rgba(255,255,255,.6);
  letter-spacing: .06em;
}
.navbar-nav {
  display: flex; gap: 4px;
  padding: 8px 0;
  flex-wrap: wrap;
}
.nav-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 7px 14px;
  background: transparent;
  border: 1.5px solid transparent;
  border-radius: 8px;
  color: rgba(255,255,255,.75);
  font-family: var(--font-body);
  font-size: .83rem; font-weight: 600;
  cursor: pointer;
  transition: all .18s;
}
.nav-btn:hover {
  background: rgba(255,255,255,.12);
  color: #fff;
}
.nav-btn.active {
  background: var(--teal);
  border-color: var(--teal);
  color: #fff;
  box-shadow: 0 3px 10px rgba(26,188,156,.4);
}
.nav-icon { font-size: 1rem; }
</style>
