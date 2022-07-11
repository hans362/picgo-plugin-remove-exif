const sharp = require('sharp')

const handle = async (ctx) => {
  ctx.log.info('**** Starting to remove EXIF data ****')
  const jobs = ctx.output.map(async outputi => {
    try {
      let b = outputi.buffer
      outputi.buffer = await sharp(b).toBuffer()
      return outputi
    } catch (err) {
      ctx.emit('notification', {
        title: `Removing EXIF data of ${outputi.fileName} error`,
        body: err
      })
      ctx.log.error(`Removing EXIF data of ${outputi.fileName} error`)
      ctx.log.error(err)
    }
  })
  ctx.output = await Promise.all(jobs)
  ctx.output = ctx.output.filter(Boolean)
  ctx.log.info(`**** Removing EXIF data complete ****`)
  return ctx
}

module.exports = (ctx) => {
  const register = () => {
    ctx.helper.beforeUploadPlugins.register('remove-exif', { handle })
  }
  return {
    register
  }
}
