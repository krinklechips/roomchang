import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { SiteShell } from "@/components/site/site-shell";
import type { CmsPage } from "@/lib/cms";

export function CmsPageContent({ page }: { page: CmsPage }) {
  return (
    <SiteShell>
      <main>
        <BlockRenderer blocks={page.blocks} />
      </main>
    </SiteShell>
  );
}
