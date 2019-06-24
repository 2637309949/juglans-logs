## juglans-logs

### Example

```javascript
const Logs = Logs({
  path: path.join(__dirname, '../../logger')
})
app.Use(Logs)
```
### API

```javascript
// set diff property if you want
const defaultOpts = {
  path: path.join(__dirname, '../../logger'),
  format (payload, ctx) {
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
      return `=> ${FORMAT({
        formatTime: moment(payload.startUnix, 'X').format('YYYY-MM-DD HH:mm:ss'),
        type,
        method: payload.method,
        href: payload.url
      })}`
    } else if (payload.type === 'OUT') {
      return `<= ${FORMAT({
        formatTime: moment(payload.startUnix, 'X').format('YYYY-MM-DD HH:mm:ss'),
        type,
        method: payload.method,
        href: payload.url
      })}`
    }
  }
}
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
