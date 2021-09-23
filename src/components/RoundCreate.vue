<template>
  <ui-header title="create_round" translate>
    <ui-text text="create_round" />
  </ui-header>

  <ui-card notitle>
    <div>
      <ui-text :text="`Problem ${pid}: ${data.problem.title}`" raw />
    </div>
    <div>
      <ui-text :text="`Players Limit: ${data.problem.playerMin}-${data.problem.playerMax === -1 ? 'infinity' : data.problem.playerMax}`" raw />
    </div>
    <div class="select_table">
      <ui-text text="select_participants" class="title" />
      <div
        v-for="bot in data.bots"
        :key="bot.bid"
        @click="toggle_select(bot.bid)"
        :title="bot.bid"
        class="bot-card"
        :class="{ selected: selected.indexOf(bot.bid) > -1 }">
        <div>
          {{ bot.name }}
        </div>
        <div class="info">
          by {{ bot.author }}
        </div>
      </div>
    </div>
    <ui-button
      type="primary"
      icon="bomb"
      :disabled="selected.length > data.problem.playerMax || selected.length < data.problem.playerMin || waiting"
      @click="createNewRound">
      <ui-text text="start_round" />
    </ui-button>
  </ui-card>
</template>

<style lang="less" scoped>
.select_table {
  margin: 20px 0;

  .title {
    font-size: 1.2em;
    font-weight: bold;
    display: block;
    margin: 10px 0;
  }

  .bot-card {
    background-color: var(--background-color);
    border: 2px solid var(--background-color);
    display: inline-block;
    padding: 0.5em 1em;
    cursor: pointer;
    margin-right: 20px;
    margin-bottom: 20px;
    text-align: center;
    transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
    user-select: none;

    &:hover {
      background-color: var(--hover-color);
      border-color: var(--hover-color);
    }

    &.selected {
      background-color: var(--active-color);
      border-color: chartreuse;
    }

    .info {
      font-size: 0.8em;
    }
  }
}
</style>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { MyStore } from '../store';
import { ActionTypes } from '../store/action-types';

export default defineComponent({
  props: {
    pid: {
      type: Number,
      required: true,
    },
    bid: {
      type: Number,
      required: false,
    }
  },
  async setup(props) {
    const { pid, bid } = toRefs(props);

    const router = useRouter();
    const store = useStore() as MyStore;

    await store.dispatch(ActionTypes.FETCH_PROBLEM_DATA, pid);
    await store.dispatch(ActionTypes.FETCH_BOT_LIST, { pid, username: undefined });

    const selected = ref([] as number[]);
    const waiting = ref(false);

    if (bid && bid.value) {
      let found = false;
      for (let i = 0; i < store.state.data.bots.length; i++) {
        if (store.state.data.bots[i].bid == bid.value) {
          found = true;
          break;
        }
      }
      if (found) {
        selected.value = [bid.value];
      }
    }

    const createNewRound = async () => {
      waiting.value = true;
      const result = await store.dispatch(ActionTypes.CREATE_NEW_ROUND, { pid, bids: selected });
      if (typeof result === 'number') {
        router.push(`/s/${result}`);
      } else {
        waiting.value = false;
      }
    }

    const toggle_select = (bid: number) => {
      if (selected.value.indexOf(bid) > -1) {
        selected.value = selected.value.filter((i) => i != bid);
      } else {
        selected.value = selected.value.concat(bid);
      }
    }

    return {
      waiting,
      selected,
      toggle_select,
      createNewRound,
      ...toRefs(store.state)
    }

  },
})
</script>

