import Koa from 'koa';
const { Nuxt, Builder } = require('nuxt')
const app = new Koa()

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')
async function start() {
    // Instantiate nuxt.js
    const nuxt = new Nuxt(config)

    const {
        host = process.env.HOST || '127.0.0.1',
        port = process.env.PORT || 3000
    } = nuxt.options.server

    // Build in development
    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
    } else {
        await nuxt.ready()
    }

    // 监听所有路由
    app.use(ctx => {
        ctx.status = 200
        ctx.respond = false // 绕过Koa的内置响应处理
        ctx.req.ctx = ctx // 这在以后可能会很有用，例如在nuxtServerInit或nuxt-stash中
        nuxt.render(ctx.req, ctx.res)
    })

    app.listen(port, host)
    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
    })
}

start() 