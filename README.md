### developer notes

- to use utils functions in templates, pass them in as locals
- req status => `req._status`
- res status => `res.statusCode`
- for variable in `layout` use the `layoutVariables` [paradgim](https://gist.github.com/viktorbezdek/9665226)

**URL query params Param**

### Card Size:

Usage:

- use with `/` endpoints
- use with `/api` endpoints
- applies different CSS to get various card sizes on screen

Specs:

- `size` : `[full, mobile, mini, unset]`
- `/screenshots?size=mini`
- `teams/:name_slug:?size=mini` => small version, select card
- `teams/:name_slug:?size=mobile` => full size, stats card
- unset is full size of screen with no width or height restraints. This is unused in demo.

### Card Type

Usage:

- use with `/api/take-screenshots` endpoints
- used to take only that type of new shots

Specs:

- `type` : `[drivers, teams]`
- `screenshots?type=drivers`
- `screenshots?type=teams`

### Card Format

Usage:

- use with `/` endpoints
- use with `/api` endpoints
- used to render which format of card to show

Specs:

- `format` : `[stats,select]`
- `/teams/ferrari?format=select`

### Endpoints

- root `/api`
- drivers `/drivers`
- driver `/drivers/:name_slug`
- teams `/teams`
- team `/teams/:team_slug`
- all `/take-screenshots`
