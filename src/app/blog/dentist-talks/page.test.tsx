import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DentistTalksPage, { DENTIST_TALKS } from "./page";

describe("DentistTalksPage", () => {
  it("embeds the official playlist videos instead of stale placeholder IDs", () => {
    render(<DentistTalksPage />);

    const frames = screen.getAllByTitle(/.+/).filter((node) => node.tagName === "IFRAME");
    const sources = frames.map((frame) => frame.getAttribute("src"));

    expect(frames).toHaveLength(DENTIST_TALKS.length);
    expect(DENTIST_TALKS).toHaveLength(24);
    expect(sources).toContain(
      "https://www.youtube-nocookie.com/embed/Sj212poMjQQ?list=PL2Dq5LzBKy4wi9hCaXPEoFhY1xY-LoN46&rel=0",
    );
    expect(sources).toContain(
      "https://www.youtube-nocookie.com/embed/98xjrKSG2Tg?list=PL2Dq5LzBKy4wi9hCaXPEoFhY1xY-LoN46&rel=0",
    );
    expect(sources).not.toContain(
      "https://www.youtube-nocookie.com/embed/FqxjxR7Rr6Y?list=PL2Dq5LzBKy4wi9hCaXPEoFhY1xY-LoN46&rel=0",
    );
  });
});
