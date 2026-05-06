import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { hasCmsSession, isCmsAuthEnabled, isCmsWriteEnabled } from "@/lib/cms-auth";
import { isLocale, type Locale } from "@/lib/i18n";
import { wisp } from "@/lib/wisp";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CmsWorkspaceClient } from "./CmsWorkspaceClient";

interface Params {
  lang: string;
}

const copy = {
  vi: {
    title: "Trung tâm soạn thảo nội dung",
    subtitle:
      "Một workspace duy nhất để quản lý bài blog, kiểm tra trạng thái kết nối Wisp, và từng bước tiến tới quản lý toàn bộ nội dung website từ cùng một chỗ.",
    loginTitle: "Đăng nhập CMS",
    loginDescription:
      "Nhập mật khẩu biên tập để mở chế độ chỉnh sửa trực tiếp trên Wisp.",
    passwordLabel: "Mật khẩu CMS",
    passwordPlaceholder: "Nhập mật khẩu biên tập",
    loginAction: "Mở workspace",
    logoutAction: "Đăng xuất",
    authMissing:
      "CMS_LOGIN_PASSWORD chưa được cấu hình. Route CMS vẫn mở để review, nhưng chức năng ghi nội dung đang bị khóa.",
    apiMissing:
      "WISP_API_KEY chưa có. Hệ thống đã sẵn lớp editor và API nội bộ, nhưng chưa thể ghi bài trực tiếp vào Wisp.",
    connected: "Phiên biên tập đã sẵn sàng",
    readonly: "Chế độ chỉ đọc",
    editorTitle: "Blog editor",
    editorDescription:
      "Soạn, chỉnh, lưu nháp, publish và cập nhật ảnh đại diện trực tiếp từ site này.",
    libraryTitle: "Thư viện bài viết",
    libraryDescription: "Danh sách bài gần đây lấy từ Wisp để tìm và chỉnh sửa nhanh.",
    siteContentTitle: "Bề mặt nội dung ngoài blog",
    siteContentDescription:
      "Các trang như homepage, about, contact và projects hiện vẫn còn code-backed. Tôi đang gom chúng về cùng một mô hình nội dung để mở đường cho chỉnh sửa trực tiếp toàn site.",
    newDraft: "Bài nháp mới",
    refresh: "Làm mới",
    searchPlaceholder: "Tìm theo tiêu đề, slug hoặc tag",
    untitled: "Chưa có tiêu đề",
    draft: "Nháp",
    published: "Live",
    noPosts: "Không có bài nào khớp bộ lọc hiện tại.",
    loadError: "Không tải được danh sách bài viết.",
    titleLabel: "Tiêu đề",
    slugLabel: "Slug",
    excerptLabel: "Mô tả ngắn / SEO description",
    imageLabel: "Ảnh đại diện",
    imageHelp: "Có thể dán URL hoặc upload ảnh trực tiếp sang Wisp.",
    contentLabel: "Nội dung bài viết",
    tagsLabel: "Chủ đề",
    languageLabel: "Ngôn ngữ",
    seoTitle: "Xem trước SEO",
    seoDescription: "Mô tả sẽ hiển thị ở đây khi chưa nhập nội dung.",
    checklistTitle: "Checklist biên tập",
    checklist: [
      "Tiêu đề rõ, không quá dài, đúng giọng của site.",
      "Slug ngắn, sạch, không trùng với bài cũ.",
      "Có ngôn ngữ vi hoặc en đúng với bài viết.",
      "Description đủ ngắn để chia sẻ social và search.",
      "Ảnh đại diện rõ chủ thể và hiển thị tốt ở crop ngang.",
      "Đã mở lại trang live để kiểm tra sau khi publish.",
    ],
    saveDraft: "Lưu nháp",
    publishNow: "Publish ngay",
    updatePost: "Cập nhật bài viết",
    deletePost: "Xóa bài viết",
    deleting: "Đang xóa...",
    uploading: "Đang upload...",
    viewLive: "Xem live",
    siteSurfaces: [
      {
        name: "Homepage",
        source: "Code-backed",
        note:
          "Hero, navigation copy và quick links đang nằm trong source code. Đây là mục nên tách ra đầu tiên nếu muốn vận hành toàn site từ CMS.",
      },
      {
        name: "About / Contact",
        source: "Code-backed",
        note:
          "Nội dung các trang giới thiệu hiện chưa có writable backend riêng. Cần một content store ngoài code hoặc một lớp sync vào repo.",
      },
      {
        name: "Projects",
        source: "Code-backed",
        note:
          "Portfolio và project data đã có cấu trúc tốt, phù hợp để chuyển sang collection riêng trong giai đoạn tiếp theo.",
      },
    ],
  },
  en: {
    title: "Content authoring workspace",
    subtitle:
      "One workspace for direct blog authoring, Wisp connection status, and the path toward managing the rest of the website from the same place.",
    loginTitle: "CMS login",
    loginDescription:
      "Enter the editor password to unlock direct writing against Wisp.",
    passwordLabel: "CMS password",
    passwordPlaceholder: "Enter editor password",
    loginAction: "Open workspace",
    logoutAction: "Log out",
    authMissing:
      "CMS_LOGIN_PASSWORD is not configured yet. The CMS route is still available for review, but write access is locked.",
    apiMissing:
      "WISP_API_KEY is missing. The editor and internal API bridge are in place, but direct writing to Wisp is still disabled.",
    connected: "Editor session ready",
    readonly: "Read-only mode",
    editorTitle: "Blog editor",
    editorDescription:
      "Write, edit, save drafts, publish, and update hero images directly from this site.",
    libraryTitle: "Post library",
    libraryDescription: "Recent Wisp posts for quick search and editing.",
    siteContentTitle: "Non-blog content surfaces",
    siteContentDescription:
      "Homepage, about, contact, and projects are still code-backed today. The next step is moving them into a unified content model so the whole site can be edited from here.",
    newDraft: "New draft",
    refresh: "Refresh",
    searchPlaceholder: "Search by title, slug, or tag",
    untitled: "Untitled",
    draft: "Draft",
    published: "Live",
    noPosts: "No posts match the current filter.",
    loadError: "Failed to load posts.",
    titleLabel: "Title",
    slugLabel: "Slug",
    excerptLabel: "Excerpt / SEO description",
    imageLabel: "Featured image",
    imageHelp: "Paste an image URL or upload directly to Wisp.",
    contentLabel: "Post content",
    tagsLabel: "Topics",
    languageLabel: "Language",
    seoTitle: "SEO preview",
    seoDescription: "Your search description preview will appear here.",
    checklistTitle: "Editorial checklist",
    checklist: [
      "The title is clear, compact, and consistent with the site voice.",
      "The slug is short, clean, and not duplicated.",
      "The correct vi or en language tag is selected.",
      "The description is concise enough for search and social.",
      "The featured image survives a horizontal crop cleanly.",
      "The live page has been checked again after publishing.",
    ],
    saveDraft: "Save draft",
    publishNow: "Publish now",
    updatePost: "Update post",
    deletePost: "Delete post",
    deleting: "Deleting...",
    uploading: "Uploading...",
    viewLive: "View live",
    siteSurfaces: [
      {
        name: "Homepage",
        source: "Code-backed",
        note:
          "Hero copy, navigation text, and quick links still live in source code. This is the first migration target for whole-site editing.",
      },
      {
        name: "About / Contact",
        source: "Code-backed",
        note:
          "These pages do not yet have a writable backend. They need either an external content store or a repo-sync layer.",
      },
      {
        name: "Projects",
        source: "Code-backed",
        note:
          "The portfolio structure is already clean enough to migrate into a dedicated collection next.",
      },
    ],
  },
} as const;

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const params = await props.params;

  if (!isLocale(params.lang)) {
    return { title: "CMS" };
  }

  const locale = params.lang;

  return {
    title:
      locale === "vi"
        ? "Trung tâm soạn thảo nội dung"
        : "Content authoring workspace",
    description: copy[locale].subtitle,
    alternates: {
      canonical: `/${locale}/cms`,
      languages: {
        vi: "/vi/cms",
        en: "/en/cms",
      },
    },
  };
}

async function getCmsData() {
  try {
    const [postsResult, tagsResult] = await Promise.all([
      wisp.getPosts({ limit: 12 }),
      wisp.getTags(1, "all"),
    ]);

    return {
      posts: postsResult.posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        description: post.description,
        image: post.image,
        updatedAt: post.updatedAt.toString(),
        publishedAt: post.publishedAt ? post.publishedAt.toString() : null,
        tags: post.tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
        })),
      })),
      tags: tagsResult.tags,
    };
  } catch {
    return {
      posts: [],
      tags: [],
    };
  }
}

export default async function CmsPage(props: { params: Promise<Params> }) {
  const params = await props.params;

  if (!isLocale(params.lang)) {
    return notFound();
  }

  const locale = params.lang as Locale;
  const cmsData = await getCmsData();
  const authenticated = await hasCmsSession();

  return (
    <div className="min-h-screen bg-[#080807] text-zinc-100">
      <div className="mx-auto w-full max-w-7xl px-5 pb-14">
        <Header locale={locale} />
        <CmsWorkspaceClient
          locale={locale}
          copy={copy[locale]}
          authEnabled={isCmsAuthEnabled()}
          writeEnabled={isCmsWriteEnabled()}
          authenticated={authenticated}
          initialPosts={cmsData.posts}
          tags={cmsData.tags}
        />
        <Footer />
      </div>
    </div>
  );
}
