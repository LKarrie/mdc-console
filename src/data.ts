export const menu = [
  {
    id: 1,
    title: "概览",
    icon: "/首页.svg",
    listItems: [
      {
        id: 1,
        title: "首页",
        url: "/",
        icon: "/首页.svg",
      },
    ],
  },
  {
    id: 2,
    title: "容器",
    icon: "/docker.svg",
    listItems: [
      {
        id: 1,
        title: "镜像管理",
        url: "/images/management",
        icon: "/docker.svg",
      },
    ],
  },
  {
    id: 3,
    title: "中间件",
    icon: "/nginx.svg",
    listItems: [
      {
        id: 1,
        title: "NGINX管理",
        url: "/nginx/management",
        icon: "/nginx.svg",
      },
    ],
  },
  {
    id: 4,
    title: "用户设置",
    icon: "/角色管理.svg",
    listItems: [
      {
        id: 1,
        title: "角色管理",
        url: "/users/role",
        icon: "/角色管理.svg",
      },
      {
        id: 2,
        title: "用户管理",
        url: "/users/management",
        icon: "/用户管理.svg",
      },
    ],
  },
  {
    id: 5,
    title: "系统设置",
    icon: "/系统参数.svg",
    listItems: [
      {
        id: 1,
        title: "系统参数",
        url: "/setting/parameter",
        icon: "/系统参数.svg",
      },
      {
        id: 2,
        title: "值列表",
        url: "/setting/values",
        icon: "/值列表.svg",
      },
    ],
  },
];