export enum MutationTypes {
  LOGIN = 'login',
  LOGOUT = 'logout',

  UPDATE_LANGUAGE = 'update_language',

  FETCH_REGION_LIST = 'fetch_region_list',
  FETCH_PROBLEM_LIST = 'fetch_problem_list',
  FETCH_REGION_DETAIL = 'fetch_region_detail',
  FETCH_PROBLEM_DETAIL = 'fetch_problem_detail',
  FETCH_POST_LIST = 'fetch_post_list',
  FETCH_POST_DETAIL = 'fetch_post_detail',
  FETCH_COMMENT_LIST = 'fetch_comment_list',
  FETCH_USER_DETAIL = 'fetch_user_detail',
  FETCH_FILE_LIST = 'fetch_file_list',
  FETCH_BOT_LIST = 'fetch_bot_list',
  FETCH_BOT_DETAIL = 'fetch_bot_detail',

  DELETED_REGION = 'deleted_region',
  DELETED_POST = 'deleted_post',
  DELETED_COMMENT = 'deleted_comment',
  DELETED_FILE = 'deleted_file',

  CREATED_REGION = 'created_region',
  CREATED_POST = 'created_post',
  CREATED_COMMENT = 'created_comment',
  CREATED_FILE = 'created_file',

  CHANGE_SSR_STATUS = 'change_ssr_status',
  CHANGE_SSR_TITLE = 'change_ssr_title',
  CHANGE_SSR_META = 'change_ssr_meta',

  FETCH_USER_FRIENDS = 'fetch_user_friends',
  ADD_NEW_FRIEND = 'add_new_friend',
  REMOVE_FRIEND = 'remove_friend',

  UPLOAD_START = 'upload_start',
  UPLOAD_PROGRESS = 'upload_progress',
  UPLOAD_END = 'upload_end',

  UPDATE_PROBLEM = 'update_problem',
  UPDATE_COMMENT = 'update_comment',
  UPDATE_REGION = 'update_region',
}
