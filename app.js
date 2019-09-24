require('dotenv').config()
// require('newrelic')
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const index = require('./routes/index')
const users = require('./routes/users')
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
app.use(require('koa-static')(__dirname + '/public'))

app.use(
  views(__dirname + '/views', {
    extension: 'pug',
    pretty: true
  })
)

app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// uses async arrow functions
app.use(async (ctx, next) => {
  try {
    await next() // next is now a function
  } catch (err) {
    ctx.body = { message: err.message }
    ctx.status = err.status || 500
  }
})
// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// set locals
app.context.title = 'Formula 1 Cards Demo'
app.context.urls = urls
// // error-handling
// app.on('error', (err, ctx) => {
//   console.error('server error', err, ctx)
// })

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound)

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (process.env.NODE_ENV === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors)
} else {
  // production error handler
  app.use(errorHandlers.productionErrors)
}

module.exports = app
