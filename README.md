
# Lista de presentes de casamento - Next.js + Supabase

Este projeto é uma aplicação para reserva de presentes de casamento, com frontend Next.js, backend Supabase e pronto para deploy na Vercel.

## Funcionalidades
- Visual limpo, responsivo, paleta preto/branco/cinza
- Lista de presentes disponíveis
- Reserva de presente por nome e telefone (sem cadastro/login)
- Consulta de reservas já feitas

## Como rodar localmente
1. Instale as dependências:
	```
	npm install
	```
2. Configure as variáveis de ambiente:
	- Crie um arquivo `.env.local` na raiz com:
	  ```
	  NEXT_PUBLIC_SUPABASE_URL=URL_DO_SUPABASE
	  NEXT_PUBLIC_SUPABASE_ANON_KEY=CHAVE_ANON_SUPABASE
	  ```
3. Rode o projeto:
	```
	npm run dev
	```

## Deploy
- Pronto para deploy na Vercel (importar repositório, definir variáveis de ambiente).

## Estrutura principal
- `src/app/page.tsx`: Página principal com lista, reserva e consulta
- `src/lib/supabaseClient.ts`: Cliente Supabase

---

> Substitua os valores de Supabase no `.env.local` antes de rodar.
