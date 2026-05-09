import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";

export interface MarketingShellProps {
  children: React.ReactNode;
}

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <div className="min-vh-100 bg-body text-body">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
