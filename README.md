# juglans-logs
A plugin for http request print, you can defined your formatter stype

    Debugger listening on ws://127.0.0.1:9229/636cdbe3-9da6-4b12-8a78-2f747eda968e
    For help see https://nodejs.org/en/docs/inspector
    key[Config]:name has existed, the same properties will be overridden.
    key[Config]:name has existed, the same properties will be overridden.
    key[Config]:prefix has existed, the same properties will be overridden.
    key[Config]:port has existed, the same properties will be overridden.
    key[Config]:debug has existed, the same properties will be overridden.
    key[Config]:logger has existed, the same properties will be overridden.
    key[Config]:bodyParser has existed, the same properties will be overridden.
    key[Inject]:config has existed, the same properties will be overridden.
    key[Inject]:test has existed, the same properties will be overridden.
    key[Inject]:test has existed, the same properties will be overridden.
    DEPRECATED: opts.strict has been deprecated in favor of opts.parsedMethods.
    first message
    App:juglans test v1.1
    App:local
    App:runing on Port:3001
    Redis:redis://127.0.0.1:6379 connect successfully!
    Mongodb:mongodb://127.0.0.1:27017/test?authSource=admin connect successfully!
    2019-05-27T04:01:42.934Z http: => 2019-05-27 12:01:42 [UD] GET /api/v1/user?access_token=DEBUG&accessToken=DEBUG
    before
    after
    2019-05-27T04:01:42.958Z http: <= 2019-05-27 12:01:42 [FT] GET /api/v1/user?access_token=DEBUG&accessToken=DEBUG 200 31ms

## Use
```javascript
  // Logs Plugin
  app.Use(Logs({
    logger: {
      path: path.join(__dirname, '../logger')
    },
    // default format type
    format: function (payload, ctx) {
        let type
        if (payload.accessData) {
            type = payload.accessData.username
        } else if (ctx.state.fakeToken) {
            type = 'FT'
        } else if (ctx.state.fakeUrl) {
            type = 'FU'
        } else {
            type = 'UD'
        }
        if (payload.type === 'IN') {
            return `=> ${formatPrint({
            formatTime: moment(payload.startUnix, 'X').format('YYYY-MM-DD HH:mm:ss'),
            type,
            method: payload.method,
            href: payload.url
            })}`
        } else if (payload.type === 'OUT') {
            return `<= ${formatPrint({
            formatTime: moment(payload.startUnix, 'X').format('YYYY-MM-DD HH:mm:ss'),
            type,
            method: payload.method,
            href: payload.url
            })}`
        }
    }
  }))
```


## MIT License

Copyright (c) 2018-2020 Double

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
