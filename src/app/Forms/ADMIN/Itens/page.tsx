'use client';

import { useState, useEffect, useMemo } from 'react';
import { GerenciadorItens } from '@/lib/GerenciadorItens';
import Link from 'next/link';

export default function GerenciarItensPage() {
  const [itens, setItens] = useState<any[]>([]);
  const [novoItem, setNovoItem] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [textoEdicao, setTextoEdicao] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Instância da classe via useMemo para evitar recriações desnecessárias
  const gerenciador = useMemo(() => new GerenciadorItens(), []);

  const carregarDados = async () => {
    setCarregando(true);
    const dados = await gerenciador.buscarTodos();
    setItens(dados);
    setCarregando(false);
  };

  useEffect(() => { carregarDados(); }, [gerenciador]);

  const handleAdicionar = async (e: React.FormEvent) => {
    e.preventDefault();
    await gerenciador.adicionar(novoItem);
    setNovoItem('');
    carregarDados();
  };

  const handleExcluir = async (id: string) => {
    if (confirm("Deseja realmente excluir este item?")) {
      await gerenciador.excluir(id);
      carregarDados();
    }
  };

  const handleSalvarEdicao = async (id: string) => {
    await gerenciador.atualizar(id, textoEdicao);
    setEditandoId(null);
    carregarDados();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* CABEÇALHO DA PÁGINA */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gerenciar Itens</h1>
            <p className="text-gray-600">Adicione, edite ou remova itens do formulário</p>
          </div>
          <Link href="/admin" className="text-blue-600 hover:underline font-medium">
            ← Voltar ao Painel
          </Link>
        </header>

        {/* FORMULÁRIO DE ADIÇÃO */}
        <form onSubmit={handleAdicionar} className="bg-white p-6 rounded-lg shadow-md mb-8 flex gap-4">
          <input
            type="text"
            placeholder="Descreva o novo item..."
            className="flex-1 p-3 border rounded-md outline-none focus:ring-2 focus:ring-green-500 text-black"
            value={novoItem}
            onChange={(e) => setNovoItem(e.target.value)}
            required
          />
          <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-md font-bold hover:bg-green-700 transition">
            CADASTRAR ITEM
          </button>
        </form>

        {/* LISTAGEM */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-bold text-gray-700">Descrição do Item</th>
                <th className="p-4 font-bold text-gray-700 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {carregando ? (
                <tr><td colSpan={2} className="p-10 text-center text-gray-500">Carregando itens...</td></tr>
              ) : itens.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="p-4">
                    {editandoId === item.id ? (
                      <input
                        className="w-full p-2 border border-blue-500 rounded text-black outline-none"
                        value={textoEdicao}
                        onChange={(e) => setTextoEdicao(e.target.value)}
                        autoFocus
                      />
                    ) : (
                      <span className="text-gray-800">{item.descricao}</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    {editandoId === item.id ? (
                      <>
                        <button onClick={() => handleSalvarEdicao(item.id)} className="text-green-600 font-bold hover:text-green-800">SALVAR</button>
                        <button onClick={() => setEditandoId(null)} className="text-gray-400 hover:text-gray-600">CANCELAR</button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setEditandoId(item.id); setTextoEdicao(item.descricao); }}
                          className="text-blue-500 hover:text-blue-700 font-medium"
                        >
                          EDITAR
                        </button>
                        <button 
                          onClick={() => handleExcluir(item.id)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          EXCLUIR
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!carregando && itens.length === 0 && (
            <p className="p-10 text-center text-gray-400">Nenhum item cadastrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}