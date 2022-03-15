const jwt = require('jsonwebtoken');
const allowlistRefreshToken = require('../../redis/allowlist-refresh-token');
const crypto = require('crypto');
const moment = require('moment');
const blocklistAccessToken = require('../../redis/blocklist-access-token');
const { InvalidArgumentError } = require('../erros');

function criaTokenJWT(id, [tempoQtd, tempoUnd]) {
    const payload = { id };
    const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: tempoQtd + tempoUnd });
    return token;
}

async function verificaTokenJWT(token, nome, blocklist) {
    await verificaTokenNaBlocklist(token, nome,blocklist);
    const { id } = jwt.verify(token, process.env.CHAVE_JWT);
    return id;
}

async function verificaTokenNaBlocklist(token, nome, blocklist) {
    if (!blocklist) return;
    const tokenNaBlocklist = await blocklist.contemToken(token);
    if (tokenNaBlocklist) throw new jwt.JsonWebTokenError(`${nome} inválido por logout!`);
}

async function invalidaTokenJWT(token, blocklist) {
    await blocklist.adiciona(token);
}

async function criaTokenOpaco(id, [tempoQtd, tempoUnd], allowlist) {
    const tokenOpaco = crypto.randomBytes(24).toString('hex');
    const dataExpiracao = moment().add(tempoQtd, tempoUnd).unix();
    await allowlist.adiciona(tokenOpaco, id, dataExpiracao)
    return tokenOpaco;
}

async function verificaTokenOpaco(token, nome, allowlist) {
    verificaTokenEnviado(token, nome)
    const id = await allowlist.buscavalor(token);
    verificaTokenValido(id, nome)
    return id;
}

async function invalidaTokenOpaco(token, allowlist) {
    await allowlist.deleta(token);
}

function verificaTokenEnviado(token, nome) {
    if (!token) {
        throw new InvalidArgumentError(`${nome} não enviado!`)
    }
}

function verificaTokenValido(id, nome) {
    if (!id) {
        throw new InvalidArgumentError(`${nome} inválido!`)
    }
}

module.exports = {
    access: {
        nome: 'Access Token',
        lista: blocklistAccessToken,
        expiracao: [15, 'm'],
        cria(id) {
            return criaTokenJWT(id, this.expiracao);
        },
        verifica(token) {
            return verificaTokenJWT(token, this.nome, this.lista);
        },
        invalida(token) {
            return invalidaTokenJWT(token, this.lista);
        }
    },
    refresh: {
        nome: 'Refresh Token',
        lista: allowlistRefreshToken,
        expiracao: [5, 'd'],
        cria(id) {
            return criaTokenOpaco(id, this.expiracao, this.lista);
        },
        verifica(token) {
            return verificaTokenOpaco(token, this.nome, this.lista);
        },
        invalida(token) {
            return invalidaTokenOpaco(token, this.lista);
        }
    },
    verificacaoEmail: {
        nome: 'Token Verificação de E-mail',
        expiracao: [1, 'h'],
        cria(id) {
            return criaTokenJWT(id, this.expiracao);
        },
        verifica(token) {
            return verificaTokenJWT(token, this.nome);
        },
    },
};