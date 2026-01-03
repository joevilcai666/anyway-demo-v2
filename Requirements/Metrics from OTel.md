# Metrics from OTel

# OTel Attributes for LLM Agents

This document lists all telemetry attributes that can be captured from LLM agents using OpenTelemetry.

---

## Terminology

| Term | What It Is | Analogy |
| --- | --- | --- |
| **Trace** | A complete record of a request's journey through your system | Like a package tracking number - follows one request end-to-end |
| **Span** | A single operation within a trace (e.g., one LLM call) | One stop on the package's journey |
| **Parent/Child Spans** | Spans can be nested - a parent span contains child spans | A flight with layovers: the trip is the parent, each flight is a child |
| **Attributes** | Key-value metadata attached to a span | Labels on the package: weight, destination, contents |
| **Instrumentation** | Code that captures telemetry data automatically | A security camera that records without you pressing a button |
| **Exporter** | Sends collected telemetry to a backend | The mail carrier that delivers data to your dashboard |
| **Collector** | Receives, processes, and forwards telemetry data | A sorting facility between sender and destination |
| **Context Propagation** | Passes trace IDs across service boundaries | Ensuring the tracking number follows the package when it transfers trucks |

### Example

```
Trace (trace_id: abc123)
│
├── Span: "support.ticket"          ← Parent span (your agent)
│   ├── Span: "openai.chat"         ← Child span (LLM call)
│   └── Span: "anthropic.messages"  ← Child span (another LLM call)
│
└── Each span has attributes like: model, tokens, cost, duration

```

---

## Standard OTel Span Attributes

These are **automatically captured** by the OpenTelemetry SDK for every span.

| Attribute | Type | Example | Description |
| --- | --- | --- | --- |
| `trace_id` | string | `a1b2c3d4e5f6...` | Unique ID for the entire trace |
| `span_id` | string | `x1y2z3...` | Unique ID for this span |
| `parent_span_id` | string | `p1q2r3...` | ID of parent span (if nested) |
| `name` | string | `openai.chat.completions` | Span name |
| `kind` | enum | `CLIENT` | Span type (CLIENT, SERVER, INTERNAL) |
| `start_time` | timestamp | `2024-01-15T10:30:00.123Z` | When span started |
| `end_time` | timestamp | `2024-01-15T10:30:01.456Z` | When span ended |
| `duration` | int | `1333` | Duration in milliseconds |
| `status.code` | enum | `OK` / `ERROR` | Span status |
| `status.message` | string | `Rate limit exceeded` | Error message (if error) |
|  |  |  |  |

### Gen AI Semantic Convention Attributes (Auto-Instrumented)

These attributes follow the [OpenTelemetry Gen AI Semantic Conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) and are **automatically captured** by OTel instrumentation libraries.

| Attribute | Type | Example | Description |
| --- | --- | --- | --- |
| `gen_ai.system` | string | `openai` | The AI system/provider |
| `gen_ai.operation.name` | string | `chat` | The operation type (chat, completion, embeddings) |
| `gen_ai.request.model` | string | `gpt-4o-mini` | Model requested |
| `gen_ai.request.max_tokens` | int | `300` | Max tokens requested |
| `gen_ai.response.model` | string | `gpt-4o-mini-2024-07-18` | Actual model used |
| `gen_ai.response.id` | string | `chatcmpl-abc123` | Response ID from provider |
| `gen_ai.response.finish_reasons` | string[] | `["stop"]` | Why generation stopped |
| `gen_ai.usage.input_tokens` | int | `97` | Prompt/input token count |
| `gen_ai.usage.output_tokens` | int | `160` | Completion/output token count |
| `server.address` | string | `api.openai.com` | API endpoint address |

```json
{
  "gen_ai.operation.name": "chat",
  "gen_ai.request.max_tokens": 300,
  "gen_ai.request.model": "gpt-4o-mini",
  "gen_ai.response.finish_reasons": [
    "stop"
  ],
  "gen_ai.response.id": "chatcmpl-CsJtfS1AZqXspTTIxV1LLE0kAarHB",
  "gen_ai.response.model": "gpt-4o-mini-2024-07-18",
  "gen_ai.system": "openai",
  "gen_ai.usage.input_tokens": 97,
  "gen_ai.usage.output_tokens": 160,
  "server.address": "api1.147ai.com"
}
```