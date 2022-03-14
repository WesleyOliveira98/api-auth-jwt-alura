const jwt = require('jsonwebtoken');
const allowlistRefreshToken = require('../../redis/allowlist-refresh-token');
const crypto = require('crypto');
const moment = require('moment');

function criaTokenJWT(id, [tempoQtd, tempoUnd]) {
    const payload = { id };
    const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: tempoQtd + tempoUnd });
    return token;
}

async function criaTokenOpaco(id, [tempoQtd, tempoUnd], allowlist) {
    const tokenOpaco = crypto.randomBytes(24).toString('hex');
    const dataExpiracao = moment().add(tempoQtd, tempoUnd).unix();
    await allowlist.adiciona(tokenOpaco, id, dataExpiracao)
    return tokenOpaco;
}

module.exports = {
    access: {
        expiracao: [15, 'm'],
        cria(id) {
            return criaTokenJWT(id, this.expiracao);
        }
    },
    refresh: {
        lista: allowlistRefreshToken,
        expiracao: [5, 'd'],
        cria(id) {
            return criaTokenOpaco(id, this.expiracao, this.lista);
        }
    }
}