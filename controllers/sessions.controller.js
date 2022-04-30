const utils = require('../utils')
const urls = require('../envUrls')

exports.renderLoginTemplate = (ctx) => {
  return ctx.render('login', {
    process: process,
    method: 'POST',
    action: '/login',
    formID: 'login-form',
    // field one
    field_one_for: 'email',
    fieldOne: 'Email',
    field_one_id: 'email-input',
    // field_one_type: 'email',
    field_one_placeholder: 'Enter Email',
    field_one_name: 'email',
    // field two
    field_two_for: 'password',
    fieldTwo: 'Password',
    field_two_type: 'password',
    field_two_id: 'password-input',
    field_two_placeholder: 'Enter Password',
    field_two_name: 'password',
    button_type: 'submit',
    button_value: 'placeholder-button-value',
    routeName: 'login',
    buttonField: 'Submit',
  })
}
exports.userLogin = async (ctx) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return await utils.httpPostCall(urls.localF1('login'), ctx.request.body)
    } else if (process.env.NODE_ENV === 'production') {
      return await utils.httpPostCall(urls.prodF1('login'), ctx.request.body)
    }
  } catch (e) {
    console.error('error in userLogin', e)
    return e
  }
}
