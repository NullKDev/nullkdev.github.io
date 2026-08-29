---
entryId: notes-model-hardware-standard
locale: en
translationKey: model-hardware-standard
slug: mhs-is-not-mcp-for-hardware
title: 'MHS is not MCP for hardware'
summary: 'Anthropic opened its hardware standard on 27 August as a closed research preview. It is not built on MCP, and the number worth quoting comes from a laser lab.'
visibility: public
maturity: growing
publishedAt: 2026-08-29
updatedAt: 2026-08-29
topics: [ai, architecture, developer-tools]
featuredRank: 1
image: /banners/model-hardware-standard.svg
imageAlt: Model Hardware Standard banner — one driver surface, not MCP.
links:
  - label: Previewing the Model Hardware Standard
    href: https://www.anthropic.com/news/model-hardware-standard-research-preview
    kind: publication
  - label: modelhardwarestandard.com
    href: https://modelhardwarestandard.com
    kind: external
references: []
evidence: []
documents: []
protection: { mode: public }
kind: article
lifecycle: current
citations:
  - title: Previewing the Model Hardware Standard
    url: https://www.anthropic.com/news/model-hardware-standard-research-preview
    accessedAt: 2026-08-29
  - title: Model Hardware Standard
    url: https://modelhardwarestandard.com
    accessedAt: 2026-08-29
  - title: Anthropic pushes into physical world with new standard to help AI agents operate machines
    url: https://www.cnbc.com/2026/08/27/anthropic-pushes-into-physical-world-with-new-standard-to-help-ai-agents-operate-machines.html
    accessedAt: 2026-08-29
  - title: Anthropic proposes plumbing spec to link AI agents to lab kit and robots
    url: https://www.theregister.com/ai-and-ml/2026/08/28/anthropic-proposes-plumbing-spec-to-link-ai-agents-to-lab-kit-and-robots/5293135
    accessedAt: 2026-08-29
  - title: Anthropic makes first move into physical AI with universal standard
    url: https://fortune.com/2026/08/27/anthropic-makes-first-move-into-physical-ai-with-universal-standard-for-scientists-manufacturing/
    accessedAt: 2026-08-29
---

On 27 August 2026 Anthropic opened a research preview of the **Model Hardware
Standard**, a specification that lets agents operate laboratory and
manufacturing instruments. Within a day the framing had settled everywhere,
including in my own first reaction: _MCP, but for hardware._

That framing is wrong in a way that changes what you would do about it. The
announcement is also more interesting than the framing, and considerably less
available.

## The relationship to MCP is not the one being reported

Several write-ups describe MHS as built on the Model Context Protocol. The
announcement does not say that. It says MHS "works with any device that has a
programmable interface" and that it is **model-agnostic** — "any agent harness
can access it using standard protocols, **such as** the Model Context Protocol."

Such as. MCP is one of three ways in, alongside a CLI and code file APIs. MHS
sits underneath as a driver specification; it does not ride on MCP, and nothing
about adopting it commits you to Anthropic's protocol stack or Anthropic's
models.

That is not a pedantic distinction. It is the commercial design of the thing. A
device manufacturer can ship an MHS driver without betting on one vendor's
agent, and an operator can drive that same driver from a shell script with no
model in the loop at all. Read the vendor list — Universal Robots, Doosan,
Danaher, Tecan, QIAGEN, Automata, MBF Bioscience, Raspberry Pi, AWS via Strands
Robots, Hugging Face via LeRobot — and it is hard to imagine any of them signing
up for something that shipped as an MCP extension.

## What it actually standardises

Three things, and none of them is a protocol.

**A driver architecture** that reduces every device to the same primitives —
read and write — so the differences between a microscope and a liquid handler
stop being the integrator's problem.

**A discovery format**, so that devices and agents "can find each other and
communicate across networks without needing a bespoke translator program". This
is the part that kills the N-by-M integration matrix.

**Natural-language tags inside the driver**, where the device documents its own
specifications and limits.

That third one is quiet and it is the one I would watch. Operational knowledge
today lives in the heads of a small number of people and in paper manuals next
to the machine. A driver that carries its own constraints in a form both a human
and an agent can read is a different kind of artifact from a PDF — it is the
tacit knowledge finally written down somewhere that gets loaded at runtime.

## The number worth quoting

Most of the announcement is qualitative. One partner published numbers that are
hard to argue with.

**QuEra**, on quantum laser frequency stabilisation:

| Measure                         | Before  | After    |
| ------------------------------- | ------- | -------- |
| Laser recovery success rate     | 58%     | 99.3%    |
| Recovery time                   | 150 s   | 0.9–14 s |
| Residual noise after PID tuning | 15.7 mV | 1.55 mV  |

A 58% success rate is a coin flip that a human has to babysit. 99.3% is a
system. That is the shape of the claim actually being made here, and it is a
narrower and stronger one than "agents can now use machines".

On integration time, the headline is that setup drops from "weeks, if not
months" to "hours or minutes". The supporting figures are more modest and more
believable: **Carnegie Mellon integrated three incompatible computer systems in
8 hours**, and the **University of Washington brought up six instruments in
under a week including driver development**. Days, not minutes — but against
weeks, that is still the interesting number.

Two more worth keeping: Tetsuwan Scientific improved dispense-model accuracy
**12–17% over the manufacturer's own specifications**, measured across 9,143
dispenses in 1,508 conditions. And at Carnegie Mellon the agent rejected its own
dose-response curve at R² below 0.9 and reran with adjusted parameters to clear
0.98 — an agent noticing that its result was bad is a more useful capability
than an agent producing a result.

## What it is scoped to, and what it is not

The launch partners are Genentech, the Baker and Pinglay labs at the University
of Washington, Carnegie Mellon, HHMI Janelia, QuEra and Tetsuwan Scientific. The
hardware is microscopes, liquid handlers, plate readers, qPCR machines, robotic
arms and lasers. Janelia's case was unifying seven vendor programs across one
microscopy rig.

**SCADA, PLC and MES appear nowhere in the announcement.** Neither does process
industry, neither does plant-floor control. This is scientific research and
advanced manufacturing, which in this context means benches and instruments, not
a continuous operation with an interlock system and a safety case.

The extrapolation to industrial control is the obvious one to make, and I think
it eventually lands — a PLC is a programmable interface, which is the only
qualification MHS states. But "eventually lands" is a forecast, and it is worth
keeping it separate from the announcement, because the gap between a bench
instrument and a plant is exactly the safety-case work Anthropic says is not
finished.

## Where the human stays

The safety model is more conservative than the excitement around it suggests,
and the honest parts are the useful parts.

Limits are **enforced in the driver**, not in the prompt. One researcher's
framing: "because MHS enforces device-level safety limits, I don't need to worry
about the agent accidentally using excess laser power." That is the right place
for a limit — a constraint the model cannot talk its way past is a constraint.

Agents pause for confirmation. From the preview: "Claude often stopped to wait
for human confirmation before performing an action it deemed even slightly
risky."

And the failure that Anthropic chose to publish is the one that matters most. At
Genentech the agent hit bubble-related failures in liquid handling and needed
human guidance — "we had to guide it towards parameters that handled the liquid
more gently" — because **"Claude did not yet understand the underlying physics
of the failure"**.

Hold that next to the QuEra numbers. The agent tuned a PID loop to a tenfold
noise reduction and could not reason about why a liquid was foaming. It is very
good at closing a loop over a measurable signal and it does not have physical
intuition. That is a specific, testable shape of competence, and it tells you
which jobs to hand it first.

## You cannot use it yet

This is the part missing from most of the coverage, and it is the part that
decides whether you can act on any of the above.

MHS is a **closed research preview**. Access is by application at
modelhardwarestandard.com, which is a landing page and an application form —
**it does not host the specification**. The standard is not open source; the
announcement says Anthropic is completing "additional safety evaluations with
our launch partners" ahead of making it so, with no date attached. Devices
without a programmable interface are out of scope entirely.

So there is nothing to install, nothing to read at the spec level, and no way to
write a driver today unless you are one of the named partners.

## What I would actually do

- **Stop repeating "MCP for hardware".** It is the one line everyone has taken
  from this, and it misdescribes both the architecture and the commercial
  strategy. Model-agnostic driver spec, three access paths, MCP optional.
- **Quote QuEra, not the integration claim.** 58% to 99.3% is evidence.
  "Hours or minutes" is a marketing range whose own supporting cases took eight
  hours and a week.
- **Apply if you have a bench.** The preview is where the safety evaluations are
  being written, and the cost of being in that conversation early is a form.
- **If you run a plant, treat this as a watch item, not a roadmap item.** Nothing
  announced covers industrial control, and the honest read of the Genentech
  failure is that physical intuition is the missing piece — which is precisely
  what a plant runs on.
- **Build the intuition anyway.** A mini robotic arm and an Arduino kit will not
  connect to MHS today. What they will do is make you fluent in the failure
  modes — backlash, calibration drift, the difference between a command
  accepted and a command executed — before the standard opens. Raspberry Pi and
  Hugging Face's LeRobot are both on the vendor list, which is the strongest
  available signal that the hobbyist end of this is not an afterthought.

The interesting claim in this announcement is not that agents can operate
machines. It is that the integration layer between a model and a machine can be
a boring, model-agnostic, self-documenting driver — and that if it is, the
knowledge currently trapped in a manual and a technician's memory becomes
something a system can read. Whether that holds outside a laboratory bench is
the open question, and nothing shipped on 27 August answers it.
