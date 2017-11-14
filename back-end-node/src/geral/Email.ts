export class Email {

    public email: string;

    constructor(email: string, public invalido: boolean = false) {
        this.email = Email.corrigirEmail(email);
    }

    // torna nome@e-098571.tcu.gov.br em nome@tcu.gov.br
    static corrigirEmail(email: string): string {
        return email.replace(/@.*\.tcu\.gov\.br$/g, '@tcu.gov.br').toLowerCase();
    }

    isEmailDeEstagiario(): boolean {
        return /[xX]\d{11}@tcu.gov.br$/.test(this.email);
    }

    isEmailDeServidor(): boolean {
        return !this.isEmailDeEstagiario();
    }

    static ehEmailDeServidor(email: string): boolean {
        return new Email(email).isEmailDeServidor();
    }

    static ehEmailDeEstagiario(email: string): boolean {
        return new Email(email).isEmailDeEstagiario();
    }

}
