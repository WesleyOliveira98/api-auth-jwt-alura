const nodemailer = require('nodemailer');

async function enviaEmail(usuario) {
    const contaTeste = await nodemailer.createTestAccount();
    const tranportador = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        auth: contaTeste,
    });
    const info = await tranportador.sendMail({
        from: '"Blod do Código" <noreply@blogdocodigo.com.br>',
        to: usuario.email,
        subject: 'Teste de e-mail',
        text: 'Olá, este é um e-mail de teste!',
        html: '<h1>Olá!</h1> <p>Este é um e-mail de teste!</p>'
    });
    const url = nodemailer.getTestMessageUrl(info);

    console.log({ url });
}

module.exports = { enviaEmail };