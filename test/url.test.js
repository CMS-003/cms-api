const urlSchema = require('url').URLSearchParams

console.log(Object.fromEntries(new urlSchema('"authSource=admin"')))

console.log(new URLSearchParams(Object.fromEntries(new urlSchema('"authSource=admin"'))).toString())