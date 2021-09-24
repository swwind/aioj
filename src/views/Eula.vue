<template>
  <ui-header title="eula" translate>
    <ui-text text="eula" />
  </ui-header>

  <ui-card>
    <template #header>
      <ui-text text="welcome" />
    </template>
    <p>欢迎来到 <a href="https://aioj.ac">aioj.ac</a>！我们墙裂建议您在注册并使用网站前强细地阅读本用户协议，以免我们将您发飞机票。</p>
  </ui-card>

  <ui-card>
    <template #header>
      <ui-text text="user_and_files" />
    </template>
    <p>用户可以将文件上传到本网站上用于学♂习和交♂流。但是在上传任何文件到我们的服务器之前，您必须同♂意我们保留未经您同意而删除您的文件或重新分配文件的权利。我们可以承诺，我们不会对您上传的文件进行任何商业盈利或滥♂用。</p>
    <p>换句话说，不要上传你的秘♂密视频或一些奇♂怪的（比如 NSFW）内容到我们的服务器上，这可能会导致您被本站口♂球。</p>
    <p>我们的服务器支持动态的 <code>Content-Type</code> 头，支持对于视频和音频的网络串流播放，所以您可以在本站自♂由地分享您的想♂法而不收到任何限制。</p>
  </ui-card>

  <ui-card>
    <template #header>
      <ui-text text="forum" />
    </template>
    <p>AIOJ 的论坛可以让您与其他选手亲切地交♂流。</p>
    <p>如果你想在帖子中内嵌图片/视频/音频，你只需复制上传文件页面上的代码即可。</p>
    <p>某些特定的 markdown 代码会经过特判，用以展示视频等在线功能。</p>
  </ui-card>

  <ui-card>
    <template #header>
      <ui-text text="problems" />
    </template>
    <p>用户可以自由地在题目下方提交机器人，并且发起战局。</p>
    <p>但是如果您在用脚本疯狂提交战局，则会导致服务器崩溃，所以我们不建议您这样做。</p>
    <p>关于如何提交代码可以参考 <a href="https://github.com/swwind/aioj/wiki">wiki</a></p>
  </ui-card>
</template>
