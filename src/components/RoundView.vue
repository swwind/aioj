<template>
  <ui-header title="check_round" translate>
    <ui-text text="check_round" />
  </ui-header>

  <ui-card notitle>
    <div class="canvas">
      <canvas></canvas>
    </div>
    <div class="bot-list">
      <ui-text text="participants" class="title" />
      <router-link
        :to="`/b/${bot.bid}`"
        v-for="bot in data.bots"
        :key="bot.bid"
        class="bot">
        <div>
          {{ bot.name }}
        </div>
        <div class="info">
          by {{ bot.author }}
        </div>
      </router-link>
    </div>
  </ui-card>
</template>

<style lang="less" scoped>
.bot-list {

  .title {
    display: block;
    margin: 10px 0;
    font-size: 1.2em;
    font-weight: bold;
  }

  .bot {
    color: var(--font-color);
    text-decoration: none;
    background-color: var(--background-color);
    border: 2px solid var(--background-color);
    display: inline-block;
    padding: 0.5em 1em;
    cursor: pointer;
    margin-right: 20px;
    text-align: center;
    transition: border-color 0.2s ease-in-out, background-color 0.2s ease-in-out;
    user-select: none;

    &:hover {
      background-color: var(--hover-color);
      border-color: var(--hover-color);
    }

    .info {
      font-size: .8em;
    }
  }
}
</style>

<script lang="ts">
import { defineComponent, toRefs } from 'vue'
import { useStore } from 'vuex';
import { MyStore } from '../store';
import { ActionTypes } from '../store/action-types';

export default defineComponent({
  props: {
    rid: {
      type: Number,
      required: true,
    }
  },
  async setup(props) {
    const { rid } = toRefs(props);

    const store = useStore() as MyStore;

    await store.dispatch(ActionTypes.FETCH_ROUND_DETAIL, rid);
    await store.dispatch(ActionTypes.FETCH_PROBLEM_DATA, store.state.data.round.pid);
    await store.dispatch(ActionTypes.FETCH_BOTS_DATA, store.state.data.round.bids);

    return {
      ...toRefs(store.state),
    }
  },
})
</script>

