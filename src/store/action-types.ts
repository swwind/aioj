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
  FETCH_BOT_LIST = 'fetch_bot_list',
  FETCH_BOT_DATA = 'fetch_bot_data',
  FETCH_BOTS_DATA = 'fetch_bots_data',
  FETCH_BOT_RECENT_ROUNDS = 'fetch_bot_recent_rounds',

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
  NOTIFY_CREATE_ROUND_SUCCESS = 'notify_create_round_success',

  HANDLE_ERROR = 'handle_error',
  HANDLE_RENDER_ERROR = 'handle_render_error',
  ROUTER_PUSH = 'router_push',

  UPDATE_BOT_BY_CODE = 'update_bot_by_code',
  UPDATE_BOT_BY_FILE = 'update_bot_by_file',
  UPDATE_BOT_ONLY = 'update_bot_only',
  CREATE_BOT_BY_CODE = 'create_bot_by_code',
  CREATE_BOT_BY_FILE = 'create_bot_by_file',

  UPLOAD_PROBLEM_JUDGER = 'upload_problem_judger',

  CREATE_NEW_ROUND = 'create_new_round',
  FETCH_ROUND_DETAIL = 'fetch_round_detail',

  UNBLOCK_SSR = 'unblock_ssr',
}
