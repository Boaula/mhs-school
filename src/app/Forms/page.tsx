'use client';

import { useState, useEffect } from 'react';
import { db, auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, User } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { RespostaFormulario } from '@/lib/GerenciadorRespostas';
import { BannerTermos } from '@/components/BannerTermos';

export default function ProfessorPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [materia, setMateria] = useState('');
  const [status, setStatus] = useState('');
  const [respostas, setRespostas] = useState<Record<string, any>>({}); // Armazenará { "ID_DO_ITEM": { segue: true, justificativa: "" } }
  const [itens, setItens] = useState<any[]>([]); 
  const [docId, setDocId] = useState<string | null>(null); // Guarda o ID da resposta anterior
  const [podeInteragir, setPodeInteragir] = useState(false); // Bloqueia o fundo

// Instanciamos o objeto da nossa Classe
  const gerenciador = new RespostaFormulario(itens, respostas);

  useEffect(() => {
    const carregarDadosEAnteriores = async () => {
      if (user) {
        // 1. Busca os itens cadastrados pelo ADM
        const queryItens = await getDocs(collection(db, "itens-para-formulario"));
        const listaItens = queryItens.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItens(listaItens);

        // 2. Busca se este professor JÁ RESPONDEU (Filtro por e-mail)
        const q = query(collection(db, "responder-formulario"), where("professorEmail", "==", user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Se já respondeu, pega o primeiro documento encontrado
          const docExistente = querySnapshot.docs[0];
          setDocId(docExistente.id);
          setRespostas(docExistente.data().respostas); // Carrega o objeto de respostas salvo
          setMateria(docExistente.data().materia || ''); // Carrega a matéria se já existir
        }
      }
    };
    carregarDadosEAnteriores();
  }, [user]);

  // Função para Login com Google
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;

      // Verificação do e-mail institucional
      if (email && !email.endsWith('@edu.mt.gov.br')) {
        await signOut(auth);
        alert("Acesso negado! Por favor, use sua conta institucional");
        return;
      }
      setUser(result.user);
    } catch (error: any) {
      console.error("Erro no login:", error);
      alert("Erro ao tentar logar: " + error.message);
    }
  };

  const atualizarResposta = (itemId: string, valor: boolean, descricao: string) => {
    // Chamamos o método do objeto
    const novasRespostas = gerenciador.definirResposta(itemId, valor, descricao);
    setRespostas(novasRespostas);
  };

  const atualizarJustificativa = (itemId: string, texto: string) => {
      const novasRespostas = gerenciador.definirJustificativa(itemId, texto);
      setRespostas(novasRespostas);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus('Salvando...');

      try {
        // A classe prepara os dados no formato correto
        const dadosParaSalvar = gerenciador.prepararParaSalvar(user, materia);

        if (docId) {
          await updateDoc(doc(db, "responder-formulario", docId), dadosParaSalvar);
        } else {
          await addDoc(collection(db, "responder-formulario"), dadosParaSalvar);
        }
        router.push('/Forms/Sucesso');
      } catch (error) {
        setStatus('Erro ao salvar.');
      }
    };
    // TELA DE LOGIN
    if (!user) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <div className="p-8 bg-white shadow-xl rounded-lg text-center border-t-4 border-green-600">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Portal do Professor</h1>
            <p className="text-gray-600 mb-6">Acesse com seu e-mail do IFMT para continuar</p>
            <button
              onClick={handleLogin}
              className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50 text-gray-700 font-semibold transition"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Entrar com Google
            </button>
          </div>
        </div>
      );
    }

  // TELA DO FORMULÁRIO (APÓS LOGIN)
 return (
  <>
  {/* O CONTEÚDO: Fica desfocado e bloqueado enquanto 'podeInteragir' for false */}
  <BannerTermos aoAceitar={() => setPodeInteragir(true)} tempo={10} />
    <div className={`transition-all duration-700 ${
      !podeInteragir ? 'blur-lg pointer-events-none opacity-50' : 'opacity-100'
    }`}></div>

    <div className="flex flex-col items-center p-6 bg-gray-50 min-h-screen pt-32"> {/* pt-32 resolve o problema de ficar muito para cima */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <header className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Professor Logado:</p>
            <p className="font-bold text-sm text-gray-700">{user?.email}</p>
          </div>
          <button 
            onClick={() => { signOut(auth); setUser(null); }} 
            className="text-red-500 text-xs font-semibold hover:text-red-700 transition"
          >
            SAIR
          </button>
        </header>

        {/* Altere o título abaixo para ficar mais genérico se quiser */}
        <h2 className="text-xl font-bold text-green-700 text-center">
          O item selecionado segue o fluxo?
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* matéria */}
          <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
            <label className="block text-sm font-bold text-green-800 mb-2">
              Sua Matéria / Disciplina:
            </label>
            <input
              type="text"
              required
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
              className="w-full p-3 border border-green-300 rounded-md outline-none focus:ring-2 focus:ring-green-500 text-black"
              placeholder="Ex: Geografia..."
            />
          </div>

          {itens.map((item) => (
            <div key={item.id} className="p-4 border-b-2 border-gray-100 space-y-4">
              <h3 className="text-gray-800 text-lg">{item.descricao}</h3>
              
              <div className="flex gap-4">
                {/* Opção SIM */}
                <div 
                  className={`flex flex-1 items-center justify-between p-3 border rounded-md cursor-pointer transition ${respostas[item.id]?.segue === true ? 'bg-green-50 border-green-500' : ''}`}
                  onClick={() => atualizarResposta(item.id, true, item.descricao)}
                >
                  <span className="text-sm text-green-700">Sim</span>
                  <input type="checkbox" checked={respostas[item.id]?.segue === true} readOnly className="accent-green-600" />
                </div>

                {/* Opção NÃO */}
                <div 
                  className={`flex flex-1 items-center justify-between p-3 border rounded-md cursor-pointer transition ${respostas[item.id]?.segue === false ? 'bg-red-50 border-red-500' : ''}`}
                  onClick={() => atualizarResposta(item.id, false, item.descricao)}
                >
                  <span className="text-sm text-yellow-600">Não</span>
                  <input type="checkbox" checked={respostas[item.id]?.segue === false} readOnly className="accent-red-600" />
                </div>
              </div>

              {/* Justificativa se for NÃO */}
              {respostas[item.id]?.segue === false && (
                <textarea
                  required
                  placeholder="Justificativa obrigatória..."
                  className="w-full p-2 border rounded bg-white text-black"
                  value={respostas[item.id]?.justificativa || ""}
                  onChange={(e) => atualizarJustificativa(item.id, e.target.value)}
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={Object.keys(respostas).length < itens.length} // BLOQUEIO: Só envia se respondeu todos
            className="w-full bg-green-700 text-white py-4 rounded-md font-bold disabled:bg-gray-300 transition shadow-lg"
          >
            ENVIAR TODAS AS AVALIAÇÕES ({Object.keys(respostas).length}/{itens.length})
          </button>
        </form>
      </div>
    </div>
  </>
  );
}