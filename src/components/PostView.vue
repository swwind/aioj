<template>
  <h1>{{ data.post.title }}</h1>
  <div class="comment" v-for="comment of data.comments" :key="comment.cid">
    <div class="info">
      <a v-if="comment.cid > 1" :href="`#${comment.cid}`" class="level" :id="comment.cid"># {{ comment.cid }}</a>
      <router-link class="author" :to="`/u/${comment.author}`"><i class="el-icon-user"></i>{{ comment.author }}</router-link>
      <time class="time"><i class="el-icon-date"></i>{{ new Date(comment.date).toLocaleString() }}</time>
    </div>
    <div class="content">{{ comment.content }}</div>
  </div>
  <div class="reply" v-if="accounts.username">
    <h2>{{ translate(i18n.lang, 'reply') }}</h2>
    <textarea v-model="reply"></textarea>
    <div class="buttons">
      <el-button type="primary" @click="handleReply">{{ translate(i18n.lang, 'reply') }}</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { getPostDetail, sendReply } from '@/api/forum';
import { StoreState } from '@/store';
import { defineComponent, ref, toRefs } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/i18n/translate';
import { handleNetworkRequestError } from '@/utils';
import { ElNotification as notify } from 'element-plus';
import * as MutationTypes from '@/store/mutation-types';

export default defineComponent({
  props: {
    region: {
      type: String,
      required: true,
    },
    pid: {
      type: String,
      required: true,
    },
  },
  async setup(props) {
    const reply = ref('');
    const { region, pid } = toRefs(props);

    const store = useStore<StoreState>();

    const handleReply = async () => {
      const result = await sendReply(region.value, pid.value, reply.value);
      if (result.status === 200) {
        reply.value = '';
        notify({
          type: 'success',
          title: translate(store.state.i18n.lang, 'success'),
          message: translate(store.state.i18n.lang, 'reply_success'),
        });
      } else {
        handleNetworkRequestError(store.state.i18n.lang, result);
      }
    };

    const result = await getPostDetail(region.value, pid.value);
    if (result.status === 200) {
      store.commit(MutationTypes.FETCH_POST_DETAIL, result.post);
      store.commit(MutationTypes.FETCH_COMMENT_LIST, result.comments);
      store.commit(MutationTypes.FETCH_REGION_DETAIL, result.region);
    } else {
      handleNetworkRequestError(store.state.i18n.lang, result);
    }

    return {
      translate,
      reply,
      handleReply,

      ...toRefs(store.state),
    };
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

.comment {
  margin-top: 20px;

  .info {
    i {
      margin-right: 5px;
    }

    .level, .author {
      margin-right: 20px;
    }
  }

  .content {
    margin-top: 20px;
    white-space: pre-wrap;
  }
}

.reply {

  textarea {
    display: block;
    min-width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    min-height: 200px;
    padding: 5px;
  }

  .buttons {
    margin-top: 20px;
  }
}

</style>
