export default {
  BASE_URL: '',
  api: [
    {
      name: 'login',
      desc: '登录',
      method: 'POST',
      path: '/login'
    },
    {
      name: 'logout',
      desc: '注销',
      method: 'POST',
      path: '/logout'
    },
    {
      name: 'basic_list',
      desc: '获取列表',
      method: 'POST',
      path: '/basic_list'
    },
    {
      name: 'org_data',
      desc: '获取组织结构数据',
      method: 'GET',
      path: '/org_data'
    },
    {
      name: '404',
      desc: '请求错误',
      method: 'POST',
      path: '/404'
    },
    {
      name: 'exceptions',
      desc: '获取错误信息',
      method: 'GET',
      path: '/exception/list'
    },
    {
      name: 'exceptionDetail',
      desc: '获取错误详情',
      method: 'GET',
      path: '/exception/detail'
    }
  ]
}
