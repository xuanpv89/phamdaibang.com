/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "blog.phamdaibang.com",
          },
        ],
        destination: "https://phamdaibang.com/:path*",
        permanent: true,
      },
      {
        source: "/",
        destination: "/vi",
        permanent: false,
      },
      {
        source: "/about",
        destination: "/vi/about",
        permanent: true,
      },
      {
        source: "/projects",
        destination: "/vi/projects",
        permanent: true,
      },
      {
        source: "/projects/:path*",
        destination: "/vi/projects/:path*",
        permanent: true,
      },
      {
        source: "/contact",
        destination: "/vi/contact",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/vi/blog",
        permanent: true,
      },
      {
        source: "/blog/:path*",
        destination: "/vi/blog/:path*",
        permanent: true,
      },
      {
        source: "/tag",
        destination: "/vi/tag",
        permanent: true,
      },
      {
        source: "/tag/:path*",
        destination: "/vi/tag/:path*",
        permanent: true,
      },
    ];
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ],
};

export default nextConfig;
