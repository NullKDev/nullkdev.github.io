---
entryId: notes-chandra-ocr
locale: en
translationKey: chandra-ocr
slug: chandra-ocr-benchmark-scores
title: "What Chandra's 85.9% OCR score does not tell you"
summary: 'An open 5B model beats Gemini and GPT-5 Mini at document OCR. Two things the leaderboard omits: who wrote the benchmark, and what the licence permits.'
visibility: public
maturity: stable
publishedAt: 2026-07-29
updatedAt: 2026-07-29
topics: [ai, architecture, performance]
featuredRank: 2
image: /banners/chandra-ocr.svg
imageAlt: Chandra OCR banner — what an 85.9% score leaves out.
links:
  - label: datalab-to/chandra
    href: https://github.com/datalab-to/chandra
    kind: repository
  - label: chandra-ocr-2 weights
    href: https://huggingface.co/datalab-to/chandra-ocr-2
    kind: publication
references: []
evidence: []
documents: []
protection: { mode: public }
kind: article
lifecycle: current
citations:
  - title: datalab-to/chandra
    url: https://github.com/datalab-to/chandra
    accessedAt: 2026-07-29
  - title: chandra-ocr-2 model card
    url: https://huggingface.co/datalab-to/chandra-ocr-2
    accessedAt: 2026-07-29
  - title: 'RealDocBench: field-level QA and layout understanding on real-world regulated documents'
    url: https://arxiv.org/abs/2606.07401
    accessedAt: 2026-07-29
  - title: 'dots.ocr: multilingual document layout parsing in a single vision-language model'
    url: https://arxiv.org/abs/2512.02498
    accessedAt: 2026-07-29
---

Chandra 2 shipped in March 2026 and the headline is genuinely impressive: **85.9%
on the olmOCR benchmark from a 5-billion-parameter model**, against 67.6% for
Gemini 2.5 Flash and 60.5% for GPT-5 Mini. Half the parameter count of Chandra 1,
a higher score, and you can run it yourself.

I went looking for the catch, and found two. Neither is a flaw in the model.
Both are things a leaderboard cannot show you.

## The core idea in one paragraph

Chandra is not character recognition. It takes a page and reconstructs it as a
**structured artifact** — markdown, HTML, or JSON with layout coordinates — so a
two-column spread stays two columns, a table stays a table, and a form keeps its
checkboxes. Output is meant to be consumed by something downstream, which is why
the JSON carries positions and not just text. It is built on Qwen 3.5, handles
90+ languages, and reports 1.44 pages/second on an H100 with 96 concurrent
sequences.

## Where the number comes from

There are two benchmarks in play, and they are not the same kind of thing.

**olmOCR** is external. AllenAI built it, other models report against it, and
85.9% means something you can compare. This is the number worth quoting.

**The multilingual benchmark is Chandra's own.** The repository is upfront about
why — the authors say no good public multilingual alternative exists, which is
true. But it means the 77.8% average across 43 languages, and the 72.7% across
90, are scores on an exam its own author wrote. That is not dishonest. It is
simply a weaker claim than the olmOCR figure, and the two get quoted
interchangeably.

Worth noting who has a paper and who does not. `dots.ocr`, which Chandra 2 beats
by two points on olmOCR, is
[published](https://arxiv.org/abs/2512.02498) with its methodology open to
attack. Chandra is a model release and a README. The strongest scores in this
comparison come from the artefact with the least peer-reviewed documentation —
that is worth holding in mind, not as an accusation, but as a difference in what
you are trusting.

## The paper that actually tested it

[RealDocBench](https://arxiv.org/abs/2606.07401) asks a different question:
not "how well does the model transcribe a page" but **"can it extract the right
value from a specific field on a real regulated document"**. It evaluates AWS
Textract, Azure Document Intelligence, Claude, Gemini, olmOCR, Docling,
PaddleOCR, LlamaParse, Reducto — and Chandra.

Its finding is the one that matters if you are about to build on any of these:
models that perform well on established benchmarks show **significantly lower
accuracy** on authentic regulatory documents with field-level requirements. The
paper's own framing is that standard benchmarks do not transfer.

This is not surprising once stated. olmOCR asks for a faithful reading of a page.
Your invoice pipeline asks: what is the total, and is it the total or the
subtotal. A model can score 85.9% on the first and still put the wrong number in
your database, because a page that is 95% correctly transcribed can be 100% wrong
about the one field you needed.

**The practical consequence:** the leaderboard tells you which model to shortlist.
It does not tell you whether any of them clears your bar. That still requires
your own documents, your own fields, and counting the errors yourself.

## What the licence permits

This is the part I would want to know before writing any code, and it is easy to
miss because the repository is Apache 2.0.

The **code** is Apache 2.0. The **weights** are not. They ship under a modified
OpenRAIL-M licence: free for research, personal use, and startups under **$2M in
funding or revenue** — and, explicitly, they **cannot be used to compete with
Datalab's own API**.

Read that second clause carefully. A revenue threshold is a threshold; you know
when you cross it. "Not competitively with our API" is a judgement about what
your product is, made by the party whose API you would be competing with. If you
are building a document-processing feature inside a larger product, you are
probably fine. If document processing _is_ the product, you are negotiating a
commercial licence, and it is better to know that on day one than after
integration.

Calling this "open source" is a stretch. The code is; the thing that does the
work is source-available with commercial restrictions. That distinction disappears
in most write-ups and it is the one with contractual consequences.

## What it costs to run

Throughput is benchmarked on an **H100 80GB**. The model card does not state a
minimum VRAM figure, which in practice means nobody has committed to one.

For a 5B vision-language model you can reason about the floor: weights at bf16
are roughly 10GB before any KV cache or image tensors, so a 24GB consumer card is
plausible for single-page work and an H100 is what you need for the quoted
1.44 pages/second at 96 concurrent sequences. Those are very different machines.
If your plan involves batch-processing an archive, the throughput number and the
hardware it was measured on travel together.

There is a CLI (`chandra input.pdf ./output --method hf|vllm`), a Streamlit app,
and a Dockerised vLLM server. Getting it running is not the hard part.

## Where accuracy actually lands

The model card reports multilingual scores ranging from **8.1% to 97.0%**
depending on language. That spread is the most useful number on the page and the
one least likely to be quoted.

An average of 72.7% across 90 languages is compatible with excellent performance
on the twenty languages that dominate the training data and near-uselessness on
the tail. If your documents are English, that average understates what you will
get. If they are in a lower-resource language, it overstates it — possibly by a
lot. Check your language, not the mean.

## What I would actually do

- **Shortlist it.** For open models at this size, the olmOCR score is real and
  the layout-preserving output is the right shape for anything downstream.
- **Do not trust the score for your case.** Take fifty of your own documents,
  extract the fields you actually need, and count the mistakes. RealDocBench
  exists because that gap is measurable and consistent.
- **Check your language against the per-language table**, not the average.
- **Settle the licence before you integrate**, not after. The $2M line is clear;
  the no-compete clause is not, and that is the one to resolve in writing.

The interesting thing about Chandra is not that an open 5B model beat two hosted
frontier models. It is that it did so on a _narrow, well-defined_ task — which is
the pattern worth taking away. A model built for one job, evaluated on that job,
beats general-purpose systems at it. What the benchmark cannot tell you is
whether that job is the same shape as yours.
