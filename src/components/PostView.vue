<template>
  <ui-card notitle
    class="comment"
    v-for="comment of data.comments"
    :key="comment.cid">
    <div class="infos">
      <a :href="`#${comment.cid}`" class="level" :id="comment.cid">#{{ comment.cid }}</a>
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
    </div>
    <div class="content marked" v-if="comment.markdown" v-html="santinizeMarked(comment.content)"></div>
    <div class="content raw" v-else>{{ comment.content }}</div>
  </ui-card>
  <ui-card class="reply" v-if="accounts.username" shadow="hover">
    <template #header>
      {{ translate(i18n.lang, 'reply') }}
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
  </ui-card>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/i18n/translate';
import { santinizeMarked, confirm } from '@/utils';
import { MyStore } from '@/store';
import { ActionTypes } from '@/store/action-types';

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

    const store = useStore() as MyStore;

    const handleReply = async () => {
      const success = await store.dispatch(ActionTypes.CREATE_COMMENT, {
        region,
        pid,
        content,
      });
      if (success) {
        content.value = '';
      }
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

    await store.dispatch(ActionTypes.FETCH_POST_DATA, {
      region: region.value,
      pid: pid.value,
    });

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

  .infos {

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
    margin-top: 20px;

    &.marked {
      word-wrap: break-word;
    }

    &.raw {
      white-space: pre-wrap;
    }
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
