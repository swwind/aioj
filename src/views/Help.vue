<template>
  <ui-header />
  <ui-card v-for="(help, index) in helps" :key="index">
    <template #header>
      {{ help.title[i18n.lang] }}
    </template>
    <ui-content :text="help.content[i18n.lang]" markdown />
  </ui-card>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { MyStore } from '@/store';
import { translate } from '@/i18n/translate';
import { defineComponent, toRefs } from 'vue';
import { MutationTypes } from '@/store/mutation-types';

const helps = [{
  title: {
    en_us: 'Welcome', zh_cn: '欢迎',
  },
  content: {
    en_us: `
Welcome to [aioj.ac](https://aioj.ac)! We strongly recommand you to read this manual before start using this website.
`,
    zh_cn: `
欢迎来到 [aioj.ac](https://aioj.ac)！我们强烈建议您在使用网站前详细地阅读本使用手册。
`,
  },
}, {
  title: {
    en_us: 'User and files', zh_cn: '用户和文件',
  },
  content: {
    en_us: `
User can upload file onto this server and only used for study and commucation. Before upload any of your files onto our server, you must agree that we reserve the right to delete your file or redistrubute it without your agreement. We can promise that we will not made any commercial profits or abuse to your uploaded files.

In other words, do not upload your secret video or something weird (e.g. NSFW) content to our server, which may cause you be banned.

We support dynamic \`Content-Type\` header and even network stream for videos and audios uploaded to our server, so you can feel free to share your ideas without any limitaions.
`,
    zh_cn: `
用户可以将文件上传到本网站上用于学习和交流。但是在上传任何文件到我们的服务器之前，您必须同意我们保留未经您同意而删除您的文件或重新分配文件的权利。我们可以承诺，我们不会对您上传的文件进行任何商业盈利或滥用。

换句话说，不要上传你的秘密视频或一些奇怪的（比如 NSFW）内容到我们的服务器上，这可能会导致您被本站封禁。

我们的服务器支持动态的 \`Content-Type\` 头，支持对于视频和音频的网络串流播放，所以您可以在本站自由分享你的想法而不收到任何限制。
`,
  },
}, {
  title: {
    en_us: 'Forum', zh_cn: '论坛',
  },
  content: {
    en_us: `
There is a forum for you to get in touch with other participants.

If you want to insert an image/video/audio in a post inline, you can just copy the code from your uploaded files page.
`,
    zh_cn: `
AIOJ 的论坛可以让您与其他选手亲切地交♂流。

如果你想在帖子中内嵌图片/视频/音频，你只需复制上传文件页面上的代码即可。
`,
  },
}, {
  title: {
    en_us: 'Problems', zh_cn: '题库',
  },
  content: {
    en_us: `
WIP
`,
    zh_cn: `
构建中
`,
  },
}];

export default defineComponent({
  setup() {
    const store = useStore() as MyStore;

    store.commit(MutationTypes.CHANGE_SSR_TITLE, translate(store.state.i18n.lang, 'help'));

    return {
      helps,
      ...toRefs(store.state),
    };
  },
});
</script>
