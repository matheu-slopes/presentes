-- Tabela de usuários
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  phone varchar not null unique,
  name varchar not null,
  created_at timestamp with time zone default now()
);

 create table if not exists reservations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  gift varchar not null,
  created_at timestamp with time zone default now(),
  unique(user_id, gift)
);
