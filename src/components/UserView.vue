<template>
  <h1 :class="{ admin: admin }">{{ username }}</h1>
  <p>{{ desc }}</p>
  <p>{{ email }}</p>
</template>

<script lang="ts">
import { getUserDetail } from '@/api/accounts';
import { defineComponent, ref } from 'vue';
import { handleNetworkRequestError } from '@/utils';
import { Store, useStore } from 'vuex';
import { State } from '@/store';

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
    };
  },
  watch: {
    username(newval) {
      this.resolveUserDetail(newval);
    },
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

.admin {
  color: purple;
}

</style>
