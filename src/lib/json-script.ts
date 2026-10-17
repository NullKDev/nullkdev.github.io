/**
 * Serialises a value for embedding inside a `<script>` element.
 *
 * `JSON.stringify` is not enough on its own: the HTML parser ends a script at
 * the first `</script`, whatever the JSON around it means, so a string field
 * holding `</script><script>…` breaks out and becomes markup. `<!--` changes
 * how the parser reads the rest of the element too. Escaping every `<` as
 * `<` removes both, and the result is still valid JSON that parses back
 * to the same value.
 *
 * U+2028 and U+2029 are escaped as well: they are legal inside JSON strings
 * but were line terminators in JavaScript string literals before ES2019, so a
 * payload read as script by an older engine would fail to parse.
 */
export const serializeJsonForScript = (value: unknown): string =>
  JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029')
