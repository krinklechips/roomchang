"use client";

import { useRouter } from "next/navigation";
import { RefreshRouteOnSave as PayloadRefresh } from "@payloadcms/live-preview-react";

/**
 * DUMMY-SITE only (CONTENT_SOURCE=payload): when this page is shown inside
 * the Payload admin's Live Preview iframe, re-render the route whenever the
 * document is saved in the CMS — so the real page updates in place.
 * Renders nothing on the live site.
 *
 * MULTI-ORIGIN: RefreshRouteOnSave drops postMessages whose origin doesn't
 * match its serverURL. The admin is served on BOTH the platform domain
 * (serviettelab.com) and the tenant domain (roomchang.serviettelab.com), so a
 * save made on the tenant domain never refreshed the preview (BUG, found in
 * live UI testing 2026-08-18). One listener per allowed origin fixes it —
 * only the matching one fires.
 */
export function PayloadLiveRefresh({ serverURL }: { serverURL: string }) {
  const router = useRouter();

  const origins = new Set<string>([serverURL]);
  try {
    const u = new URL(serverURL);
    if (u.hostname.endsWith("serviettelab.com")) {
      // Both admin hosts of the Serviette CMS deployment.
      origins.add(`${u.protocol}//serviettelab.com`);
      origins.add(`${u.protocol}//roomchang.serviettelab.com`);
    }
  } catch {
    // keep just the provided serverURL
  }

  return (
    <>
      {[...origins].map((origin) => (
        <PayloadRefresh key={origin} refresh={() => router.refresh()} serverURL={origin} />
      ))}
    </>
  );
}
