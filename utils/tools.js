const crypto = require('crypto')

const Cookie = {
  get: (cookie, key) => {
    let cookies = cookie.indexOf(';') > 0? cookie.split(';') : [cookie]
    let result = {}
    for (let i = 0; i < cookies.length; i++) {
      let parts = cookies[i].split('=')
      let cookieKey = parts[0].trim()
      result[cookieKey] = parts.slice(1).join('=')
    }
    return result[key]
  }
}

const Page = (array, limit, skip) => {
  let offset = skip * limit
  return (offset + limit >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + limit)
}

const toMD5 = (str) => {
  let md5 = crypto.createHash('md5')
  return md5.update(str).digest('hex')
}

module.exports = {
  Cookie,
  Page,
  toMD5
}