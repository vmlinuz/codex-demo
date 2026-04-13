import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NotesList } from "@/components/notes/notes-list";

describe("NotesList", () => {
  it("renders the empty state when the user has no notes", () => {
    render(<NotesList notes={[]} />);

    expect(screen.getByRole("heading", { name: "No notes yet" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Create your first note" })).toBeTruthy();
  });

  it("renders note summaries with fallbacks for untitled and empty notes", () => {
    render(
      <NotesList
        notes={[
          {
            createdAt: "2026-04-13T08:00:00.000Z",
            excerpt: "",
            id: "note-1",
            shareEnabled: false,
            title: "   ",
            updatedAt: "2026-04-13T10:30:00.000Z",
          },
          {
            createdAt: "2026-04-12T08:00:00.000Z",
            excerpt: "A shared note excerpt",
            id: "note-2",
            shareEnabled: true,
            title: "Roadmap",
            updatedAt: "2026-04-13T09:00:00.000Z",
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: "Untitled note" })).toBeTruthy();
    expect(screen.getByText("No content yet. Open the note to start writing.")).toBeTruthy();
    expect(screen.getByText("Private")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Roadmap" })).toBeTruthy();
    expect(screen.getByText("A shared note excerpt")).toBeTruthy();
    expect(screen.getByText("Shared")).toBeTruthy();
  });
});
