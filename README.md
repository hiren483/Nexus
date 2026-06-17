# NEXUS
### *what if AI agents could actually talk to each other through you*

---

```
@researcher  ──┐
@coder       ──┼──► ONE SHARED BRAIN ◄── every agent. every turn. no secrets.
@critic      ──┘
```

> **NEXUS** is a multi-agent chat interface where specialized AI agents share a single semantic memory layer. Tag `@researcher`, get research. Tag `@coder`, it already knows what the researcher said. Tag `@critic`, it tears apart *both* of them without you repeating a single word.

---

## the problem with every other "multi-agent" tool

You've seen these. You tag an agent, it answers, you move on. You tag a different agent and it has **absolutely no idea** what just happened. You're the RAM. You're manually copy-pasting context between agents like it's 2009.

That's not multi-agent collaboration. That's you doing extra work for a party trick.

---

## what NEXUS actually does

One conversation thread. Multiple specialized agents. A **shared semantic memory** that every agent reads from automatically when you call them.

```
you:           @researcher which vector DB has the best filtering?

@researcher:   Qdrant. Self-hosted, typed payloads, fastest filtered search.
               [stored to shared memory → chunk ①②]

you:           @coder build it

@coder:        [reads chunks ①②, knows why Qdrant was chosen]
               here's your async Python client with payload filters...
               [stored → chunk ③④]

you:           @critic find issues

@critic:       [reads ALL chunks ①②③④]
               no connection pooling. missing error handling.
               no index on the payload field you're filtering on, by the way.
```

The critic didn't need a briefing. It just **knew**.

---

## how the shared memory actually works

Not a raw transcript dump. Not a context window stuffed with everything ever said.

**Semantic retrieval over live conversation history.**

Every message user or agent gets embedded and stored in a vector DB. When an agent is called, the system runs a similarity search using the current query as the search vector. The top-k relevant chunks come back, ranked by a composite score:

```
score(chunk) = α · cosine_similarity(query, chunk) + (1-α) · recency_weight(chunk.timestamp)
```

The `α` parameter is tunable per agent:

- `@coder` is recency-heavy (the latest code version matters most)
- `@summarizer` is relevance-heavy (the most important points, whenever they were said)
- `@critic` wants both (recent code + original requirements)

This means a highly relevant old chunk beats a vaguely related new one. Context is **earned**, not given.

---

## the agents

| agent | personality | system prompt focus |
|---|---|---|
| `@researcher` | analytical, cautious, thorough | compare options, cite tradeoffs, stay factual |
| `@coder` | direct, minimal, working | write it, don't explain it unless asked |
| `@critic` | adversarial, precise, ruthless | find what breaks, what's missing, what's wrong |
| `@planner` | strategic, decomposition-first | break goals into steps, own dependencies |
| `@summarizer` | distillation engine | compress threads, update meta-context |

Each agent has its own system prompt. Same underlying model. Completely different behavior. The role *is* the prompt.

---

## the hard problems (the ones that make this interesting)

**1. chunk boundary design**
You can't split a conversation by sentence you lose context. By message you get huge uneven chunks. NEXUS uses semantic chunking: detect topic shifts via sliding-window cosine diff, chunk at the boundary. The conversation splits where the *meaning* shifts, not where the newlines are.

**2. context budget management**
Every model has a token limit. The budget manager ranks retrieved chunks by composite score, trims to fit, and when the top chunks are still too large summarizes them rather than cutting them. You never lose the gist.

**3. conflict resolution** *(in progress)*
What happens when `@researcher` says "use Qdrant" and `@coder` implements Pinecone because it liked the SDK better? A meta-agent that detects contradiction across agent responses and surfaces it to you: *"note: @researcher and @coder disagree on X here's why."* Not resolved silently. Flagged explicitly.

**4. per-agent α tuning**
One α doesn't fit all agents. Recency vs. relevance weighting is configured per role at instantiation. `@critic` should not be reading a 10-turn-old chunk about a different topic just because it happened recently.

---

## architecture

```
┌─────────────────────────────────────────────────┐
│                  chat interface                  │
│   parses @mentions → routes to agent router      │
└──────────────────────┬──────────────────────────┘
                       │
          ┌────────────▼────────────┐
          │      agent router       │
          │  @mention → system      │
          │  prompt + role config   │
          └────────────┬────────────┘
                       │
          ┌────────────▼────────────┐
          │   context budget mgr    │
          │  token limit → rank →   │
          │  trim → summarize       │
          └────────────┬────────────┘
                       │
          ┌────────────▼────────────┐
          │    semantic memory      │◄── every message (user + agent)
          │  embed → store → query  │    embedded on arrival
          │  top-k retrieval        │
          └────────────┬────────────┘
                       │
          ┌────────────▼────────────┐
          │       LLM call          │
          │  [system prompt]        │
          │  [retrieved context]    │
          │  [current query]        │
          └─────────────────────────┘
```

The data model is deliberately simple:

```python
ConversationChunk(
    id: str,
    role: "user" | "agent",
    agent_name: str | None,
    content: str,
    embedding: list[float],   # stored in Qdrant
    timestamp: datetime,
    session_id: str
)
```

One growing array. Every agent reads from it. Nobody owns it.

---

## stack

| layer | choice | why |
|---|---|---|
| frontend | Next.js | real-time streaming, clean component model |
| backend | FastAPI | async, fast, Python (where the ML libraries live) |
| vector store | Qdrant | self-hosted, typed payload filtering, fast |
| embeddings | `sentence-transformers` | local, no API cost per chunk |
| streaming | WebSockets | token-by-token response, feels alive |
| session state | Redis | fast, ephemeral, exactly what we need |
| models | Anthropic API / OpenAI API | swappable via config |

---

## getting started

```bash
git clone https://github.com/hiren483/Nexus
cd nexus

# spin up qdrant
docker run -p 6333:6333 qdrant/qdrant

# backend
cd backend
pip install -r requirements.txt
cp .env.example .env   # add your API keys
uvicorn main:app --reload

# frontend
cd ../frontend
npm install
npm run dev
```

visit `localhost:3000`. type something. tag an agent. watch it remember.

---

## config

```yaml
# nexus.config.yaml

agents:
  researcher:
    system_prompt: "You are a thorough analyst..."
    alpha: 0.4          # more relevance, less recency
    top_k: 6
    max_tokens: 800

  coder:
    system_prompt: "You write clean, minimal, working code..."
    alpha: 0.7          # more recency (latest code matters)
    top_k: 4
    max_tokens: 1200

  critic:
    system_prompt: "You find what's wrong, what's missing, what breaks..."
    alpha: 0.5          # balanced
    top_k: 8            # needs more context to critique properly
    max_tokens: 600

memory:
  embedding_model: "all-MiniLM-L6-v2"
  chunk_strategy: "semantic"    # or "message" or "sentence"
  session_scope: "conversation" # or "persistent"
```

---

## what's next

- [ ] conflict detection meta-agent
- [ ] persistent memory across sessions (with staleness decay)
- [ ] custom agent builder in UI define your own @handles with custom system prompts
- [ ] `@all` broadcast sends to all agents, surfaces all responses side by side
- [ ] memory visualization see which chunks each agent retrieved, and why
- [ ] export conversation as structured report (with per-agent attribution)

---

## why Nexus is More Effective than normal multichat interfaces

Most people build "multi-agent" demos where agents hand off to each other in a fixed pipeline. NEXUS is different: **the user drives the conversation**, agents are called on demand, and the shared memory means any agent called at any point has access to everything relevant that came before without you managing that state manually.

The interesting engineering is in the retrieval layer. Getting `α` right. Getting chunk boundaries right. Getting the budget manager to summarize gracefully instead of cutting bluntly. Those are real problems.

---

*built by Hiren · give it a star if it made you think*