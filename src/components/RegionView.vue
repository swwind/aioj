<template>
  <h1>{{ title }}</h1>
  <p>{{ desc }}</p>
  <el-alert type="error" v-if="errorMessage" v-text="errorMessage" />
  <div class="posts-list">
    <el-alert type="warning" v-if="!postlist.length">No posts yet</el-alert>
    <div class="post-item" v-for="post of postlist" :key="post.pid">
      <div class="title"><router-link :to="`/r/${region}/${post.pid}`">{{ post.title }}</router-link></div>
      <router-link class="author" :to="`/u/${post.author}`"><i class="el-icon-user-solid"></i>{{ post.author }}</router-link>
      <time class="time"><i class="el-icon-date"></i>{{ new Date(post.date).toLocaleString() }}</time>
    </div>
  </div>
</template>

<script lang="ts">
import { getPostsList } from '@/api/forum';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { PostDetail } from 'app/db';

export default defineComponent({
  props: {
    region: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const errorMessage = ref('');

    const handleGoto = (pid: string) => {
      router.push(`/r/${props.region}/${pid}`);
    };

    const title = ref('');
    const desc = ref('');
    const postlist = ref([] as PostDetail[]);

    return {
      errorMessage,
      handleGoto,
      title,
      desc,
      postlist,
    };
  },
  async mounted() {
    const result = await getPostsList(this.region);
    if (result.status === 200) {
      this.title = result.title;
      this.desc = result.description;
      this.postlist = result.list;
    } else {
      this.$notify.error({
        title: 'Network Error',
        message: 'Failed to fetch posts list',
      });
    }
  },
});

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

.post-item {
  display: flex;

  .title {
    flex: 1;
  }

  .time {
    margin-left: 20px;
  }

  i {
    margin-right: 5px;
  }
}

</style>
