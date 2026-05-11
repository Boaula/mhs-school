"use client"; // Adicione esta linha aqui!
import { useEffect, useState } from 'react';

interface Ementa {
  id: number;
  materia: string;
  ementa: string;
}

export default function EmentasList() {
  const [dados, setDados] = useState<Ementa[]>([]);

useEffect(() => {
    // O Date.now() impede que o navegador use uma versão antiga/vazia do arquivo
    fetch(`/dados/ementas.json?v=${Date.now()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Não encontrou o arquivo");
        return res.json();
      })
      .then((data) => setDados(data))
      .catch((err) => console.error("Erro no 'DB':", err));
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <h2 className="text-2xl font-bold text-green-900 mb-4 dark:text-green-400">
        Ementas de ADS - IFMT
      </h2>
      
      {/* Container com scroll: h-80 equivale a +/- 5 itens dependendo do padding */}
      <div className="h-96 overflow-y-auto pr-2 custom-scrollbar border border-green-800/20 rounded-xl shadow-inner bg-zinc-50 dark:bg-zinc-950">
        <ul className="flex flex-col gap-3 p-2">
          {dados.map((item) => (
            <li 
              key={item.id} 
              className="p-4 rounded-lg bg-green-900 text-white border-l-4 border-green-500 hover:bg-green-800 transition-colors"
            >
              <h3 className="font-bold text-green-300">{item.materia}</h3>
              <p className="text-sm text-green-100/80 mt-1">{item.ementa}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}