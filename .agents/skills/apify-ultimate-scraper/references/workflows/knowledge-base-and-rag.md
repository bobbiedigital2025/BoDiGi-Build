# Knowledge base and RAG pipeline workflows

## Website to RAG knowledge base via sitemap crawl
1. `apify/sitemap-extractor`
2. `apify/website-content-crawler` with `htmlTransformer: "readableText"`, `outputFormats: ["markdown"]`
3. n8n chunking + embeddings
4. Upsert to Supabase/Qdrant

## Deep research agent with web crawling
1. LLM query expansion
2. `apify/google-search-scraper`
3. `apify/rag-web-browser`
4. LLM report synthesis

## Scheduled news monitoring to AI knowledge feed
1. `lukaskrivka/article-extractor-smart`
2. Dedup filter
3. AI summarize + tag
4. Upsert to Notion/NocoDB/Supabase
