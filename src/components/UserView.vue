<template>
  <Suspense>
    <div>
      <h1>{{ data.user.username }}</h1>
      <span v-if="data.user.admin">{{ translate(i18n.lang, 'admin') }}</span>
      <p>{{ data.user.email }}</p>
      <p>{{ data.user.desc }}</p>
    </div>
  </Suspense>
</template>

<script lang="ts">
import { getUserDetail } from '@/api/accounts';
import { defineComponent, Ref, toRefs, watch } from 'vue';
import { handleNetworkRequestError } from '@/utils';
import { Store, useStore } from 'vuex';
import { MutationTypes, StoreState } from '@/store';
import { translate } from '@/i18n/translate';
import { RouteLocationNormalizedLoaded } from 'vue-router';

type Props = {
  username: string;
}

export default defineComponent(async (props: Props) => {
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
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
