# recall

Rust HNSW vector engine with AES-256-GCM encryption and Solana on-chain provenance. The core of [VecLabs](https://veclabs.xyz).

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-57%20passing-brightgreen.svg)]()
[![Solana Devnet](https://img.shields.io/badge/solana-devnet%20live-9945FF.svg)](https://explorer.solana.com/address/8xjQ2XrdhR4JkGAdTEB7i34DBkbrLRkcgchKjN1Vn5nP?cluster=devnet)
[![crates.io](https://img.shields.io/badge/crates.io-solvec--core-orange.svg)](https://crates.io/crates/solvec-core)

---

## What this is

Most vector databases are centralized infrastructure you rent access to. Your data lives on their servers. You trust their uptime, their pricing, and their word that nothing has changed.

`recall` is the engine underneath a different approach. Three things happen on every write:

- Vectors are encrypted with **AES-256-GCM** using a key derived from your Solana wallet — before they leave your machine
- A **Rust HNSW** graph indexes them in memory with no garbage collector, delivering consistent sub-5ms p99 latency
- A **32-byte SHA-256 Merkle root** of all vector IDs is posted on-chain to a Solana Anchor program — a cryptographic fingerprint of your entire collection, immutable and publicly verifiable

The result: a vector database that is faster, cheaper, and verifiable by anyone — without trusting VecLabs.

---

## Benchmarks

Measured on Apple M3. 100K vectors, 1536 dimensions (OpenAI ada-002), top-10 query, cosine similarity, 1,000 samples. Release build.

|                           | recall          | Pinecone s1   | Qdrant        | Weaviate      |
| ------------------------- | --------------- | ------------- | ------------- | ------------- |
| p50                       | **2.995ms**     | ~10ms         | ~6ms          | ~18ms         |
| p95                       | **3.854ms**     | ~20ms         | ~12ms         | ~32ms         |
| p99                       | **4.688ms**     | ~30ms         | ~18ms         | ~48ms         |
| p99.9                     | **5.674ms**     | ~50ms         | ~30ms         | ~80ms         |
| Monthly cost (1M vectors) | **~$20**        | $70           | $25+          | $25+          |
| Data ownership            | **Your wallet** | Their servers | Their servers | Their servers |
| Audit trail               | **On-chain**    | None          | None          | None          |

Full methodology and reproduction steps: [`benchmarks/COMPARISON.md`](benchmarks/COMPARISON.md)

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              recall core                    │
│                                             │
│  ┌──────────┐  ┌────────────┐  ┌─────────┐  │
│  │   HNSW   │  │ AES-256-GCM│  │ Merkle  │  │
│  │  graph   │  │ encryption │  │  tree   │  │
│  │          │  │            │  │         │  │
│  │ sub-5ms  │  │ wallet-key │  │ SHA-256 │  │
│  │   p99    │  │  derived   │  │  root   │  │
│  └──────────┘  └────────────┘  └────────┬┘  │
│                                         │   │
└─────────────────────────────────────────┼───┘
                                          │
                                          ▼
                              Solana Anchor Program
                              8xjQ2XrdhR4JkGAdTEB7i34DBkbrLRkcgchKjN1Vn5nP
```

**HNSW graph** (`src/hnsw.rs`) — insert, delete, query, serialize. No GC means no latency spikes under concurrent load. Supports cosine, euclidean, and dot product distance metrics. Full serialization support for persistence.

**Encryption** (`src/encryption.rs`) — AES-256-GCM. Key is derived from your Solana wallet keypair. Vectors are encrypted client-side before any storage operation. VecLabs cannot read your data.

**Merkle tree** (`src/merkle.rs`) — after every write, leaf hashes are computed with domain separators (SHA-256), paired bottom-up to a single 32-byte root, and posted to the Anchor program. One transaction. $0.00025. 400ms finality. Any party can verify the current state of a collection without trusting VecLabs.

**Solana program** (`programs/solvec/`) — Anchor program live on devnet. Stores Merkle roots per collection. Public and permanent.

---

## Repository Structure

```
recall/
├── crates/
│   └── solvec-core/
│       └── src/
│           ├── hnsw.rs         # HNSW graph — insert, delete, query, serialize
│           ├── distance.rs     # Cosine, euclidean, dot product
│           ├── merkle.rs       # Merkle tree + proof generation + verification
│           ├── encryption.rs   # AES-256-GCM vector encryption
│           └── types.rs        # Core types and error handling
├── programs/
│   └── solvec/                 # Solana Anchor program
│       └── src/
│           └── lib.rs          # On-chain Merkle root storage
└── benchmarks/                 # Criterion.rs benchmark suite
    └── COMPARISON.md           # Full methodology and reproduction steps
```

---

## Building from Source

Requirements: Rust 1.85+, Solana CLI 2.0+, Anchor CLI 0.32+

```bash
git clone https://github.com/veclabs/recall
cd recall

# Build
cargo build --workspace

# Tests (57 passing)
cargo test --workspace
cargo test --test integration_test -- --nocapture

# Benchmarks
cargo bench --workspace

# Solana program (requires devnet SOL)
cd programs/solvec && anchor build && anchor test --skip-deploy
```

---

## Status

| Component                      | Status                                              |
| ------------------------------ | --------------------------------------------------- |
| HNSW core                      | ✅ Complete — 31 unit tests, 2.011ms p99 at 100K vectors |
| AES-256-GCM encryption         | ✅ Complete                                          |
| Merkle tree + proof generation | ✅ Complete — domain separator verified cross-language |
| Solana Anchor program          | ✅ Live on devnet — 6/6 tests passing                |
| Irys · Arweave permanent storage | ✅ Complete (Pro tier)                             |
| WASM bridge                    | ✅ Complete                                      |
| Mainnet deployment             | 📋 Planned                                          |

---

## SDKs

Use `recall` directly in Rust or through the language SDKs:

- **TypeScript / JavaScript** → [`veclabs/recall-sdk-js`](https://github.com/veclabs/recall-sdk-js) — `npm install @veclabs/solvec`
- **Python** → [`veclabs/recall-sdk-python`](https://github.com/veclabs/recall-sdk-python) — `pip install solvec --pre`

---

## Live on Solana Devnet

- Program: [`8xjQ2XrdhR4JkGAdTEB7i34DBkbrLRkcgchKjN1Vn5nP`](https://explorer.solana.com/address/8xjQ2XrdhR4JkGAdTEB7i34DBkbrLRkcgchKjN1Vn5nP?cluster=devnet)
- Collection: [`8iLpyegDt8Vx2Q56kdvDJYpmnkTD2VDZvHXXead75Fm7`](https://explorer.solana.com/address/8iLpyegDt8Vx2Q56kdvDJYpmnkTD2VDZvHXXead75Fm7?cluster=devnet)

---

## Contributing

Priority areas: Rust HNSW SIMD optimizations, Shadow Drive integration, WASM bridge, additional distance metrics.

See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT. See [LICENSE](LICENSE).

---

[veclabs.xyz](https://veclabs.xyz) · [@veclabs](https://x.com/veclabs46369) · [Discord](https://discord.gg/veclabs)
