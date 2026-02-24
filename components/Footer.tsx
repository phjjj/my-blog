interface FooterProps {
  currentPage: number;
  totalPages: number;
}

export default function Footer({ currentPage, totalPages }: FooterProps) {
  const pageStr = String(currentPage).padStart(2, "0");
  const totalStr = String(totalPages).padStart(2, "0");

  return (
    <footer className="mt-20 flex justify-between items-center text-xs tracking-widest font-semibold text-subtle">
      <button
        className="hover:text-crimson transition-colors opacity-30 cursor-not-allowed"
        disabled
      >
        이전
      </button>

      <span className="text-muted">
        {pageStr} / {totalStr}
      </span>

      <button className="hover:text-crimson transition-colors">다음</button>
    </footer>
  );
}
