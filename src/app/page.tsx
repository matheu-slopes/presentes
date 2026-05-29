"use client";



import {
  Utensils, GlassWater, Coffee, CookingPot, Soup, SlidersHorizontal, Brush, ChefHat, ForkKnife, CupSoda, Salad, Scissors, Pizza, CakeSlice, Trash2, Ruler, Box, EggFried, Wine, Thermometer, MoreHorizontal
} from "lucide-react";

import React, { useState } from "react";

import { supabase } from "../lib/supabaseClient";

const giftIcons: Record<string, React.ReactNode> = {
  "Jogo de talheres": <Utensils size={40} />,
  "Jogo de copos": <GlassWater size={40} />,
  "Jogo de pratos": <EggFried size={40} />,
  "Jogo de xícaras": <Coffee size={40} />,
  "Jogo de panelas (para fogão de indução)": <CookingPot size={40} />,
  "Colheres de silicone para cozinhar": <Soup size={40} />,
  "Concha de silicone": <Soup size={40} />,
  "Escumadeira de silicone": <SlidersHorizontal size={40} />,
  "Pincel de silicone": <Brush size={40} />,
  "Fuet": <ChefHat size={40} />,
  "Jogo de facas": <ForkKnife size={40} />,
  "Travessas de vidro": <Box size={40} />,
  "Jogo de taças": <Wine size={40} />,
  "Tesoura de cozinha": <Scissors size={40} />,
  "Cortador de pizza": <Pizza size={40} />,
  "Boleira": <CakeSlice size={40} />,
  "Lixo de cozinha (com dois cestos)": <Trash2 size={40} />,
  "Copo medidor": <Ruler size={40} />,
  "Potes para sobremesa": <EggFried size={40} />,
  "Saladeira": <Salad size={40} />,
};

const giftsByCategory = [
  {
    category: "Lista de presentes",
    items: [
      "Jogo de talheres",
      "Jogo de copos",
      "Jogo de pratos",
      "Jogo de xícaras",
      "Jogo de panelas (para fogão de indução)",
      "Colheres de silicone para cozinhar",
      "Concha de silicone",
      "Escumadeira de silicone",
      "Pincel de silicone",
      "Fuet",
      "Jogo de facas",
      "Travessas de vidro",
      "Tábua para corte de vidro",
      "Porta temperos",
      "Potes multiuso de vidro",
      "Ralador",
      "Kit peneiras de alumínio",
      "Escorredor de louça",
      "Escorredor de macarrão",
      "Amassador de batata",
      "Panos de prato",
      "Forma para bolo com furo",
      "Jarra de suco",
      "Boleira",
      "Porta detergente e esponja",
      "Lixo de cozinha (com dois cestos)",
      "Frigideira (para fogão de indução)",
      "Centrífuga/secador de salada",
      "Porta frios",
      "Colher de sorvete",
      "Prendedores",
      "Tesoura de cozinha",
      "Processador de alho",
      "Copo medidor",
      "Pá de lixo, rodo e vassoura",
      "Pegador de macarrão",
      "Potes para mantimentos (arroz, feijão, macarrão etc)",
      "Potes para sobremesa",
      "Abridor de lata",
      "Cortador de pizza",
      "Espátula para bolo",
      "Luva térmica para forno",
      "Funil",
      "Rodinho de pia",
      "Afiador de faca",
      "Descanso de panela",
      "Jogo americano (sousplat)",
      "Jogo de taças",
      "Toalha de mesa",
      "Balde dobrável",
    ],
  },
];

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function downloadICS(items: string[]) {
  const dtStart = "20260613T180000Z";
  const dtEnd = "20260613T210000Z";
  const description = `Venha celebrar conosco!\n\nSeus presentes reservados:\n- ${items.join('\n- ')}`;
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Casamento Matheus & Lívia\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nLOCATION:Rua Dr Alves do Banho, 796 – São Bernardo, Campinas/SP – Salão de Festas Torre 1\nDESCRIPTION:${description}\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "casamento-matheus-livia.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function Home() {
  // ...existing code...
  const [step, setStep] = useState<"welcome"|"name"|"gifts"|"review">("welcome");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState<string[]>([]); // Reservas já confirmadas
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Excluir reserva de presente
  async function handleDeleteReservation(gift: string) {
    if (!userId) return;
    setLoading(true);
    const { error } = await supabase
      .from("reservations")
      .delete()
      .eq("user_id", userId)
      .eq("gift", gift);
    if (error) {
      alert("Erro ao excluir reserva: " + error.message);
    } else {
      setConfirmed(confirmed.filter(item => item !== gift));
    }
    setLoading(false);
  }

  // Validação de telefone brasileiro (com ou sem DDD, 10 ou 11 dígitos, só números)
  function isValidPhone(phone: string) {
    const cleaned = phone.replace(/\D/g, "");
    // Aceita 10 ou 11 dígitos (com DDD)
    return /^(?:[1-9]{2})?(?:9\d{8}|[2-9]\d{7})$/.test(cleaned);
  }

  // Validação de nome: pelo menos 2 palavras, sem números
  function isValidName(name: string) {
    const parts = name.trim().split(/\s+/);
    if (parts.length < 2) return false;
    if (/\d/.test(name)) return false;
    return true;
  }

  function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPhoneError("");
    if (!isValidPhone(phone)) {
      setPhoneError("Digite um telefone válido (com DDD e 9 dígitos, só números).");
      return;
    }
    setLoading(true);
    supabase
      .from("users")
      .select("id, name")
      .eq("phone", phone)
      .single()
      .then(async ({ data, error }) => {
        if (error) {
          // PGRST116 indica que o usuário não foi encontrado (zero linhas). Isso é esperado.
          if (error.code === "PGRST116") {
            setStep("name");
          } else {
            console.error("Erro do Supabase:", error);
            setPhoneError(`Erro ao conectar ao banco de dados: ${error.message}. Verifique a URL do Supabase no arquivo .env.local.`);
          }
        } else if (data) {
          setName(data.name);
          setUserId(data.id);
          try {
            // Buscar reservas desse usuário
            const { data: reservas, error: resError } = await supabase
              .from("reservations")
              .select("gift")
              .eq("user_id", data.id);
            if (resError) {
              setPhoneError(`Erro ao buscar reservas: ${resError.message}`);
            } else {
              setConfirmed(reservas ? reservas.map((r: any) => r.gift) : []);
              setStep("gifts");
            }
          } catch (err: any) {
            setPhoneError(`Erro de conexão ao buscar reservas: ${err.message}`);
          }
        }
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Erro de rede no Supabase:", err);
        setPhoneError(`Falha de conexão com o servidor: ${err.message || err}. Por favor, verifique sua conexão com a internet ou as chaves do Supabase.`);
        setLoading(false);
      });
  }

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameError("");
    if (!isValidName(name)) {
      setNameError("Digite nome e sobrenome, sem números.");
      return;
    }
    setLoading(true);
    supabase
      .from("users")
      .insert([{ phone, name }])
      .select()
      .single()
      .then(async ({ data, error }) => {
        if (error) {
          console.error("Erro ao salvar usuário:", error);
          setNameError(`Erro ao salvar usuário: ${error.message}`);
        } else if (data) {
          setUserId(data.id);
          setStep("gifts");
        } else {
          setNameError("Erro desconhecido ao salvar usuário.");
        }
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("Erro inesperado ao salvar usuário:", err);
        setNameError(`Falha de rede ao salvar usuário: ${err.message || err}`);
        setLoading(false);
      });
  }

  function handleGiftClick(item: string) {
    // Aqui faria reserva no Supabase, com concorrência
    if (!selected.includes(item)) setSelected([...selected, item]);
    else setSelected(selected.filter(i => i !== item));
  }

  function handleConfirm() {
    if (!userId) return;
    setLoading(true);
    // Salva cada reserva nova
    Promise.all(
      selected.map(item =>
        supabase.from("reservations").insert([{ user_id: userId, gift: item }])
      )
    ).then(async (results) => {
      const firstError = results.find(r => r.error);
      if (firstError) {
        alert(`Erro ao reservar presente: ${firstError.error?.message}`);
        setLoading(false);
        return;
      }

      try {
        // Buscar reservas atualizadas
        const { data: reservas, error: resError } = await supabase
          .from("reservations")
          .select("gift")
          .eq("user_id", userId);
        if (resError) {
          alert(`Erro ao atualizar reservas: ${resError.message}`);
        } else {
          setConfirmed(reservas ? reservas.map((r: any) => r.gift) : []);
          setSelected([]);
          setStep("gifts");
        }
      } catch (err: any) {
        alert(`Erro de rede ao buscar reservas atualizadas: ${err.message}`);
      }
      setLoading(false);
    }).catch(err => {
      alert(`Erro ao salvar reservas: ${err.message}`);
      setLoading(false);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 text-black dark:text-white font-sans relative overflow-hidden">
      {/* Detalhe decorativo: imagem utensílios */}
      {step === "welcome" && (
        <img
          src="/utensilios-cozinha.png"
          alt="Utensílios de cozinha"
          className="pointer-events-none select-none opacity-20 absolute right-0 bottom-0 w-64 max-w-[60vw] md:w-80 md:max-w-[40vw] lg:w-96 lg:max-w-[30vw] z-0"
          aria-hidden="true"
        />
      )}
      <main className="w-full max-w-lg sm:max-w-2xl px-4 sm:px-8 py-8 flex flex-col gap-12 items-center justify-center mx-auto relative z-10">
        {step === "welcome" && (
          <header className="mb-8 text-center flex flex-col items-center gap-4 w-full">
            {/* Imagem decorativa centralizada */}
            <img
              src="/utensilios-cozinha.png"
              alt="Utensílios de cozinha"
              className="mx-auto mb-2 w-32 sm:w-40 md:w-48 lg:w-56 opacity-80 drop-shadow-md"
              aria-hidden="true"
            />
            <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white drop-shadow-sm">Chá dos Noivos</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-300 mt-1 font-medium">Reserve um presente especial para Matheus & Lívia</p>
            <div className="mt-4 bg-white/80 dark:bg-zinc-900/80 shadow-lg rounded-2xl p-6 flex flex-col items-center gap-3 w-full max-w-md border border-zinc-200 dark:border-zinc-700">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 items-center justify-center text-lg">
                <span className="font-semibold">📅 13 de Junho</span>
                <span className="font-semibold">⏰ 15H</span>
              </div>
              <span className="block font-medium mt-1 text-base text-zinc-700 dark:text-zinc-200">📍 Rua Dr Alves do Banho, 796 – São Bernardo, Campinas/SP – Salão de Festas Torre 1</span>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Rua+Dr+Alves+do+Banho%2C+796%2C+Campinas%2C+SP"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition"
              >
                Ver no Maps
              </a>
            </div>
            <form className="flex flex-col gap-4 items-center mt-8 w-full max-w-xs" onSubmit={handlePhoneSubmit}>
              <label className="text-lg font-medium">Digite seu telefone para começar</label>
              <input
                type="tel"
                value={phone}
                onChange={e => {
                  const cleaned = e.target.value.replace(/\D/g, "").slice(0, 11);
                  setPhone(cleaned);
                }}
                maxLength={15}
                placeholder="Telefone (WhatsApp)"
                className="rounded border border-zinc-300 dark:border-zinc-700 p-2 bg-white dark:bg-zinc-800 text-black dark:text-white w-64 text-center"
                required
              />
              {phoneError && <span className="text-red-500 text-sm text-center max-w-xs">{phoneError}</span>}
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white dark:bg-white dark:text-black rounded p-2 font-semibold hover:opacity-90 transition w-64 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Carregando..." : "Avançar"}
              </button>
            </form>
          </header>
        )}

        {step === "name" && (
          <form className="flex flex-col gap-4 items-center w-full max-w-xs mx-auto" onSubmit={handleNameSubmit}>
            <label className="text-lg font-medium">Qual seu nome completo?</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Nome completo"
              className="rounded border border-zinc-300 dark:border-zinc-700 p-2 bg-white dark:bg-zinc-800 text-black dark:text-white w-64 text-center"
              required
            />
            {nameError && <span className="text-red-500 text-sm text-center max-w-xs">{nameError}</span>}
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white dark:bg-white dark:text-black rounded p-2 font-semibold hover:opacity-90 transition w-64 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Carregando..." : "Entrar"}
            </button>
          </form>
        )}

        {step === "gifts" && (
          <div className="w-full flex flex-col items-center justify-center relative">
            {/* Banner bonito para adicionar ao calendário */}
            <div className="w-full flex justify-center mb-8">
              <div className="flex items-center gap-4 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 border border-blue-300 rounded-2xl px-6 py-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <div className="flex flex-col">
                  <span className="font-bold text-blue-900 text-lg mb-1">Não esqueça de adicionar o evento ao seu calendário!</span>
                  <span className="text-blue-800 text-sm">Receba um lembrete no dia do evento no seu app favorito.</span>
                </div>
                <button
                  type="button"
                  className="ml-4 bg-blue-600 text-white rounded-xl px-6 py-2 font-bold text-base shadow-lg hover:bg-blue-700 transition-all border-2 border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => downloadICS(confirmed.length > 0 ? confirmed : [])}
                  title="Adicionar lembrete do evento ao seu calendário"
                >
                  Adicionar ao calendário
                </button>
              </div>
            </div>
            {giftsByCategory.map(cat => (
              <section key={cat.category} className="mb-8 w-full">
                <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100 text-center">{cat.category}</h2>
                {confirmed.length > 0 && (
                  <>
                    <div className="mb-2 text-base font-semibold text-blue-700 dark:text-blue-300">Reservado por você</div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
                      {cat.items.filter(item => confirmed.includes(item)).map(item => (
                        <li
                          key={item}
                          className="flex items-center gap-4 rounded-2xl p-4 border border-blue-400 bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 shadow-sm opacity-100 group transition-all"
                        >
                          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-700">
                            {giftIcons[item] || <MoreHorizontal size={32} />}
                          </span>
                          <span className="text-lg font-medium">{item}</span>
                          <span className="ml-2 text-xs font-semibold">(Reservado por você)</span>
                          <button
                            className="ml-4 p-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                            style={{ lineHeight: 0 }}
                            disabled={loading}
                            title="Excluir reserva"
                            onClick={() => handleDeleteReservation(item)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <div className="mb-2 text-base font-semibold text-zinc-700 dark:text-zinc-200">Itens disponíveis</div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {cat.items.filter(item => !confirmed.includes(item)).map(item => (
                    <li
                      key={item}
                      className={`flex items-center gap-4 rounded-2xl p-4 border shadow-sm cursor-pointer select-none transition-all duration-150 ${selected.includes(item) ? "bg-green-100 text-green-900 border-green-400 dark:bg-green-900 dark:text-green-100" : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:shadow-md hover:scale-[1.03] hover:bg-zinc-100 dark:hover:bg-zinc-700"}`}
                      onClick={() => handleGiftClick(item)}
                    >
                      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-700">
                        {giftIcons[item] || <MoreHorizontal size={32} />}
                      </span>
                      <span className="text-lg font-medium">{item}</span>
                      {selected.includes(item) && <span className="ml-2 text-xs font-semibold">(Selecionado)</span>}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {selected.length > 0 && step === "gifts" && (
              <div className="fixed bottom-6 left-0 w-full flex justify-center z-50">
                <button
                  className="bg-green-600 text-white rounded-lg px-8 py-3 font-bold text-lg shadow-lg hover:bg-green-700 transition"
                  style={{maxWidth: 400, width: '90%'}} 
                  onClick={() => setStep("review")}
                >
                  Confirmar reserva
                </button>
              </div>
            )}
          </div>
        )}

        {step === "review" && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center gap-8">
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-white text-center">Revisar presentes selecionados</h2>
              <ul className="list-disc ml-6 text-lg w-full">
                {selected.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="flex gap-4 w-full justify-center">
                <button
                  disabled={loading}
                  className="bg-green-600 text-white rounded-lg px-6 py-2 font-semibold text-lg shadow hover:bg-green-700 transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    handleConfirm();
                  }}
                >
                  {loading ? "Carregando..." : "Confirmar reserva"}
                </button>
                <button
                  disabled={loading}
                  className="bg-gray-400 text-white rounded-lg px-6 py-2 font-semibold text-lg shadow hover:bg-gray-500 transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setStep("gifts")}
                >
                  Voltar
                </button>
                <button
                  type="button"
                  className="bg-blue-600 text-white rounded-lg px-6 py-2 font-semibold text-lg shadow hover:bg-blue-700 transition w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => downloadICS(selected)}
                  disabled={selected.length === 0}
                  title="Adicionar ao calendário"
                >
                  Adicionar ao calendário
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
export default Home;
