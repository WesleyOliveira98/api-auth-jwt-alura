const nodemailer = require('nodemailer');

class Email {
    async enviaEmail() {
        const contaTeste = await nodemailer.createTestAccount();
        const tranportador = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            auth: contaTeste,
        });
        const info = await tranportador.sendMail(this);
        const url = nodemailer.getTestMessageUrl(info);
    
        console.log({ url });
    }
}

class EmailVerificacao extends Email {
    constructor(usuario, endereco) {
        super();
        this.from = '"Blod do Código" <noreply@blogdocodigo.com.br>';
        this.to = usuario.email;
        this.subject = 'Verificação de e-mail';
        this.text = `Olá! Verifique o seu e-mail aqui: ${endereco}`;
        this.html = `<h1>Olá!</h1> Verifique o seu e-mail aqui: <a href="${endereco}">${endereco}</a>`;
    }
}

module.exports = { EmailVerificacao };