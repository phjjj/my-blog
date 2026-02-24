import Link from "next/link";

export default function Header() {
  return (
    <nav className="w-full border-b border-border px-8 py-5 flex justify-between items-center bg-cream/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="flex items-center gap-8">
        {/* <Link
          href="/"
          className="font-muji text-base font-bold text-crimson"
        >
          PHJJJ
        </Link> */}

        <div className="hidden md:flex gap-6 text-xs font-semibold tracking-widest text-subtle">
          <Link
            href="/"
            className="hover:text-crimson transition-colors uppercase"
          >
            POST
          </Link>
        </div>
      </div>
    </nav>
  );
}
