export class Configuracao {
    constructor(
      public id?: string,
      public tituloSistema?: string,
      public quantidadeNuvemDePalavras?: number,
      public iconeBase64?: string,
      public logomarcaBase64?: string,
      public faviconBase64?: string,
      public nomeInstituicao?: string,
      public siglaInstituicao?: string,
      public htmlPaginaSobre?: string
    ) {}
}
