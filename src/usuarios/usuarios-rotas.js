const usuariosControlador = require('./usuarios-controlador');
const middlewaresAuth = require('./middlewares-autenticacao');

module.exports = app => {
  app
    .route('/usuario/login')
    .post(
      middlewaresAuth.local, 
      usuariosControlador.login
    );

  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app.route('/usuario/:id').delete(
    middlewaresAuth.bearer,
    usuariosControlador.deleta
  );
};
