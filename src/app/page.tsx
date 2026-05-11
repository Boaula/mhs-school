import Image from "next/image";
import EmentasList from "@/components/EmentasList";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-green-900 font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:justify-between w-full max-w-4xl mx-auto p-4">
          <Image
            src="/Logo02.png"
            alt="Logo do Projeto"
            width={100}
            height={20}
            priority
            className="object-contain"
          />
          
          <Image
            src="/Image/IFMT-Campo-Verde.jpeg"
            alt="Campus IFMT Campo Verde"
            width={500}
            height={100}
            priority
            className="rounded-lg shadow-md object-cover"
          />
        </div>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            IFMT - Campus Campo Verde
          </h1>
          <h2 className="max-w-md text-lg leading-8 text-zinc-00 dark:text-zinc-400">
            Formação profissional de excelência no coração de Mato Grosso.
          </h2>

          <section className="w-full px-4 pb-20">
            <EmentasList />
          </section>

          <h1 className="max-w-md text-lg leading-8 text-zinc-900 dark:text-zinc-200">
            Sobre o Polo Campo Verde
          </h1>
          <h2 className="max-w-md text-lg leading-8 text-zinc-00 dark:text-zinc-400">
            O Campus Campo Verde do Instituto Federal de Mato Grosso é referência em ensino público, 
            gratuito e de qualidade. Atuamos no desenvolvimento regional através da educação, pesquisa e extensão, 
            preparando cidadãos para os desafios do mercado de trabalho e da inovação tecnológica.
          </h2>

          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
           
           
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
