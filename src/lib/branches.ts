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
  /** Google Maps search query for the embed iframe */
  mapQuery: string;
  /** Lat,Lng for the directions link */
  mapDirectionsQuery: string;
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
      "Our flagship 10-storey hospital with 46 dental chairs, 9 operation rooms, an in-house CAD/CAM digital laboratory, and the full specialist team.",
    imageSrc: "/about/facilities/DJI_0387.jpg",
    imageAlt: "Roomchang Dental Hospital main building — Sisowath High School",
    coords: "11.5631748,104.9255864",
    mapQuery: "Roomchang Dental Hospital, Street 184, Phnom Penh",
    mapDirectionsQuery: "Roomchang+Dental+Hospital+Street+184+Phnom+Penh+Cambodia",
  },
  {
    slug: "rose-condo",
    badge: "Branch",
    name: "Rose Condo — Bassac Garden City",
    shortName: "Rose Condo - Bassac Garden City",
    address: "No. 10, Block 252, Bassac Garden City",
    addressLine2: "Chamkarmorn, Phnom Penh, Cambodia",
    hours: "Mon–Sat 08:00–17:30",
    phone: "+855 23 723 338",
    description:
      "Serving the Bassac and BKK residential communities, this branch offers specialist consultations and treatments in a quiet, accessible setting.",
    imageSrc: "/about/facilities/2014.jpg",
    imageAlt: "Roomchang Dental — Rose Condo Bassac branch",
    coords: "11.5442748,104.931863",
    mapQuery: "Roomchang Dental Hospital, Bassac Garden City, Phnom Penh",
    mapDirectionsQuery: "Roomchang+Dental+Bassac+Garden+City+Chamkarmorn+Phnom+Penh+Cambodia",
  },
  {
    slug: "aeon-mall",
    badge: "Mall Branch",
    name: "AEON Mall Sen Sok",
    shortName: "AEON Mall Sen Sok",
    address: "1st Floor, AEON Mall Sen Sok City, Street 1003",
    addressLine2: "Khan Sen Sok, Phnom Penh, Cambodia",
    hours: "Mon–Sun 09:00–20:00",
    phone: "+855 23 911 338",
    description:
      "Conveniently located on the 1st floor of AEON Mall Sen Sok — offering the full range of Roomchang dental services, 7 days a week.",
    imageSrc: "/about/facilities/Aeon-Mall-2018.jpg",
    imageAlt: "Roomchang Dental — AEON Mall Sen Sok branch",
    coords: "11.6002724,104.8855684",
    mapQuery: "Roomchang Dental, AEON Mall Sen Sok, Phnom Penh",
    mapDirectionsQuery: "Roomchang+Dental+AEON+Mall+Sen+Sok+Phnom+Penh+Cambodia",
  },
  {
    slug: "ph-euro-park",
    badge: "Branch",
    name: "PH Euro Park",
    shortName: "PH Euro Park",
    address: "Euro Park, Borey Peng Huoth, National Road 1",
    addressLine2: "Chbar Ampov, Phnom Penh, Cambodia",
    hours: "Mon–Sat 08:00–17:30",
    phone: "+855 86 811 338",
    description:
      "Located within the Euro Park development in Borey Peng Huoth — serving residents on the eastern side of Phnom Penh along National Road 1.",
    imageSrc: "/about/facilities/T-PH-1-2022.jpg",
    imageAlt: "Roomchang Dental — PH Euro Park branch",
    coords: "11.5157673,104.9563122",
    mapQuery: "Roomchang Dental Hospital Borey Peng Huoth Phnom Penh",
    mapDirectionsQuery: "Roomchang+Dental+Hospital+Borey+Peng+Huoth+National+Road+1+Phnom+Penh+Cambodia",
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
    mapQuery: "Roomchang Dental, Fun Mall, Street 315, Toul Kork, Phnom Penh",
    mapDirectionsQuery: "Roomchang+Dental+Fun+Mall+Street+315+Toul+Kork+Phnom+Penh+Cambodia",
  },
];

export function getBranchBySlug(slug: string): Branch | undefined {
  return BRANCHES.find((b) => b.slug === slug);
}
