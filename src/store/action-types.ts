export enum ActionTypes {
  FETCH_ACCOUNT_DATA = 'fetch_account_data',
  FETCH_FRIEND_DATA = 'fetch_friend_data',
  FETCH_POST_DATA = 'fetch_post_data',
  FETCH_REGION_DATA = 'fetch_region_data',
  FETCH_REGIONS_DATA = 'fetch_regions_data',
  FETCH_PROBLEMS_DATA = 'fetch_problems_data',
  FETCH_PROBLEM_DATA = 'fetch_problem_data',
  FETCH_USER_DATA = 'fetch_user_data',
  FETCH_USER_FILES = 'fetch_user_files',

  LOGOUT = 'logout',
  LOGIN = 'login',
  REGISTER = 'register',
  DELETE_FILE = 'delete_file',
  UPLOAD_FILE = 'upload_file',

  ADD_FRIEND = 'add_friend',
  REMOVE_FRIEND = 'remove_friend',

  DELETE_REGION = 'delete_region',
  DELETE_POST = 'delete_post',
  DELETE_COMMENT = 'delete_comment',
  DELETE_PROBLEM = 'delete_problem',

  CREATE_REGION = 'create_region',
  CREATE_POST = 'create_post',
  CREATE_COMMENT = 'create_comment',
  CREATE_PROBLEM = 'create_problem',

  UPDATE_PROBLEM = 'update_problem',
  UPDATE_COMMENT = 'update_comment',
  UPDATE_REGION = 'update_region',

  NOTIFY_DELETE_SUCCESS = 'notify_delete_success',
  NOTIFY_REPLY_SUCCESS = 'notify_reply_success',
  NOTIFY_UPDATE_SUCCESS = 'notify_update_success',
  NOTIFY_COPY_SUCCESS = 'notify_copy_success',
  NOTIFY_COPY_FAILED = 'notify_copy_failed',

  HANDLE_ERROR = 'handle_error',
  HANDLE_RENDER_ERROR = 'handle_render_error',
  ROUTER_PUSH = 'router_push',

  UNBLOCK_SSR = 'unblock_ssr',
}
