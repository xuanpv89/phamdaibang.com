import { config } from "@/config";
import {
  buildWispClient,
  GetPostResult,
  GetPostsResult,
} from "@wisp-cms/client";

const emptyPagination = {
  page: 1,
  limit: "all" as const,
  totalPages: 0,
  nextPage: null,
  prevPage: null,
};

const emptyWispClient: ReturnType<typeof buildWispClient> = {
  getPosts: async ({ page = 1, limit = "all" } = {}) => ({
    posts: [],
    pagination: {
      page,
      limit,
      totalPages: 0,
      totalPosts: 0,
      nextPage: null,
      prevPage: null,
    },
  }),
  getPost: async () => ({
    post: null,
  }),
  getRelatedPosts: async () => ({
    posts: [],
  }),
  getCtas: async () => ({
    ctas: [],
  }),
  getTags: async (page = 1, limit = "all") => ({
    tags: [],
    pagination: {
      ...emptyPagination,
      page,
      limit,
      totalTags: 0,
    },
  }),
  getContents: async () => ({
    contents: [],
    contentType: {
      name: "",
      slug: "",
      schema: [] as never,
    },
    pagination: {
      ...emptyPagination,
      totalContents: 0,
    },
  }),
  getContent: async () => {
    throw new Error("NEXT_PUBLIC_BLOG_ID is required to fetch Wisp content.");
  },
  getComments: async ({ page = 1, limit = "all" }) => ({
    comments: [],
    pagination: {
      page,
      limit,
      totalPages: 0,
      totalComments: 0,
      nextPage: null,
      prevPage: null,
    },
    config: {
      enabled: false,
      allowUrls: false,
      allowNested: false,
      reviewType: "MANUAL_REVIEW",
      signUpMessage: null,
    },
  }),
  createComment: async () => ({
    success: false,
  }),
};

export const wisp = config.wisp.blogId
  ? buildWispClient({
      blogId: config.wisp.blogId,
    })
  : emptyWispClient;

export type { GetPostsResult, GetPostResult };
