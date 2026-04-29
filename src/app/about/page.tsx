import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { config } from "@/config";
import { signOgImageUrl } from "@/lib/og-image";
import Markdown from "react-markdown";

const content = `# About Me

![Samantha](https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/db7abbe3-aa5c-433e-a16d-cbf137d1c9e5.png/public)

Welcome to the corner of Phạm Đại Bàng.

In a world filled with constant noise, this blog serves as a quiet retreat for those who appreciate the weight of words and the depth of reflection. Here, I explore life through multiple lenses—from the analytical to the purely imaginative.

Inside, you will find:

A Cup of Words & Musings: Light yet lingering thoughts on the everyday.

Fiction & Non-Fiction: A blend of sharp real-world observations and creative storytelling.

The Breath of Poetry: Where rhythm meets the soul, offering a moment of stillness.

Notes & Random Posts: Snapshots of knowledge, economic paradoxes (#Startjup), or simply the vibe of a favorite rooftop.

Join me on this journey of contemplation, where every post is a sincere dialogue between the writer and the reader.

So I took a leap of faith, quit my cushy job in Singapore, and decided to see the world on my own terms. No more stuffy meetings or rigid schedules – just me, my backpack, and an open road ahead.

![Samantha](https://imagedelivery.net/lLmNeOP7HXG0OqaG97wimw/clvlugru90000o4g8ahxp069s/6b080e65-2329-4a36-ad5c-0a6af8d9aeb1.png/public)

This blog is where I'll be documenting my travels, sharing my experiences, and hopefully inspiring others to follow their wanderlust. From trekking through remote villages to savoring local cuisines, I'm on a mission to immerse myself in different cultures and create memories that will last a lifetime.

But this journey isn't just about checking off destinations from a bucket list. It's about self-discovery, personal growth, and finding the courage to live life on my own terms. I'll be honest and raw, sharing the highs and lows, the moments of pure bliss and the inevitable challenges that come with solo travel.

So join me on this adventure, and let's explore the world together! Who knows, maybe my stories will inspire you to take that leap of faith and pursue your own dreams, whatever they may be.

Let's go on an adventure!

Love,

Samantha`;

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
