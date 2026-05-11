"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-green-950 border-b border-green-400/30 text-green-500 shadow-lg backdrop-blur-md">
      {/* LADO ESQUERDO: Logo */}
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity z-50">
        <Image 
          src="/Logo.png" 
          alt="Logo do IF"
          width={40} 
          height={40}
          priority
        />
        <span className="text-xl font-bold hidden xs:block">
          IFMT
        </span>
      </Link>

      {/* BOTÃO HAMBÚRGUER (Aparece apenas no Mobile) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col gap-1.5 z-50 md:hidden"
        aria-label="Menu"
      >
        <div className={`w-6 h-0.5 bg-green-400 transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <div className={`w-6 h-0.5 bg-green-400 transition-all ${isOpen ? 'opacity-0' : ''}`} />
        <div className={`w-6 h-0.5 bg-green-400 transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* LINKS DE NAVEGAÇÃO */}
      <div className={`
        fixed inset-0 bg-green-950 flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:static md:flex-row md:bg-transparent md:translate-x-0
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <Link href="/" onClick={() => setIsOpen(false)} className="text-lg md:text-sm font-medium hover:text-green-300 transition-colors">
          Cursos
        </Link>
        <Link href="/" onClick={() => setIsOpen(false)} className="text-lg md:text-sm font-medium hover:text-green-300 transition-colors">
          Sobre
        </Link>
        <Link href="/" onClick={() => setIsOpen(false)} className="text-lg md:text-sm font-medium hover:text-green-300 transition-colors">
          Notícias
        </Link>
        <Link href="/" onClick={() => setIsOpen(false)} className="text-lg md:text-sm font-medium hover:text-green-300 transition-colors">
          Editais
        </Link>
        
        <Link 
          href="/login" 
          onClick={() => setIsOpen(false)}
          className="rounded-lg bg-white/10 px-6 py-2 text-sm font-semibold text-white transition-all hover:bg-white/20 active:scale-95"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}