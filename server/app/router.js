'use strict'

const base = '/api/v1'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.get(`${base}/exception/list`, controller.home.list)
  router.get(`${base}/exception/collect`, controller.home.collect)
  router.get(`${base}/exception/detail`, controller.home.source)
}
