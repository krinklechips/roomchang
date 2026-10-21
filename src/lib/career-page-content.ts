import type { CareerPosition } from "./data";
import type { Position } from "./careers";

export type CareerPagePosition = Omit<Position, "category"> & {
  category: string;
  applicationEmail?: string | null;
};

export function careerPagePosition(position: CareerPosition & { applicationEmail?: string | null }): CareerPagePosition {
  return {
    slug: position.slug,
    title: position.title,
    shortDescription: position.description ?? "",
    category: position.department ?? "",
    requirements: position.requirements ?? [],
    benefits: position.benefits ?? [],
    applicationEmail: position.applicationEmail?.trim() || null,
  };
}
