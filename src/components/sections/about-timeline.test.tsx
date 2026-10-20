import { act, cleanup, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { TimelineEvent } from "@/lib/data";
import { AboutTimeline } from "./about-timeline";
import en from "../../../messages/en.json";

vi.mock("next/image", () => ({ default: () => null }));

const observers: MockObserver[] = [];
class MockObserver {
  targets = new Set<Element>();
  constructor(private callback: IntersectionObserverCallback) { observers.push(this); }
  observe(element: Element) { this.targets.add(element); }
  unobserve(element: Element) { this.targets.delete(element); }
  disconnect() { this.targets.clear(); }
  intersect(element: Element) {
    this.callback([{ target: element, isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

beforeEach(() => { observers.length = 0; vi.stubGlobal("IntersectionObserver", MockObserver); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

const milestone = (id: string): TimelineEvent => ({ id, year: "2026", heading: `Milestone ${id}`, caption: "CMS caption", body: "CMS body", imageSrc: "", imageAlt: null, imagePosition: null, order: 0, published: true });
const timeline = (events: TimelineEvent[]) => <NextIntlClientProvider locale="en" messages={en}><AboutTimeline events={events} /></NextIntlClientProvider>;
const row = (id: string) => screen.getByRole("heading", { name: `Milestone ${id}` }).closest("section > div")!;
const reveal = (element: Element) => act(() => {
  for (const observer of observers) if (observer.targets.has(element)) observer.intersect(element);
});
const isRevealed = (id: string) => expect(screen.getByRole("heading", { name: `Milestone ${id}` }).parentElement).toHaveClass("opacity-100");
const isHidden = (id: string) => expect(screen.getByRole("heading", { name: `Milestone ${id}` }).parentElement).toHaveClass("opacity-0");

it("observes and reveals newly added CMS milestones after an in-place refresh", () => {
  const view = render(timeline([milestone("a")]));
  reveal(row("a"));
  isRevealed("a");
  view.rerender(timeline([milestone("a"), milestone("b")]));
  isHidden("b");
  reveal(row("b"));
  isRevealed("b");
});

it("keeps visibility on stable IDs when rows are inserted, reordered, or removed", () => {
  const view = render(timeline([milestone("a"), milestone("b")]));
  reveal(row("a"));
  isRevealed("a");
  isHidden("b");
  view.rerender(timeline([milestone("c"), milestone("b"), milestone("a")]));
  isHidden("c");
  isRevealed("a");
  reveal(row("c"));
  isRevealed("c");
  view.rerender(timeline([milestone("b"), milestone("a")]));
  isHidden("b");
  isRevealed("a");
});

it("does not recreate observers or loop when visibility or copy updates without ID changes", () => {
  const view = render(timeline([milestone("a")]));
  const created = observers.length;
  reveal(row("a"));
  isRevealed("a");
  view.rerender(timeline([{ ...milestone("a"), body: "Updated CMS body" }]));
  expect(screen.getByText("Updated CMS body")).toBeInTheDocument();
  isRevealed("a");
  expect(observers).toHaveLength(created);
});
