export const adminItems = [
  { title: "Dashboard", icon: "dashboard", to: "/admin" },
  // {
  //   title: "Role dan Permission",
  //   icon: "pan_tool",
  //   to: "/roles",
  //   hasChild: true,
  //   children: [
  //     { title: "Role", icon: "format_line_spacing", to: "/roles" },
  //     {
  //       title: "Permission",
  //       icon: "format_list_bulleted",
  //       to: "/permissions"
  //     }
  //   ]
  // },
  // {
  //   title: "User",
  //   icon: "account_circle",
  //   to: "/users",
  //   hasChild: true,
  //   children: [
  //     { title: "User", icon: "perm_identity", to: "/users" },
  //     { title: "Supervisor", icon: "perm_identity", to: "/supervisors" }
  //   ]
  // },
  {
    title: "Product Category",
    icon: "bookmarks",
    to: "/admin/product-categories"
  },
  {
    title: "Banners",
    icon: "announcement",
    to: "/admin/banners"
  },

  {
    title: "Products",
    icon: "apps",
    to: "/admin/products"
  }
];
