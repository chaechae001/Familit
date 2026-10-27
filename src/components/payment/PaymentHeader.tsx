import { Link } from "@tanstack/react-router";
import { FamilitLogo } from "@/components/ui/FamilitLogo";

export function PaymentHeader() {
  return (
    <header className="border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Familit 홈">
          <FamilitLogo size={32} />
          <span className="font-display text-lg font-bold tracking-tight">Familit</span>
        </Link>
        <Link
          to="/pricing"
          className="text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          요금제
        </Link>
      </div>
    </header>
  );
}
