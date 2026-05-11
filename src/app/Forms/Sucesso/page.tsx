'use client';
import Link from 'next/link';

export default function SucessoPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pt-32 p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md text-center border-t-8 border-green-600">
        <div className="text-6xl mb-4 text-green-600">✅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Envio Concluído!</h1>
        <p className="text-gray-600 mb-8">
          Todas as avaliações de fluxo foram registradas com sucesso no sistema.
        </p>
        
        <Link 
          href="/Forms" 
          className="block w-full bg-green-700 text-white py-3 rounded-md font-bold hover:bg-green-800 transition shadow-md"
        >
          VOLTAR AO INÍCIO
        </Link>
      </div>
    </div>
  );
}