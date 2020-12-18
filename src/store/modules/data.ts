import { CommentDetail, FileDetail, PostDetail, RegionDetail, UserDetail } from '../../../app/types';
import { MutationTypes } from '../mutation-types';
import { ActionTypes } from '../action-types';
import { API } from '@/api';
import { translate } from '@/i18n/translate';
import { Argument, Arguments, chooseFile, unwarpArguments } from '@/utils';
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
}

export type Mutations<S = State> = {
  [MutationTypes.FETCH_USER_DETAIL](state: S, payload: UserDetail): void;
  [MutationTypes.FETCH_REGION_LIST](state: S, payload: RegionDetail[]): void;
  [MutationTypes.FETCH_POST_LIST](state: S, payload: PostDetail[]): void;
  [MutationTypes.FETCH_REGION_DETAIL](state: S, payload: RegionDetail): void;
  [MutationTypes.FETCH_POST_DETAIL](state: S, payload: PostDetail): void;
  [MutationTypes.FETCH_COMMENT_LIST](state: S, payload: CommentDetail[]): void;
  [MutationTypes.FETCH_FILE_LIST](state: S, payload: FileDetail[]): void;
  [MutationTypes.DELETED_REGION](state: S, payload: string): void;
  [MutationTypes.DELETED_POST](state: S, payload: string): void;
  [MutationTypes.DELETED_COMMENT](state: S, payload: string): void;
  [MutationTypes.DELETED_FILE](state: S, payload: string): void;
  [MutationTypes.CREATED_REGION](state: S, payload: RegionDetail): void;
  [MutationTypes.CREATED_POST](state: S, payload: PostDetail): void;
  [MutationTypes.CREATED_COMMENT](state: S, payload: CommentDetail): void;
  [MutationTypes.CREATED_FILE](state: S, payload: FileDetail): void;
  [MutationTypes.UPLOAD_START](state: S): void;
  [MutationTypes.UPLOAD_PROGRESS](state: S, progress: number): void;
  [MutationTypes.UPLOAD_END](state: S): void;
}

export type Actions<S = State> = {
  [ActionTypes.FETCH_POST_DATA](actx: ArgumentedActionContext<S>, payload: Arguments<{
    region: string;
    pid: string;
  }>): Promise<void>;
  [ActionTypes.FETCH_REGIONS_DATA](actx: ArgumentedActionContext<S>): Promise<void>;
  [ActionTypes.FETCH_REGION_DATA](actx: ArgumentedActionContext<S>, payload: Argument<string>): Promise<void>;
  [ActionTypes.FETCH_USER_DATA](actx: ArgumentedActionContext<S>, payload: Argument<string>): Promise<void>;
  [ActionTypes.FETCH_USER_FILES](actx: ArgumentedActionContext<S>, payload: Argument<string>): Promise<void>;
  [ActionTypes.DELETE_FILE](actx: ArgumentedActionContext<S>, file: FileDetail): Promise<void>;
  [ActionTypes.UPLOAD_FILE](actx: ArgumentedActionContext<S>): Promise<void>;
  [ActionTypes.DELETE_REGION](actx: ArgumentedActionContext<S>, payload: Argument<string>): Promise<void>;
  [ActionTypes.DELETE_POST](actx: ArgumentedActionContext<S>, payload: Arguments<{
    region: string;
    pid: string;
  }>): Promise<void>;
  [ActionTypes.DELETE_COMMENT](actx: ArgumentedActionContext<S>, payload: Arguments<{
    region: string;
    pid: string;
    cid: string;
  }>): Promise<void>;
  [ActionTypes.CREATE_REGION](actx: ArgumentedActionContext<S>, payload: Arguments<{
    region: string;
    title: string;
    description: string;
  }>): Promise<void>;
  [ActionTypes.CREATE_POST](actx: ArgumentedActionContext<S>, payload: Arguments<{
    region: string;
    title: string;
    content: string;
  }>): Promise<void>;
  [ActionTypes.CREATE_COMMENT](actx: ArgumentedActionContext<S>, payload: Arguments<{
    region: string;
    pid: string;
    content: string;
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
  });

  const mutations: Mutations = {
    [MutationTypes.FETCH_USER_DETAIL](state, payload) {
      state.user = payload;
    },
    [MutationTypes.FETCH_REGION_LIST](state, payload) {
      state.regions = payload;
    },
    [MutationTypes.FETCH_POST_LIST](state, payload) {
      state.posts = payload;
    },
    [MutationTypes.FETCH_REGION_DETAIL](state, payload) {
      state.region = payload;
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
    [MutationTypes.DELETED_REGION](state, payload) {
      state.regions = state.regions.filter((s) => s.region !== payload);
    },
    [MutationTypes.DELETED_POST](state, payload) {
      state.posts = state.posts.filter((s) => String(s.pid) !== payload);
    },
    [MutationTypes.DELETED_COMMENT](state, payload) {
      state.comments = state.comments.filter((s) => String(s.cid) !== payload);
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
  };

  const actions: Actions = {
    async [ActionTypes.FETCH_POST_DATA]({ commit, dispatch }, payload) {
      const { region, pid } = unwarpArguments(payload);
      const result = await api.getPostDetail(region, pid);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_POST_DETAIL, result.post);
        commit(MutationTypes.FETCH_COMMENT_LIST, result.comments);
        commit(MutationTypes.FETCH_REGION_DETAIL, result.region);
        commit(MutationTypes.CHANGE_SSR_TITLE, `${result.post.title} - AIOJ`);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.FETCH_REGIONS_DATA]({ commit, dispatch }) {
      const result = await api.getRegions();
      if (result.status === 200) {
        commit(MutationTypes.FETCH_REGION_LIST, result.regions);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.FETCH_REGION_DATA]({ rootState: state, commit, dispatch }, payload) {
      const region = unref(payload);
      const result = await api.getPostsList(region);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_REGION_DETAIL, result.region);
        commit(MutationTypes.FETCH_POST_LIST, result.posts);
        commit(MutationTypes.CHANGE_SSR_TITLE, `${translate(state.i18n.lang, 'region')}: ${result.region.title} - AIOJ`);
        commit(MutationTypes.CHANGE_SSR_META, {
          description: result.region.description,
        });
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.FETCH_USER_DATA]({ rootState: state, commit, dispatch }, payload) {
      const username = unref(payload);
      const result = await api.getUserDetail(username);
      if (result.status === 200) {
        commit(MutationTypes.FETCH_USER_DETAIL, result.user);
        commit(MutationTypes.CHANGE_SSR_TITLE, `${translate(state.i18n.lang, 'user')}: ${result.user.username} - AIOJ`);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
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
    async [ActionTypes.CREATE_REGION]({ dispatch }, payload) {
      const { region, title, description } = unwarpArguments(payload);
      const result = await api.createRegion(region, title, description);
      if (result.status === 200) {
        dispatch(ActionTypes.ROUTER_PUSH, `/r/${region}`);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.CREATE_POST]({ dispatch }, payload) {
      const { region, title, content } = unwarpArguments(payload);
      const result = await api.createPost(region, title, content);
      if (result.status === 200) {
        dispatch(ActionTypes.ROUTER_PUSH, `/r/${region}/${result.pid}`);
      } else {
        dispatch(ActionTypes.HANDLE_ERROR, result);
      }
    },
    async [ActionTypes.CREATE_COMMENT]({ commit, dispatch }, payload) {
      const { region, pid, content } = unwarpArguments(payload);
      const result = await api.sendReply(region, pid, content);
      if (result.status === 200) {
        dispatch(ActionTypes.NOTIFY_REPLY_SUCCESS);
        commit(MutationTypes.CREATED_COMMENT, result.comment);
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
