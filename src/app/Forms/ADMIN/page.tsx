'use client';

import { useState } from 'react';
import { db, auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { RelatorioPAEDE } from '@/lib/RelatorioPDF'; 

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [itemNome, setItemNome] = useState('');
  const [listaItens, setListaItens] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  const ADM_EMAIL = "natanael.rodrigues@edu.mt.gov.br";

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== ADM_EMAIL) {
        await signOut(auth);
        alert("Acesso restrito ao administrador.");
        return;
      }
      setUser(result.user);
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const adicionarNaLista = () => {
    if (itemNome.trim()) {
      setListaItens([...listaItens, itemNome.trim()]);
      setItemNome(''); // Limpa o campo para o próximo item
    }
  };

  const salvarNoFirebase = async () => {
    if (listaItens.length === 0) return;
    setStatus('Salvando itens no banco de dados...');
    try {
      for (const nome of listaItens) {
        await addDoc(collection(db, "itens-para-formulario"), {
          descricao: nome,
          cadastradoPor: user?.email,
          dataCadastro: new Date().toISOString(),
          status: 'disponivel'
        });
      }
      setStatus('Todos os itens foram cadastrados com sucesso!');
      setListaItens([]);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setStatus('Erro ao salvar no banco.');
    }
  };

// Função dentro do componente AdminPage
const gerarPDF = async () => {
  try {
    setStatus('A aceder ao banco de dados...');
    
    // 1. O 'getDocs' precisa de estar importado neste ficheiro para funcionar aqui
    const querySnapshot = await getDocs(collection(db, "responder-formulario"));
    
    if (querySnapshot.empty) {
      alert("Nenhuma resposta encontrada!");
      return;
    }

    // 2. Instancia a classe de POO
    const relatorioGerador = new RelatorioPAEDE();

    // 3. Alimenta a classe com os dados
    querySnapshot.docs.forEach(docSnap => {
      relatorioGerador.adicionarPaginaProfessor(docSnap.data());
    });

    // 4. Download
    relatorioGerador.download(`Relatorio_Geral_PAEDE.pdf`);
    setStatus('PDF gerado com sucesso!');
    
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    setStatus('Erro técnico ao gerar o documento.');
  }
};

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-32">
        <button 
          onClick={handleLogin} 
          className="bg-green-600 text-white px-8 py-3 rounded shadow-lg font-bold hover:bg-green-700 transition"
        >
          Entrar como Administrador
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen pt-32 text-black">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <h2 className="text-xl font-bold text-green-700 mb-6 text-center uppercase tracking-wide">
          Cadastro de Itens (ADM)
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-green-700 mb-2">
              Descrição do Item:
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none bg-white"
              rows={2}
              value={itemNome}
              onChange={(e) => setItemNome(e.target.value)}
              placeholder="Ex: Aluno João da Silva ou Item de Inventário..."
            />
          </div>

          <button
            onClick={adicionarNaLista}
            className="w-full bg-green-100 text-green-700 py-2 rounded-md font-bold hover:bg-green-200 transition border border-green-200"
          >
            + Adicionar na lista temporária
          </button>

          {listaItens.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md border border-dashed border-gray-300">
              <p className="text-xs font-bold text-gray-400 mb-2">LISTA DE ENVIO:</p>
              <ul className="text-sm space-y-2">
                {listaItens.map((item, index) => (
                  <li key={index} className="flex justify-between items-center text-gray-700 border-b border-gray-100 pb-1">
                    <span>{index + 1}. {item}</span>
                    <button 
                      onClick={() => setListaItens(listaItens.filter((_, i) => i !== index))}
                      className="text-red-400 hover:text-red-600 ml-2"
                    >
                      <small>Remover</small>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={salvarNoFirebase}
            disabled={listaItens.length === 0}
            className="w-full bg-green-700 text-white py-4 rounded-md font-bold hover:bg-green-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-md"
          >
            CONCLUIR E SALVAR NO BANCO
          </button>
          
          {status && (
            <p className="text-center text-sm font-bold mt-4 text-green-600 animate-pulse">
              {status}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10 p-6 border-t border-gray-200">
        <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">Exportar Resultados</h3>
        <button
          onClick={gerarPDF}
          className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-md font-bold hover:bg-red-700 transition shadow-md"
        >
          <span>📄</span> GERAR RELATÓRIO PDF GERAL
        </button>
      </div>      
      
      <button 
        onClick={() => { signOut(auth); setUser(null); }} 
        className="mt-8 text-gray-400 text-xs hover:underline"
      >
        Sair da conta de Administrador
      </button>
    </div>
  );
}