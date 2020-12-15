<template>
  <el-card
    class="comment"
    v-for="comment of data.comments"
    :key="comment.cid"
    shadow="hover">
    <template #header>
      <h1 v-if="comment.cid === 1" class="post-title">{{ data.post.title }}</h1>
      <a :href="`#${comment.cid}`" class="level" :id="comment.cid"># {{ comment.cid }}</a>
      <router-link class="author" :to="`/u/${comment.author}`"><i class="el-icon-user"></i>{{ comment.author }}</router-link>
      <time class="time"><i class="el-icon-date"></i>{{ new Date(comment.date).toLocaleString() }}</time>
      <span class="edited" v-if="comment.edited">
        <i class="el-icon-edit"></i>
        Edited
      </span>
      <span class="operations" v-if="accounts.admin || accounts.username === comment.author">
        <i class="delete el-icon-delete"
          @click="handleDeleteComment(comment.cid)" />
        <i class="edit el-icon-edit"
          @click="handleEditComment(comment.cid)" />
      </span>
    </template>
    <div class="content marked" v-html="santinizeMarked(comment.content)"></div>
  </el-card>
  <el-card class="reply" v-if="accounts.username" shadow="hover">
    <template #header>
      <h2>{{ translate(i18n.lang, 'reply') }}</h2>
    </template>
    <div class="reply-warn">
      {{ translate(i18n.lang, 'reply_warning') }}
    </div>
    <el-input
      type="textarea"
      v-model="content"
      :autosize="{ minRows: 6 }"
      :placeholder="translate(i18n.lang, 'reply_placeholder')"
      class="reply-content" />
    <div class="buttons">
      <el-button type="primary" @click="handleReply">{{ translate(i18n.lang, 'submit') }}</el-button>
    </div>
  </el-card>
</template>

<script lang="ts">
import { ActionTypes, MutationTypes, StoreState } from '@/store';
import { defineComponent, ref, toRefs } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/i18n/translate';
import { preventSSRFetchTwice, handleNetworkRequestError, msgbox, notify, santinizeMarked, confirm } from '@/utils';
import { useRouter } from 'vue-router';
import { API } from '@/api';

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
    const content = ref('');
    const { region, pid } = toRefs(props);

    const store = useStore<StoreState>();
    const router = useRouter();

    const handleReply = async () => {
      await store.dispatch(ActionTypes.CREATE_COMMENT, {
        region,
        pid,
        content,
      });
    };

    const handleDeleteComment = async (cid: number) => {
      if (cid === 1) {
        if (!await confirm(store.state.i18n.lang, translate(store.state.i18n.lang, 'confirm_delete_post'))) {
          return;
        }
        await store.dispatch(ActionTypes.DELETE_POST, {
          region,
          pid,
        });
      } else {
        if (!await confirm(store.state.i18n.lang, translate(store.state.i18n.lang, 'confirm_delete_comment'))) {
          return;
        }
        await store.dispatch(ActionTypes.DELETE_COMMENT, {
          region,
          pid,
          cid: String(cid),
        });
      }
    };

    const handleEditComment = (cid: number) => {
      alert('Not implemented yet ' + cid);
    };

    if (preventSSRFetchTwice()) {
      await store.dispatch(ActionTypes.FETCH_POST_DATA, {
        region: region.value,
        pid: pid.value,
      });
    }

    return {
      translate,
      content,
      handleReply,
      handleEditComment,
      handleDeleteComment,
      santinizeMarked,
      ...toRefs(store.state),
    };
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

.post-title {
  margin-bottom: 10px !important;
}

.comment {
  margin-top: 20px;

  .el-card__header {

    i {
      margin-right: 5px;
    }

    .level, .author, .time {
      margin-right: 20px;
    }

    .operations {
      float: right;
      opacity: 0;
      transition: opacity .2s;

      .delete {
        color: red;
        cursor: pointer;
      }

      .edit {
        cursor: pointer;
      }
    }
  }

  .content {
    word-wrap: break-word;
  }

  &:hover .operations {
    opacity: 1;
  }
}

.reply {
  margin-top: 20px;

  .reply-warn {
    margin-top: 20px;
    color: red;
  }

  .reply-content {
    margin-top: 20px;
  }
  
  .reply-title {
    margin: 0;
  }

  .buttons {
    margin: 20px 0;
  }
}

</style>
