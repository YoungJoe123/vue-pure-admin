import { http } from "@/utils/http";

type Result = {
  code: number;
  msg: string;
  data?: Array<any>;
};

type ResultTable = {
  code: number;
  msg: string;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 获取系统管理-用户管理列表 */
export const getUserList = (data?: object) => {
  return http.request<ResultTable>("post", "/admin/user", { data });
};

/** 系统管理-用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return http.request<Result>("get", "/admin/list-all-role");
};

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (data?: object) => {
  return http.request<Result>("post", "/admin/list-role-ids", { data });
};

/** 获取系统管理-角色管理列表 */
export const getRoleList = (data?: object) => {
  return http.request<ResultTable>("post", "/admin/role", { data });
};

/** 获取系统管理-菜单管理列表 */
export const getMenuList = (data?: object) => {
  return http.request<Result>("post", "/admin/menu", { data });
};

/** 获取系统管理-部门管理列表 */
export const getDeptList = (data?: object) => {
  return http.request<Result>("post", "/admin/dept", { data });
};

/** 获取系统监控-在线用户列表 */
export const getOnlineLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/admin/online-logs", { data });
};

/** 获取系统监控-登录日志列表 */
export const getLoginLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/admin/login-logs", { data });
};

/** 获取系统监控-操作日志列表 */
export const getOperationLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/admin/operation-logs", { data });
};

/** 获取系统监控-系统日志列表 */
export const getSystemLogsList = (data?: object) => {
  return http.request<ResultTable>("post", "/admin/system-logs", { data });
};

/** 获取系统监控-系统日志-根据 id 查日志详情 */
export const getSystemLogsDetail = (data?: object) => {
  return http.request<Result>("post", "/admin/system-logs-detail", { data });
};

/** 获取角色管理-权限-菜单权限 */
export const getRoleMenu = (data?: object) => {
  return http.request<Result>("post", "/admin/role-menu", { data });
};

/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
export const getRoleMenuIds = (data?: object) => {
  return http.request<Result>("post", "/admin/role-menu-ids", { data });
};

/** 用户管理-新增 */
export const addUser = (data?: object) =>
  http.request<Result>("post", "/admin/user/add", { data });
/** 用户管理-修改 */
export const updateUser = (data?: object) =>
  http.request<Result>("put", "/admin/user/update", { data });
/** 用户管理-删除 */
export const deleteUser = (id: number) =>
  http.request<Result>("delete", `/admin/user/${id}`);
/** 用户管理-重置密码 */
export const resetUserPwd = (data?: object) =>
  http.request<Result>("put", "/admin/user/reset-pwd", { data });

/** 角色管理-新增 */
export const addRole = (data?: object) =>
  http.request<Result>("post", "/admin/role/add", { data });
/** 角色管理-修改 */
export const updateRole = (data?: object) =>
  http.request<Result>("put", "/admin/role/update", { data });
/** 角色管理-删除 */
export const deleteRole = (id: number) =>
  http.request<Result>("delete", `/admin/role/${id}`);
/** 角色管理-保存菜单权限 */
export const saveRoleMenu = (data?: object) =>
  http.request<Result>("put", "/admin/role/menu", { data });

/** 菜单管理-新增 */
export const addMenu = (data?: object) =>
  http.request<Result>("post", "/admin/menu/add", { data });
/** 菜单管理-修改 */
export const updateMenu = (data?: object) =>
  http.request<Result>("put", "/admin/menu/update", { data });
/** 菜单管理-删除 */
export const deleteMenu = (id: number) =>
  http.request<Result>("delete", `/admin/menu/${id}`);

/** 部门管理-新增 */
export const addDept = (data?: object) =>
  http.request<Result>("post", "/admin/dept/add", { data });
/** 部门管理-修改 */
export const updateDept = (data?: object) =>
  http.request<Result>("put", "/admin/dept/update", { data });
/** 部门管理-删除 */
export const deleteDept = (id: number) =>
  http.request<Result>("delete", `/admin/dept/${id}`);
