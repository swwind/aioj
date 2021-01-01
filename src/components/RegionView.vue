<template>
  <ui-header />
  <div v-if="ssr.status === 200">
    <ui-card notitle>
      <div class="desc">
        {{ data.region.description }}
        <div class="operations" v-if="accounts.admin">
          <ui-icon name="trash-alt" right @click="handleDeleteRegion" />
          <ui-icon name="edit" @click="handleEnterEdit" />
        </div>
      </div>
      <div class="margin margin-bottom" v-if="editing">
        <ui-input
          type="text"
          icon="align-left"
          v-model="rtitle"
          placeholder="region_title" />
        <ui-editor
          v-model="rdesc"
          class="margin"
          placeholder="region_desc" />
        <div class="margin">
          <ui-button type="primary" icon="location-arrow" @click="handleEditRegion">
            <ui-text text="submit" />
          </ui-button>
          <ui-button icon="cat" @click="handleCancelEdit">
            <ui-text text="cancel" />
          </ui-button>
        </div>
      </div>
      <ui-icon
        v-if="!data.posts.length"
        name="cat"
        text="no_posts"
      />
      <div class="post-item" v-for="post of data.posts" :key="post.pid" v-else>
        <div class="title">
          <router-link :to="`/r/${data.region.region}/${post.pid}`">{{ post.title }}</router-link>
        </div>
        <router-link class="author" :to="`/u/${post.author}`">
          <ui-icon name="user" regular right />{{ post.author }}
        </router-link>
        <time class="time">
          <ui-icon name="calendar-alt" regular right />{{ new Date(post.date).toLocaleString() }}
        </time>
      </div>
    </ui-card>
    <ui-card class="create" v-if="accounts.username">
      <template #header>
        <ui-text text="create_new_post"/>
      </template>
      <div class="form">
        <ui-input
          type="text"
          v-model="title"
          class="title"
          icon="align-left"
          placeholder="post_title"
        />
        <ui-editor
          v-model="content"
          class="content"
          placeholder="post_content"
        />
        <div class="buttonset">
          <ui-button
            type="primary"
            icon="location-arrow"
            @click="handleSendPost">
            <ui-text text="post"/>
          </ui-button>
        </div>
      </div>
    </ui-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import { confirm } from '@/utils';
import { useStore } from 'vuex';
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

    const rtitle = ref('');
    const rdesc = ref('');
    const editing = ref(false);

    const handleEnterEdit = () => {
      rtitle.value = store.state.data.region.title;
      rdesc.value = store.state.data.region.description;
      editing.value = true;
    }

    const handleCancelEdit = () => {
      editing.value = false;
    }
    const handleEditRegion = async () => {
      const success = await store.dispatch(ActionTypes.UPDATE_REGION, {
        region,
        title: rtitle,
        description: rdesc,
      });
      if (success) {
        handleCancelEdit();
      }
    }

    const handleSendPost = async () => {
      await store.dispatch(ActionTypes.CREATE_POST, {
        region,
        title,
        content,
        markdown: true,
      });
    };

    const handleDeleteRegion = async () => {
      if (!await confirm(store.state.i18n.lang, 'confirm_delete_region')) {
        return;
      }

      await store.dispatch(ActionTypes.DELETE_REGION, region.value);
    };

    await store.dispatch(ActionTypes.FETCH_REGION_DATA, region.value);

    return {
      rtitle,
      rdesc,
      editing,
      handleCancelEdit,
      handleEnterEdit,
      handleEditRegion,

      title,
      content,
      handleSendPost,
      handleDeleteRegion,

      ...toRefs(store.state),
    };
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

@import "@/plugins/ui/styles/vars.less";

.desc {
  margin-bottom: 20px;
  color: @font-color-light;

  .operations {
    float: right;
    font-size: 1.2rem;

    i {
      cursor: pointer;
    }
  }
}

.margin {
  margin-top: 20px;
}
.margin-bottom {
  margin-bottom: 20px;
}

.post-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  grid-column-gap: 20px;

  .title {
    word-break: break-word;
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
