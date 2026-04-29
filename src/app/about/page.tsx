import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import Markdown from "react-markdown";

const content = `# Welcome to the corner of Phạm Đại Bàng.

![Phamdaibang](public/images/phamdaibang-profile.png/public)

Welcome to the corner of Phạm Đại Bàng.

In a world filled with constant noise, this blog serves as a quiet retreat for those who appreciate the weight of words and the depth of reflection. Here, I explore life through multiple lenses—from the analytical to the purely imaginative.

Inside, you will find:
- A Cup of Words & Musings: Light yet lingering thoughts on the everyday.
- Fiction & Non-Fiction: A blend of sharp real-world observations and creative storytelling.
- The Breath of Poetry: Where rhythm meets the soul, offering a moment of stillness.
- Notes & Random Posts: Snapshots of knowledge, economic paradoxes (#Startjup), or simply the vibe of a favorite rooftop.

Join me on this journey of contemplation, where every post is a sincere dialogue between the writer and the reader.

`;

export async function generateMetadata() {
  return {
    title: "About Me",
    description: "Learn more about Samantha and her travel adventures",
    openGraph: {
      title: "About Me",
      description: "Learn more about Samantha and her travel adventures",
      images: [
        signOgImageUrl({
          title: "Samantha",
          label: "About Me",
          brand: config.blog.name,
        }),
      ],
    },
  };
}

const Page = async () => {
  return (
    <div className="container mx-auto px-5">
      <Header />
      <div className="prose lg:prose-lg dark:prose-invert m-auto mt-20 mb-10 blog-content">
        <Markdown>{content}</Markdown>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
