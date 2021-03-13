<template>
  <ui-header :title="data.post.title">
    <template #route1>
      <ui-text to="/r" text="region" />
    </template>
    <template #route2>
      <ui-text :to="`/r/${data.region.region}`" :text="data.region.title" row />
    </template>
    <ui-text :text="data.post.title" />
  </ui-header>
  <div v-if="ssr.status === 200">
    <ui-card
      notitle
      class="comment"
      v-for="comment of data.comments"
      :key="comment.cid">
      <div class="infos">
        <a :href="`#${comment.cid}`" class="level" :id="comment.cid">#{{ comment.cid }}</a>
        <router-link class="author" :to="`/u/${comment.author}`"><ui-icon name="user" regular right/>{{ comment.author }}</router-link>
        <ui-date :time="comment.date" />
        <span class="edited" v-if="comment.edited">
          <ui-icon name="edit" right />
          <ui-text text="edited" />
        </span>
        <span class="operations" v-if="accounts.admin || accounts.username === comment.author">
          <ui-icon class="delete" name="trash-alt" regular right
            @click="handleDeleteComment(comment.cid)" />
          <ui-icon class="edit" name="edit"
            @click="handleEditComment(comment)" />
        </span>
      </div>
      <ui-content
        v-if="editing !== comment.cid"
        class="content"
        :text="comment.content"
        :markdown="comment.markdown" />
      <div class="editing" v-else>
        <ui-editor v-model="editingText" />
        <div class="bts">
          <ui-button type="primary" icon="location-arrow" @click="handleApplyEdit">
            <ui-text text="submit" />
          </ui-button>
          <ui-button icon="cat" @click="handleCancelEdit">
            <ui-text text="cancel" />
          </ui-button>
        </div>
      </div>
    </ui-card>
    <ui-card class="reply" v-if="accounts.username" shadow="hover">
      <template #header>
        <ui-text text="reply"/>
      </template>
      <div class="reply-warn">
        <ui-text text="reply_warning"/>
      </div>
      <ui-editor
        v-model="content"
        placeholder="reply_placeholder"
        class="reply-content"
      />
      <div class="buttons">
        <ui-button type="primary" icon="location-arrow" @click="handleReply">
          <ui-text text="submit"/>
        </ui-button>
      </div>
    </ui-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import { useStore } from 'vuex';
import { confirm } from '../utils';
import { MyStore } from '../store';
import { ActionTypes } from '../store/action-types';
import { CommentDetail } from 'app/types';

export default defineComponent({
  props: {
    region: {
      type: String,
      required: true,
    },
    pid: {
      type: Number,
      required: true,
    },
  },
  async setup(props) {
    const content = ref('');
    const editing = ref(-1);
    const editingText = ref('');
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
        if (!await confirm(store.state.i18n.lang, 'confirm_delete_post')) {
          return;
        }
        await store.dispatch(ActionTypes.DELETE_POST, {
          region,
          pid,
        });
      } else {
        if (!await confirm(store.state.i18n.lang, 'confirm_delete_comment')) {
          return;
        }
        await store.dispatch(ActionTypes.DELETE_COMMENT, {
          region,
          pid,
          cid,
        });
      }
    };

    const handleEditComment = (cmt: CommentDetail) => {
      editingText.value = cmt.content;
      editing.value = cmt.cid;
    };
    const handleCancelEdit = () => {
      editing.value = -1;
    };

    const handleApplyEdit = async () => {
      const success = await store.dispatch(ActionTypes.UPDATE_COMMENT, {
        region,
        pid,
        cid: editing,
        content: editingText,
      });
      if (success) {
        handleCancelEdit();
      }
    };

    await store.dispatch(ActionTypes.FETCH_POST_DATA, {
      region: region.value,
      pid: pid.value,
    });

    return {
      editing,
      content,
      handleReply,
      editingText,
      handleApplyEdit,
      handleCancelEdit,
      handleEditComment,
      handleDeleteComment,
      ...toRefs(store.state),
    };
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

@import "../plugins/ui/styles/vars.less";

.post-title {
  margin-bottom: 10px !important;
}

.comment {

  .infos {

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
  }

  &:hover .operations {
    opacity: 1;
  }

  .editing {
    margin-top: 20px;

    .bts {
      margin-top: 20px;
    }
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
