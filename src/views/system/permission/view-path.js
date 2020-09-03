const files = require
  .context('@/', true, /^.\/(views).*(vue)/)
  .keys()
  .map((e) => {
    return e.substr(2).replace('.vue', '')
  })

export default files
