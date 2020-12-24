<template>
  <ui-card notitle
    class="comment"
    v-for="comment of data.comments"
    :key="comment.cid">
    <div class="infos">
      <a :href="`#${comment.cid}`" class="level" :id="comment.cid">#{{ comment.cid }}</a>
      <router-link class="author" :to="`/u/${comment.author}`"><ui-icon name="perm_identity"/>{{ comment.author }}</router-link>
      <time class="time"><ui-icon name="access_time" />{{ new Date(comment.date).toLocaleString() }}</time>
      <span class="edited" v-if="comment.edited">
        <ui-icon name="edit" />
        Edited
      </span>
      <span class="operations" v-if="accounts.admin || accounts.username === comment.author">
        <ui-icon class="delete" name="delete_outline"
          @click="handleDeleteComment(comment.cid)" />
        <ui-icon class="edit" name="edit"
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
    <ui-editor
      v-model="content"
      :placeholder="translate(i18n.lang, 'reply_placeholder')"
      class="reply-content"
    />
    <div class="buttons">
      <ui-button type="primary" @click="handleReply">{{ translate(i18n.lang, 'submit') }}</ui-button>
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
        markdown: true,
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

@import "@/plugins/ui/styles/vars.less";

.post-title {
  margin-bottom: 10px !important;
}

.comment {

  .infos {

    i {
      margin-right: 5px;
      font-size: 1.125rem;
    }

    .level, .author, .time {
      margin-right: 20px;
    }

    .operations {
      float: right;
      opacity: 0;
      transition: opacity .2s;

      .delete {
        color: @red;
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
