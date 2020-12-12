import { CommentDetail, FileDetail, PostDetail, RegionDetail, UserDetail } from '../../../app/types';
import { Action, Mutation } from 'vuex';
import * as MutationTypes from '../mutation-types';
import * as ActionTypes from '../action-types';
import { StoreState } from '..';
import { API } from '@/api';
import { translate } from '@/i18n/translate';
import { chooseFile, notify } from '@/utils';
import { Ref } from 'vue';

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

const mutations: { [key: string]: Mutation<State> } = {
  [MutationTypes.FETCH_USER_DETAIL](state, payload: UserDetail) {
    state.user = payload;
  },
  [MutationTypes.FETCH_REGION_LIST](state, payload: RegionDetail[]) {
    state.regions = payload;
  },
  [MutationTypes.FETCH_POST_LIST](state, payload: PostDetail[]) {
    state.posts = payload;
  },
  [MutationTypes.FETCH_REGION_DETAIL](state, payload: RegionDetail) {
    state.region = payload;
  },
  [MutationTypes.FETCH_POST_DETAIL](state, payload: PostDetail) {
    state.post = payload;
  },
  [MutationTypes.FETCH_COMMENT_LIST](state, payload: CommentDetail[]) {
    state.comments = payload;
  },
  [MutationTypes.FETCH_FILE_LIST](state, payload: FileDetail[]) {
    state.files = payload;
  },
  [MutationTypes.DELETED_REGION](state, payload: string) {
    state.regions = state.regions.filter((s) => s.region !== payload);
  },
  [MutationTypes.DELETED_POST](state, payload: string) {
    state.posts = state.posts.filter((s) => String(s.pid) !== payload);
  },
  [MutationTypes.DELETED_COMMENT](state, payload: string) {
    state.comments = state.comments.filter((s) => String(s.cid) !== payload);
  },
  [MutationTypes.DELETED_FILE](state, payload: string) {
    state.files = state.files.filter((s) => s.fid !== payload);
  },
  [MutationTypes.CREATED_REGION](state, payload: RegionDetail) {
    state.regions = state.regions.concat(payload);
  },
  [MutationTypes.CREATED_POST](state, payload: PostDetail) {
    state.posts = state.posts.concat(payload);
  },
  [MutationTypes.CREATED_COMMENT](state, payload: CommentDetail) {
    state.comments = state.comments.concat(payload);
  },
  [MutationTypes.CREATED_FILE](state, payload: FileDetail) {
    state.files = state.files.concat(payload);
  },
  [MutationTypes.UPLOAD_START](state) {
    state.uploading = true;
    state.progress = 0;
  },
  [MutationTypes.UPLOAD_PROGRESS](state, progress: number) {
    state.progress = progress;
  },
  [MutationTypes.UPLOAD_END](state) {
    state.uploading = false;
  },
};

const actions: { [key: string]: Action<StoreState, any> } = {
  async [ActionTypes.FETCH_POST_DATA]({ commit, dispatch }, payload: { region: string; pid: string; }) {
    const result = await API.getPostDetail(payload.region, payload.pid);
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
    const result = await API.getRegions();
    if (result.status === 200) {
      commit(MutationTypes.FETCH_REGION_LIST, result.regions);
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  },
  async [ActionTypes.FETCH_REGION_DATA]({ rootState: state, commit, dispatch }, payload: string) {
    const result = await API.getPostsList(payload);
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
  async [ActionTypes.FETCH_USER_DATA]({ rootState: state, commit, dispatch }, payload: string) {
    const result = await API.getUserDetail(payload);
    if (result.status === 200) {
      commit(MutationTypes.FETCH_USER_DETAIL, result.user);
      commit(MutationTypes.CHANGE_SSR_TITLE, `${translate(state.i18n.lang, 'user')}: ${result.user.username} - AIOJ`);
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  },
  async [ActionTypes.FETCH_USER_FILES]({ commit, dispatch }, payload: string) {
    const result = await API.getUserUploadedFiles(payload);
    if (result.status === 200) {
      commit(MutationTypes.FETCH_FILE_LIST, result.files);
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  },
  async [ActionTypes.DELETE_FILE]({ commit, dispatch }, file: FileDetail) {
    const result = await API.deleteFile(file.fid);
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
    const result = await API.uploadFile(file, (e) => {
      commit(MutationTypes.UPLOAD_PROGRESS, e.loaded / e.total);
    });
    commit(MutationTypes.UPLOAD_END);
    if (result.status === 200) {
      commit(MutationTypes.CREATED_FILE, result.file);
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  },
  async [ActionTypes.DELETE_REGION]({ commit, dispatch }, region: string) {
    const result = await API.deleteRegion(region);
    if (result.status === 200) {
      commit(MutationTypes.DELETED_REGION, region);
      dispatch(ActionTypes.NOTIFY_DELETE_SUCCESS);
      dispatch(ActionTypes.ROUTER_PUSH, '/r');
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  },
  async [ActionTypes.DELETE_POST]({ commit, dispatch }, payload: {
    region: Ref<string>;
    pid: Ref<string>;
  }) {
    const result = await API.deletePost(payload.region.value, payload.pid.value);
    if (result.status === 200) {
      dispatch(ActionTypes.NOTIFY_DELETE_SUCCESS);
      dispatch(ActionTypes.ROUTER_PUSH, `/r/${payload.region.value}`);
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  },
  async [ActionTypes.DELETE_COMMENT]({ commit, dispatch }, payload: {
    region: Ref<string>;
    pid: Ref<string>;
    cid: string;
  }) {
    const result = await API.deleteComment(payload.region.value, payload.pid.value, payload.cid);
    if (result.status === 200) {
      commit(MutationTypes.DELETED_COMMENT, payload.cid);
      dispatch(ActionTypes.NOTIFY_DELETE_SUCCESS);
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  },
  async [ActionTypes.CREATE_REGION]({ commit, dispatch }, payload: {
    region: Ref<string>;
    title: Ref<string>;
    description: Ref<string>;
  }) {
    const result = await API.createRegion(payload.region.value, payload.title.value, payload.description.value);
    if (result.status === 200) {
      dispatch(ActionTypes.ROUTER_PUSH, `/r/${payload.region.value}`);
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  },
  async [ActionTypes.CREATE_POST]({ commit, dispatch }, payload: {
    region: Ref<string>;
    title: Ref<string>;
    content: Ref<string>;
  }) {
    const result = await API.createPost(payload.region.value, payload.title.value, payload.content.value);
    if (result.status === 200) {
      dispatch(ActionTypes.ROUTER_PUSH, `/r/${payload.region.value}/${result.pid}`);
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  },
  async [ActionTypes.CREATE_COMMENT]({ commit, dispatch }, payload: {
    region: Ref<string>;
    pid: Ref<string>;
    content: Ref<string>;
  }) {
    const result = await API.sendReply(payload.region.value, payload.pid.value, payload.content.value);
    if (result.status === 200) {
      dispatch(ActionTypes.NOTIFY_REPLY_SUCCESS);
      commit(MutationTypes.CREATED_COMMENT, result.comment);
      payload.content.value = '';
    } else {
      dispatch(ActionTypes.HANDLE_ERROR, result);
    }
  }
}

export default {
  state,
  mutations,
  actions,
};
