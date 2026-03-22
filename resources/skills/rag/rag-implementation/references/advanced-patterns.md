# Advanced RAG Patterns

Sophisticated retrieval patterns for production RAG systems.

## Pattern 1: Hybrid Search with RRF

Combine dense (semantic) and sparse (keyword) retrieval for best recall.

```python
from langchain_community.retrievers import BM25Retriever
from langchain.retrievers import EnsembleRetriever

# Sparse retriever (BM25 for keyword matching)
bm25_retriever = BM25Retriever.from_documents(documents)
bm25_retriever.k = 10

# Dense retriever (embeddings for semantic search)
dense_retriever = vectorstore.as_retriever(search_kwargs={"k": 10})

# Combine with Reciprocal Rank Fusion weights
ensemble_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, dense_retriever],
    weights=[0.3, 0.7]  # 30% keyword, 70% semantic
)
```

## Pattern 2: Multi-Query Retrieval

Generate multiple query perspectives for better recall.

```python
from langchain.retrievers.multi_query import MultiQueryRetriever

# Generate multiple query perspectives for better recall
multi_query_retriever = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
    llm=llm
)

# Single query → multiple variations → combined results
results = await multi_query_retriever.ainvoke("What is the main topic?")
```

## Pattern 3: Contextual Compression

Extract only relevant portions from retrieved documents.

```python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

# Compressor extracts only relevant portions
compressor = LLMChainExtractor.from_llm(llm)

compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=vectorstore.as_retriever(search_kwargs={"k": 10})
)

# Returns only relevant parts of documents
compressed_docs = await compression_retriever.ainvoke("specific query")
```

## Pattern 4: Parent Document Retriever

Small chunks for precise retrieval, large chunks for context.

```python
from langchain.retrievers import ParentDocumentRetriever
from langchain.storage import InMemoryStore
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Small chunks for precise retrieval, large chunks for context
// ... (15 lines trimmed)

# Retrieval returns parent documents with full context
results = await parent_retriever.ainvoke("query")
```

## Pattern 5: HyDE (Hypothetical Document Embeddings)

Generate hypothetical documents for better retrieval.

```python
from langchain_core.prompts import ChatPromptTemplate

class HyDEState(TypedDict):
    question: str
    hypothetical_doc: str
// ... (31 lines trimmed)
builder.add_edge("generate", END)

hyde_rag = builder.compile()
```

## Pattern 6: Self-Query Retrieval

Let the LLM construct structured queries with filters.

```python
from langchain.retrievers.self_query.base import SelfQueryRetriever
from langchain.chains.query_constructor.base import AttributeInfo

metadata_field_info = [
    AttributeInfo(
// ... (25 lines trimmed)
    "Find documents about APIs from 2024"
)
# Automatically constructs filter: {"year": 2024}
```

## Pattern 7: Corrective RAG (CRAG)

Evaluate and correct retrieval quality before generation.

```python
from langgraph.graph import StateGraph, START, END

class CRAGState(TypedDict):
    question: str
    documents: list[Document]
// ... (39 lines trimmed)
        pass

    return {"corrected_documents": relevant}
```
