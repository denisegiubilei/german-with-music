import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";

export interface MarketingShellProps {
  children: React.ReactNode;
}

export async function MarketingShell({ children }: MarketingShellProps) {
  return (
    <div className="marketing-shell min-vh-100 d-flex flex-column bg-body text-body">
      <Header />
      <main className="marketing-shell-main flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
}
