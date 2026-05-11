export class RespostaFormulario {
  public itens: any[];
  public respostas: Record<string, any>;

  constructor(itensIniciais: any[], respostasIniciais: Record<string, any> = {}) {
    this.itens = itensIniciais;
    this.respostas = respostasIniciais;
  }

  // Método para atualizar uma resposta específica
  public definirResposta(itemId: string, valor: boolean, descricao: string) {
    this.respostas = {
      ...this.respostas,
      [itemId]: {
        ...this.respostas[itemId],
        segue: valor,
        descricao: descricao,
        justificativa: valor ? "" : (this.respostas[itemId]?.justificativa || "")
      }
    };
    return this.respostas; // Retorna o novo estado
  }

  // Método para atualizar apenas a justificativa
  public definirJustificativa(itemId: string, texto: string) {
    this.respostas = {
      ...this.respostas,
      [itemId]: { ...this.respostas[itemId], justificativa: texto }
    };
    return this.respostas;
  }

  // Método que verifica se o formulário está completo (Regra de Negócio)
  public estaCompleto(): boolean {
    if (this.itens.length === 0) return false;
    return this.itens.every(item => this.respostas[item.id] !== undefined);
  }

  // Método para formatar os dados para o Firebase
  public prepararParaSalvar(user: any, materia: string) {
    return {
      professorNome: user?.displayName,
      professorEmail: user?.email,
      materia: materia,
      respostas: this.respostas,
      ultimaAtualizacao: new Date().toISOString()
    };
  }
}