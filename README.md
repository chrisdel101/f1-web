### developer notes

- to use utils functions in templates, pass them in as locals
- req status => `req._status`
- res status => `res.statusCode`
- for variable in `layout` use the `layoutVariables` [paradgim](https://gist.github.com/viktorbezdek/9665226)

**URL query params Param**

- All type and sizes `/screenshots`
- For size use `full, mobile, mini` like `/screenshots?size=mini`
- For type use `drivers, teams` like `/screenshots?type=drivers`
- For card format, options are `stats` or `select` like `/teams/ferrari?format=select`

### Endpoints

- root `/api`
- drivers `/drivers`
- driver `/drivers/:name_slug`
- teams `/teams`
- team `/teams/:team_slug`
