import Link from "next/link";
import Image from "next/image";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    browse: [
      { label: "All Anime", href: "/browse" },
      { label: "Movies", href: "/movies" },
      { label: "TV Series", href: "/browse?type=TV" },
      { label: "Trending", href: "/browse?sort=popularity" },
    ],
    genres: [
      { label: "Action", href: "/browse?genre=Action" },
      { label: "Romance", href: "/browse?genre=Romance" },
      { label: "Comedy", href: "/browse?genre=Comedy" },
      { label: "Fantasy", href: "/browse?genre=Fantasy" },
    ],
  };

  return (
    <footer className="bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block group transition-transform hover:scale-105">
              <div className="bg-white rounded-xl px-1 shadow-[0_4px_20px_rgba(255,255,255,0.05)]">
                <Image
                  src="/Slice Meow Final-log.png"
                  alt="Slice Meow"
                  width={150}
                  height={40}
                  className="h-12 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="mt-4 text-sm text-slate-500 max-w-sm leading-relaxed">
              Experience anime like never before. A premium, ad-free sanctuary for the most dedicated fans to discover, track, and enjoy the finest animation from around the world.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 flex items-center justify-center transition-all group"
              >
                <Twitter size={18} className="text-slate-500 group-hover:text-blue-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 flex items-center justify-center transition-all group"
              >
                <Github size={18} className="text-slate-500 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Browse links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-6">
              Platform
            </h3>
            <ul className="space-y-4">
              {footerLinks.browse.map((link) => (
                <li key={link.href}>
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
            <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-6">
              Discover
            </h3>
            <ul className="space-y-4">
              {footerLinks.genres.map((link) => (
                <li key={link.href}>
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
