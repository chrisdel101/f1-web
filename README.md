### developer notes

- to use utils functions in templates, pass them in as locals
- req status => `req._status`
- res status => `res.statusCode`
- for variable in `layout` use the `layoutVariables` [paradgim](https://gist.github.com/viktorbezdek/9665226)

**SrceenShot Param**

- All type and sizes `/screenshots`
- For size use `full, mobile, mini` like `/screenshots?size=mini`
- For type use `drivers, teams` like `/screenshots?type=drivers`
