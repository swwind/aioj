import { BotDetail, CommentDetail, FileDetail, PostDetail, ProblemAbstract, ProblemDetail, RegionDetail, UserDetail } from '../../../app/types';
import { MutationTypes } from '../mutation-types';
import { ActionTypes } from '../action-types';
import { API } from '../../api';
import { Argument, Arguments, chooseFile, unwarpArguments } from '../../utils';
import { ArgumentedActionContext } from '..';
import { unref } from 'vue';

export type State = {
  regions: RegionDetail[];
  region: RegionDetail;
  posts: PostDetail[];
  post: PostDetail;
  comments: CommentDetail[];
  user: UserDetail;
  files: FileDetail[];
  uploading: boolean;
  progress: number; // range [0,1]
  problems: ProblemAbstract[];
  bots: BotDetail[];
  bot: BotDetail;
  problem: ProblemDetail;
}

export type Mutations<S = State> = {
  [MutationTypes.FETCH_USER_DETAIL](state: S, payload: UserDetail): void;
  [MutationTypes.FETCH_REGION_LIST](state: S, payload: RegionDetail[]): void;
  [MutationTypes.FETCH_PROBLEM_LIST](state: S, payload: ProblemAbstract[]): void;
  [MutationTypes.FETCH_POST_LIST](state: S, payload: PostDetail[]): void;
  [MutationTypes.FETCH_REGION_DETAIL](state: S, payload: RegionDetail): void;
  [MutationTypes.FETCH_PROBLEM_DETAIL](state: S, payload: ProblemDetail): void;
  [MutationTypes.FETCH_POST_DETAIL](state: S, payload: PostDetail): void;
  [MutationTypes.FETCH_COMMENT_LIST](state: S, payload: CommentDetail[]): void;
  [MutationTypes.FETCH_FILE_LIST](state: S, payload: FileDetail[]): void;
  [MutationTypes.FETCH_BOT_DETAIL](state: S, payload: BotDetail): void;
  [MutationTypes.FETCH_BOT_LIST](state: S, payload: BotDetail[]): void;
  [MutationTypes.DELETED_REGION](state: S, payload: string): void;
  [MutationTypes.DELETED_POST](state: S, payload: number): void;
  [MutationTypes.DELETED_COMMENT](state: S, payload: number): void;
  [MutationTypes.DELETED_FILE](state: S, payload: string): void;
  [MutationTypes.CREATED_REGION](state: S, payload: RegionDetail): void;
  [MutationTypes.CREATED_POST](state: S, payload: PostDetail): void;
  [MutationTypes.CREATED_COMMENT](state: S, payload: CommentDetail): void;
  [MutationTypes.CREATED_FILE](state: S, payload: FileDetail): void;
  [MutationTypes.UPLOAD_START](state: S): void;
  [MutationTypes.UPLOAD_PROGRESS](state: S, progress: number): void;
  [MutationTypes.UPLOAD_END](state: S): void;
  [MutationTypes.UPDATE_PROBLEM](state: S, payload: { title: string, content: string, hidden: boolean }): void;
  [MutationTypes.UPDATE_COMMENT](state: S, payload: { cid: number, content: string }): void;
  [MutationTypes.UPDATE_REGION](state: S, payload: { title: string, description: string }): void;
}

export type Actions<S = State> = {

  [ActionTypes.FETCH_POST_DATA](actx: ArgumentedActionContext<S>, payload: Arguments<{
    region: string;
    pid: number;
  }>): Promise<void>;
  [ActionTypes.FETCH_REGIONS_DATA](actx: ArgumentedActionContext<S>): Promise<void>;
  [ActionTypes.FETCH_PROBLEMS_DATA](actx: ArgumentedActionContext<S>): Promise<void>;
  [ActionTypes.FETCH_REGION_DATA](actx: ArgumentedActionContext<S>, payload: Argument<string>): Promise<void>;
  [ActionTypes.FETCH_PROBLEM_DATA](actx: ArgumentedActionContext<S>, payload: Argument<number>): Promise<void>;
  [ActionTypes.FETCH_USER_DATA](actx: ArgumentedActionContext<S>, payload: Argument<string>): Promise<void>;
  [ActionTypes.FETCH_USER_FILES](actx: ArgumentedActionContext<S>, payload: Argument<string>): Promise<void>;
  [ActionTypes.FETCH_BOT_DATA](actx: ArgumentedActionContext<S>, payload: Argument<number>): Promise<void>;
  [ActionTypes.FETCH_BOT_LIST](actx: ArgumentedActionContext<S>, payload: Arguments<{
    username: string | undefined;
    pid: number | undefined;
  }>): Promise<void>;
  [ActionTypes.DELETE_FILE](actx: ArgumentedActionContext<S>, file: FileDetail): Promise<void>;
  [ActionTypes.UPLOAD_FILE](actx: ArgumentedActionContext<S>): Promise<void>;
  [ActionTypes.DELETE_REGION](actx: ArgumentedActionContext<S>, payload: Argument<string>): Promise<void>;
  [ActionTypes.DELETE_POST](actx: ArgumentedActionContext<S>, payload: Arguments<{
    region: string;
    pid: number;
  }>): Promise<void>;
  [ActionTypes.DELETE_COMMENT](actx: ArgumentedActionContext<S>, payload: Arguments<{
    region: string;
    pid: number;
    cid: number;
  }>): Promise<void>;
  [ActionTypes.DELETE_PROBLEM](actx: ArgumentedActionContext<S>, payload: Argument<number>): Promise<void>;
  [ActionTypes.CREATE_REGION](actx: ArgumentedActionContext<S>, payload: Arguments<{
    region: string;
    title: string;
    description: string;
  }>): Promise<void>;
  [ActionTypes.CREATE_PROBLEM](actx: ArgumentedActionContext<S>, payload: Arguments<{
    title: string;
  }>): Promise<void>;
  [ActionTypes.CREATE_POST](actx: ArgumentedActionContext<S>, payload: Arguments<{
    region: string;
    title: string;
    content: string;
    markdown: boolean;
  }>): Promise<void>;
  [ActionTypes.CREATE_COMMENT](actx: ArgumentedActionContext<S>, payload: Arguments<{
    region: string;
    pid: number;
    content: string;
    markdown: boolean;
  }>): Promise<boolean>;
  [ActionTypes.UPDATE_PROBLEM](actx: ArgumentedActionContext<S>, payload: Arguments<{
    pid: number;
    title: string;
    content: string;
    hidden: boolean;
    playerMin: number;
    playerMax: number;
    paint: string;
  }>): Promise<boolean>;
  [ActionTypes.UPDATE_COMMENT](actx: ArgumentedActionContext<S>, payload: Arguments<{
    region: string;
    pid: number;
    cid: number;
    content: string;
  }>): Promise<boolean>;
  [ActionTypes.UPDATE_REGION](actx: ArgumentedActionContext<S>, payload: Arguments<{
    region: string;
    title: string;
    description: string;
  }>): Promise<boolean>;
  [ActionTypes.CREATE_BOT_BY_CODE](actx: ArgumentedActionContext<S>, payload: Arguments<{
    pid: number;
    name: string;
    description: string;
    src: string;
    type: string;
  }>): Promise<void>;
  [ActionTypes.CREATE_BOT_BY_FILE](actx: ArgumentedActionContext<S>, payload: Arguments<{
    pid: number;
    name: string;
    description: string;
    file: File;
  }>): Promise<void>;
  [ActionTypes.UPDATE_BOT_BY_CODE](actx: ArgumentedActionContext<S>, payload: Arguments<{
    bid: number;
    name: string;
    description: string;
    src: string;
    type: string;
  }>): Promise<boolean>;
  [ActionTypes.UPDATE_BOT_ONLY](actx: ArgumentedActionContext<S>, payload: Arguments<{
    bid: number;
    name: string;
    description: string;
  }>): Promise<boolean>;
  [ActionTypes.UPDATE_BOT_BY_FILE](actx: ArgumentedActionContext<S>, payload: Arguments<{
    bid: number;
    name: string;
    description: string;
    file: File;
  }>): Promise<boolean>;
  [ActionTypes.UPLOAD_PROBLEM_JUDGER](actx: ArgumentedActionContext<S>, payload: Arguments<{
    pid: number;
    file: File;
  }>): Promise<boolean>;
}

export const createDataModule = (api: API) => {
  const state = (): State => ({
    regions: [],
    region: {} as any,
    posts: [],
    post: {} as any,
    comments: [],
    user: {} as any,
    files: [],
    uploading: false,
    progress: 0,
    problems: [],
    problem: {} as any,
    bots: [],
    bot: {} as any,
  });

  const mutations: Mutations = {
    [MutationTypes.FETCH_USER_DETAIL](state, payload) {
      state.user = payload;
    },
    [MutationTypes.FETCH_REGION_LIST](state, payload) {
      state.regions = payload;
    },
    [MutationTypes.FETCH_PROBLEM_LIST](state, payload) {
      state.problems = payload;
    },
    [MutationTypes.FETCH_POST_LIST](state, payload) {
      state.posts = payload;
    },
    [MutationTypes.FETCH_REGION_DETAIL](state, payload) {
      state.region = payload;
    },
    [MutationTypes.FETCH_PROBLEM_DETAIL](state, payload) {
      state.problem = payload;
    },
    [MutationTypes.FETCH_POST_DETAIL](state, payload) {
      state.post = payload;
    },
    [MutationTypes.FETCH_COMMENT_LIST](state, payload) {
      state.comments = payload;
    },
    [MutationTypes.FETCH_FILE_LIST](state, payload) {
      state.files = payload;
    },
    [MutationTypes.FETCH_BOT_DETAIL](state, payload) {
      state.bot = payload;
    },
    [MutationTypes.FETCH_BOT_LIST](state, payload) {
      state.bots = payload;
    },
    [MutationTypes.DELETED_REGION](state, payload) {
      state.regions = state.regions.filter((s) => s.region !== payload);
    },
    [MutationTypes.DELETED_POST](state, payload) {
      state.posts = state.posts.filter((s) => s.pid !== payload);
    },
    [MutationTypes.DELETED_COMMENT](state, payload) {
      state.comments = state.comments.filter((s) => s.cid !== payload);
    },
    [MutationTypes.DELETED_FILE](state, payload) {
      state.files = state.files.filter((s) => s.fid !== payload);
    },
    [MutationTypes.CREATED_REGION](state, payload) {
      state.regions = state.regions.concat(payload);
    },
    [MutationTypes.CREATED_POST](state, payload) {
      state.posts = state.posts.concat(payload);
    },
    [MutationTypes.CREATED_COMMENT](state, payload) {
      state.comments = state.comments.concat(payload);
    },
    [MutationTypes.CREATED_FILE](state, payload) {
      state.files = state.files.concat(payload);
    },
    [MutationTypes.UPLOAD_START](state) {
      state.uploading = true;
      state.progress = 0;
    },
    [MutationTypes.UPLOAD_PROGRESS](state, progress) {
      state.progress = progress;
    },
    [MutationTypes.UPLOAD_END](state) {
      state.uploading = false;
    },
    [MutationTypes.UPDATE_PROBLEM](state, payload) {
      state.problem.title = payload.title;
      state.problem.content = payload.content;
      state.problem.hidden = payload.hidden;
    },
    [MutationTypes.UPDATE_COMMENT](state, payload) {
      state.comments = state.comments.map((cmt) => {
        if (cmt.cid === payload.cid) {
          cmt.content = payload.content;
          cmt.edited = true;
        }
        return cmt;
      });
    },
    [MutationTypes.UPDATE_REGION](state, payload) {
      state.region.title = payload.title;
      state.region.description = payload.description;
    },
  };

  const actions: Actions = {
    async [ActionTypes.FETCH_POST_DATA]({ commit, dispatch }, payload) {
      const { region, pid } = unwarpArguments(payload);
      const result = await api.getPostDetail(region, pid);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_POST_DETAIL, result.post);
        commit(MutationTypes.FETCH_COMMENT_LIST, result.comments);
        commit(MutationTypes.FETCH_REGION_DETAIL, result.region);
      }
      dispatch(ActionTypes.HANDLE_RENDER_ERROR, result);
    },
    async [ActionTypes.FETCH_REGIONS_DATA]({ commit, dispatch }) {
      const result = await api.getRegions();
      if (result.status === 200) {
        commit(MutationTypes.FETCH_REGION_LIST, result.regions);
      }
      dispatch(ActionTypes.HANDLE_RENDER_ERROR, result);
    },
    async [ActionTypes.FETCH_PROBLEMS_DATA]({ commit, dispatch }) {
      const result = await api.getProblemList();
      if (result.status === 200) {
        commit(MutationTypes.FETCH_PROBLEM_LIST, result.problems);
      }
      dispatch(ActionTypes.HANDLE_RENDER_ERROR, result);
    },
    async [ActionTypes.FETCH_PROBLEM_DATA]({ commit, dispatch }, payload) {
      const pid = unref(payload);
      const result = await api.getProblemDetail(pid);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_PROBLEM_DETAIL, result.problem);
      }
      dispatch(ActionTypes.HANDLE_RENDER_ERROR, result);
    },
    async [ActionTypes.FETCH_REGION_DATA]({ commit, dispatch }, payload) {
      const region = unref(payload);
      const result = await api.getPostsList(region);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_REGION_DETAIL, result.region);
        commit(MutationTypes.FETCH_POST_LIST, result.posts);
        commit(MutationTypes.CHANGE_SSR_META, {
          description: result.region.description,
        });
      }
      dispatch(ActionTypes.HANDLE_RENDER_ERROR, result);
    },
    async [ActionTypes.FETCH_USER_DATA]({ commit, dispatch }, payload) {
      const username = unref(payload);
      const result = await api.getUserDetail(username);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_USER_DETAIL, result.user);
      }
      dispatch(ActionTypes.HANDLE_RENDER_ERROR, result);
    },
    async [ActionTypes.FETCH_USER_FILES]({ commit, dispatch }, payload) {
      const username = unref(payload);
      const result = await api.getUserUploadedFiles(username);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_FILE_LIST, result.files);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.FETCH_BOT_DATA]({ commit, dispatch }, payload) {
      const bid = unref(payload);
      const result = await api.getBotDetail(bid);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_BOT_DETAIL, result.bot);
      } else {
        dispatch(ActionTypes.HANDLE_RENDER_ERROR, result);
      }
    },
    async [ActionTypes.FETCH_BOT_LIST]({ commit, dispatch }, payload) {
      const { username, pid } = unwarpArguments(payload);
      const result = await api.getBotList(pid, username);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_BOT_LIST, result.bots);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.DELETE_FILE]({ commit, dispatch }, file) {
      const result = await api.deleteFile(file.fid);
      if (result.status === 200) {
        commit(MutationTypes.DELETED_FILE, file.fid);
        dispatch(ActionTypes.NOTIFY_DELETE_SUCCESS);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.UPLOAD_FILE]({ commit, dispatch }) {
      const file = await chooseFile();
      if (!file) return;
      commit(MutationTypes.UPLOAD_START);
      const result = await api.uploadFile(file, (e) => {
        commit(MutationTypes.UPLOAD_PROGRESS, e.loaded / e.total);
      });
      commit(MutationTypes.UPLOAD_END);
      if (result.status === 200) {
        commit(MutationTypes.CREATED_FILE, result.file);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.DELETE_REGION]({ commit, dispatch }, payload) {
      const region = unref(payload);
      const result = await api.deleteRegion(region);
      if (result.status === 200) {
        commit(MutationTypes.DELETED_REGION, region);
        dispatch(ActionTypes.NOTIFY_DELETE_SUCCESS);
        dispatch(ActionTypes.ROUTER_PUSH, '/r');
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.DELETE_POST]({ dispatch }, payload) {
      const { region, pid } = unwarpArguments(payload);
      const result = await api.deletePost(region, pid);
      if (result.status === 200) {
        dispatch(ActionTypes.NOTIFY_DELETE_SUCCESS);
        dispatch(ActionTypes.ROUTER_PUSH, `/r/${region}`);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.DELETE_COMMENT]({ commit, dispatch }, payload) {
      const { region, pid, cid } = unwarpArguments(payload);
      const result = await api.deleteComment(region, pid, cid);
      if (result.status === 200) {
        commit(MutationTypes.DELETED_COMMENT, cid);
        dispatch(ActionTypes.NOTIFY_DELETE_SUCCESS);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.DELETE_PROBLEM]({ dispatch }, payload) {
      const pid = unref(payload);
      const result = await api.deleteProblem(pid);
      if (result.status === 200) {
        dispatch(ActionTypes.ROUTER_PUSH, '/p');
        dispatch(ActionTypes.NOTIFY_DELETE_SUCCESS);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.CREATE_REGION]({ dispatch }, payload) {
      const { region, title, description } = unwarpArguments(payload);
      const result = await api.createRegion(region, title, description);
      if (result.status === 200) {
        dispatch(ActionTypes.ROUTER_PUSH, `/r/${region}`);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.CREATE_PROBLEM]({ dispatch }, payload) {
      const { title } = unwarpArguments(payload);
      const result = await api.createProblem(title);
      if (result.status === 200) {
        dispatch(ActionTypes.ROUTER_PUSH, `/p/${result.pid}`);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.CREATE_POST]({ dispatch }, payload) {
      const { region, title, content, markdown } = unwarpArguments(payload);
      const result = await api.createPost(region, title, content, markdown);
      if (result.status === 200) {
        dispatch(ActionTypes.ROUTER_PUSH, `/r/${region}/${result.pid}`);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.CREATE_COMMENT]({ commit, dispatch }, payload) {
      const { region, pid, content, markdown } = unwarpArguments(payload);
      const result = await api.sendReply(region, pid, content, markdown);
      if (result.status === 200) {
        dispatch(ActionTypes.NOTIFY_REPLY_SUCCESS);
        commit(MutationTypes.CREATED_COMMENT, result.comment);
        return true;
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
        return false;
      }
    },
    async [ActionTypes.UPDATE_PROBLEM]({ dispatch, commit }, payload) {
      const { title, content, hidden, pid, playerMin, playerMax, paint } = unwarpArguments(payload);
      const result = await api.modifyProblem(pid, title, content, hidden, paint, playerMin, playerMax);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_PROBLEM_DETAIL, result.problem);
        dispatch(ActionTypes.NOTIFY_UPDATE_SUCCESS);
        return true;
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
        return false;
      }
    },
    async [ActionTypes.UPDATE_COMMENT]({ dispatch, commit }, payload) {
      const { region, content, cid, pid } = unwarpArguments(payload);
      const result = await api.modifyComment(region, pid, cid, content);
      if (result.status === 200) {
        commit(MutationTypes.UPDATE_COMMENT, { cid, content });
        dispatch(ActionTypes.NOTIFY_UPDATE_SUCCESS);
        return true;
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
        return false;
      }
    },
    async [ActionTypes.UPDATE_REGION]({ dispatch, commit }, payload) {
      const { region, title, description } = unwarpArguments(payload);
      const result = await api.modifyRegion(region, title, description);
      if (result.status === 200) {
        commit(MutationTypes.UPDATE_REGION, { title, description });
        dispatch(ActionTypes.NOTIFY_UPDATE_SUCCESS);
        return true;
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
        return false;
      }
    },
    async [ActionTypes.CREATE_BOT_BY_CODE]({ dispatch }, payload) {
      const { name, description, src, type, pid } = unwarpArguments(payload);
      const result = await api.createNewBotFromCode(pid, name, description, src, type);
      if (result.status === 200) {
        dispatch(ActionTypes.ROUTER_PUSH, `/b/${result.bid}`);
        dispatch(ActionTypes.NOTIFY_UPDATE_SUCCESS);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.CREATE_BOT_BY_FILE]({ commit, dispatch }, payload) {
      const { name, description, file, pid } = unwarpArguments(payload);
      commit(MutationTypes.UPLOAD_START);
      const result = await api.createNewBotFromFile(pid, name, description, file, (e) => {
        commit(MutationTypes.UPLOAD_PROGRESS, e.loaded / e.total);
      });
      commit(MutationTypes.UPLOAD_END);
      if (result.status === 200) {
        dispatch(ActionTypes.ROUTER_PUSH, `/b/${result.bid}`);
        dispatch(ActionTypes.NOTIFY_UPDATE_SUCCESS);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.UPDATE_BOT_BY_CODE]({ commit, dispatch }, payload) {
      const { name, description, src, type, bid } = unwarpArguments(payload);
      const result = await api.updateBotFromCode(bid, name, description, src, type);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_BOT_DETAIL, result.bot);
        dispatch(ActionTypes.NOTIFY_UPDATE_SUCCESS);
        return true;
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
        return false;
      }
    },
    async [ActionTypes.UPDATE_BOT_ONLY]({ commit, dispatch }, payload) {
      const { name, description, bid } = unwarpArguments(payload);
      const result = await api.updateBotInfomationsOnly(bid, name, description);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_BOT_DETAIL, result.bot);
        dispatch(ActionTypes.NOTIFY_UPDATE_SUCCESS);
        return true;
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
        return false;
      }
    },
    async [ActionTypes.UPDATE_BOT_BY_FILE]({ commit, dispatch }, payload) {
      const { name, description, file, bid } = unwarpArguments(payload);
      commit(MutationTypes.UPLOAD_START);
      const result = await api.updateBotFromFile(bid, name, description, file, (e) => {
        commit(MutationTypes.UPLOAD_PROGRESS, e.loaded / e.total);
      });
      commit(MutationTypes.UPLOAD_END);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_BOT_DETAIL, result.bot);
        dispatch(ActionTypes.NOTIFY_UPDATE_SUCCESS);
        return true;
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
        return false;
      }
    },
    async [ActionTypes.UPLOAD_PROBLEM_JUDGER]({ commit, dispatch }, payload) {
      const { pid, file } = unwarpArguments(payload);
      commit(MutationTypes.UPLOAD_START);
      const result = await api.uploadProblemJudger(pid, file, (e) => {
        commit(MutationTypes.UPLOAD_PROGRESS, e.loaded / e.total);
      });
      commit(MutationTypes.UPLOAD_END);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_PROBLEM_DETAIL, result.problem);
        dispatch(ActionTypes.NOTIFY_UPDATE_SUCCESS);
        return true;
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
        return false;
      }
    },
  };

  return {
    state,
    mutations,
    actions,
  };
};
