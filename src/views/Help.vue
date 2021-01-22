<template>
  <ui-header title="help" translate>
    <ui-text text="help" />
  </ui-header>

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
import { defineComponent, toRefs } from 'vue';

const helps = [{
  title: {
    en_us: 'Welcome', zh_cn: '欢迎',
  },
  content: {
    en_us: `
Welcome to [aioj.ac](https://aioj.ac)! We strongly recommand you to read this manual before start using this website.
`,
    zh_cn: `
欢迎来到 [aioj.ac](https://aioj.ac)！我们墙裂建议您在使用网站前强细地阅读本使用手册。
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
用户可以将文件上传到本网站上用于学♂习和交♂流。但是在上传任何文件到我们的服务器之前，您必须同♂意我们保留未经您同意而删除您的文件或重新分配文件的权利。我们可以承诺，我们不会对您上传的文件进行任何商业盈利或滥♂用。

换句话说，不要上传你的秘♂密视频或一些奇♂怪的（比如 NSFW）内容到我们的服务器上，这可能会导致您被本站封♂禁。

我们的服务器支持动态的 \`Content-Type\` 头，支持对于视频和音频的网络串流播放，所以您可以在本站自♂由地分享您的想♂法而不收到任何限制。
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

Some specific markdown code will be regard as video player or other, you don't need to learn it.
`,
    zh_cn: `
AIOJ 的论坛可以让您与其他选手亲切地交♂流。

如果你想在帖子中内嵌图片/视频/音频，你只需复制上传文件页面上的代码即可。

某些特定的 markdown 代码会经过特判，用以展示视频等在线功能。
`,
  },
}, {
  title: {
    en_us: 'Problems', zh_cn: '题库',
  },
  content: {
    en_us: `
See chinese ver. please...
`,
    zh_cn: `

### 对于选手

您可以使用以下语言来书写您的 bot:

- C++
- Python
- JavaScript
- ...

对于每个 bot，所有所需要的信息将会从 stdin 输入。

输入的第一行包括一个整数，表示您被分配到的 id。

接下来的一行为主程序的初始化输入（可能没有，如果是这样那就是一个空行）。

接下来的每一行的第一个数为当前操作的 bot id，如果这个 id 与您被分配到的 id 相同，则您需要做出决策，并将操作输出到 stdout。否则接下来由空格分隔，衔接上对方 bot 的决策。选手需要自行模拟对方操作对当前战局产生的影响。

当主程序可以判定对局的胜负的时候，评测线程便会直接 kill 掉您的 bot 线程。

以下是五子棋的随机下子 bot，可以参考。

\`\`\`cpp
#include <bits/stdc++.h>
using namespace std;

int a[19][19];
int me;

pair<int, int> getPosition() {
  int x = rand() % 19;
  int y = rand() % 19;
  while (a[x][y]) {
    x = rand() % 19;
    y = rand() % 19;
  }
  return make_pair(x, y);
}

int main() {
  srand(time(0));

  cin >> me;
  // initial game state is nothing

  while (true) {
    int player;
    cin >> player;
    if (player != me) {
      int x, y;
      cin >> x >> y;
      a[x][y] = 1;
    } else {
      pair<int, int> pr = getPosition();
      a[pr.first][pr.second] = 1;
      cout << pr.first << " " << pr.second << endl << flush;
    }
  }
}
\`\`\`

**提交代码**

您可以直接提交单个文件，或者整个文件夹。

提交文件夹的时候请注意，请将文件夹打包成 \`.zip\` 的形式。

文件夹中需要包含一个 \`settings.json\` 文件，其中需要包含 \`main\` 字段，填写入口程序的相对文件名。

### 对于出题人

您可能需要写一堆东西

**主程序**

主程序用来模拟游戏过程以及按照游戏的规则做出判决。

主程序初始时将会输入一个整数，表示玩家的数量 $n$，所有玩家将会以 $0$ 到 $n-1$ 编号。

接下来主程序需要输出游戏的初始局面，并以换行表示输出的结束。

接下来开始游戏的轮回，每次开始的时候输出 \`continue %d\` 并换行，其中 \`%d\` 表示当前轮到操作的选手 id。

接下来可以读入一行，表示当前选手做出的操作。

接下来由主程序判断操作是否合法，以及游戏是否出现了胜者。

如果游戏出现胜者，则输出 \`win %d\` 并换行，表示选手 \`%d\` 胜出，游戏结束。

如果游戏平局，则输出 \`draw\` 并换行。

否则游戏继续进行，回到下一轮回的开始。

以下是五子棋的主程序，可以参考：

\`\`\`cpp
#include <bits/stdc++.h>

int board[19][19];
std::vector<std::pair<int, int>> p[2];

// initialize the game
void init() {
  memset(board, -1, sizeof board);
  p[0].clear();
  p[1].clear();
}

bool validate(int x, int y) {
  if (x < 0 || x >= 19) return false;
  if (y < 0 || y >= 19) return false;
  return board[x][y] == -1;
}

// 0: player 1 win | 1: player 2 win | -1: nobody win
int checkWin() {
  for (int i = 0; i < 15; ++ i) {
    for (int j = 0; j < 15; ++ j) {
      int one, two;
      // [-]
      one = two = 0;
      for (int k = 0; k < 5; ++ k) {
        one += board[i][j+k] == 0;
        tow += board[i][j+k] == 1;
      }
      if (one == 5) return 0;
      if (two == 5) return 1;

      // [|]
      one = two = 0;
      for (int k = 0; k < 5; ++ k) {
        one += board[i+k][j] == 0;
        tow += board[i+k][j] == 1;
      }
      if (one == 5) return 0;
      if (two == 5) return 1;

      // [\\]
      one = two = 0;
      for (int k = 0; k < 5; ++ k) {
        one += board[i+k][j+k] == 0;
        tow += board[i+k][j+k] == 1;
      }
      if (one == 5) return 0;
      if (two == 5) return 1;

      // [/]
      one = two = 0;
      for (int k = 0; k < 5; ++ k) {
        one += board[i+4-k][j+k] == 0;
        tow += board[i+4-k][j+k] == 1;
      }
      if (one == 5) return 0;
      if (two == 5) return 1;
    }
  }
  return -1;
}

int main(int argc, const char* argv[]) {
  init();

  int n = 0;
  std::cin >> n;
  // assert(n == 2);

  std::cout << std::endl << std::flush;

  int nowplayer = 0;
  std::cout << "continue " << nowplayer << std::endl << std::flush;

  while (true) {
    // read player operation
    int x, y;
    std::cin >> x >> y;

    // validate the operation
    if (!validate(x, y)) {
      std::cout << "win " << (nowplayer ^ 1) << std::endl << std::flush;
      return 0;
    }

    // take the operation
    board[x][y] = nowplayer;
    p[nowplayer].push_back(std::make_pair(x, y));

    // check if somebody wins
    int winner = checkWin();
    if (winner > -1) {
      std::cout << "win " << winner << std::endl << std::flush;
      return 0;
    }

    // check if there is no place to put chess anymore
    if (p[0].size() + p[1].size() == 19 * 19) {
      std::cout << "draw" << std::endl << std::flush;
      return 0;
    }

    // continue playing
    nowplayer ^= 1;
    std::cout << "continue " << nowplayer << std::endl << std::flush;
  }
}
\`\`\`

接下来需要一个绘图脚本来在前端将战局绘制成图形。

需要在全局中暴露一个函数，接受两个参数，\`ctx\` 和 \`ws\`，分别为 CanvasContext 对象和 WebSocket 对象。

具体接口请参考以下五子棋绘制代码：

\`\`\`js
function __fucking_paint(ctx, ws) {
  const bg = new Path2D();
  bg.rect(0, 0, 1000, 1000);
  ctx.fillStyle = '#f4b475';
  ctx.fill(bg);
  ctx.fillStyle = 'black';
  for (let i = 1; i <= 19; ++ i) {
    const line = new Path2D();
    line.moveTo(i * 50, 50);
    line.lineTo(i * 50, 19 * 50);
    ctx.stroke(line);

    const row = new Path2D();
    row.moveTo(50, i * 50);
    row.lineTo(19 * 50, i * 50);
    ctx.stroke(row);
  }

  ws.addEventListener('message', ({ data }) => {
    const reg = /bot (\\d+) > (\\d+) (\\d+)/;
    const res = reg.match(data);
    if (res) {
      const id = res[1];
      const x = res[2];
      const y = res[3];

      const zi = new Path2D();
      zi.moveTo(x * 50 + 50, y * 50 + 50, 45, 0, Math.PI * 2);
      ctx.fillStyle = Number(id) ? 'black' : 'white';
      ctx.fill(zi);
    }
  });
}

// expose here
window.__paint_script__ = __fucking_paint;
\`\`\`
`,
  },
}];

export default defineComponent({
  setup() {
    const store = useStore() as MyStore;

    return {
      helps,
      ...toRefs(store.state),
    };
  },
});
</script>
