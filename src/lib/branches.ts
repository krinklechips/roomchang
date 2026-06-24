export type Branch = {
  slug: string;
  badge: string;
  name: string;
  shortName: string;
  address: string;
  addressLine2?: string;
  hours: string;
  phone: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  /** Exact "lat,lng" of this specific branch — used for the map embed pin and directions */
  coords: string;
  /** Google Maps search query for the embed iframe + link fallback */
  mapQuery: string;
  /** Lat,Lng for the directions link */
  mapDirectionsQuery: string;
  /**
   * Official Google Maps place link for this branch's exact listing (share
   * link or ?cid= link). The "View on map" button uses it — guarantees the
   * correct pin + place page (and "Write a review" button). Falls back to a
   * named search (mapQuery) when absent.
   */
  mapPlaceUrl?: string;
  /**
   * Official Google Maps Embed (maps/embed?pb=…) src for the iframe — encodes
   * the exact place_id, so the embed shows the labelled place card. Falls back
   * to a keyless coordinate embed when absent.
   */
  mapEmbedSrc?: string;
};

export const BRANCHES: Branch[] = [
  {
    slug: "sisowath-high-school",
    badge: "Main Hospital",
    name: "Main Hospital — Sisowath High School",
    shortName: "Main Hospital",
    address: "No. 4, Street 184, Khan Daun Penh",
    addressLine2: "Phnom Penh, Cambodia",
    hours: "Mon–Sat 08:00–17:30",
    phone: "+855 69 811 338",
    description:
      "Our flagship 10-storey hospital with 46 dental chairs, 4 operation rooms, an in-house CAD/CAM digital laboratory, and the full specialist team.",
    imageSrc: "/about/facilities/DJI_0387.jpg",
    imageAlt: "Roomchang Dental Hospital main building — Sisowath High School",
    coords: "11.5631748,104.9255864",
    mapQuery: "Roomchang Dental Hospital, Street 184, Phnom Penh",
    mapDirectionsQuery: "Roomchang+Dental+Hospital+Street+184+Phnom+Penh+Cambodia",
    mapPlaceUrl: "https://www.google.com/maps?cid=10914600565851345441",
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d40389.20667204924!2d104.8736348646311!3d11.578152585682135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513848e62f8f%3A0x97787362f8d8d221!2sRoomchang%20Dental%20Hospital!5e1!3m2!1sen!2skh!4v1781596982055!5m2!1sen!2skh",
  },
  {
    slug: "rose-condo",
    badge: "Branch",
    name: "Rose Condo — Bassac Garden City",
    shortName: "Rose Condo - Bassac Garden City",
    address: "No. 10, Block 252, Bassac Garden City",
    addressLine2: "Chamkarmorn, Phnom Penh, Cambodia",
    hours: "Mon–Sat 08:00–17:30",
    phone: "+855 78 911 338",
    description:
      "Serving the Bassac and BKK residential communities, this branch offers specialist consultations and treatments in a quiet, accessible setting.",
    imageSrc: "/about/facilities/2014.jpg",
    imageAlt: "Roomchang Dental — Rose Condo Bassac branch",
    coords: "11.5442748,104.931863",
    mapQuery: "Roomchang Dental Clinic - Rose Condo Branch, Phnom Penh",
    mapDirectionsQuery: "Roomchang+Dental+Bassac+Garden+City+Chamkarmorn+Phnom+Penh+Cambodia",
    mapPlaceUrl: "https://maps.app.goo.gl/vJaeFEA8ShY5LVeQ9",
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d40389.20667204924!2d104.8736348646311!3d11.578152585682135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31095129eb4a3fb3%3A0x3ded613629f2410d!2sRoomchang%20Dental%20Clinic%20-%20Rose%20Condo%20Branch!5e1!3m2!1sen!2skh!4v1781596955417!5m2!1sen!2skh",
  },
  {
    slug: "aeon-mall",
    badge: "Mall Branch",
    name: "AEON Mall Sen Sok",
    shortName: "AEON Mall Sen Sok",
    address: "1st Floor, AEON Mall Sen Sok City, Street 1003",
    addressLine2: "Khan Sen Sok, Phnom Penh, Cambodia",
    hours: "Mon–Sun 09:00–20:00",
    phone: "+855 93 911 338",
    description:
      "Conveniently located on the 1st floor of AEON Mall Sen Sok — offering the full range of Roomchang dental services, 7 days a week.",
    imageSrc: "/about/facilities/Aeon-Mall-2018.jpg",
    imageAlt: "Roomchang Dental — AEON Mall Sen Sok branch",
    coords: "11.6002724,104.8855684",
    mapQuery: "Roomchang Dental Clinic - Aeon Mall Sen Sok City Branch, Phnom Penh",
    mapDirectionsQuery: "Roomchang+Dental+AEON+Mall+Sen+Sok+Phnom+Penh+Cambodia",
    mapPlaceUrl: "https://www.google.com/maps?cid=11826366884948072365",
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d40389.20667204924!2d104.8736348646311!3d11.578152585682135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310953ec2da66047%3A0xa41fb205e8c5d7ad!2sRoomchang%20Dental%20Clinic%20-%20Aeon%20Mall%20Sen%20Sok%20City%20Branch!5e1!3m2!1sen!2skh!4v1781597001106!5m2!1sen!2skh",
  },
  {
    slug: "ph-euro-park",
    badge: "Branch",
    name: "PH Euro Park",
    shortName: "PH Euro Park",
    address: "Euro Park, Borey Peng Huoth, National Road 1",
    addressLine2: "Chbar Ampov, Phnom Penh, Cambodia",
    hours: "Mon–Sat 08:00–17:30",
    phone: "+855 86 911 338",
    description:
      "Located within the Euro Park development in Borey Peng Huoth — serving residents on the eastern side of Phnom Penh along National Road 1.",
    imageSrc: "/about/facilities/T-PH-1-2022.jpg",
    imageAlt: "Roomchang Dental — PH Euro Park branch",
    coords: "11.5157673,104.9563122",
    mapQuery: "Roomchang Dental Clinic - PH Euro Park, Phnom Penh",
    mapDirectionsQuery: "Roomchang+Dental+Hospital+Borey+Peng+Huoth+National+Road+1+Phnom+Penh+Cambodia",
    mapPlaceUrl: "https://maps.app.goo.gl/fxbZyAifkUQP9vRi8",
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d40389.20667204924!2d104.8736348646311!3d11.578152585682135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109576b7e20221d%3A0x378f4822c3b411ee!2sRoomchang%20Dental%20Clinic%20-%20PH%20Euro%20Park!5e1!3m2!1sen!2skh!4v1781597013660!5m2!1sen!2skh",
  },
  {
    slug: "fun-mall",
    badge: "Mall Branch",
    name: "Fun Mall — TK Avenue",
    shortName: "Fun Mall — TK Avenue",
    address: "2nd Floor, Fun Mall, Street 315",
    addressLine2: "Toul Kork, Phnom Penh, Cambodia",
    hours: "Mon–Sun 09:00–20:00",
    phone: "+855 12 911 338",
    description:
      "Inside Fun Mall on TK Avenue in Toul Kork — our most recently opened branch, serving one of Phnom Penh's fastest-growing residential and commercial areas.",
    imageSrc: "/about/facilities/RCD_9243Fun Mall.jpg",
    imageAlt: "Roomchang Dental — Fun Mall TK Avenue branch",
    coords: "11.5781534,104.8939555",
    mapQuery: "Roomchang Dental Clinic - Fun Mall Branch, Phnom Penh",
    mapDirectionsQuery: "Roomchang+Dental+Fun+Mall+Street+315+Toul+Kork+Phnom+Penh+Cambodia",
    mapPlaceUrl: "https://maps.app.goo.gl/sF4cnqWVmk6Ye4j49",
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d40389.20667204924!2d104.8736348646311!3d11.578152585682135!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109573046ea4f37%3A0x5e9386e22e7b0210!2sRoomchang%20Dental%20Clinic%20-%20Fun%20Mall%20Branch!5e1!3m2!1sen!2skh!4v1781596973636!5m2!1sen!2skh",
  },
];

export function getBranchBySlug(slug: string): Branch | undefined {
  return BRANCHES.find((b) => b.slug === slug);
}
