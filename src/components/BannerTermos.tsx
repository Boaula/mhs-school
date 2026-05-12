'use client';
import { useState, useEffect, useMemo } from 'react';
import { GerenciadorBanner } from '@/lib/GerenciadorBanner';

export function BannerTermos({ aoAceitar, tempo = 10 }: { aoAceitar: () => void, tempo?: number }) {
  const [segundos, setSegundos] = useState(tempo);
  const [ativo, setAtivo] = useState(true);
  const logic = useMemo(() => new GerenciadorBanner(tempo), [tempo]);

  useEffect(() => {
    if (segundos > 0) {
      const timer = setInterval(() => setSegundos(s => s - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [segundos]);

  if (!ativo) return null;

return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border-t-8 border-green-600 my-8">
        <div className="p-8">
          <header className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">
              Diretrizes de Avaliação - Fluxo Pedagógico
            </h2>
            <p className="text-gray-500 text-sm mt-2">Leia atentamente os critérios antes de prosseguir</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Card SIM */}
            <div className="bg-green-50 p-5 rounded-xl border border-green-200">
              <h3 className="font-bold text-green-800 flex items-center gap-2 mb-3">
                ✅ Segue o Fluxo (SIM)
              </h3>
              <ul className="text-sm text-green-900 space-y-2 leading-relaxed">
                <li>• <strong>Desempenho:</strong> Realiza atividades com adaptações ou apoio do AEE.</li>
                <li>• <strong>Progresso:</strong> Demonstra evolução contínua em seu próprio ritmo.</li>
                <li>• <strong>Autonomia:</strong> Participa do processo, mesmo com mediação constante.</li>
              </ul>
            </div>

            {/* Card NÃO */}
            <div className="bg-red-50 p-5 rounded-xl border border-red-200">
              <h3 className="font-bold text-red-800 flex items-center gap-2 mb-3">
                ❌ Não Segue o Fluxo (NÃO)
              </h3>
              <ul className="text-sm text-red-900 space-y-2 leading-relaxed">
                <li>• <strong>Impedimentos:</strong> Sem avanço apesar de todo suporte pedagógico.</li>
                <li>• <strong>Barreiras:</strong> Dificuldade persiste mesmo com auxílio direto de monitor/AEE.</li>
                <li>• <strong>Descompasso:</strong> Conteúdo da turma não atende às necessidades mínimas.</li>
              </ul>
            </div>
          </div>

          {/* Regras de Justificativa */}
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 mb-8">
            <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2 uppercase text-sm">
              ⚠️ Regra de Preenchimento Obrigatório
            </h3>
            <p className="text-sm text-amber-900 mb-3 italic">
              Para cada marcação "NÃO", a justificativa deve conter:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-amber-800">
              <div className="p-2 bg-white/50 rounded border border-amber-100">
                <strong>1. Evidência:</strong> Confirmar oferta de atividades adaptadas.
              </div>
              <div className="p-2 bg-white/50 rounded border border-amber-100">
                <strong>2. Metodologia:</strong> Relatar uso de linguagem simplificada/individualizada.
              </div>
              <div className="p-2 bg-white/50 rounded border border-amber-100">
                <strong>3. Apoios:</strong> Descrever atuação do auxiliar/AEE no caso.
              </div>
            </div>
          </div>

          {/* Botão de Ação */}
          <button
            disabled={segundos > 0}
            onClick={() => { setAtivo(false); aoAceitar(); }}
            className={`w-full py-4 rounded-xl font-bold transition-all text-lg shadow-xl ${
              segundos > 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700 hover:scale-[1.02] active:scale-95'
            }`}
          >
            {segundos > 0 ? `Aguarde para confirmar (${segundos}s)` : 'LI E COMPREENDO AS DIRETRIZES'}
          </button>
        </div>
      </div>
    </div>
  );
}