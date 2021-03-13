<template>
  <ui-header title="search_result" translate>
    <template #route1>
      <ui-text text="bot" />
    </template>
    <ui-text text="search_result" />
  </ui-header>

  <ui-card notitle>
    <div class="filter">
      <ui-input class="a" type="number" v-model="mypid" placeholder="pid" />
      <ui-input class="a" type="text" v-model="myusername" placeholder="username" />
      <ui-button type="primary" @click="applyFilter">
        <ui-text text="apply" />
      </ui-button>
    </div>
    <div class="list margin">
      <ui-icon name="cat" text="no_matches" large v-if="!data.bots.length" />
      <div v-for="bot in data.bots" :key="bot.bid" class="item">
        <ui-text :text="bot.name" row :to="`/b/${bot.bid}`" class="a" />
        <ui-text :text="bot.author" row icon="user" :to="`/u/${bot.author}`" />
        <ui-text :text="`${bot.version}`" row icon="code-branch" />
        <ui-date :time="bot.created" />
        <ui-date :time="bot.updated" />
      </div>
    </div>
  </ui-card>
</template>

<style lang="less" scoped>
.filter {
  display: flex;
  gap: 20px;

  .a {
    flex: 1;
  }
}

.item {
  display: flex;

  .a {
    flex: 1;
  }
}
</style>

<script lang="ts">
import { MyStore } from '../store';
import { ActionTypes } from '../store/action-types';
import { defineComponent, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export default defineComponent({
  props: {
    pid: String,
    username: String,
  },
  async setup(props) {
    const store = useStore() as MyStore;
    const router = useRouter();

    const update = async (pid: string | undefined, username: string | undefined) => {
      const ppid = !Number(pid) ? undefined : Number(pid);
      const uuname = username || undefined;
      await store.dispatch(ActionTypes.FETCH_BOT_LIST, {
        pid: ppid,
        username: uuname,
      });
    };
    await update(props.pid, props.username);

    const mypid = ref(props.pid ?? '');
    const myusername = ref(props.username ?? '');

    const applyFilter = async () => {
      await update(mypid.value, myusername.value);
      const url = new URLSearchParams();
      if (mypid.value) url.append('p', mypid.value);
      if (myusername.value) url.append('u', myusername.value);
      router.replace({ name: 'BotList', query: { p: mypid.value, u: myusername.value } });
    };

    return {
      mypid,
      myusername,
      applyFilter,
      ...toRefs(store.state),
    };
  },
});
</script>
