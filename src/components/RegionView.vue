<template>
  <ui-card notitle>
    <div class="desc">
      {{ data.region.description }}
      <div class="operations" v-if="accounts.admin">
        <i class="el-icon-delete" @click="handleDeleteRegion"></i>
        <i class="el-icon-edit"></i>
      </div>
    </div>
    <div class="posts-list">
      <el-alert type="warning" v-if="!data.posts.length">{{ translate(i18n.lang, 'no_posts') }}</el-alert>
      <div class="post-item" v-for="post of data.posts" :key="post.pid">
        <div class="title">
          <router-link :to="`/r/${data.region.region}/${post.pid}`">{{ post.title }}</router-link>
        </div>
        <router-link class="author" :to="`/u/${post.author}`">
          <i class="el-icon-user-solid"></i>
          {{ post.author }}
        </router-link>
        <time class="time">
          <i class="el-icon-date"></i>
          {{ new Date(post.date).toLocaleString() }}
        </time>
      </div>
    </div>
  </ui-card>
  <ui-card class="create" v-if="accounts.username">
    <template #header>
      {{ translate(i18n.lang, 'create_new_post') }}
    </template>
    <div class="form">
      <el-input
        type="text"
        v-model="title"
        class="title"
        :placeholder="translate(i18n.lang, 'post_title')" />
      <el-input
        type="textarea"
        v-model="content"
        class="content"
        :placeholder="translate(i18n.lang, 'post_content')" />
      <div class="buttonset">
        <el-button
          type="primary"
          @click="handleSendPost">
          {{ translate(i18n.lang, 'post') }}
        </el-button>
      </div>
    </div>
  </ui-card>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import { confirm } from '@/utils';
import { useStore } from 'vuex';
import { translate } from '@/i18n/translate';
import { MyStore } from '@/store';
import { ActionTypes } from '@/store/action-types';

export default defineComponent({
  props: {
    region: {
      type: String,
      required: true,
    },
  },
  async setup(props) {
    const { region } = toRefs(props);
    const store = useStore() as MyStore;

    const title = ref('');
    const content = ref('');
    const handleSendPost = async () => {
      await store.dispatch(ActionTypes.CREATE_POST, {
        region,
        title,
        content,
      });
    };

    const handleDeleteRegion = async () => {
      if (!await confirm(store.state.i18n.lang, translate(store.state.i18n.lang, 'confirm_delete_region'))) {
        return;
      }

      await store.dispatch(ActionTypes.DELETE_REGION, region.value);
    };

    await store.dispatch(ActionTypes.FETCH_REGION_DATA, region.value);

    return {
      title,
      content,
      translate,
      handleSendPost,
      handleDeleteRegion,

      ...toRefs(store.state),
    };
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

.desc {
  margin: 20px 0 0 0;

  .operations {
    float: right;
    font-size: 1.2rem;

    i {
      margin-right: 5px;
      cursor: pointer;
    }
  }
}

.posts-list {
  margin: 20px 0;
}

.post-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-column-gap: 20px;

  .title {
    word-break: break-word;
  }

  i {
    margin-right: 5px;
  }
}

.create {
  margin-top: 20px;

  .form {
    margin: 20px 0;
  }

  .title, .content {
    margin-bottom: 20px;
  }
}

</style>
