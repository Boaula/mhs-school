import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export class GerenciadorItens {
  private colecao = "itens-para-formulario";

  async buscarTodos() {
    const querySnapshot = await getDocs(collection(db, this.colecao));
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async adicionar(descricao: string) {
    if (!descricao.trim()) throw new Error("Descrição vazia");
    return await addDoc(collection(db, this.colecao), {
      descricao,
      dataCriacao: new Date().toISOString()
    });
  }

  async atualizar(id: string, novaDescricao: string) {
    const itemRef = doc(db, this.colecao, id);
    return await updateDoc(itemRef, { descricao: novaDescricao });
  }

  async excluir(id: string) {
    const itemRef = doc(db, this.colecao, id);
    return await deleteDoc(itemRef);
  }
}