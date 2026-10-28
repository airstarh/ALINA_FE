<template>
  <section class="user-admin-block">
    <b-button v-b-toggle="collapseId" class="btn-a user-admin-toggle">
      🛡 {{ $t('Administrative user data') }}
    </b-button>

    <b-collapse :id="collapseId" @show="load">
      <div class="user-admin-panel">
        <p v-if="loading" class="user-admin-status">{{ $t('i_loading') }}</p>
        <p v-if="error" class="user-admin-status user-admin-error">{{ error }}</p>

        <form v-if="loaded" class="user-admin-form" @submit.prevent="save">
          <aSelect v-model="form.role_ids" :options="translatedRoles" :modeEdit="true" multiple searchable
                   valueKey="id" labelKey="name" :label="$t('Roles')" componentDisplay="block"
                   inputWidth="100%" class="user-admin-roles" @update:modelValue="emitRoleSelection" />

          <div class="user-admin-grid">
            <aInput :modelValue="String(form.id)" type="text" :modeEdit="false" :label="$t('ID')" componentDisplay="block" />
            <aInput v-model="form.mail" type="email" :modeEdit="true" :label="$t('Email')" componentDisplay="block" />
            <aInput v-model="form.password" type="password" :modeEdit="true" :label="$t('TXT_PASSWORD')"
                    :placeholder="$t('Leave empty to keep the current password')" componentDisplay="block" />
            <aInput v-model="form.firstname" type="text" :modeEdit="true" :label="$t('First name')" componentDisplay="block" />
            <aInput v-model="form.lastname" type="text" :modeEdit="true" :label="$t('Last name')" componentDisplay="block" />
            <aInput v-model="form.language" type="text" :modeEdit="true" :label="$t('Language')" componentDisplay="block" />
            <AlinaDatePicker v-model="form.created_at" :label="$t('Created')" :idq="`admin-created-${userId}`" format="dateTime" :modeEdit="false" />
          </div>

          <div class="user-admin-dates">
            <AlinaDatePicker v-model="form.birth" :label="$t('Birth')" :idq="`admin-birth-${userId}`" format="dateTime" :modeEdit="true" />
            <AlinaDatePicker v-model="form.banned_till" :label="$t('Banned until')" :idq="`admin-banned-${userId}`" format="dateTime" :modeEdit="true" />
          </div>

          <div class="user-admin-flags">
            <aInput v-model="form.is_verified" type="checkbox" :modeEdit="true" :label="$t('Verified')" :trueValue="1" :falseValue="0" />
            <aInput v-model="form.is_deleted" type="checkbox" :modeEdit="true" :label="$t('Deleted')" :trueValue="1" :falseValue="0" />
          </div>

          <div class="user-admin-actions">
            <button type="button" class="btn btn-danger" :disabled="saving || deleting" @click="deleteUser">
              {{ $t(deleting ? 'i_loading' : 'i_delete') }}
            </button>
            <button type="submit" class="btn btn-a" :disabled="saving || deleting">{{ $t(saving ? 'i_loading' : 'Save') }}</button>
            <span v-if="saved" class="user-admin-saved">{{ $t('Saved') }}</span>
          </div>

          <AlinaFileUploader
            :entity_id="Number(userId)"
            entity_table="user"
            :owner_id="Number(userId)"
            :ownLength="Number(form.count_files || 0)"
            :modeEdit="false"
            :expanded="false"
            loadByOwner />
        </form>
      </div>
    </b-collapse>
  </section>
</template>

<script>
import AjaxAlina from '@/services/AjaxAlina';
import ConfigApi from '@/configs/ConfigApi';
import aInput from '@/components/elements/form/aInput.vue';
import aSelect from '@/components/elements/form/aSelect.vue';
import AlinaDatePicker from '@/components/elements/form/AlinaDatePicker.vue';
import AlinaFileUploader from '@/components/elements/form/AlinaFileUploader.vue';

export default {
  name: 'UserAdminBlock',
  components: {aInput, aSelect, AlinaDatePicker, AlinaFileUploader},
  emits: ['saved', 'roles-changed'],
  props: {
    userId: {type: [Number, String], required: true},
  },
  data() {
    return {
      form: {},
      roles: [],
      loaded: false,
      loading: false,
      saving: false,
      deleting: false,
      saved: false,
      error: '',
      savedTimer: null,
    };
  },
  computed: {
    translatedRoles() {
      return this.roles.map(role => ({...role, name: this.$t(role.name)}));
    },
    collapseId() {
      return `user-admin-${this.userId}`;
    },
    endpoint() {
      return `${ConfigApi.url_base}/auth/ProfileAdmin/${this.userId}`;
    },
  },
  beforeUnmount() {
    clearTimeout(this.savedTimer);
  },
  methods: {
    emitRoleSelection(roleIds) {
      const selected = new Set((roleIds || []).map(Number));
      this.$emit('roles-changed', this.roles.filter(role => selected.has(Number(role.id))).map(role => role.name));
    },
    load() {
      if (this.loaded || this.loading) return;
      this.loading = true;
      this.error = '';
      AjaxAlina.newInst({
        method: 'GET',
        url: this.endpoint,
        onDone: aja => {
          this.loading = false;
          if (aja.respBody.meta.alina_response_success == 1) {
            this.form = {...aja.respBody.data.user, password: ''};
            this.roles = aja.respBody.data.roles || [];
            this.loaded = true;
          } else {
            this.error = this.$t('Could not load administrative user data.');
          }
        },
      }).go();
    },
    save() {
      if (this.saving) return;
      this.saving = true;
      this.saved = false;
      this.error = '';
      const editableFields = ['id', 'mail', 'firstname', 'lastname', 'birth', 'language', 'is_verified', 'banned_till', 'is_deleted'];
      const postParams = Object.fromEntries(
        editableFields
          .filter(field => Object.prototype.hasOwnProperty.call(this.form, field))
          .map(field => [field, this.form[field]])
      );
      postParams.rbac_user_role = [...new Set((this.form.role_ids || []).map(Number))];
      postParams.form_id = 'actionProfileAdmin';
      const password = String(this.form.password ?? '');
      if (password.trim()) {
        postParams.password = password;
      }
      AjaxAlina.newInst({
        method: 'POST',
        url: this.endpoint,
        postParams,
        onDone: aja => {
          this.saving = false;
          if (aja.respBody.meta.alina_response_success == 1) {
            this.form = {...aja.respBody.data.user, password: ''};
            this.roles = aja.respBody.data.roles || this.roles;
            this.saved = true;
            this.$emit('saved', aja.respBody.data.user);
            clearTimeout(this.savedTimer);
            this.savedTimer = setTimeout(() => { this.saved = false; }, 3000);
          } else {
            this.error = this.$t('Could not save administrative user data.');
          }
        },
      }).go();
    },
    deleteUser() {
      if (this.deleting || this.saving) return;
      if (!window.confirm(this.$t('Delete this user and all related data?'))) return;
      if (!window.confirm(this.$t('This cannot be undone. Continue?'))) return;
      this.deleting = true;
      this.error = '';
      AjaxAlina.newInst({
        method: 'POST',
        url: `${ConfigApi.url_base}/auth/UserDelete/${this.userId}`,
        postParams: {id: this.userId, form_id: 'actionUserDelete'},
        onDone: aja => {
          this.deleting = false;
          if (aja.respBody.meta.alina_response_success == 1) {
            this.$router.replace('/auth/users');
          } else {
            this.error = this.$t('Could not delete user.');
          }
        },
      }).go();
    },
  },
};
</script>

<style scoped>
.user-admin-block { width: min(96vw, 1200px); margin: 3rem auto; }
.user-admin-toggle { width: 100%; padding: .65rem 1rem; }
.user-admin-panel { margin-top: .5rem; padding: 1rem; border: 1px solid #666; border-radius: .75rem; background: #242424; }
.user-admin-form { display: flex; flex-direction: column; gap: 1.25rem; }
.user-admin-roles { width: 100%; }
.user-admin-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.user-admin-grid :deep(.aInput), .user-admin-grid :deep(label) { width: 100%; }
.user-admin-dates, .user-admin-flags, .user-admin-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 1rem; }
.user-admin-dates > * { flex: 1 1 18rem; }
.user-admin-status { margin: 0; padding: 1rem; text-align: center; }
.user-admin-error { color: #ffb4aa; }
.user-admin-saved { color: #9bd2a5; }

@media (max-width: 700px) {
  .user-admin-grid { grid-template-columns: 1fr; }
  .user-admin-panel { padding: .65rem; }
}
</style>
