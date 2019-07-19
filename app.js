require('dotenv').config()

const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')
const F1 = 'Formula 1'
const urls = require('./urls')
const errorHandlers = require('./errorHandlers')
// error handler
onerror(app)

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text']
  })
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(
  views(__dirname + '/views', {
    extension: 'pug',
    pretty: true
  })
)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// uses async arrow functions
// app.use(async (ctx, next) => {
//   try {
//     await next() // next is now a function
//   } catch (err) {
//     ctx.body = { message: err.message }
//     ctx.status = err.status || 500
//   }
// })
// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// set locals
app.context.title = F1
app.context.urls = urls
// // error-handling
// app.on('error', (err, ctx) => {
//   console.error('server error', err, ctx)
// })

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound)

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors)

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (process.env.NODE_ENV === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors)
} else {
  // production error handler
  app.use(errorHandlers.productionErrors)
}

module.exports = app
