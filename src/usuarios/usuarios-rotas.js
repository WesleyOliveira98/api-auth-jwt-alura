const usuariosControlador = require('./usuarios-controlador');
const middlewaresAuth = require('./middlewares-autenticacao');

module.exports = app => {
  app
    .route('/usuario/atualiza_token')
    .post(
      middlewaresAuth.refresh,
      usuariosControlador.login
    );

  app
    .route('/usuario/login')
    .post(
      middlewaresAuth.local, 
      usuariosControlador.login
    );

  app
    .route('/usuario/logout')
    .post(
      [middlewaresAuth.refresh, middlewaresAuth.bearer], 
      usuariosControlador.logout
    );

  app
    .route('/usuario')
    .get(usuariosControlador.lista)
    .post(usuariosControlador.adiciona);
    

  app
    .route('/usuario/verifica_email/:token')
    .get(
      middlewaresAuth.verificacaoEmail,
      usuariosControlador.verificaEmail
    );

  app.route('/usuario/:id').delete(
    middlewaresAuth.bearer,
    usuariosControlador.deleta
  );
};
