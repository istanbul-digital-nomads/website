-- Drop the RAG corpus tables / functions added in 010_relocation_agent.sql.
-- The relocation agent moved to a deterministic plan-builder in v1.13.0
-- (see CHANGELOG); corpus_chunks and match_corpus_chunks are unused.
--
-- relocation_plans IS kept - authenticated members can still persist
-- their plans through the deterministic pipeline

drop function if exists match_corpus_chunks(vector(1024), int, text[]);

drop table if exists corpus_chunks;

-- Leave the pgvector extension installed in case something else picks it
-- up later. Dropping the extension would also drop any other vector
-- columns elsewhere in the project (none right now, but defensive)
