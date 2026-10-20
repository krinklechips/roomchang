import "server-only";
import { BRANCHES, matchStaticBranch, type Branch } from "./branches";
import { getBranches } from "./data";
import { getTranslatedFieldsBatch, mergeTranslation } from "./i18n-content";
import { isPayloadSource } from "./payload-source";

const nonempty = (value: string | null | undefined, fallback = "") => value?.trim() ? value : fallback;

export async function getBranchDetails(): Promise<Branch[]> {
  if (!isPayloadSource()) {
    const translations = await getTranslatedFieldsBatch("branch", BRANCHES.map((branch) => branch.slug));
    return BRANCHES.map((branch) => mergeTranslation(branch, translations.get(branch.slug) ?? {}));
  }

  return (await getBranches()).map((branch) => {
    const fallback = matchStaticBranch(branch);
    return {
      slug: fallback?.slug || nonempty(branch.slug, branch.id),
      badge: nonempty(branch.badge, fallback?.badge),
      name: nonempty(branch.displayName, branch.name),
      shortName: nonempty(branch.shortDisplayName, nonempty(branch.displayName, nonempty(branch.shortName, fallback?.shortName || branch.name))),
      address: nonempty(branch.address, fallback?.address),
      addressLine2: nonempty(branch.addressLine2, fallback?.addressLine2),
      hours: nonempty(branch.hours, fallback?.hours),
      phone: nonempty(branch.phone, fallback?.phone),
      description: nonempty(branch.description, fallback?.description),
      imageSrc: nonempty(branch.imageSrc, fallback?.imageSrc),
      imageAlt: nonempty(branch.imageAlt, fallback?.imageAlt || branch.name),
      coords: nonempty(branch.coords, fallback?.coords),
      mapQuery: nonempty(branch.mapQuery, fallback?.mapQuery || branch.name),
      mapDirectionsQuery: nonempty(branch.mapDirectionsQuery, fallback?.mapDirectionsQuery || branch.name),
      mapPlaceUrl: nonempty(branch.map_place_url, fallback?.mapPlaceUrl) || undefined,
      mapEmbedSrc: nonempty(branch.mapEmbedSrc, fallback?.mapEmbedSrc) || undefined,
      photos: branch.photos,
    };
  });
}
