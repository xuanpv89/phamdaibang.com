"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type {
  WispRestPost,
  WispRestPostListItem,
  WispRestTag,
} from "@/lib/wisp-rest";
import Link from "next/link";
import {
  Bold,
  CheckCircle2,
  ExternalLink,
  Eye,
  FilePlus2,
  Globe,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Lock,
  LogOut,
  PencilLine,
  Quote,
  RefreshCcw,
  Save,
  Search,
  Send,
  Trash2,
  Unlink2,
  type LucideIcon,
} from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useState,
  useTransition,
} from "react";

type Locale = "vi" | "en";

type PublicPost = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image: string | null;
  updatedAt: string;
  publishedAt: string | null;
  tags: Array<{ id: string; name: string }>;
};

type CmsClientCopy = {
  title: string;
  subtitle: string;
  loginTitle: string;
  loginDescription: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  loginAction: string;
  logoutAction: string;
  authMissing: string;
  apiMissing: string;
  connected: string;
  readonly: string;
  editorTitle: string;
  editorDescription: string;
  libraryTitle: string;
  libraryDescription: string;
  siteContentTitle: string;
  siteContentDescription: string;
  newDraft: string;
  refresh: string;
  searchPlaceholder: string;
  untitled: string;
  draft: string;
  published: string;
  noPosts: string;
  loadError: string;
  titleLabel: string;
  slugLabel: string;
  excerptLabel: string;
  imageLabel: string;
  imageHelp: string;
  contentLabel: string;
  tagsLabel: string;
  languageLabel: string;
  seoTitle: string;
  seoDescription: string;
  checklistTitle: string;
  checklist: readonly string[];
  saveDraft: string;
  publishNow: string;
  updatePost: string;
  deletePost: string;
  deleting: string;
  uploading: string;
  viewLive: string;
  siteSurfaces: readonly {
    name: string;
    source: string;
    note: string;
  }[];
};

type Props = {
  locale: Locale;
  copy: CmsClientCopy;
  authEnabled: boolean;
  writeEnabled: boolean;
  authenticated: boolean;
  initialPosts: readonly PublicPost[];
  tags: readonly WispRestTag[];
};

type EditorFormState = {
  mode: "create" | "edit";
  originalSlug: string | null;
  title: string;
  slug: string;
  description: string;
  image: string;
  content: string;
  tagIds: string[];
  publishedAt: string | null;
};

const EMPTY_FORM: EditorFormState = {
  mode: "create",
  originalSlug: null,
  title: "",
  slug: "",
  description: "",
  image: "",
  content: "<p></p>",
  tagIds: [],
  publishedAt: null,
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function mapPublicPosts(posts: readonly PublicPost[]): WispRestPostListItem[] {
  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    description: post.description,
    image: post.image,
    publishedAt: post.publishedAt,
    createdAt: post.updatedAt,
    updatedAt: post.updatedAt,
    tags: post.tags.map((tag) => ({
      tag: {
        id: tag.id,
        name: tag.name,
        description: null,
      },
    })),
  }));
}

function toFormState(post: WispRestPost): EditorFormState {
  return {
    mode: "edit",
    originalSlug: post.slug,
    title: post.title || "",
    slug: post.slug || "",
    description: post.description || "",
    image: post.image || "",
    content: post.content || "<p></p>",
    tagIds: post.tags.map((tag) => tag.tag.id),
    publishedAt: post.publishedAt,
  };
}

function formatDate(value: string | null, locale: Locale) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function ToolbarButton({
  icon: Icon,
  active,
  onClick,
  label,
}: {
  icon: LucideIcon;
  active?: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-zinc-300 transition hover:border-amber-200/60 hover:text-white",
        active && "border-amber-200 bg-amber-100 text-zinc-950"
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function CmsWorkspaceClient({
  locale,
  copy,
  authEnabled,
  writeEnabled,
  authenticated,
  initialPosts,
  tags,
}: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(authenticated);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [posts, setPosts] = useState<WispRestPostListItem[]>(
    mapPublicPosts(initialPosts)
  );
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [formState, setFormState] = useState<EditorFormState>(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [planBlocked, setPlanBlocked] = useState(false);
  const [isPending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(search);
  const localDraftKey = `phamdaibang-cms-draft-${locale}`;

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder:
          locale === "vi"
            ? "Soan thao noi dung bai viet tai day..."
            : "Write the body of the post here...",
      }),
    ],
    content: formState.content,
    onUpdate: ({ editor: currentEditor }) => {
      const html = currentEditor.getHTML();
      setFormState((current) => ({ ...current, content: html }));
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[420px] rounded-b-lg bg-[#111111] px-5 py-4 text-[15px] leading-7 text-zinc-100 focus:outline-none prose prose-invert max-w-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextContent = formState.content || "<p></p>";
    if (editor.getHTML() !== nextContent) {
      editor.commands.setContent(nextContent, { emitUpdate: false });
    }
  }, [editor, formState.content]);

  const languageTags = tags.filter(
    (tag) => tag.name.toLowerCase() === "vi" || tag.name.toLowerCase() === "en"
  );
  const topicTags = tags.filter(
    (tag) => tag.name.toLowerCase() !== "vi" && tag.name.toLowerCase() !== "en"
  );
  const hasRemoteBridge = authEnabled && isAuthenticated && writeEnabled;
  const remoteWriteReady = hasRemoteBridge && !planBlocked;

  const filteredPosts = posts.filter((post) => {
    const needle = deferredSearch.trim().toLowerCase();
    if (!needle) {
      return true;
    }

    return (
      post.title.toLowerCase().includes(needle) ||
      post.slug.toLowerCase().includes(needle) ||
      post.tags.some((tag) => tag.tag.name.toLowerCase().includes(needle))
    );
  });

  const loadPosts = useCallback(
    async (query = deferredSearch) => {
      if (!authEnabled || !isAuthenticated || !writeEnabled || planBlocked) {
        return;
      }

      setErrorMessage("");

      const response = await fetch(
        `/api/cms/posts?limit=100&query=${encodeURIComponent(query)}`
      );
      const payload = (await response.json()) as
        | { posts: WispRestPostListItem[] }
        | { error: string };

      if (!response.ok || !("posts" in payload)) {
        const message = "error" in payload ? payload.error : copy.loadError;
        if (/paid plans|upgrade/i.test(message)) {
          setPlanBlocked(true);
        }
        throw new Error(message);
      }

      setPosts(payload.posts);
    },
    [
      authEnabled,
      copy.loadError,
      deferredSearch,
      isAuthenticated,
      planBlocked,
      writeEnabled,
    ]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedDraft = window.localStorage.getItem(localDraftKey);

    if (!savedDraft) {
      return;
    }

    try {
      const parsedDraft = JSON.parse(savedDraft) as EditorFormState;
      setFormState(parsedDraft);
      setSlugTouched(Boolean(parsedDraft.slug));
    } catch {}
  }, [localDraftKey]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(localDraftKey, JSON.stringify(formState));
  }, [formState, localDraftKey]);

  useEffect(() => {
    if (!authEnabled || !isAuthenticated || !writeEnabled || planBlocked) {
      return;
    }

    startTransition(() => {
      loadPosts().catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : copy.loadError
        );
      });
    });
  }, [authEnabled, copy.loadError, isAuthenticated, loadPosts, planBlocked, writeEnabled]);

  function resetEditor() {
    setSelectedSlug(null);
    setFormState(EMPTY_FORM);
    setSlugTouched(false);
    setErrorMessage("");
    setStatusMessage("");
  }

  async function selectPost(slug: string) {
    if (!remoteWriteReady) {
      return;
    }

    setSelectedSlug(slug);
    setErrorMessage("");
    setStatusMessage("");

    const response = await fetch(`/api/cms/posts/${slug}`);
    const payload = (await response.json()) as WispRestPost | { error: string };

    if (!response.ok || !("slug" in payload)) {
      setErrorMessage("error" in payload ? payload.error : copy.loadError);
      return;
    }

    setFormState(toFormState(payload));
    setSlugTouched(true);
  }

  async function handleLogin() {
    setAuthError("");
    setStatusMessage("");

    const response = await fetch("/api/cms/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });
    const payload = (await response.json()) as
      | { success: boolean }
      | { error: string };

    if (!response.ok || !("success" in payload)) {
      setAuthError("error" in payload ? payload.error : copy.authMissing);
      return;
    }

    setPassword("");
    setIsAuthenticated(true);
    startTransition(() => {
      loadPosts("").catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : copy.loadError
        );
      });
    });
  }

  async function handleLogout() {
    await fetch("/api/cms/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    resetEditor();
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    setErrorMessage("");

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);

      const response = await fetch("/api/cms/uploads", {
        method: "POST",
        body: uploadData,
      });
      const payload = (await response.json()) as
        | { imageUrl: string }
        | { error: string };

      if (!response.ok || !("imageUrl" in payload)) {
        throw new Error("error" in payload ? payload.error : "Upload failed.");
      }

      setFormState((current) => ({ ...current, image: payload.imageUrl }));
      setStatusMessage(locale === "vi" ? "Da upload anh." : "Image uploaded.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed.";
      if (/paid plans|upgrade/i.test(message)) {
        setPlanBlocked(true);
      }
      setErrorMessage(message);
    } finally {
      setUploading(false);
    }
  }

  async function savePost(nextPublishedAt: string | null) {
    setErrorMessage("");
    setStatusMessage("");

    if (!remoteWriteReady) {
      setErrorMessage(copy.apiMissing);
      return;
    }

    if (!formState.title.trim()) {
      setErrorMessage(locale === "vi" ? "Can nhap tieu de." : "Title is required.");
      return;
    }

    if (!formState.slug.trim()) {
      setErrorMessage(locale === "vi" ? "Can nhap slug." : "Slug is required.");
      return;
    }

    const payload = {
      title: formState.title.trim(),
      slug: formState.slug.trim(),
      description: formState.description.trim() || null,
      image: formState.image.trim() || null,
      content: formState.content,
      tagIds: formState.tagIds,
      publishedAt: nextPublishedAt,
      metadata: null,
    };

    const isEditing = formState.mode === "edit" && formState.originalSlug;
    const endpoint = isEditing
      ? `/api/cms/posts/${formState.originalSlug}`
      : "/api/cms/posts";
    const method = isEditing ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as WispRestPost | { error: string };

    if (!response.ok || !("slug" in result)) {
      const message =
        "error" in result
          ? result.error
          : locale === "vi"
            ? "Luu bai that bai."
            : "Failed to save post.";
      if (/paid plans|upgrade/i.test(message)) {
        setPlanBlocked(true);
      }
      setErrorMessage(message);
      return;
    }

    const nextState = toFormState(result);
    setFormState(nextState);
    setSelectedSlug(result.slug);
    setSlugTouched(true);
    setStatusMessage(
      nextPublishedAt
        ? locale === "vi"
          ? "Da publish bai viet."
          : "Post published."
        : locale === "vi"
          ? "Da luu nhap bai viet."
          : "Draft saved."
    );

    await loadPosts("");
  }

  async function deletePost() {
    if (!formState.originalSlug || !remoteWriteReady) {
      return;
    }

    const confirmed = window.confirm(
      locale === "vi"
        ? "Xoa bai viet nay khoi Wisp?"
        : "Delete this post from Wisp?"
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage("");
    setStatusMessage("");

    const response = await fetch(`/api/cms/posts/${formState.originalSlug}`, {
      method: "DELETE",
    });
    const result = (await response.json()) as
      | { success: boolean }
      | { error: string };

    if (!response.ok || !("success" in result)) {
      const message =
        "error" in result
          ? result.error
          : locale === "vi"
            ? "Xoa bai that bai."
            : "Failed to delete post.";
      if (/paid plans|upgrade/i.test(message)) {
        setPlanBlocked(true);
      }
      setErrorMessage(message);
      return;
    }

    resetEditor();
    await loadPosts("");
    setStatusMessage(
      locale === "vi" ? "Da xoa bai viet." : "Post deleted."
    );
  }

  function toggleTag(tagId: string, checked: boolean) {
    setFormState((current) => ({
      ...current,
      tagIds: checked
        ? [...current.tagIds, tagId]
        : current.tagIds.filter((item) => item !== tagId),
    }));
  }

  function setTitle(nextTitle: string) {
    setFormState((current) => ({
      ...current,
      title: nextTitle,
      slug: slugTouched ? current.slug : slugify(nextTitle),
    }));
  }

  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(formState.content);
      setStatusMessage(
        locale === "vi" ? "Da copy HTML." : "HTML copied to clipboard."
      );
    } catch {
      setErrorMessage(
        locale === "vi"
          ? "Khong copy duoc HTML."
          : "Could not copy HTML to clipboard."
      );
    }
  }

  async function copyPlainText() {
    try {
      const parser = new DOMParser();
      const text = parser.parseFromString(formState.content, "text/html").body
        .innerText;
      await navigator.clipboard.writeText(text);
      setStatusMessage(
        locale === "vi" ? "Da copy van ban." : "Plain text copied."
      );
    } catch {
      setErrorMessage(
        locale === "vi"
          ? "Khong copy duoc van ban."
          : "Could not copy plain text."
      );
    }
  }

  return (
    <section className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200/80">
            phamdaibang.com
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
            {copy.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <div className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-200">
              {authEnabled ? (
                <span className="inline-flex items-center gap-2">
                  <Lock className="h-4 w-4 text-amber-100" />
                  {copy.connected}
                </span>
              ) : (
                copy.authMissing
              )}
            </div>
            <div className="rounded-full border border-white/10 px-3 py-1 text-sm text-zinc-200">
               {planBlocked ? (
                 <span className="inline-flex items-center gap-2">
                   <PencilLine className="h-4 w-4 text-amber-100" />
                   {locale === "vi"
                     ? "Wisp dang khoa write API theo plan"
                     : "Wisp write API blocked by plan"}
                 </span>
               ) : writeEnabled ? (
                 <span className="inline-flex items-center gap-2">
                   <PencilLine className="h-4 w-4 text-amber-100" />
                   Wisp write API ready
                </span>
              ) : (
                copy.apiMissing
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111111] p-6">
          <h2 className="font-display text-2xl font-semibold text-white">
            {copy.siteContentTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {copy.siteContentDescription}
          </p>
          <div className="mt-5 space-y-3">
            {copy.siteSurfaces.map((surface) => (
              <div
                key={surface.name}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{surface.name}</p>
                  <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-zinc-400">
                    {surface.source}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {surface.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {authEnabled && !isAuthenticated ? (
        <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#111111] p-6">
          <h2 className="font-display text-2xl font-semibold text-white">
            {copy.loginTitle}
          </h2>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {copy.loginDescription}
          </p>
          <label className="mt-5 block text-sm font-medium text-zinc-200">
            {copy.passwordLabel}
          </label>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={copy.passwordPlaceholder}
            className="mt-2 border-white/10 bg-black/30 text-white"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleLogin();
              }
            }}
          />
          {authError ? (
            <p className="mt-3 text-sm text-red-300">{authError}</p>
          ) : null}
          <Button
            onClick={() => void handleLogin()}
            className="mt-5 w-full bg-amber-100 text-zinc-950 hover:bg-amber-200"
          >
            {copy.loginAction}
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[300px,minmax(0,1fr),320px]">
          <aside className="rounded-2xl border border-white/10 bg-[#111111] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-semibold text-white">
                  {copy.libraryTitle}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {copy.libraryDescription}
                </p>
              </div>
              {authEnabled ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => void handleLogout()}
                  className="text-zinc-400 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              ) : null}
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                onClick={resetEditor}
                className="flex-1 bg-amber-100 text-zinc-950 hover:bg-amber-200"
              >
                <FilePlus2 className="h-4 w-4" />
                {copy.newDraft}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  startTransition(() => {
                    loadPosts(deferredSearch).catch((error) => {
                      setErrorMessage(
                        error instanceof Error ? error.message : copy.loadError
                      );
                    });
                  })
                }
                className="border-white/10 bg-transparent text-zinc-300 hover:bg-white/5"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="border-white/10 bg-black/30 pl-9 text-white"
              />
            </div>

            <div className="mt-4 max-h-[760px] space-y-2 overflow-y-auto pr-1">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  const active =
                    selectedSlug === post.slug ||
                    formState.originalSlug === post.slug;

                  return (
                    <button
                      key={post.id}
                      type="button"
                      onClick={() => void selectPost(post.slug)}
                      disabled={!remoteWriteReady}
                      className={cn(
                        "w-full rounded-xl border border-white/10 p-4 text-left transition hover:border-amber-200/40 hover:bg-white/[0.03]",
                        active && "border-amber-200/60 bg-white/[0.05]"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium text-white">
                          {post.title || copy.untitled}
                        </p>
                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-zinc-400">
                          {post.publishedAt ? copy.published : copy.draft}
                        </span>
                      </div>
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-500">
                        /{post.slug}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">
                        {post.description || copy.untitled}
                      </p>
                      <p className="mt-3 text-xs text-zinc-500">
                        {formatDate(post.updatedAt, locale)}
                      </p>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-zinc-500">
                  {copy.noPosts}
                </div>
              )}
            </div>
          </aside>

          <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-semibold text-white">
                  {copy.editorTitle}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {copy.editorDescription}
                </p>
              </div>
              {formState.originalSlug ? (
                <Link
                  href={`/${locale}/blog/${formState.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:border-amber-200/60 hover:text-white"
                >
                  {copy.viewLive}
                  <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-200">
                  {copy.titleLabel}
                </label>
                <Input
                  value={formState.title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-2 border-white/10 bg-black/30 text-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-200">
                  {copy.slugLabel}
                </label>
                <Input
                  value={formState.slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    setFormState((current) => ({
                      ...current,
                      slug: slugify(event.target.value),
                    }));
                  }}
                  className="mt-2 border-white/10 bg-black/30 text-white"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-zinc-200">
                {copy.excerptLabel}
              </label>
              <Textarea
                value={formState.description}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className="mt-2 min-h-28 border-white/10 bg-black/30 text-white"
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
              <div>
                <label className="text-sm font-medium text-zinc-200">
                  {copy.imageLabel}
                </label>
                <Input
                  value={formState.image}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      image: event.target.value,
                    }))
                  }
                  className="mt-2 border-white/10 bg-black/30 text-white"
                />
                <p className="mt-2 text-xs text-zinc-500">{copy.imageHelp}</p>
              </div>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-zinc-200 transition hover:border-amber-200/60 hover:text-white">
                {uploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="mr-2 h-4 w-4" />
                )}
                {uploading ? copy.uploading : copy.imageLabel}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void handleImageUpload(file);
                    }
                  }}
                />
              </label>
            </div>

            <div className="mt-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <ToolbarButton
                  icon={Bold}
                  label="Bold"
                  active={editor?.isActive("bold")}
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                />
                <ToolbarButton
                  icon={Italic}
                  label="Italic"
                  active={editor?.isActive("italic")}
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                />
                <ToolbarButton
                  icon={Heading2}
                  label="Heading 2"
                  active={editor?.isActive("heading", { level: 2 })}
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                />
                <ToolbarButton
                  icon={Heading3}
                  label="Heading 3"
                  active={editor?.isActive("heading", { level: 3 })}
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                />
                <ToolbarButton
                  icon={List}
                  label="Bullet list"
                  active={editor?.isActive("bulletList")}
                  onClick={() =>
                    editor?.chain().focus().toggleBulletList().run()
                  }
                />
                <ToolbarButton
                  icon={ListOrdered}
                  label="Ordered list"
                  active={editor?.isActive("orderedList")}
                  onClick={() =>
                    editor?.chain().focus().toggleOrderedList().run()
                  }
                />
                <ToolbarButton
                  icon={Quote}
                  label="Quote"
                  active={editor?.isActive("blockquote")}
                  onClick={() =>
                    editor?.chain().focus().toggleBlockquote().run()
                  }
                />
                <ToolbarButton
                  icon={Link2}
                  label="Add link"
                  active={editor?.isActive("link")}
                  onClick={() => {
                    const currentUrl = editor?.getAttributes("link").href || "";
                    const nextUrl = window.prompt("URL", currentUrl);
                    if (nextUrl === null) {
                      return;
                    }
                    if (!nextUrl.trim()) {
                      editor?.chain().focus().unsetLink().run();
                      return;
                    }
                    editor
                      ?.chain()
                      .focus()
                      .extendMarkRange("link")
                      .setLink({ href: nextUrl.trim() })
                      .run();
                  }}
                />
                <ToolbarButton
                  icon={Unlink2}
                  label="Remove link"
                  onClick={() => editor?.chain().focus().unsetLink().run()}
                />
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30">
                <div className="border-b border-white/10 px-4 py-2 text-sm font-medium text-zinc-200">
                  {copy.contentLabel}
                </div>
                <EditorContent editor={editor} />
              </div>
            </div>

            {errorMessage ? (
              <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {errorMessage}
              </div>
            ) : null}
            {statusMessage ? (
              <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {statusMessage}
              </div>
            ) : null}
            {planBlocked ? (
              <div className="mt-4 rounded-xl border border-amber-200/20 bg-amber-100/10 px-4 py-3 text-sm leading-6 text-amber-50">
                {locale === "vi"
                  ? "Wisp dang chan REST API tren plan hien tai. Ban van co the soan thao, luu draft local va copy noi dung tu day; publish truc tiep se bat ngay khi Wisp mo API cho plan nay."
                  : "Wisp is blocking REST API access on the current plan. You can still compose here, keep local drafts, and copy content out; direct publish will work as soon as the Wisp API is enabled for this plan."}
              </div>
            ) : null}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
              <h2 className="font-display text-2xl font-semibold text-white">
                Publish
              </h2>
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.localStorage.setItem(
                        localDraftKey,
                        JSON.stringify(formState)
                      );
                    }
                    setStatusMessage(
                      locale === "vi"
                        ? "Da luu draft tren trinh duyet nay."
                        : "Draft saved in this browser."
                    );
                  }}
                  disabled={isPending || uploading}
                  className="w-full justify-start bg-white text-zinc-950 hover:bg-zinc-200"
                >
                  <Save className="h-4 w-4" />
                  {copy.saveDraft}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void copyHtml()}
                  className="w-full justify-start border-white/10 bg-transparent text-zinc-200 hover:bg-white/5"
                >
                  <Link2 className="h-4 w-4" />
                  Copy HTML
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void copyPlainText()}
                  className="w-full justify-start border-white/10 bg-transparent text-zinc-200 hover:bg-white/5"
                >
                  <PencilLine className="h-4 w-4" />
                  Copy text
                </Button>
                <Button
                  onClick={() => void savePost(new Date().toISOString())}
                  disabled={isPending || uploading || !remoteWriteReady}
                  className="w-full justify-start bg-amber-100 text-zinc-950 hover:bg-amber-200"
                >
                  <Send className="h-4 w-4" />
                  {copy.publishNow}
                </Button>
                {formState.mode === "edit" ? (
                  <Button
                    variant="outline"
                    onClick={() => void deletePost()}
                    disabled={isPending || !remoteWriteReady}
                    className="w-full justify-start border-red-400/20 bg-transparent text-red-200 hover:bg-red-500/10 hover:text-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                    {copy.deletePost}
                  </Button>
                ) : null}
              </div>
              {!remoteWriteReady ? (
                <p className="mt-4 text-sm leading-6 text-zinc-500">
                  {planBlocked
                    ? locale === "vi"
                      ? "Wisp dang khoa REST API theo plan hien tai."
                      : "Wisp REST API is blocked by the current plan."
                    : copy.apiMissing}
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
              <h2 className="font-display text-2xl font-semibold text-white">
                {copy.languageLabel}
              </h2>
              <div className="mt-4 space-y-3">
                {languageTags.map((tag) => {
                  const checked = formState.tagIds.includes(tag.id);

                  return (
                    <label
                      key={tag.id}
                      className="flex items-center gap-3 rounded-xl border border-white/10 p-3 text-sm text-zinc-200"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) =>
                          toggleTag(tag.id, Boolean(value))
                        }
                      />
                      <span>{tag.name.toUpperCase()}</span>
                    </label>
                  );
                })}
              </div>

              <h3 className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
                {copy.tagsLabel}
              </h3>
              <div className="mt-3 max-h-60 space-y-3 overflow-y-auto pr-1">
                {topicTags.map((tag) => {
                  const checked = formState.tagIds.includes(tag.id);

                  return (
                    <label
                      key={tag.id}
                      className="flex items-center gap-3 rounded-xl border border-white/10 p-3 text-sm text-zinc-200"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) =>
                          toggleTag(tag.id, Boolean(value))
                        }
                      />
                      <span>#{tag.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
              <h2 className="font-display text-2xl font-semibold text-white">
                {copy.seoTitle}
              </h2>
              <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
                <p className="line-clamp-2 text-lg text-[#8ab4f8]">
                  {formState.title || copy.untitled}
                </p>
                <p className="mt-1 text-sm text-[#9aa0a6]">
                  {`phamdaibang.com/${locale}/blog/${formState.slug || "your-slug"}`}
                </p>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-300">
                  {formState.description || copy.seoDescription}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
              <h2 className="font-display text-2xl font-semibold text-white">
                {copy.checklistTitle}
              </h2>
              <div className="mt-4 space-y-3">
                {copy.checklist.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-xl border border-white/10 p-3 text-sm leading-6 text-zinc-300"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-100" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111111] p-5">
              <div className="flex items-center gap-2 text-white">
                <Globe className="h-4 w-4 text-amber-100" />
                <Eye className="h-4 w-4 text-amber-100" />
                <p className="text-sm font-medium">{copy.viewLive}</p>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href={`/${locale}/blog`}
                  target="_blank"
                  className="inline-flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300 transition hover:border-amber-200/60 hover:text-white"
                >
                  Blog index
                  <ExternalLink className="h-4 w-4" />
                </Link>
                <Link
                  href={`/${locale}/cms`}
                  target="_blank"
                  className="inline-flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-300 transition hover:border-amber-200/60 hover:text-white"
                >
                  CMS route
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
