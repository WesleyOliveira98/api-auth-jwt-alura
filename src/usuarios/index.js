module.exports = {
  rotas: require('./usuarios-rotas'),
  controlador: require('./usuarios-controlador'),
  modelo: require('./usuarios-modelo'),
  estrategiasAuth: require('./estrategias-autenticacao'),
  middlewaresAuth: require('./middlewares-autenticacao')
}