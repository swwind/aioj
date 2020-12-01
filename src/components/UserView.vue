<template>
  <h1>{{ username }}</h1>
  <span v-if="admin">{{ translate(i18n.lang, 'admin') }}</span>
  <p>{{ desc }}</p>
  <p>{{ email }}</p>
</template>

<script lang="ts">
import { getUserDetail } from '@/api/accounts';
import { defineComponent, ref } from 'vue';
import { handleNetworkRequestError } from '@/utils';
import { mapState, Store, useStore } from 'vuex';
import { State } from '@/store';
import { translate } from '@/i18n/translate';

export default defineComponent({
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const desc = ref('');
    const email = ref('');
    const admin = ref(false);

    const store = useStore() as Store<State>;

    const resolveUserDetail = async (username: string) => {
      const result = await getUserDetail(username);
      if (result.status === 200) {
        desc.value = result.description;
        email.value = result.email;
        admin.value = result.admin;
      } else {
        handleNetworkRequestError(store.state.i18n.lang, result);
      }
    };

    resolveUserDetail(props.username);

    return {
      desc,
      email,
      admin,
      resolveUserDetail,
      translate,
    };
  },
  watch: {
    username(newval) {
      this.resolveUserDetail(newval);
    },
  },
  computed: {
    ...mapState(['i18n']),
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
