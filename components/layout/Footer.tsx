import Link from "next/link";
import Image from "next/image";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    browse: [
      { label: "All Anime", href: "/browse" },
      { label: "Movies", href: "/browse?type=Movie" },
      { label: "TV Series", href: "/browse?type=TV" },
      { label: "Trending", href: "/browse?sort=popularity" },
    ],
    genres: [
      { label: "Action", href: "/browse?genre=Action" },
      { label: "Romance", href: "/browse?genre=Romance" },
      { label: "Comedy", href: "/browse?genre=Comedy" },
      { label: "Fantasy", href: "/browse?genre=Fantasy" },
    ],
    account: [
      { label: "Login", href: "/" },
      { label: "Register", href: "/register" },
      { label: "Watchlist", href: "#" }, // Fallback until page exists
      { label: "Settings", href: "#" },   // Fallback until page exists
    ],
  };

  return (
    <footer className="bg-white dark:bg-black border-t border-slate-200 dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/Slice Meow Final-log.png"
                alt="Slice Meow"
                width={150}
                height={50}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-sm text-slate-500 max-w-xs">
              Your personal sanctuary for tracking and discovering the finest anime content.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <Twitter size={18} className="text-slate-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <Github size={18} className="text-slate-400" />
              </a>
            </div>
          </div>

          {/* Browse links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
              Browse
            </h3>
            <ul className="space-y-3">
              {footerLinks.browse.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genre links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
              Genres
            </h3>
            <ul className="space-y-3">
              {footerLinks.genres.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
              Account
            </h3>
            <ul className="space-y-3">
              {footerLinks.account.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © {currentYear} Slice Meow. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-slate-600 hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-slate-600 hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
