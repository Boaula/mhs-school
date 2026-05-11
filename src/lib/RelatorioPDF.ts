import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export class RelatorioPAEDE {
  private doc: jsPDF;
  private verdeIF = [21, 128, 61] as [number, number, number];

  constructor() {
    this.doc = new jsPDF();
  }

  // Método Privado: Desenha o cabeçalho em cada página
  private desenharCabecalho() {
    this.doc.setFontSize(18);
    this.doc.setTextColor(...this.verdeIF);
    this.doc.text("RELATÓRIO DE AVALIAÇÃO DE FLUXO", 105, 20, { align: 'center' });
    
    this.doc.setFontSize(10);
    this.doc.setTextColor(100);
    this.doc.text("Escola Estadual Ledy Anita Brescancim - Sistema PAEDE", 105, 27, { align: 'center' });
    this.doc.line(20, 32, 190, 32);
  }

  // Método: Adiciona a página de um professor específico
  adicionarPaginaProfessor(relatorio: any) {
    // Se não for a primeira página, adiciona uma nova
    if (this.doc.getNumberOfPages() > 1 || this.doc.internal.pages.length > 2) {
       this.doc.addPage();
    }

    this.desenharCabecalho();

    // Info do Professor
    this.doc.setFontSize(12);
    this.doc.setTextColor(0);
    this.doc.setFont("helvetica", "bold");
    this.doc.text(`Professor: ${relatorio.professorNome}`, 20, 45);
    this.doc.text(`Matéria: ${relatorio.materia}`, 20, 52);
    
    this.doc.setFont("helvetica", "normal");
    this.doc.setFontSize(10);
    this.doc.text(`E-mail: ${relatorio.professorEmail}`, 20, 59);
    this.doc.text(`Data: ${new Date(relatorio.ultimaAtualizacao).toLocaleString('pt-BR')}`, 20, 66);

    // Dados da Tabela
    const tableData = Object.keys(relatorio.respostas).map(itemId => {
    const r = relatorio.respostas[itemId];
    
    // Tenta pegar r.descricao (se salvo no novo formato) 
    // ou r.nome (se salvo no formato antigo)
    const nomeAluno = r.descricao || r.nome || `Item ID: ${itemId}`;

    return [
        nomeAluno,
        r.segue ? "SIM" : "NÃO",
        r.justificativa || "---"
    ];
    });

    autoTable(this.doc, {
      startY: 75,
      head: [['Item/Aluno', 'Segue Fluxo?', 'Justificativa']],
      body: tableData,
      headStyles: { fillColor: this.verdeIF },
      columnStyles: { 1: { halign: 'center', fontStyle: 'bold' } },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 1) {
          data.cell.styles.textColor = data.cell.raw === 'SIM' ? [22, 101, 52] : [153, 27, 27];
        }
      }
    });
  }

  // Método: Finaliza e baixa o arquivo
  download(nomeArquivo: string = "relatorio.pdf") {
    this.doc.save(nomeArquivo);
  }
}