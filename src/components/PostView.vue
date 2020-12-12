<template>
  <h1>{{ data.post.title }}</h1>
  <div class="comment" v-for="comment of data.comments" :key="comment.cid">
    <div class="info">
      <a v-if="comment.cid > 1" :href="`#${comment.cid}`" class="level" :id="comment.cid"># {{ comment.cid }}</a>
      <router-link class="author" :to="`/u/${comment.author}`"><i class="el-icon-user"></i>{{ comment.author }}</router-link>
      <time class="time"><i class="el-icon-date"></i>{{ new Date(comment.date).toLocaleString() }}</time>
      <span class="edited" v-if="comment.edited">
        <i class="el-icon-edit"></i>
        Edited
      </span>
      <div class="operations" v-if="accounts.admin || accounts.username === comment.author">
        <i class="delete el-icon-delete"
          @click="handleDeleteComment(comment.cid)" />
        <i class="edit el-icon-edit"
          @click="handleEditComment(comment.cid)" />
      </div>
    </div>
    <div class="content marked" v-html="santinizeMarked(comment.content)"></div>
  </div>
  <div class="reply" v-if="accounts.username">
    <h2>{{ translate(i18n.lang, 'reply') }}</h2>
    <el-input type="textarea" v-model="reply" />
    <div class="buttons">
      <el-button type="primary" @click="handleReply">{{ translate(i18n.lang, 'reply') }}</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { ActionTypes, MutationTypes, StoreState } from '@/store';
import { defineComponent, ref, toRefs } from 'vue';
import { useStore } from 'vuex';
import { translate } from '@/i18n/translate';
import { preventSSRFetchTwice, handleNetworkRequestError, msgbox, notify, santinizeMarked } from '@/utils';
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
    const reply = ref('');
    const { region, pid } = toRefs(props);

    const store = useStore<StoreState>();
    const router = useRouter();

    const handleReply = async () => {
      const result = await API.sendReply(region.value, pid.value, reply.value);
      if (result.status === 200) {
        reply.value = '';
        notify({
          type: 'success',
          title: translate(store.state.i18n.lang, 'success'),
          message: translate(store.state.i18n.lang, 'reply_success'),
        });
        store.commit(MutationTypes.CREATED_COMMENT, result.comment);
      } else {
        handleNetworkRequestError(store, result);
      }
    };

    const handleDeletePost = async () => {
      try {
        await msgbox.confirm(
          translate(store.state.i18n.lang, 'confirm_delete_post'),
          translate(store.state.i18n.lang, 'warning'),
          {
            type: 'warning',
            confirmButtonText: translate(store.state.i18n.lang, 'ok'),
            cancelButtonText: translate(store.state.i18n.lang, 'cancel'),
          },
        );
      } catch (e) {
        // cancel
        return;
      }

      const result = await API.deletePost(region.value, pid.value);
      if (result.status === 200) {
        notify({
          title: translate(store.state.i18n.lang, 'success'),
          type: 'success',
          message: translate(store.state.i18n.lang, 'delete_success'),
        });
        router.push(`/r/${region.value}`);
      } else {
        handleNetworkRequestError(store, result);
      }
    };

    const handleDeleteComment = async (cid: number) => {
      if (cid === 1) {
        await handleDeletePost();
        return;
      }

      try {
        await msgbox.confirm(
          translate(store.state.i18n.lang, 'confirm_delete_comment'),
          translate(store.state.i18n.lang, 'warning'),
          {
            type: 'warning',
            confirmButtonText: translate(store.state.i18n.lang, 'ok'),
            cancelButtonText: translate(store.state.i18n.lang, 'cancel'),
          },
        );
      } catch (e) {
        // cancel
        return;
      }

      const result = await API.deleteComment(region.value, pid.value, String(cid));
      if (result.status === 200) {
        notify({
          title: translate(store.state.i18n.lang, 'success'),
          type: 'success',
          message: translate(store.state.i18n.lang, 'delete_success'),
        });
        store.commit(MutationTypes.DELETED_COMMENT, cid);
      } else {
        handleNetworkRequestError(store, result);
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
      reply,
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

.comment {
  margin-top: 20px;

  .info {
    position: relative;

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
    word-wrap: break-word;
  }

  &:hover .operations {
    opacity: 1;
  }
}

.reply {

  .buttons {
    margin-top: 20px;
  }
}

</style>
