const blacklist = require('./blacklist');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { createHash } = require('crypto');

const existsAsync = promisify(blacklist.exists).bind(blacklist);
const setAsync = promisify(blacklist.set).bind(blacklist);
const geraTokenHash = token => { return createHash('sha256').update(token).digest('hex'); }

module.exports = {
    adiciona: async token => {
        const dataExpiracao = jwt.decode(token).exp;
        const tokenHash = geraTokenHash(token);
        await setAsync(tokenHash, '');
        blacklist.expireAt(tokenHash, dataExpiracao)
    },
    contemToken: async token => {
        const tokenHash = geraTokenHash(token);
        const result = await existsAsync(tokenHash);
        return result === 1;
    }
};