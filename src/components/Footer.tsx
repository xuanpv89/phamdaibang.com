"use client";

import { config } from "@/config";
import { Rss } from "lucide-react";
import Link from "next/link";
import { FunctionComponent } from "react";
import { DarkModeToggle } from "./DarkModeToggle";
import { Button } from "./ui/button";

export const Footer: FunctionComponent = () => {
  return (
    <section className="mt-8 md:mt-16 mb-12 motion-safe:animate-fade-in [animation-delay:180ms]">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          © {config.blog.copyright} {new Date().getFullYear()}
        </div>
        <div className="text-xs text-muted-foreground hidden lg:block">
          <Link href="https://folksteam.com" className="animated-link">
            BLOG POWERED BY FOLKS
          </Link>
        </div>
        <div>
          <Link href="/rss">
            <Button
              variant="ghost"
              className="p-2 transition duration-300 hover:-translate-y-0.5"
            >
              <Rss className="w-4 h-4" />
            </Button>
          </Link>
          <DarkModeToggle />
        </div>
      </div>
      <div className="text-xs text-muted-foreground lg:hidden">
        <Link href="https://folksteam.com" className="animated-link">
          BLOG POWERED BY FOLKS
        </Link>
      </div>
    </section>
  );
};
