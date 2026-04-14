"use client";

import type { ChangeEvent } from "react";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useMemo, useRef, useState, useTransition } from "react";

import { Panel } from "@/components/ui/panel";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  bodyErrorTextClassName,
  eyebrowClassName,
  primaryPillButtonClassName,
  secondaryPillButtonClassName,
  subtleCardClassName,
} from "@/components/ui/tailwind-recipes";
import {
  createEmptyNoteDocument,
  hasMeaningfulNoteContent,
  parseNoteDocument,
  serializeNoteDocument,
} from "@/notes/document";
import { formatNoteDate } from "@/notes/formatting";
import { createNoteEditorExtensions, normalizeHttpUrl } from "@/notes/tiptap";
import type { NoteDetail } from "@/notes/types";
import {
  createNoteAction,
  deleteNoteAction,
  disableShareAction,
  enableShareAction,
  updateNoteAction,
} from "@/server/note-actions";

const AUTOSAVE_DELAY = 1000;

const inputClassName =
  "w-full rounded-card border border-line bg-white/85 px-4 py-4 text-base text-foreground outline-none transition placeholder:text-muted/80 focus:border-accent/35 focus:ring-4 focus:ring-accent/10";

const toolbarButtonClassName =
  "inline-flex min-h-10 items-center justify-center rounded-2xl border border-line bg-white/80 px-3 py-2 text-sm font-semibold text-foreground transition hover:border-accent/30 hover:bg-white disabled:cursor-not-allowed disabled:opacity-55";

const toolbarButtonActiveClassName = "border-accent/30 bg-accent/12 text-accent-strong";

const defaultToolbarState = {
  canUseLink: false,
  isBlockquote: false,
  isBold: false,
  isBulletList: false,
  isCodeBlock: false,
  isHeading1: false,
  isHeading2: false,
  isItalic: false,
  isLink: false,
  isOrderedList: false,
  isStrike: false,
  isUnderline: false,
};

type NoteEditorProps =
  | {
      mode: "existing";
      note: NoteDetail;
    }
  | {
      mode: "new";
    };

type SavePhase = "dirty" | "draft" | "error" | "saved" | "saving";

export function NoteEditor(props: Readonly<NoteEditorProps>) {
  const router = useRouter();
  const initialDocument = useMemo(
    () => (props.mode === "existing" ? props.note.content : createEmptyNoteDocument()),
    [props],
  );
  const initialSerializedContent = useMemo(
    () => serializeNoteDocument(initialDocument),
    [initialDocument],
  );
  const [title, setTitle] = useState(props.mode === "existing" ? props.note.title : "");
  const [serializedContent, setSerializedContent] = useState(initialSerializedContent);
  const [savePhase, setSavePhase] = useState<SavePhase>(
    props.mode === "existing" ? "saved" : "draft",
  );
  const [createErrorMessage, setCreateErrorMessage] = useState<string | null>(null);
  const [editorMessage, setEditorMessage] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const [shareErrorMessage, setShareErrorMessage] = useState<string | null>(null);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState(
    props.mode === "existing" ? props.note.updatedAt : null,
  );
  const [shareEnabled, setShareEnabled] = useState(
    props.mode === "existing" ? props.note.shareEnabled : false,
  );
  const [latestShareUrl, setLatestShareUrl] = useState<string | null>(null);
  const [latestShareAbsoluteUrl, setLatestShareAbsoluteUrl] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isCreating, startCreateTransition] = useTransition();
  const [isTogglingShare, startShareTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [, startAutosaveTransition] = useTransition();
  const extensions = useMemo(() => createNoteEditorExtensions(), []);
  const currentSnapshot = useMemo(
    () => JSON.stringify({ serializedContent, title }),
    [serializedContent, title],
  );
  const titleRef = useRef(title);
  const serializedContentRef = useRef(serializedContent);
  const currentSnapshotRef = useRef(currentSnapshot);
  const lastSavedSnapshotRef = useRef(props.mode === "existing" ? currentSnapshot : null);
  const lastFailedSnapshotRef = useRef<string | null>(null);
  const editor = useEditor(
    {
      content: initialDocument,
      editorProps: {
        attributes: {
          "aria-label": "Note content",
          class: "note-editor-surface note-rich-text",
        },
      },
      extensions,
      immediatelyRender: false,
      onUpdate: ({ editor: nextEditor }) => {
        const nextSerializedContent = serializeNoteDocument(nextEditor.getJSON());

        setEditorMessage(null);
        serializedContentRef.current = nextSerializedContent;
        setSerializedContent(nextSerializedContent);
      },
    },
    [],
  );
  const toolbarState = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => {
      if (!currentEditor) {
        return defaultToolbarState;
      }

      return {
        canUseLink: currentEditor.isActive("link") || !currentEditor.state.selection.empty,
        isBlockquote: currentEditor.isActive("blockquote"),
        isBold: currentEditor.isActive("bold"),
        isBulletList: currentEditor.isActive("bulletList"),
        isCodeBlock: currentEditor.isActive("codeBlock"),
        isHeading1: currentEditor.isActive("heading", { level: 1 }),
        isHeading2: currentEditor.isActive("heading", { level: 2 }),
        isItalic: currentEditor.isActive("italic"),
        isLink: currentEditor.isActive("link"),
        isOrderedList: currentEditor.isActive("orderedList"),
        isStrike: currentEditor.isActive("strike"),
        isUnderline: currentEditor.isActive("underline"),
      };
    },
  });
  const contentDocument = useMemo(
    () => parseNoteDocument(serializedContent) ?? createEmptyNoteDocument(),
    [serializedContent],
  );
  const canCreate = title.trim().length > 0 || hasMeaningfulNoteContent(contentDocument);
  const saveState = getSaveStateDetails(savePhase);
  const resolvedToolbarState = toolbarState ?? defaultToolbarState;

  useEffect(() => {
    currentSnapshotRef.current = currentSnapshot;
  }, [currentSnapshot]);

  const runAutosave = useEffectEvent(async () => {
    if (props.mode !== "existing") {
      return;
    }

    const snapshotToSave = currentSnapshotRef.current;
    const contentToSave = parseNoteDocument(serializedContentRef.current);
    const titleToSave = titleRef.current;

    if (!contentToSave) {
      setSavePhase("error");
      setSaveErrorMessage("Unable to save note right now.");
      lastFailedSnapshotRef.current = snapshotToSave;
      return;
    }

    setSavePhase("saving");
    setSaveErrorMessage(null);

    startAutosaveTransition(async () => {
      const result = await updateNoteAction({
        contentJson: contentToSave,
        id: props.note.id,
        title: titleToSave,
      });

      if ("error" in result) {
        lastFailedSnapshotRef.current = snapshotToSave;
        setSavePhase("error");
        setSaveErrorMessage(result.error.message);

        if (result.error.code === "NOT_FOUND" || result.error.code === "UNAUTHORIZED") {
          router.refresh();
        }

        return;
      }

      lastSavedSnapshotRef.current = snapshotToSave;
      lastFailedSnapshotRef.current = null;
      setUpdatedAt(result.updatedAt);
      setShareEnabled(result.shareEnabled);
      setSaveErrorMessage(null);
      setSavePhase(snapshotToSave === currentSnapshotRef.current ? "saved" : "dirty");
    });
  });

  useEffect(() => {
    if (props.mode !== "existing") {
      return;
    }

    if (currentSnapshot === lastSavedSnapshotRef.current) {
      if (savePhase !== "saved" && savePhase !== "saving") {
        setSavePhase("saved");
        setSaveErrorMessage(null);
      }

      return;
    }

    if (savePhase === "saving") {
      return;
    }

    if (savePhase === "error" && currentSnapshot === lastFailedSnapshotRef.current) {
      return;
    }

    if (savePhase !== "dirty") {
      setSavePhase("dirty");
    }

    const timeoutId = window.setTimeout(() => {
      void runAutosave();
    }, AUTOSAVE_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentSnapshot, props.mode, runAutosave, savePhase]);

  function handleTitleChange(event: ChangeEvent<HTMLInputElement>) {
    const nextTitle = event.target.value;

    setCreateErrorMessage(null);
    setEditorMessage(null);
    titleRef.current = nextTitle;
    setTitle(nextTitle);
  }

  function handleClearDraft() {
    const emptyDocument = createEmptyNoteDocument();
    const emptySerializedContent = serializeNoteDocument(emptyDocument);

    setCreateErrorMessage(null);
    setEditorMessage(null);
    titleRef.current = "";
    serializedContentRef.current = emptySerializedContent;
    setTitle("");
    setSerializedContent(emptySerializedContent);
    editor?.commands.setContent(emptyDocument, { emitUpdate: true });
  }

  function handleToggleBold() {
    editor?.chain().focus().toggleBold().run();
  }

  function handleToggleItalic() {
    editor?.chain().focus().toggleItalic().run();
  }

  function handleToggleUnderline() {
    editor?.chain().focus().toggleUnderline().run();
  }

  function handleToggleStrike() {
    editor?.chain().focus().toggleStrike().run();
  }

  function handleToggleHeading1() {
    editor?.chain().focus().toggleHeading({ level: 1 }).run();
  }

  function handleToggleHeading2() {
    editor?.chain().focus().toggleHeading({ level: 2 }).run();
  }

  function handleToggleBulletList() {
    editor?.chain().focus().toggleBulletList().run();
  }

  function handleToggleOrderedList() {
    editor?.chain().focus().toggleOrderedList().run();
  }

  function handleToggleBlockquote() {
    editor?.chain().focus().toggleBlockquote().run();
  }

  function handleToggleCodeBlock() {
    editor?.chain().focus().toggleCodeBlock().run();
  }

  function handleLinkAction() {
    if (!editor) {
      return;
    }

    if (editor.isActive("link")) {
      setEditorMessage(null);
      editor.chain().focus().unsetLink().run();
      return;
    }

    if (!resolvedToolbarState.canUseLink) {
      return;
    }

    const requestedUrl = window.prompt("Enter an http or https URL", "https://");

    if (requestedUrl === null) {
      return;
    }

    const normalizedUrl = normalizeHttpUrl(requestedUrl);

    if (!normalizedUrl) {
      setEditorMessage("Only http and https links are allowed.");
      return;
    }

    setEditorMessage(null);
    editor.chain().focus().extendMarkRange("link").setLink({ href: normalizedUrl }).run();
  }

  function handleCreateNote() {
    if (!canCreate || isCreating) {
      return;
    }

    setCreateErrorMessage(null);
    setEditorMessage(null);

    startCreateTransition(async () => {
      const result = await createNoteAction({
        contentJson: contentDocument,
        title,
      });

      if ("error" in result) {
        setCreateErrorMessage(result.error.message);

        if (result.error.code === "UNAUTHORIZED") {
          router.refresh();
        }

        return;
      }

      router.replace(`/notes/${result.noteId}`);
    });
  }

  function handleToggleShare() {
    if (props.mode !== "existing") {
      return;
    }

    setShareErrorMessage(null);

    startShareTransition(async () => {
      if (!shareEnabled) {
        const result = await enableShareAction({ id: props.note.id });

        if ("error" in result) {
          setShareErrorMessage(result.error.message);

          if (result.error.code === "NOT_FOUND" || result.error.code === "UNAUTHORIZED") {
            router.refresh();
          }

          return;
        }

        const absoluteUrl = new URL(result.shareUrl, window.location.origin).toString();

        setShareEnabled(true);
        setUpdatedAt(result.updatedAt);
        setLatestShareUrl(result.shareUrl);
        setLatestShareAbsoluteUrl(absoluteUrl);
        return;
      }

      const result = await disableShareAction({ id: props.note.id });

      if ("error" in result) {
        setShareErrorMessage(result.error.message);

        if (result.error.code === "NOT_FOUND" || result.error.code === "UNAUTHORIZED") {
          router.refresh();
        }

        return;
      }

      setShareEnabled(false);
      setUpdatedAt(result.updatedAt);
      setLatestShareUrl(null);
      setLatestShareAbsoluteUrl(null);
    });
  }

  function handleCopyShareUrl() {
    if (!latestShareUrl) {
      return;
    }

    if (!latestShareAbsoluteUrl) {
      return;
    }

    void navigator.clipboard.writeText(latestShareAbsoluteUrl);
  }

  function handleDeleteClick() {
    if (props.mode !== "existing") {
      return;
    }

    if (!confirmingDelete) {
      setDeleteErrorMessage(null);
      setConfirmingDelete(true);
      return;
    }

    startDeleteTransition(async () => {
      const result = await deleteNoteAction({ id: props.note.id });

      if ("error" in result) {
        setDeleteErrorMessage(result.error.message);
        setConfirmingDelete(false);

        if (result.error.code === "NOT_FOUND" || result.error.code === "UNAUTHORIZED") {
          router.refresh();
        }

        return;
      }

      router.replace("/notes");
      router.refresh();
    });
  }

  return (
    <Panel className="space-y-6">
      <SectionHeading
        actions={
          <>
            <StatusBadge>{props.mode === "existing" ? "Existing note" : "New note"}</StatusBadge>
            {props.mode === "existing" ? (
              <StatusBadge tone="muted">id: {props.note.id}</StatusBadge>
            ) : null}
          </>
        }
        description={
          props.mode === "existing"
            ? "Autosave keeps this note up to date after short pauses while you write."
            : "Create a note with a dedicated title field and a TipTap rich-text body."
        }
        eyebrow={props.mode === "existing" ? "GET /notes/[id]" : "GET /notes/new"}
        title={title.trim() || (props.mode === "existing" ? "Untitled note" : "Create a new note")}
      />
      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_280px] 2xl:items-start">
        <div className="space-y-5">
          <div className={subtleCardClassName}>
            <label className="space-y-3" htmlFor="note-title">
              <span className={eyebrowClassName}>Title</span>
              <input
                className={inputClassName}
                id="note-title"
                maxLength={250}
                onChange={handleTitleChange}
                placeholder="Give this note a clear title"
                type="text"
                value={title}
              />
            </label>
          </div>
          <div className="rounded-card border border-line bg-white/80 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap gap-2 border-b border-line pb-4">
              <ToolbarButton
                active={resolvedToolbarState.isBold}
                label="Bold"
                onClick={handleToggleBold}
              />
              <ToolbarButton
                active={resolvedToolbarState.isItalic}
                label="Italic"
                onClick={handleToggleItalic}
              />
              <ToolbarButton
                active={resolvedToolbarState.isUnderline}
                label="Underline"
                onClick={handleToggleUnderline}
              />
              <ToolbarButton
                active={resolvedToolbarState.isStrike}
                label="Strike"
                onClick={handleToggleStrike}
              />
              <ToolbarButton
                active={resolvedToolbarState.isHeading1}
                label="H1"
                onClick={handleToggleHeading1}
              />
              <ToolbarButton
                active={resolvedToolbarState.isHeading2}
                label="H2"
                onClick={handleToggleHeading2}
              />
              <ToolbarButton
                active={resolvedToolbarState.isBulletList}
                label="Bullets"
                onClick={handleToggleBulletList}
              />
              <ToolbarButton
                active={resolvedToolbarState.isOrderedList}
                label="Numbers"
                onClick={handleToggleOrderedList}
              />
              <ToolbarButton
                active={resolvedToolbarState.isBlockquote}
                label="Quote"
                onClick={handleToggleBlockquote}
              />
              <ToolbarButton
                active={resolvedToolbarState.isCodeBlock}
                label="Code"
                onClick={handleToggleCodeBlock}
              />
              <ToolbarButton
                active={resolvedToolbarState.isLink}
                disabled={!resolvedToolbarState.canUseLink}
                label={resolvedToolbarState.isLink ? "Unlink" : "Link"}
                onClick={handleLinkAction}
              />
            </div>
            <div className="mt-4 min-h-[30rem] rounded-card border border-line bg-(--background)">
              {editor ? (
                <EditorContent editor={editor} />
              ) : (
                <div className="flex min-h-[30rem] items-center justify-center px-6 text-sm text-muted">
                  Preparing the editor...
                </div>
              )}
            </div>
            {editorMessage ? (
              <p aria-live="polite" className={`${bodyErrorTextClassName} mt-4`}>
                {editorMessage}
              </p>
            ) : null}
          </div>
          {props.mode === "new" ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line bg-white/70 px-5 py-4">
              <button
                className={`${secondaryPillButtonClassName} disabled:cursor-not-allowed disabled:opacity-55`}
                onClick={handleClearDraft}
                type="button"
              >
                Clear
              </button>
              <button
                className={`${primaryPillButtonClassName} disabled:cursor-not-allowed disabled:opacity-55`}
                disabled={!canCreate || isCreating}
                onClick={handleCreateNote}
                type="button"
              >
                {isCreating ? "Creating note..." : "Create note"}
              </button>
            </div>
          ) : (
            <div className="rounded-card border border-line bg-white/70 px-5 py-4 text-sm leading-7 text-muted">
              Autosave runs after short pauses. Keep typing if the status shows unsaved changes.
            </div>
          )}
          {createErrorMessage ? (
            <p aria-live="polite" className={bodyErrorTextClassName}>
              {createErrorMessage}
            </p>
          ) : null}
        </div>
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-1">
          <div className={subtleCardClassName}>
            <p className={eyebrowClassName}>Save state</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <StatusBadge tone={saveState.tone}>{saveState.label}</StatusBadge>
              {props.mode === "new" ? <StatusBadge tone="muted">Draft</StatusBadge> : null}
            </div>
            <p className="mt-3 text-sm leading-7 text-muted">{saveState.description}</p>
            {saveErrorMessage ? (
              <p aria-live="polite" className={`${bodyErrorTextClassName} mt-3`}>
                {saveErrorMessage}
              </p>
            ) : null}
          </div>
          <div className={subtleCardClassName}>
            <p className={eyebrowClassName}>Note metadata</p>
            <dl className="mt-4 space-y-4 text-sm text-muted">
              <MetadataRow
                label="created_at"
                value={
                  props.mode === "existing"
                    ? formatNoteDate(props.note.createdAt)
                    : "Assigned after creation"
                }
              />
              <MetadataRow
                label="updated_at"
                value={updatedAt ? formatNoteDate(updatedAt) : "Autosave starts after creation"}
              />
              <MetadataRow
                label="visibility"
                value={shareEnabled ? "Shared link active" : "Private note"}
              />
              <MetadataRow label="mode" value={props.mode} />
            </dl>
          </div>
          {props.mode === "existing" ? (
            <div className={subtleCardClassName}>
              <p className={eyebrowClassName}>Sharing</p>
              <div className="mt-3 space-y-3 text-sm leading-7 text-muted">
                <p>
                  {shareEnabled
                    ? "Public sharing is active for this note. Disable it to invalidate the public link."
                    : "Enable sharing to generate a public URL. Re-enabling rotates the token."}
                </p>
                <button
                  className={`${shareEnabled ? secondaryPillButtonClassName : primaryPillButtonClassName} disabled:cursor-not-allowed disabled:opacity-55`}
                  disabled={isTogglingShare}
                  onClick={handleToggleShare}
                  type="button"
                >
                  {isTogglingShare
                    ? shareEnabled
                      ? "Disabling share..."
                      : "Enabling share..."
                    : shareEnabled
                      ? "Disable sharing"
                      : "Enable sharing"}
                </button>
                {latestShareUrl ? (
                  <div className="space-y-2 rounded-2xl border border-line bg-white/75 p-3">
                    <p className="text-xs text-muted">Share URL (shown once after enabling)</p>
                    <label className="space-y-2">
                      <span className="text-xs text-muted">Latest share URL</span>
                      <input
                        aria-label="Latest share URL"
                        className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-foreground"
                        readOnly
                        value={latestShareAbsoluteUrl ?? latestShareUrl}
                      />
                    </label>
                    <button
                      className={secondaryPillButtonClassName}
                      onClick={handleCopyShareUrl}
                      type="button"
                    >
                      Copy URL
                    </button>
                  </div>
                ) : null}
                {shareErrorMessage ? (
                  <p aria-live="polite" className={bodyErrorTextClassName}>
                    {shareErrorMessage}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
          {props.mode === "existing" ? (
            <div className={subtleCardClassName}>
              <p className={eyebrowClassName}>Delete note</p>
              <div className="mt-3 space-y-3 text-sm leading-7 text-muted">
                <p>This permanently deletes the note and invalidates any shared links.</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="rounded-full border border-danger-line bg-danger-soft px-5 py-3 text-sm font-semibold text-foreground transition hover:border-danger/40"
                    disabled={isDeleting}
                    onClick={handleDeleteClick}
                    type="button"
                  >
                    {isDeleting
                      ? "Deleting..."
                      : confirmingDelete
                        ? "Confirm delete"
                        : "Delete note"}
                  </button>
                  {confirmingDelete ? (
                    <button
                      className={secondaryPillButtonClassName}
                      disabled={isDeleting}
                      onClick={() => setConfirmingDelete(false)}
                      type="button"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
                {deleteErrorMessage ? (
                  <p aria-live="polite" className={bodyErrorTextClassName}>
                    {deleteErrorMessage}
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
          <div className={subtleCardClassName}>
            <p className={eyebrowClassName}>Navigation</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link className={secondaryPillButtonClassName} href="/notes">
                Back to notes
              </Link>
              {props.mode === "existing" ? (
                <Link className={secondaryPillButtonClassName} href="/notes/new">
                  New note
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

function ToolbarButton({
  active = false,
  disabled = false,
  label,
  onClick,
}: Readonly<{
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}>) {
  return (
    <button
      className={[toolbarButtonClassName, active ? toolbarButtonActiveClassName : null]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function MetadataRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt>{label}</dt>
      <dd className="text-right text-foreground">{value}</dd>
    </div>
  );
}

function getSaveStateDetails(savePhase: SavePhase) {
  switch (savePhase) {
    case "dirty":
      return {
        description: "Unsaved changes are queued and will autosave after a short pause.",
        label: "Unsaved changes",
        tone: "muted" as const,
      };
    case "error":
      return {
        description: "The last save did not complete. Edit the note again to retry.",
        label: "Save failed",
        tone: "danger" as const,
      };
    case "saved":
      return {
        description: "The latest title and rich-text content are persisted.",
        label: "Saved",
        tone: "accent" as const,
      };
    case "saving":
      return {
        description: "Server Actions are persisting your latest changes now.",
        label: "Saving",
        tone: "accent" as const,
      };
    default:
      return {
        description: "This draft stays local until you explicitly create the note.",
        label: "Draft",
        tone: "muted" as const,
      };
  }
}
