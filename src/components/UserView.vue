<template>
  <div v-if="data.user.username">
    <h1>
      {{ data.user.username }}
      <i
        v-if="accounts.username && accounts.username !== data.user.username"
        class="button"
        :class="accounts.friends.indexOf(data.user.username) > -1 ? 'el-icon-star-on' : 'el-icon-star-off'"
        @click="handleToggleFriend"/>
    </h1>
    <span v-if="data.user.admin">{{ translate(i18n.lang, 'admin') }}</span>
    <p>{{ data.user.email }}</p>
    <p>{{ data.user.desc }}</p>
  </div>
  <div v-else>
    <h1>{{ translate(i18n.lang, 'user_not_exists') }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, watch } from 'vue';
import { handleNetworkRequestError } from '@/utils';
import { useStore } from 'vuex';
import { MutationTypes, StoreState } from '@/store';
import { translate } from '@/i18n/translate';
import { API } from '@/api';

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

    const loadUser = async () => {
      const result = await API.getUserDetail(username.value);
      if (result.status === 200) {
        store.commit(MutationTypes.FETCH_USER_DETAIL, result.user);
        store.commit(MutationTypes.CHANGE_SSR_TITLE, `${translate(store.state.i18n.lang, 'user')}: ${result.user.username} - AIOJ`);
      } else {
        handleNetworkRequestError(store, result);
      }
    };
    watch(username, loadUser);
    await loadUser();

    const handleRemoveFriend = async () => {
      const result = await API.removeFriend(username.value);
      if (result.status === 200) {
        store.commit(MutationTypes.REMOVE_FRIEND, username.value);
      } else {
        handleNetworkRequestError(store, result);
      }
    };
    const handleAddFriend = async () => {
      const result = await API.addFriend(username.value);
      if (result.status === 200) {
        store.commit(MutationTypes.ADD_NEW_FRIEND, username.value);
      } else {
        handleNetworkRequestError(store, result);
      }
    };

    const handleToggleFriend = async () => {
      if (store.state.accounts.friends.indexOf(username.value) > -1) {
        await handleRemoveFriend();
      } else {
        await handleAddFriend();
      }
    };

    return {
      translate,
      handleToggleFriend,
      ...toRefs(store.state),
    };
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

.el-icon-star-on {
  color: #ffd200;
}

.button {
  cursor: pointer;
}

</style>
