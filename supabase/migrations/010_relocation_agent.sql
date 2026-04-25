-- Relocation decision agent
-- Two tables and one RPC:
--   1. corpus_chunks: vector index over guides, blog posts, neighborhoods,
--      spaces, cost tiers, setup steps. Re-built by scripts/ingest-corpus.ts
--   2. relocation_plans: optional persistence of plans for authenticated
--      members. Anonymous runs are not stored
--   3. match_corpus_chunks: cosine-similarity RPC used by the retrieval module

create extension if not exists vector;

-- Searchable corpus
create table corpus_chunks (
  id uuid primary key default uuid_generate_v4(),
  source_type text not null check (source_type in (
    'guide','blog','path','neighborhood','space','cost-tier','setup-step'
  )),
  source_slug text not null,
  section_heading text,
  chunk_index int not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(1024),
  token_count int,
  last_ingested_at timestamptz not null default now()
);

create index idx_corpus_chunks_embedding
  on corpus_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 50);

create index idx_corpus_chunks_source on corpus_chunks(source_type, source_slug);
create index idx_corpus_chunks_metadata on corpus_chunks using gin (metadata);

-- Public read so the retrieval module can use the anon client without
-- needing the service role at request time. The corpus is built from
-- already-public site content, so no privacy concern
alter table corpus_chunks enable row level security;

create policy "Corpus chunks are readable by everyone"
  on corpus_chunks for select
  using (true);

-- Saved plans (members only)
create table relocation_plans (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete set null,
  intake jsonb not null,
  plan jsonb not null,
  plan_text text not null,
  model text not null,
  retrieved_chunk_count int not null,
  created_at timestamptz default now()
);

create index idx_relocation_plans_member on relocation_plans(member_id, created_at desc);

alter table relocation_plans enable row level security;

create policy "Members read their own plans"
  on relocation_plans for select
  using (auth.uid() = member_id);

-- Service-role inserts only (the API route writes via the server client).
-- No insert policy here; the service role bypasses RLS

-- Cosine-similarity match function
create or replace function match_corpus_chunks(
  query_embedding vector(1024),
  match_count int default 8,
  source_filter text[] default null
)
returns table (
  id uuid,
  source_type text,
  source_slug text,
  section_heading text,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    c.id,
    c.source_type,
    c.source_slug,
    c.section_heading,
    c.content,
    c.metadata,
    1 - (c.embedding <=> query_embedding) as similarity
  from corpus_chunks c
  where source_filter is null or c.source_type = any(source_filter)
  order by c.embedding <=> query_embedding
  limit match_count;
$$;
