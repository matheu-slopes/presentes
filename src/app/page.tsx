"use client";

import React, { useState } from "react";
import {
  Utensils,
  GlassWater,
  Coffee,
  CookingPot,
  Soup,
  SlidersHorizontal,
  Brush,
  ChefHat,
  ForkKnife,
  CupSoda,
  Salad,
  Scissors,
  Pizza,
  CakeSlice,
  Trash2,
  Ruler,
  Box,
  EggFried,
  Wine,
  Thermometer,
  MoreHorizontal
} from "lucide-react";
// Função para gerar slug do nome do item
function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Estrutura de presentes por categoria

// Mapeamento de ícones para itens principais
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
  // ...adicione mais conforme desejar
};
const giftsByCategory = [
  {
    category: "Itens de Cozinha",
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


function downloadICS() {
  // Evento: 13 de Junho de 2026, 15h, 3h de duração
  const dtStart = "20260613T180000Z"; // 15h BRT = 18h UTC
  const dtEnd = "20260613T210000Z";
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:Casamento Matheus & Lívia\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nLOCATION:Rua Dr Alves do Banho, 796 – São Bernardo, Campinas/SP – Salão de Festas Torre 1\nDESCRIPTION:Venha celebrar conosco!\nEND:VEVENT\nEND:VCALENDAR`;
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

export default function Home() {
  const [step, setStep] = useState<"welcome"|"name"|"gifts"|"review">("welcome");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState<string[]>([]); // Reservas já confirmadas
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");

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
    // Aqui faria consulta ao Supabase
    // Simula: se telefone começa com 9, já tem cadastro
    if (phone.replace(/\D/g, "").startsWith("9")) {
      setName("Usuário Exemplo");
      setConfirmed(["Jogo de talheres", "Jogo de copos"]);
      setStep("gifts");
    } else {
      setStep("name");
    }
  }

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameError("");
    if (!isValidName(name)) {
      setNameError("Digite nome e sobrenome, sem números.");
      return;
    }
    // Aqui salvaria no Supabase
    setStep("gifts");
  }

  function handleGiftClick(item: string) {
    // Aqui faria reserva no Supabase, com concorrência
    if (!selected.includes(item)) setSelected([...selected, item]);
    else setSelected(selected.filter(i => i !== item));
  }

  function handleConfirm() {
    // Aqui faria a reserva definitiva no Supabase
    setConfirmed(selected);
    setSelected([]);
    setStep("gifts");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 text-black dark:text-white font-sans">
      <main className="w-full max-w-lg sm:max-w-2xl px-4 sm:px-8 py-8 flex flex-col gap-12 items-center justify-center mx-auto">
        {/* header duplicado removido */}
        {/* header duplicado removido: só aparece uma vez no topo */}

            {step === "welcome" && (
              <header className="mb-8 text-center flex flex-col items-center gap-4 w-full">
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
                      // Aceita só números e limita a 11 dígitos
                      const cleaned = e.target.value.replace(/\D/g, "").slice(0, 11);
                      setPhone(cleaned);
                    }}
                    maxLength={15}
                    placeholder="Telefone (WhatsApp)"
                    className="rounded border border-zinc-300 dark:border-zinc-700 p-2 bg-white dark:bg-zinc-800 text-black dark:text-white w-64 text-center"
                    required
                  />
                  {phoneError && <span className="text-red-500 text-sm">{phoneError}</span>}
                  <button type="submit" className="bg-black text-white dark:bg-white dark:text-black rounded p-2 font-semibold hover:opacity-90 transition w-64">Avançar</button>
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
            {nameError && <span className="text-red-500 text-sm">{nameError}</span>}
            <button type="submit" className="bg-black text-white dark:bg-white dark:text-black rounded p-2 font-semibold hover:opacity-90 transition w-64">Entrar</button>
          </form>
        )}

        {step === "gifts" && (
          <div className="w-full flex flex-col items-center justify-center">
            {giftsByCategory.map(cat => (
              <section key={cat.category} className="mb-8 w-full">
                <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-zinc-100 text-center">{cat.category}</h2>
                {/* Reservado por você */}
                {confirmed.length > 0 && (
                  <>
                    <div className="mb-2 text-base font-semibold text-blue-700 dark:text-blue-300">Reservado por você</div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
                      {cat.items.filter(item => confirmed.includes(item)).map(item => (
                        <li
                          key={item}
                          className="flex items-center gap-4 rounded-2xl p-4 border border-blue-400 bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 shadow-sm select-none opacity-100"
                          style={{ pointerEvents: 'none' }}
                        >
                          <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-200 dark:bg-zinc-700">
                            {giftIcons[item] || <MoreHorizontal size={32} />}
                          </span>
                          <span className="text-lg font-medium">{item}</span>
                          <span className="ml-2 text-xs font-semibold">(Reservado por você)</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {/* Itens disponíveis */}
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
            {/* Botão flutuante de confirmação de reserva */}
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
              <div className="flex gap-6 w-full justify-center">
                <button
                  className="bg-green-600 text-white rounded-lg px-6 py-2 font-semibold text-lg shadow hover:bg-green-700 transition w-full"
                  onClick={() => {
                    handleConfirm();
                    setStep("calendar");
                  }}
                >
                  Confirmar reserva
                </button>
                <button
                  className="bg-gray-400 text-white rounded-lg px-6 py-2 font-semibold text-lg shadow hover:bg-gray-500 transition w-full"
                  onClick={() => setStep("gifts")}
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        )}

                {/* ...existing code... */}
        {/* O bloco de reservas confirmadas e botão de calendário agora só aparece após confirmação, não na tela de seleção */}
      </main>
    </div>
  );
}
