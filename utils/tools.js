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

module.exports = {
  Cookie
}