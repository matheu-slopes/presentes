import { gifts } from "@/lib/gifts";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-black dark:text-white font-sans">
      <main className="w-full max-w-2xl p-6 flex flex-col gap-10">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Lista de Presentes de Casamento</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">Reserve um presente especial para os noivos</p>
        </header>
        {/* Lista de presentes */}
        <section id="gift-list" className="bg-gray-100 dark:bg-zinc-900 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">Presentes disponíveis</h2>
          <ul className="flex flex-col gap-3">
            {gifts.map((gift) => (
              <li key={gift.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white dark:bg-zinc-800 rounded p-3 border border-zinc-200 dark:border-zinc-700">
                <div>
                  <span className="font-medium">{gift.name}</span>
                  <span className="block text-sm text-zinc-500 dark:text-zinc-400">{gift.description}</span>
                </div>
                <span className={`mt-2 sm:mt-0 text-xs px-2 py-1 rounded-full font-semibold ${gift.reserved ? 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                  {gift.reserved ? 'Reservado' : 'Disponível'}
                </span>
              </li>
            ))}
          </ul>
        </section>
        {/* Reserva */}
        <section id="reservation" className="bg-gray-100 dark:bg-zinc-900 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">Reservar presente</h2>
          <form className="flex flex-col gap-4" /* onSubmit={handleReserve} */>
            <input
              type="text"
              name="name"
              placeholder="Seu nome"
              className="rounded border border-zinc-300 dark:border-zinc-700 p-2 bg-white dark:bg-zinc-800 text-black dark:text-white"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Telefone (WhatsApp)"
              className="rounded border border-zinc-300 dark:border-zinc-700 p-2 bg-white dark:bg-zinc-800 text-black dark:text-white"
              required
            />
            <select
              name="gift"
              className="rounded border border-zinc-300 dark:border-zinc-700 p-2 bg-white dark:bg-zinc-800 text-black dark:text-white"
              required
            >
              <option value="">Selecione o presente</option>
              {gifts.filter(g => !g.reserved).map(gift => (
                <option key={gift.id} value={gift.id}>{gift.name}</option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-black text-white dark:bg-white dark:text-black rounded p-2 font-semibold hover:opacity-90 transition"
              disabled
            >
              Reservar (em breve)
            </button>
          </form>
        </section>
        {/* Consulta de reservas */}
        <section id="consult" className="bg-gray-100 dark:bg-zinc-900 rounded-lg p-6 shadow">
          <h2 className="text-2xl font-semibold mb-4">Consultar reservas</h2>
          <ul className="flex flex-col gap-2">
            {/* Exemplo estático, depois integrar Supabase */}
            <li className="flex justify-between items-center bg-white dark:bg-zinc-800 rounded p-2 border border-zinc-200 dark:border-zinc-700">
              <span className="font-medium">Jogo de Panelas</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Reservado por Ana (11 99999-9999)</span>
            </li>
            <li className="flex justify-between items-center bg-white dark:bg-zinc-800 rounded p-2 border border-zinc-200 dark:border-zinc-700">
              <span className="font-medium">Aparelho de Jantar</span>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Reservado por João (21 98888-8888)</span>
            </li>
          </ul>
          <div className="text-xs text-gray-400 mt-2">(Em breve: dados reais do Supabase)</div>
        </section>
      </main>
    </div>
  );
}
