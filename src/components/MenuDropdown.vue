<template>
  <div class="burger-menu">
    <!-- Burger button -->
    <button
      class="burger-button"
      @click="isOpen = !isOpen"
    >
      <span v-if="!isOpen">☰</span>
      <span v-else>×</span>
    </button>

    <!-- Dropdown overlay -->
    <div
      v-if="isOpen"
      class="dropdown-overlay"
    >
      <div class="dropdown-content">
        <!-- Slot for custom menu items (router links, etc.) -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuDropdown",
  data() {
    return {
      isOpen: false,
    };
  },
  // Close menu on outside click
  mounted() {
    const closeMenu = (e) => {
      if (!this.$el.contains(e.target)) {
        this.isOpen = false;
      }
    };
    document.addEventListener("click", closeMenu);
    this.$on("hook:beforeDestroy", () => {
      document.removeEventListener("click", closeNewton);
    });
  },
};
</script>

<style scoped>
.burger-menu {
  position: relative;
  display: inline-block;
}

.burger-button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  padding: 0.25em;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.dropdown-content {
  position: absolute;
  top: 2.5em;
  right: 0.5em;
  background: white;
  min-width: 150px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 0.75em 0;
}

/* Optional: style menu items inside slot */
.dropdown-content > * {
  display: block;
  padding: 0.5em 1em;
  text-decoration: none;
  color: #333;
}
.dropdown-content > *:hover {
  background-color: #f0f0f0;
}
</style>
