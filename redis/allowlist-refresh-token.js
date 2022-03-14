const redis = require('redis');
const manipulaLista = require('./manipula-lista');
const allowList = redis.createClient({ prefix: 'allowlist-refresh-token:' });
module.exports = manipulaLista(allowList);