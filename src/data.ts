export const menu = [
  {
    id: 1,
    title: "概览",
    icon: "/mdc/svg/home.svg",
    listItems: [
      {
        id: 1,
        title: "首页",
        url: "/",
        icon: "/mdc/svg/home.svg",
      },
    ],
  },
  {
    id: 2,
    title: "容器",
    icon: "/mdc/svg/docker.svg",
    listItems: [
      {
        id: 1,
        title: "镜像管理",
        url: "/images/management",
        icon: "/mdc/svg/docker.svg",
      },
    ],
  },
  {
    id: 3,
    title: "中间件",
    icon: "/mdc/svg/nginx.svg",
    listItems: [
      {
        id: 1,
        title: "NGINX管理",
        url: "/nginx/management",
        icon: "/mdc/svg/nginx.svg",
      },
    ],
  },
  {
    id: 4,
    title: "用户设置",
    icon: "/mdc/svg/roles.svg",
    listItems: [
      {
        id: 1,
        title: "角色管理",
        url: "/users/role",
        icon: "/mdc/svg/roles.svg",
      },
      {
        id: 2,
        title: "用户管理",
        url: "/users/management",
        icon: "/mdc/svg/users.svg",
      },
    ],
  },
  {
    id: 5,
    title: "系统设置",
    icon: "/mdc/svg/sysparameter.svg",
    listItems: [
      {
        id: 1,
        title: "系统参数",
        url: "/setting/parameter",
        icon: "/mdc/svg/sysparameter.svg",
      },
      {
        id: 2,
        title: "值列表",
        url: "/setting/values",
        icon: "/mdc/svg/values.svg",
      },
    ],
  },
];