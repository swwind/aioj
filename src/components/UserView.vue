<template>
  <h1>{{ data.user.username }}</h1>
  <span v-if="data.user.admin">{{ translate(i18n.lang, 'admin') }}</span>
  <p>{{ data.user.email }}</p>
  <p>{{ data.user.desc }}</p>
</template>

<script lang="ts">
import { getUserDetail } from '@/api/accounts';
import { defineComponent, toRefs } from 'vue';
import { handleNetworkRequestError } from '@/utils';
import { useStore } from 'vuex';
import { MutationTypes, StoreState } from '@/store';
import { translate } from '@/i18n/translate';

export default defineComponent({
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  async setup(props) {
    const { username } = toRefs(props);
    const store = useStore<StoreState>();

    const result = await getUserDetail(username.value);
    if (result.status === 200) {
      store.commit(MutationTypes.FETCH_USER_DETAIL, result.user);
    } else {
      handleNetworkRequestError(store.state.i18n.lang, result);
    }

    return {
      translate,
      ...toRefs(store.state),
    };
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
