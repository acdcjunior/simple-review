export interface GitLabUser {

    readonly name: string; // "Antonio C. de Carvalho Junior (CARVALHOJ)",
    readonly username: string; // "carvalhoj",
    readonly email: string; // "antonio.junior@tcu.gov.br",
    readonly id: number; // 106,
    readonly state: string; // "active",
    readonly avatar_url: string; // "http://srv-scm.tcu.gov.br/uploads/user/avatar/106/imagem.jpg",
    readonly web_url: string; // "http://srv-scm.tcu.gov.br/carvalhoj"

    // as duas props abaixo nao vêm do gitlab; uso cada uma em momentos especificos do codigo
    readonly invalido: boolean;

}