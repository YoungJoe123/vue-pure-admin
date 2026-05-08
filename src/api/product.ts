import { http } from "@/utils/http";

type ResultTable = {
  code: number;
  data?: {
    list: Array<any>;
    total?: number;
    pageSize?: number;
    currentPage?: number;
  };
};

type Result = {
  code: number;
  data?: any;
};

export const getProductUserList = (data?: object) =>
  http.request<ResultTable>("post", "/admin/product/user", { data });

export const getProductUserDetail = (id: number) =>
  http.request<Result>("get", `/admin/product/user/${id}`);

export const updateUserPoints = (data?: object) =>
  http.request<Result>("put", "/admin/product/user/points", { data });

export const updateUserVip = (data?: object) =>
  http.request<Result>("put", "/admin/product/user/vip", { data });

export const updateUserStatus = (data?: object) =>
  http.request<Result>("put", "/admin/product/user/status", { data });
