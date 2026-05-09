export default {
  path: "/product",
  redirect: "/product/user/index",
  meta: {
    icon: "ri:box-3-line",
    title: "产品管理",
    rank: 100,
    showLink: false
  },
  children: [
    {
      path: "/product/user/index",
      name: "ProductUser",
      component: () => import("@/views/product/user/index.vue"),
      meta: {
        title: "用户管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
