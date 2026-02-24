import Link from "next/link";

const NAV_ITEMS = [{ href: "/", label: "POST" }];

export default function Header() {
  return (
    <nav className="w-full border-b border-border px-8 py-5 bg-cream/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-4xl mx-auto flex justify-center items-center">
        <ul className="flex gap-8 text-xs font-semibold tracking-widest text-subtle">
          {NAV_ITEMS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="hover:text-crimson transition-colors uppercase">
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
