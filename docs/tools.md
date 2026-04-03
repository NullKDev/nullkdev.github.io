# Tools

Tools are **static Astro pages** with optional React islands for interactivity. They live in `src/pages/tools/`.

## Current Tools

| File | URL | Description |
|---|---|---|
| `password-generator.astro` | `/tools/password-generator` | Secure password generator |
| `subnet-calculator.astro` | `/tools/subnet-calculator` | Subnet mask calculator |
| `ip-dns-lookup.astro` | `/tools/ip-dns-lookup` | IP geolocation and DNS records |
| `base64-encoder.astro` | `/tools/base64-encoder` | Base64 encode/decode |
| `json-formatter.astro` | `/tools/json-formatter` | JSON format and validate |
| `yaml-validator.astro` | `/tools/yaml-validator` | YAML validate and format |
| `docker-converter.astro` | `/tools/docker-converter` | `docker run` → Compose YAML |
| `ascii-converter.astro` | `/tools/ascii-converter` | ASCII text converter |

## Adding a New Tool

### 1. Create the page file

```
src/pages/tools/my-tool.astro
```

Minimum structure:

```astro
---
import Breadcrumbs from '@/components/Breadcrumbs.astro'
import PageHead from '@/components/PageHead.astro'
import Layout from '@/layouts/Layout.astro'

// Tool logic (pure Astro for static, or import a React component)
---

<Layout class="max-w-3xl">
  <PageHead
    slot="head"
    title="My Tool — NullKDev"
    description="What this tool does. Used for SEO and OG cards."
  />

  <Breadcrumbs
    items={[
      { label: 'Tools', href: '/tools', icon: 'lucide:wrench' },
      { label: 'My Tool', icon: 'lucide:hammer' },
    ]}
  />

  <article class="flex flex-col gap-y-6">
    <header class="space-y-2">
      <h1 class="text-3xl font-bold tracking-tight">My Tool</h1>
      <p class="text-muted-foreground">Short description of what it does.</p>
    </header>

    <!-- Tool UI here -->
  </article>
</Layout>
```

### 2. Register it in the tools index

Open `src/pages/tools/index.astro` and add a `<Link>` entry inside the list:

```astro
<Link
  href="/tools/my-tool"
  class="group flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
>
  <Icon name="lucide:hammer" class="size-5 text-primary shrink-0" />
  <div class="flex-1 min-w-0">
    <h2 class="font-semibold group-hover:text-primary transition-colors" data-i18n="tools.my_tool">
      My Tool
    </h2>
    <p class="text-sm text-muted-foreground" data-i18n="tools.my_tool_desc">
      Short description
    </p>
  </div>
  <Icon name="lucide:chevron-right" class="size-4 text-muted-foreground group-hover:text-primary shrink-0" />
</Link>
```

### 3. Add i18n strings

In `src/i18n/en.ts` and `src/i18n/es.ts`:

```ts
'tools.my_tool': 'My Tool',
'tools.my_tool_desc': 'Short description of what it does',
```

### 4. Update the structured data (optional but good for SEO)

Add a new `ListItem` in the `structuredData` object at the top of `tools/index.astro`:

```ts
{
  "@type": "ListItem",
  "position": 9,
  "name": "My Tool",
  "url": new URL("/tools/my-tool", Astro.site).href
}
```

## Static vs React Island

- **Prefer pure Astro** for tools that don't need reactive state — simpler and faster
- **Use a React island** (`client:idle`) when the tool has complex state, multiple interactive inputs, or real-time updates

```astro
---
import MyToolReact from '@/components/MyToolReact.tsx'
---

<MyToolReact client:idle />
```

## i18n in Tools

Tool pages use the same `data-i18n` system as the rest of the site. All user-facing labels should use `data-i18n` attributes pointing to keys in `en.ts`/`es.ts`. Do not hardcode text strings directly in the HTML.
