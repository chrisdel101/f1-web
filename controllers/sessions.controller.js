const utils = require('../utils')
const urls = require('../urls')

exports.renderLoginTemplate = ctx => {
  return ctx.render('login', {
    method: 'POST',
    action: '/login',
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
    buttonValue: 'HELLO',
    buttonField: 'Submit'
  })
}
exports.userLogin = async ctx => {
  return await utils.httpPostCall(urls.localDev('login'), ctx.request.body)
}
