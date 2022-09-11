## **URL Query Params**

### **Card Size**

Details:

- use with [`/`, `/api`] endpoints
- applies CSS width and height

Specs:
- `size` : `[full, fit, mini ]`
    - `full`: no width params
    - `fit`: fit into viewport
    - `mini`: mini version 

Examples:
- `/screenshots?size=mini`
- `teams/:name_slug:?size=mini` => mini version 
- `teams/:name_slug:?size=fit` => fit version

### **Card Type**

Details:

- use with `/api/take-screenshots` endpoint
- filters which screen shots to take when  calling `takeAllPreRunScreenShots`

Specs:
- `type` : `[drivers, teams]`
    - `drivers`: take only driver screenshots
    - `teams`: take only team screenshots

Examples:
- `api/take-screenshots?type=drivers`
- `api/take-screenshots?type=teams`

### **Card Layout**

Details:

- use with [`/`, `/api`] endpoints
- used to render specific card layout template

Specs:

- `layout` : [`select`, `stats`]
    - `select`: render selectCardMixin
    - `stats`: render statsCardMixin 

Example:
- `/teams/ferrari?layout=select`
- `/drivers/lewis-hamilton?layout=stats`

## Endpoints

- root `/api`
- drivers `/drivers`
- driver `/drivers/:name_slug`
- teams `/teams`
- team `/teams/:team_slug`
- all `/take-screenshots`


### developer notes

- to use utils functions in templates, pass them in as locals
- req status => `req._status`
- res status => `res.statusCode`
- for variable in `layout` use the `layoutVariables` [paradgim](https://gist.github.com/viktorbezdek/9665226)
