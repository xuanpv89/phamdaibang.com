export const locales = ["vi", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "vi";
export const defaultPostLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  vi: "VI",
  en: "EN",
};

export const languageTagNames: Record<Locale, string> = {
  vi: "vi",
  en: "en",
};

export const dictionary = {
  vi: {
    nav: {
      blog: "Blog",
      cms: "CMS",
      about: "Về Đại Bàng",
    },
    languagePickerLabel: "Chọn ngôn ngữ",
    allPosts: "Tất cả bài viết",
    emptyPosts: "Chưa có bài viết tiếng Việt.",
    tagsTitle: "Tags",
    tagsDescription: "Danh sách tất cả tags",
    taggedWith: "Bài viết có tag",
    relatedPosts: "Bài viết liên quan",
    readFullStory: "Đọc bài viết",
    loading: "Đang tải...",
    commentsTitle: "Bình luận",
    addCommentTitle: "Thêm bình luận",
    noComments: "Chưa có bình luận. Hãy là người đầu tiên bình luận.",
    commentPendingTitle: "Đang chờ xác minh email",
    commentPendingDescription:
      "Cảm ơn bạn đã bình luận. Vui lòng kiểm tra email để xác minh và đăng bình luận. Nếu không thấy email trong hộp thư đến, hãy kiểm tra thư rác.",
    commentErrorTitle: "Lỗi",
    commentSubmit: "Gửi bình luận",
    commentFields: {
      name: "Tên",
      namePlaceholder: "Tên của bạn",
      email: "Email",
      emailPlaceholder: "ban@example.com",
      website: "Website (không bắt buộc)",
      websitePlaceholder: "https://example.com",
      comment: "Bình luận",
      commentPlaceholder: "Chia sẻ suy nghĩ của bạn...",
    },
    commentValidation: {
      nameRequired: "Vui lòng nhập tên",
      invalidEmail: "Email không hợp lệ",
      invalidUrl: "URL không hợp lệ",
      contentRequired: "Vui lòng nhập nội dung bình luận",
    },
    aboutTitle: "Về Đại Bàng",
    aboutDescription: "Một góc nhỏ cho chữ nghĩa, suy tư và quan sát đời sống.",
    aboutContent: `# Chào mừng đến với góc viết của Phạm Đại Bàng.

![Phamdaibang](/images/phamdaibang-circle2026.webp)

Giữa một thế giới đầy tiếng ồn, blog này là một khoảng lặng cho những ai yêu sức nặng của chữ nghĩa và chiều sâu của suy tư. Ở đây, tôi nhìn đời sống qua nhiều lăng kính, từ phân tích, quan sát cho đến tưởng tượng.

Bạn sẽ tìm thấy:
- Một tách chữ và suy tưởng: những ghi chép nhẹ nhưng còn dư âm về đời sống thường ngày.
- Hư cấu và phi hư cấu: nơi quan sát thực tế gặp kể chuyện sáng tạo.
- Hơi thở của thơ: nhịp điệu, cảm xúc và những khoảng dừng.
- Ghi chú và bài viết ngẫu hứng: tri thức, nghịch lý kinh tế, #Startjup, hoặc chỉ là vibe của một sân thượng yêu thích.

Mời bạn cùng đi trong hành trình chiêm nghiệm này, nơi mỗi bài viết là một cuộc đối thoại chân thành giữa người viết và người đọc.`,
  },
  en: {
    nav: {
      blog: "Blog",
      cms: "CMS",
      about: "About Daibang",
    },
    languagePickerLabel: "Choose language",
    allPosts: "All posts",
    emptyPosts: "No English posts yet.",
    tagsTitle: "Tags",
    tagsDescription: "List of all tags",
    taggedWith: "Posts tagged with",
    relatedPosts: "Related Posts",
    readFullStory: "Read Full Story",
    loading: "Loading...",
    commentsTitle: "Comments",
    addCommentTitle: "Add comment",
    noComments: "No comments yet. Be the first to comment.",
    commentPendingTitle: "Pending email verification",
    commentPendingDescription:
      "Thanks for your comment. Please check your email to verify your email and post your comment. If you do not see it in your inbox, please check your spam folder.",
    commentErrorTitle: "Error",
    commentSubmit: "Post comment",
    commentFields: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@example.com",
      website: "Website (optional)",
      websitePlaceholder: "https://example.com",
      comment: "Comment",
      commentPlaceholder: "Share your thoughts...",
    },
    commentValidation: {
      nameRequired: "Name is required",
      invalidEmail: "Invalid email address",
      invalidUrl: "Please enter a valid URL",
      contentRequired: "Comment cannot be empty",
    },
    aboutTitle: "About Daibang",
    aboutDescription: "A small corner for words, reflection, and everyday observation.",
    aboutContent: `# Welcome to Pham Dai Bang's writing corner.

![Phamdaibang](/images/phamdaibang-circle2026.webp)

In a world filled with constant noise, this blog is a quiet retreat for those who appreciate the weight of words and the depth of reflection. Here, I explore life through multiple lenses, from the analytical to the purely imaginative.

Inside, you will find:
- A Cup of Words & Musings: light yet lingering thoughts on the everyday.
- Fiction & Non-Fiction: a blend of real-world observation and creative storytelling.
- The Breath of Poetry: where rhythm meets the soul and offers a moment of stillness.
- Notes & Random Posts: snapshots of knowledge, economic paradoxes (#Startjup), or simply the vibe of a favorite rooftop.

Join me on this journey of contemplation, where every post is a sincere dialogue between the writer and the reader.`,
  },
} as const;

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocalizedPath(locale: Locale, href: string) {
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

export function removeLanguageTags<T extends { name: string }>(tags: T[]) {
  const languageTags = new Set(Object.values(languageTagNames));
  return tags.filter((tag) => !languageTags.has(tag.name.toLowerCase()));
}

export function hasLocaleTag(
  tags: { name: string }[] | undefined,
  locale: Locale
) {
  return (
    tags?.some((tag) => tag.name.toLowerCase() === languageTagNames[locale]) ??
    false
  );
}

export function hasAnyLocaleTag(tags: { name: string }[] | undefined) {
  return locales.some((locale) => hasLocaleTag(tags, locale));
}

export function isPostInLocale(
  tags: { name: string }[] | undefined,
  locale: Locale
) {
  if (hasLocaleTag(tags, locale)) return true;
  return locale === defaultPostLocale && !hasAnyLocaleTag(tags);
}

export function getLocaleFromTags(tags: { name: string }[] | undefined) {
  return (
    locales.find((locale) => hasLocaleTag(tags, locale)) ?? defaultPostLocale
  );
}
