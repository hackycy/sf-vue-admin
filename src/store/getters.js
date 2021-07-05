const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  perms: state => state.user.perms,
  permissionRoutes: state => state.permission.routes,
  socketClient: state => state.ws.client,
  socketStatus: state => state.ws.status
}
export default getters
