import { system } from "@/router/enums";

export default {
  path: "/system",
  redirect: "/system/user/index",
  meta: {
    icon: "ri:settings-3-line",
    title: "系统管理",
    rank: system,
    showLink: false
  },
  children: [
    {
      path: "/system/user/index",
      name: "SystemUser",
      component: () => import("@/views/system/user/index.vue"),
      meta: {
        title: "用户管理"
      }
    },
    {
      path: "/system/role/index",
      name: "SystemRole",
      component: () => import("@/views/system/role/index.vue"),
      meta: {
        title: "角色管理"
      }
    },
    {
      path: "/system/menu/index",
      name: "SystemMenu",
      component: () => import("@/views/system/menu/index.vue"),
      meta: {
        title: "菜单管理"
      }
    },
    {
      path: "/system/dept/index",
      name: "SystemDept",
      component: () => import("@/views/system/dept/index.vue"),
      meta: {
        title: "部门管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
