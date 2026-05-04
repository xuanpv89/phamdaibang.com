"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { config } from "@/config";
import { dictionary, getLocalizedPath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FunctionComponent } from "react";
import { LanguagePicker } from "./LanguagePicker";
interface MenuItem {
  name: string;
  href: string;
  openInNewTab?: boolean;
}
const buildMenuItems = (locale: Locale): MenuItem[] => [
  { name: dictionary[locale].nav.blog, href: getLocalizedPath(locale, "/") },
  {
    name: dictionary[locale].nav.about,
    href: getLocalizedPath(locale, "/about"),
  },
];
export const Navigation: FunctionComponent<{ locale: Locale }> = ({
  locale,
}) => {
  const pathname = usePathname();
  const menuItems = buildMenuItems(locale);

  return (
    <nav>
      <div className="hidden md:flex items-center">
        {menuItems.map((item) => (
          <div key={item.href} className="ml-4 md:ml-8">
            <a
              href={item.href}
              target={item.openInNewTab ? "_blank" : "_self"}
              className={cn(
                "hover:text-gray-900",
                pathname === item.href && "font-semibold"
              )}
            >
              {item.name}
            </a>
          </div>
        ))}
        <div className="ml-4 md:ml-8">
          <LanguagePicker currentLocale={locale} />
        </div>
      </div>
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <Menu size="24" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetDescription>
                {menuItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target={item.openInNewTab ? "_blank" : "_self"}
                    className={cn(
                      "block py-2",
                      pathname === item.href && "font-semibold"
                    )}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-3">
                  <LanguagePicker currentLocale={locale} />
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export const Header: FunctionComponent<{ locale: Locale }> = ({ locale }) => {
  return (
    <section className="flex items-center justify-between mt-8 md:mt-16 mb-12">
      <Link href={getLocalizedPath(locale, "/")}>
        <h1 className="text-3xl md:text-4.5xl font-bold tracking-tighter leading-tight">
          {config.blog.name}
        </h1>
      </Link>
      <Navigation locale={locale} />
    </section>
  );
};
