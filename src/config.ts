const buildConfig = () => {
  const blogId = process.env.NEXT_PUBLIC_BLOG_ID;

  const name = process.env.NEXT_PUBLIC_BLOG_DISPLAY_NAME || "Pham Dai Bang";
  const copyright = process.env.NEXT_PUBLIC_BLOG_COPYRIGHT || "Pham Dai Bang";
  const defaultTitle =
    process.env.NEXT_DEFAULT_METADATA_DEFAULT_TITLE ||
    "Pham Dai Bang's Writing Corner";
  const defaultDescription =
    process.env.NEXT_PUBLIC_BLOG_DESCRIPTION ||
    "Pham Dai Bang's Writing Corner";
  const ogImageSecret = process.env.OG_IMAGE_SECRET;

  if (
    !ogImageSecret &&
    process.env.NODE_ENV === "production" &&
    typeof window === "undefined"
  ) {
    throw new Error("OG_IMAGE_SECRET is missing");
  }

  return {
    baseUrl: (
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ).replace(/\/$/, ""),
    blog: {
      name,
      copyright,
      metadata: {
        title: {
          absolute: defaultTitle,
          default: defaultTitle,
          template: `%s - ${defaultTitle}`,
        },
        description: defaultDescription,
      },
    },
    ogImageSecret: ogImageSecret || "development-og-image-secret",
    wisp: {
      blogId: blogId || "",
    },
  };
};

export const config = buildConfig();
