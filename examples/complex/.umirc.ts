import { defineConfig } from '@umijs/max';
import proxy from './config/proxy';

export default defineConfig({
  antd: {
    // compact: true,
    configProvider: {
      theme: {
        "token": {
          "colorPrimary": "#0ec7a7",
          "colorInfo": "#0ec7a7",
          "colorBgLayout": "#ededed",
          "colorBorder": "#c1c1c1",
          "colorBorderSecondary": "#dcdcdc"
        },
        "components": {
          "Layout": {
            "bodyBg": "#ededed"
          }
        }
      }
    }
  },
  access: {},
  model: {},
  base: process.env.WEB_BASE !== undefined && process.env.WEB_BASE !== "" ? process.env.WEB_BASE : "/",
  manifest: {
    basePath: process.env.WEB_BASE !== undefined && process.env.WEB_BASE !== "" ? process.env.WEB_BASE : "",
  },
  publicPath: (process.env.WEB_BASE !== undefined && process.env.WEB_BASE !== "" ? process.env.WEB_BASE + '/' : '/'),
  locale: {
    // 默认使用 src/locales/zh-CN.ts 作为多语言文件
    default: 'zh-CN',
    baseSeparator: '-',
  },
  initialState: {},
  esbuildMinifyIIFE:true,
  history: { type: 'hash' },
  request: {},
  dva: {},
  mfsu: false,
  layout: {
    title: '炘智科技'
  },
  define: { 'process.env.WEB_BASE': process.env.WEB_BASE },
  proxy: proxy['dev'],
  alias: {
    "@swiftease/designable-shared": require.resolve("../../designable/packages/shared/src"),
    "@swiftease/designable-core": require.resolve("../../designable/packages/core/src"),
    "@swiftease/designable-react":
      require.resolve("../../designable/packages/react/src")
    ,
    "@swiftease/designable-react-settings-form":
      require.resolve("../../designable/packages/react-settings-form/src")
    ,
    "@swiftease/designable-formily-antd":
      require.resolve("../../designable/formily/antd/src")
    ,
    "@swiftease/designable-formily-transformer":
      require.resolve("../../designable/formily/transformer/src")
    ,
    "@swiftease/designable-formily-setters":
      require.resolve("../../designable/formily/setters/src")
    ,
    "@swiftease/formily-antd-v5":
      require.resolve("../../formily/packages/components/src")
    ,
    "@swiftease/atali-pkg":
      require.resolve("../../atali/pkg/src")
    ,
    "@swiftease/atali-form":
      require.resolve("../../atali/form/src")
    ,
    "@swiftease/atali-graph":
      require.resolve("../../atali/graph/src")
    ,
    "@swiftease/atali-components":
      require.resolve("../../atali/components/src")
    ,
    "@swiftease/atali-curd":
      require.resolve("../../atali/curd/src")
  },
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      name: 'Block',
      path: '/block',
      component: './block',
      layout: false
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
      layout: false
    },
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
      ],
    },
    {
      path: '/dashboard',
      component: "dashboard",
      menuRender: false,
    },
    {
      path:'/demo/resizable/panel',
      component:"ResizablePanel",
      menuRender: false,
    },
    {
      path:'/demo/leftside',
      component:"side",
      menuRender: false,
      layout: false,
    },
    {
      path: '/form',
      layout: false,
      routes: [
        {
          name: '表单设计器',
          icon: 'smile',
          path: '/form/designable/:formID',
          component: './form/designable',
          layout: false,
        },
        {
          icon: 'smile',
          path: '/form/preview/:formID',
          component: './form/preview',
        },
      ]
    },
    {
      path: '/curd',
      routes: [
        {
          icon: 'smile',
          path: '/curd/page/view',
          component: './curd/CurdPage',
        },
        {
          icon: 'smile',
          exact: false,
          path: '/curd/page/manager/:name',
          component: './curd/CurdPage',
        },
        {
          icon: 'smile',
          exact: true,
          path: '/curd/page/edit',
          component: './curd/CurdPage/Edit',
        },
      ]
    },
    {
      path: 'bpm',
      layout: false,
      routes: [
        {
          name: '流程设计',
          icon: 'smile',
          path: '/bpm/designer/:processID',
          component: './bpm/DesignerPage',

        },
      ]
    },
    {
      path: '/cell',
      routes: [
        {
          icon: 'smile',
          exact: true,
          path: '/cell/edit',
          component: './cell/edit',
        },
      ]
    },
    {
      path: '/station',
      layout: false,
      routes: [
        {
          path: '/station/config',
          component: './station',
          layout: false,
        },
        {
          path: '/station/workmanship/designer/:workmanshipID',
          component: './station/workmanship',
          layout: false,
        },
        {
          path: '/station/workmanship/preview/:workmanshipID',
          component: './station/preview',
          layout: false,
        },
        {
          path: '/station/app/designer/:appID',
          component: './station/app',
          layout: false,
        },
        {
          path: '/station/app/view/:formID',
          component: './station/app/preview',
          layout: false,
        }
      ]
    },
  ],
  npmClient: 'yarn',
  jsMinifierOptions: {
    target: ['chrome80', 'es2020']
  },
});

