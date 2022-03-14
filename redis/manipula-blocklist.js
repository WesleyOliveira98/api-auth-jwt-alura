const blocklist = require('./blocklist');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');

const existsAsync = promisify(blocklist.exists).bind(blocklist);
const setAsync = promisify(blocklist.set).bind(blocklist);
const geraTokenHash = token => { return createHash('sha256').update(token).digest('hex'); }

module.exports = {
    adiciona: async token => {
        const dataExpiracao = jwt.decode(token).exp;
        const tokenHash = geraTokenHash(token);
        await setAsync(tokenHash, '');
        blocklist.expireAt(tokenHash, dataExpiracao)
    },
    contemToken: async token => {
        const tokenHash = geraTokenHash(token);
        const result = await existsAsync(tokenHash);
        return result === 1;
    }
};