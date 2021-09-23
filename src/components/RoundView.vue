<template>
  <ui-header title="check_round" translate>
    <ui-text text="check_round" />
  </ui-header>

  <ui-card notitle v-if="ssr.status === 200">
    <h2>Round #{{ data.round.rid }}: {{ data.round.status }}</h2>
    <div v-if="data.round.status === 'error'" class="error">
      <pre><code>{{ data.round.log }}</code></pre>
    </div>
    <div :class="{ hidden: data.round.status !== 'finish' }" class="canvas">
      <canvas ref="canvas"></canvas>

      <div class="details">
        <details>
          <summary>Judger Log</summary>
          <pre><code>{{ logs?.judger_log }}</code></pre>
        </details>
        <details>
          <summary>Judger Stdout</summary>
          <pre><code>{{ logs?.player_logs?.[0] }}</code></pre>
        </details>
        <details v-for="(bid, index) in data.round.bids" :key="bid">
          <summary>Player {{ index + 1 }} Stdout</summary>
          <pre><code>{{ logs?.player_logs?.[index + 1] }}</code></pre>
        </details>
      </div>
    </div>
    <div class="bot-list">
      <ui-text text="participants" class="title" />
      <div class="item"
        v-for="(bot, index) in data.bots"
        :key="bot.bid">
        <div>
          <ui-text :text="`Player ${index + 1}${logs?.result?.players?.[index]?.isWinner ? ' (Winner)' : ''}`" raw class="player" />
        </div>
        <div class="bots">
          <router-link
            :to="`/b/${bot.bid}`"
            class="bot"
            :class="{ winner: logs?.result?.players?.[index]?.isWinner }">
            <div>
              {{ bot.name }}
            </div>
            <div class="info">
              by {{ bot.author }}
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </ui-card>
</template>

<style lang="less" scoped>
.error {

  pre {
    overflow-x: auto;
  }
}

.canvas {
  margin: 20px 0;

  &.hidden {
    display: none;
  }
}

.details {
  margin: 20px 0;
}

.bot-list {

  .title {
    display: block;
    margin: 10px 0;
    font-size: 1.2em;
    font-weight: bold;
  }

  .bots {
    margin: 10px 0;
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

    &.winner {
      background-color: var(--active-color);
      border-color: chartreuse;
    }

    .info {
      font-size: .8em;
      margin-top: 5px;
    }
  }

}
</style>

<script lang="ts">
import { defineComponent, onMounted, ref, toRef, toRefs, watch } from 'vue'
import { useStore } from 'vuex';
import Code from '../plugins/ui/Code.vue';
import Select from '../plugins/ui/Select.vue';
import { MyStore } from '../store';
import { ActionTypes } from '../store/action-types';

export default defineComponent({
  components: { Code, Select },
  props: {
    rid: {
      type: Number,
      required: true,
    }
  },
  async setup(props) {
    const { rid } = toRefs(props);

    const store = useStore() as MyStore;

    const logs = ref({
      judger_log: '',
      player_logs: [],
    });

    const updateJudgeLogs = () => {
      if (store.state.data.round.status === 'finish') {
        logs.value = JSON.parse(store.state.data.round.log);
      }
    }
    const mounted = ref(false);
    const painted = ref(false);
    const updatePainting = () => {
      if (!mounted.value || painted.value || !canvas.value) return;
      if (store.state.data.round.status === 'finish' && store.state.data.problem.paint) {
        painted.value = true;
        try {
          (0, eval)(store.state.data.problem.paint);
          (window as any).__paint_script__(canvas.value, logs.value.judger_log);
        } catch (e) {
          console.error(e);
        }
      }
    }

    const refresh = async () => {
      if (!painted.value) {
        await store.dispatch(ActionTypes.FETCH_ROUND_DETAIL, rid);
        if (store.state.data.round.status === 'pending' || store.state.data.round.status === 'judging') {
          setTimeout(refresh, 1000);
        }
      }
    }

    const canvas = ref(null as HTMLCanvasElement | null);

    watch(() => store.state.data.round, updateJudgeLogs);
    watch(() => [store.state.data.round, store.state.data.problem], updatePainting);

    onMounted(() => {
      mounted.value = true;
      updatePainting();
      if (store.state.data.round.status === 'pending' || store.state.data.round.status === 'judging') {
        setTimeout(refresh, 1000);
      }
    });

    await store.dispatch(ActionTypes.FETCH_ROUND_DETAIL, rid);
    await store.dispatch(ActionTypes.FETCH_PROBLEM_DATA, store.state.data.round.pid);
    await store.dispatch(ActionTypes.FETCH_BOTS_DATA, store.state.data.round.bids);

    updateJudgeLogs();

    return {
      logs,
      canvas,
      ...toRefs(store.state),
    }
  },
})
</script>

