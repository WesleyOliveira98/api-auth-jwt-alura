const nodemailer = require('nodemailer');

const configuracaoEmailProducao = {
    host: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USUARIO,
        pass: process.env.EMAIL_SENHA
    },
    secure: true
};

const configuracaoEmailTeste = (contaTeste) => ({
    host: 'smtp.ethereal.email',
    auth: contaTeste,
});

async function criaConfiguracaoEmail() {
    if (process.env.NODE_ENV === 'production') {
        return configuracaoEmailProducao;
    } else {
        const contaTeste = await nodemailer.createTestAccount();
        return configuracaoEmailTeste(contaTeste);
    }
}
class Email {
    async enviaEmail() {
        const configuracaoEmail = await criaConfiguracaoEmail();
        const tranportador = nodemailer.createTransport(configuracaoEmail);
        const info = await tranportador.sendMail(this);
        const url = nodemailer.getTestMessageUrl(info);
        
        if (process.env.NODE_ENV !== 'production') console.log({ url });
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