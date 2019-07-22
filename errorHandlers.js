/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

exports.catchErrors = fn => {
  return function(ctx, next) {
    return fn(ctx.request, res.response, next).catch(next)
  }
}

/*
    Not Found Error Handler
  
    If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
  */
exports.notFound = (ctx, next) => {
  const err = new Error('Not Found')
  err.status = 404
  err.message = 'Not Found'
  err.detail = ctx.request.path

  ctx.state.err = err;
  next()
}

/*
    Development Error Handler
  
    In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
  */
exports.productionErrors = exports.developmentErrors = async (ctx, next) => {
  let err;
  let req;
  let res;

  if (!ctx.state.err) return next();

  err = ctx.state.err;
  req = ctx.request;
  res = ctx.response;

  const errorDetails = {
    message: err.message,
    status: err.status,
    detail: err.detail,
    stack: err.stack,
  }
  res.status = err.status || 500
  /*
   * We will keep it simple now and always return json!
   */

  /*
   * What I want is the output of
   * await ctx.render('error', errorDetails)
   * but I can't quite get it to work.
   */
  res.body = errorDetails;
}
