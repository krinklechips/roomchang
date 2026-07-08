"use client";

import { useRouter } from "next/navigation";
import { RefreshRouteOnSave as PayloadRefresh } from "@payloadcms/live-preview-react";

/**
 * DUMMY-SITE only (CONTENT_SOURCE=payload): when this page is shown inside
 * the Payload admin's Live Preview iframe, re-render the route whenever the
 * document is saved in the CMS — so the real page updates in place.
 * Renders nothing on the live site.
 */
export function PayloadLiveRefresh({ serverURL }: { serverURL: string }) {
  const router = useRouter();
  return <PayloadRefresh refresh={() => router.refresh()} serverURL={serverURL} />;
}
