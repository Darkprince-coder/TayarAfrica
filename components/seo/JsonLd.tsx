/**
 * schema.org data for search engines, server-rendered into the page. "<" is escaped so text from
 * the CMS can never close the script tag.
 */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
