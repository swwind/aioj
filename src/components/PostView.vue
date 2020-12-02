<template>
  <h1>{{ post.title }}</h1>
  <div class="comment" v-for="comment of comments" :key="comment.cid">
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
import { State } from '@/store';
import { defineComponent, ref } from 'vue';
import { CommentDetail, PostDetail } from '../../app/types';
import { mapState, Store, useStore } from 'vuex';
import { translate } from '@/i18n/translate';
import { handleNetworkRequestError } from '@/utils';
import { ElNotification as notify } from 'element-plus';

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
  setup(props) {
    const post = ref({} as PostDetail);
    const comments = ref([] as CommentDetail[]);
    const reply = ref('');

    const store = useStore() as Store<State>;

    const handleReply = async () => {
      const result = await sendReply(props.region, props.pid, reply.value);
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

    return {
      post,
      comments,
      translate,
      reply,
      handleReply,
    };
  },
  computed: {
    ...mapState(['accounts', 'i18n']),
  },
  async mounted() {
    const result = await getPostDetail(this.region, this.pid);
    if (result.status === 200) {
      this.post = result;
      this.comments = result.comments;
    } else {
      handleNetworkRequestError(this.i18n.lang, result);
    }
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
