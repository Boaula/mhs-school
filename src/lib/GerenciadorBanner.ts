export class GerenciadorBanner {
  private tempoLeitura: number;

  constructor(tempoSegundos: number = 10) {
    this.tempoLeitura = tempoSegundos;
  }

  podeFechar(segundosPassados: number): boolean {
    return segundosPassados >= this.tempoLeitura;
  }
}