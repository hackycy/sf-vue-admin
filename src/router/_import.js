
const routerMap = {
  'views/dashboard/index': () => import('@/views/dashboard/index'),
  'views/excel/export-excel': () => import('@/views/dashboard/index'),
  'views/documentation/index': () => import('@/views/documentation/index')
}

export { routerMap }
