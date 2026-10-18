# Writing notes

Firm rules for every note, in both languages. A note that breaks one is not
finished. They exist because a reader here is a developer checking whether the
text holds up: they want the fact, its source, and what it means for their app.

## Voice

1. **Clear before clever.** Say the thing. No riddles, teasers, rhetorical
   questions or "but there's a catch…" suspense. The answer goes in the first
   sentence, the explanation after it.
2. **Short.** One idea per sentence, one topic per paragraph, three or four
   sentences at most. Cut every word that does not change the meaning.
3. **Human, not robotic.** Write the way a senior developer explains something
   to a colleague. Banned: "In today's fast-paced world", "Let's dive in",
   "It's worth noting that", "In conclusion", "game-changer", "seamless",
   "robust", "leverage", "delve", "unlock", "revolutionary", "plays a crucial
   role", lists of three adjectives, and closing summaries that repeat the text.
4. **Concrete.** Name the API, the permission, the class, the setting, the
   date. "Apps lost background location" beats "privacy was improved".
5. **No hype, no verdicts without evidence.** Never "huge", "massive",
   "finally". If something mattered, show the consequence.
6. **Active voice, present tense** for what a version does; past tense for
   what happened at launch.

## Spanish

- Neutral Spanish. No voseo (`podés`, `tenés`, `acá`); `tests/content/voseo.test.ts`
  enforces it.
- Translate the meaning, not the sentence. A Spanish note must read as if it
  were written in Spanish.
- Keep API names, class names, permissions and settings in their original
  form, in code formatting: `READ_EXTERNAL_STORAGE`, not "permiso de lectura".

## Facts

1. **Never the first source.** Every factual claim has a primary source:
   developer.android.com, source.android.com, the Android Developers Blog, AOSP
   code or release notes. Release dates, API levels and version names are
   cross-checked against a second independent source.
2. **Secondary sources explain, they do not prove.** In-depth reviews (Ars
   Technica, Android Police, Android Authority) can show how a feature landed
   for users. Wikipedia only points to sources; it is never cited.
3. **Every source that supports a claim is in `citations`**, with its
   `accessedAt` date. Pages read that supported nothing stay out.
4. **Dates say which date.** A release has several: final SDK, announcement,
   start of the rollout. "Release date" in the table is the start of the
   public rollout to devices; name the others in the text when they matter.
5. **Settings and UI labels** stay in their original English form in both
   languages, in quotes, because that is the sourced text: "Never ask again".
6. **No invented numbers.** No market share, user counts or speed-ups unless a
   primary source states them, and then the source is named in the sentence.
7. **Mark uncertainty.** If sources disagree, say so and cite both.

## Images

- Only when the image tells the reader something the text cannot: a version's
  logo, a UI that changed, a permission dialog.
- Only files whose licence is stated on the source page. Copy them into the
  note's `assets/` folder; never hotlink.
- Every image has real alt text in both languages and a caption ending with
  the credit: `Source · Licence`. Logos add "Trademark of Google LLC" ("Marca
  registrada de Google LLC"). The caption is the markdown title, on an image
  alone in its paragraph:
  `![What the image shows](./assets/file.png 'Caption. Source · Licence')`
  (see "Images with a caption" in [content-schema.md](content-schema.md)).
- Read the licence from the file page itself (Wikimedia: the licence template
  in the page source), never from a search snippet.
- Diagrams are made, not copied: a ` ```mermaid title="…"` fence, built at
  build time.

## Shape of a version note

Every note in the `android-versions` series uses the same sections, so two
versions compare side by side. The note covers the **stable release**; its
developer previews and betas are its parts (`documents`), never the body.
Leave a section out only when the version has nothing for it, and say so in
one line.

1. **Lede** (no heading): two or three sentences on what this version is
   remembered for, for users and for developers.
2. **At a glance**: a table with version, API level, name (say whether it was
   public or internal only; from Android 10 on it is internal), the
   `Build.VERSION_CODES` constant, release date, launch device, the Google Play
   target-API deadline, and the toolchain the API needs (`compileSdk`, the
   minimum Android Gradle Plugin and Android Studio) when a primary source
   states it.
3. **What it brought**: the features users saw and the APIs developers got.
4. **Security and privacy**: platform hardening, encryption, updates, sandbox.
5. **Permissions**: one table, one row per permission this version added,
   changed, split, deprecated or removed. Columns: *Permission* · *What changed
   in API N* · *What to declare* · *What to remove or limit*. Then a manifest
   snippet for an app that supports versions before and after N (for example
   `maxSdkVersion="32"` on the old permission next to the new one). If nothing
   changed, say so in one line.
6. **What changed for your app**: two tables, "All apps on Android X" and
   "Apps targeting API N". Columns: *Change* · *What to do* · *How to check*
   (the Android Lint check ID, and from API 30 the compat change ID, when a
   primary source names them; otherwise empty). Every targeting-gated change
   lives in these tables, never only in a bullet elsewhere.
7. **Migrating to API N**: an ordered checklist for an app moving its
   `targetSdk` from the previous level: the steps in the order to do them,
   what breaks if skipped, and how to verify each one. End with one line for
   apps jumping several levels at once.
8. **What lasted**: what later versions kept, extended or reverted.
9. **Worth knowing** (optional): interesting values and facts a reader would
   repeat to a colleague: the Easter egg, a comment left in AOSP source, a
   limit or default that surprised developers, the story behind the name. Each
   one sourced like any other claim, one or two sentences each, at most five.
   No trivia without a source, and no section if there is nothing real.

Then `citations` in frontmatter, never a hand-written sources list; the page
shows them as its visible "Citations" block. The stable release is backed by
**at least five distinct websites** (distinct domains), including Google's own
pages and at least one independent source.

The "How to check" column and the migration checklist name tools the reader
runs on their own machine (Android Studio lint, `adb`). The site never runs
them; it only names them.

Each fact lives in one section. When it touches two (a privacy change that is
also a behaviour change), state it where it matters most and link to it from
the other with one line.

## Before publishing

- Title ≤48 characters (the site suffix takes the rest of 60), summary ≤180.
- Read it aloud. If a sentence needs a second read, rewrite it.
- `bun run test:content` and `bun run build` pass.
