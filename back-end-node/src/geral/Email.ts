export class Email {

    public email: string;

    constructor(email: string, public invalido: boolean = false) {
        this.email = Email.corrigirEmail(email);
    }

    // torna nome@e-098571.tcu.gov.br em nome@tcu.gov.br
    static corrigirEmail(email) {
        return email.replace(/@.*\.tcu\.gov\.br$/g, '@tcu.gov.br').toLowerCase();
    }

    isEmailDeEstagiario() {
        return /[xX]\d{11}@tcu.gov.br$/.test(this.email);
    }

    isEmailDeServidor() {
        return !this.isEmailDeEstagiario();
    }

}
