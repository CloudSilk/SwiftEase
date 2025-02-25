/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  test:{
    "/api/":{
      target: 'http://127.0.0.1:48089',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  dev: {
    "/api/agi/sharedevice":{
      target: 'http://127.0.0.1:48089',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    "/api/curd":{
      target: 'http://127.0.0.1:48081',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    "/api/form":{
      target: 'http://127.0.0.1:48081',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/api/core/auth': {
      target: 'http://127.0.0.1:48080',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/api/bpm': {
      target: 'http://127.0.0.1:48084',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/api/aiot': {
      target: 'http://127.0.0.1:48086',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/api/mes': {
      target: 'http://127.0.0.1:48087',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/api/core/file/download':{
      target: 'https://kuibu.atali.cn',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    }
  },
};
