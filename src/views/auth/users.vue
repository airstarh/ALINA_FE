<template>
  <main class="users-feed">
    <header class="users-feed-header">
      <h1 :title="$t('Users')" :aria-label="$t('Users')">👥</h1>
      <aInput v-model="search" type="text" :modeEdit="true" componentDisplay="block" class="users-feed-search"
              :placeholder="$t('Search users by name…')" @update:modelValue="scheduleSearch" />
    </header>

    <Paginator
      :pageCurrentNumber="Number(pagination.pageCurrentNumber)"
      :pageSize="Number(pagination.pageSize)"
      :rowsTotal="Number(pagination.rowsTotal)"
      :pagesTotal="Number(pagination.pagesTotal)"
      :onClickPage="pageChange" />

    <p v-if="loading" class="users-feed-state">{{ $t('i_loading') }}</p>
    <p v-else-if="error" class="users-feed-state users-feed-error">{{ error }}</p>
    <p v-else-if="!users.length" class="users-feed-state">{{ $t('No users found.') }}</p>

    <section v-else class="users-feed-list" :aria-label="$t('Users')">
      <article v-for="person in users" :key="person.id" class="users-feed-card">
        <router-link :to="`/auth/profile/${person.id}`" class="users-feed-photo">
          <img v-if="person.emblem" :src="emblemUrl(person.emblem)" :alt="fullName(person)" />
          <img v-else src="@/assets/anarki.png" :alt="fullName(person)" />
        </router-link>
        <div class="users-feed-info">
          <div class="users-feed-identity">
            <router-link :to="`/auth/profile/${person.id}`" class="users-feed-name">
              {{ fullName(person) }}
            </router-link>
            <small>[ID {{ person.id }}]</small>
          </div>
          <div v-if="person.about_myself" class="users-feed-bio ck ck-content" v-html="bio(person.about_myself)"></div>
        </div>
      </article>
    </section>

    <Paginator
      :pageCurrentNumber="Number(pagination.pageCurrentNumber)"
      :pageSize="Number(pagination.pageSize)"
      :rowsTotal="Number(pagination.rowsTotal)"
      :pagesTotal="Number(pagination.pagesTotal)"
      :onClickPage="pageChange" />
  </main>
</template>

<script>
import AjaxAlina from '@/services/AjaxAlina';
import ConfigApi from '@/configs/ConfigApi';
import Paginator from '@/components/elements/form/Paginator.vue';
import aInput from '@/components/elements/form/aInput.vue';
import UtilsStr from '@/Utils/UtilsStr';

export default {
  name: 'AuthUsers',
  components: {Paginator, aInput},
  data() {
    return {
      users: [],
      search: '',
      loading: false,
      error: '',
      searchTimer: null,
      requestSequence: 0,
      pagination: {pageCurrentNumber: 1, pageSize: 50, rowsTotal: 0, pagesTotal: 0},
    };
  },
  created() {
    this.loadUsers();
  },
  beforeUnmount() {
    clearTimeout(this.searchTimer);
    this.requestSequence++;
  },
  methods: {
    loadUsers(page = this.pagination.pageCurrentNumber) {
      const request = ++this.requestSequence;
      this.loading = true;
      this.error = '';
      AjaxAlina.newInst({
        method: 'GET',
        url: `${ConfigApi.url_base}/auth/users/${page}`,
        getParams: {query: this.search.trim()},
        onDone: aja => {
          if (request !== this.requestSequence) return;
          if (aja.respBody.meta.alina_response_success == 1) {
            this.users = aja.respBody.data.users || [];
            this.pagination = {...this.pagination, ...(aja.respBody.meta.user || {})};
          } else {
            this.error = this.$t('Could not load users.');
          }
          this.loading = false;
        },
      }).go();
    },
    scheduleSearch() {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.pagination.pageCurrentNumber = 1;
        this.loadUsers(1);
      }, 300);
    },
    pageChange(pageSize, page) {
      if (page < 1 || page > this.pagination.pagesTotal) return;
      this.loadUsers(page);
      window.scrollTo({top: 0, behavior: 'smooth'});
    },
    fullName(person) {
      return [person.firstname, person.lastname].filter(Boolean).join(' ') || `User ${person.id}`;
    },
    emblemUrl(path) {
      if (!path || /^https?:\/\//i.test(path)) return path;
      try {
        return new URL(path, ConfigApi.url_base).href;
      } catch {
        return path;
      }
    },
    bio(value) {
      return UtilsStr.content(value || '');
    },
  },
};
</script>

<style scoped>
.users-feed { width: min(96vw, 1400px); margin: 1rem auto 4rem; }
.users-feed-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.users-feed-header h1 { margin: 0; }
.users-feed-search { flex: 1 1 auto; width: 100%; max-width: none; min-width: 0; }
.users-feed-search :deep(label), .users-feed-search :deep(.a-input) { width: 100%; }
.users-feed-search :deep(input) { height: auto; min-height: 2.25rem; }
.users-feed-list { display: flex; flex-direction: column; gap: 200px; }
.users-feed-card { display: flex; gap: 7mm; padding: 1rem; border-radius: 1rem; background: #242424; }
.users-feed-photo { flex: 0 0 min(28vw, 260px); align-self: flex-start; }
.users-feed-photo img { display: block; width: 100%; aspect-ratio: 1 / 1; border-radius: .75rem; object-fit: cover; }
.users-feed-info { flex: 1 1 50vw; min-width: 0; }
.users-feed-identity { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.users-feed-name { color: inherit; font-size: clamp(1.4rem, 3vw, 2.5rem); font-weight: 700; overflow-wrap: anywhere; }
.users-feed-identity small { flex: 0 0 auto; color: #aaa; }
.users-feed-bio { overflow-wrap: anywhere; }
.users-feed-state { padding: 2rem; text-align: center; }
.users-feed-error { color: #ffb4aa; }

@media (max-width: 700px) {
  .users-feed { width: 100%; padding: 0 .5rem; }
  .users-feed-header { align-items: stretch; flex-direction: column; }
  .users-feed-card { align-items: stretch; flex-direction: column; gap: 1rem; }
  .users-feed-photo { flex-basis: auto; width: min(95vw, 500px); margin: 0 auto; }
  .users-feed-identity { align-items: center; flex-direction: column; gap: .25rem; text-align: center; }
}
</style>
