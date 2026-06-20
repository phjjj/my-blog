import Link from "next/link";
import { PROFILE } from "@/lib/profile";

// ponytail: active 하이라이트 필요해지면 client 전환 + usePathname
const NAV_ITEMS = [
  { href: "/", label: "POST", external: false },
  { href: "/about", label: "ABOUT", external: false },
  { href: PROFILE.github, label: "GITHUB ↗", external: true },
];

export default function Header() {
  return (
    <nav className="w-full border-b border-border px-8 py-5 bg-cream/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-4xl mx-auto flex justify-center items-center">
        <ul className="flex gap-8 text-xs font-semibold tracking-widest text-subtle">
          {NAV_ITEMS.map(({ href, label, external }) => (
            <li key={href}>
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-crimson transition-colors uppercase"
                >
                  {label}
                </a>
              ) : (
                <Link href={href} className="hover:text-crimson transition-colors uppercase">
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
