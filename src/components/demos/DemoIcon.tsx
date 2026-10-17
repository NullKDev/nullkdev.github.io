/**
 * A registry mark inside a React island. The SVG string comes from
 * `renderIcon` at build time — trusted, static markup that already carries
 * `aria-hidden` — so the island ships no icon pack of its own.
 */
export function DemoIcon({ svg }: { svg: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-grid shrink-0 place-items-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
