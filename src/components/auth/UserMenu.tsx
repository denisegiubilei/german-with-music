"use client";

import { useRouter } from "next/navigation";
import { Nav, Button, Spinner } from "react-bootstrap";
import { useAppSelector } from "@/store";
import { useLogoutMutation } from "@/integrations/lyric-palette";
import { useLocale } from "@/i18n/locale-context";
import { localizedPath } from "@/lib/localized-path";
import { LocalizedLinkClient } from "@/components/localized-link/LocalizedLinkClient";

interface UserMenuCopy {
  signIn: string;
  signUp: string;
  myAccount: string;
  signOut: string;
}

export function UserMenu({ copy }: { copy: UserMenuCopy }) {
  const router = useRouter();
  const locale = useLocale();
  const user = useAppSelector((state) => state.auth.user);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  async function handleLogout() {
    await logout().unwrap().catch(() => {});
    router.replace(localizedPath("/", locale));
  }

  if (user) {
    return (
      <div className="d-flex align-items-center gap-2">
        <Nav.Link
          as={LocalizedLinkClient}
          href="/me"
          className="text-body-secondary py-md-1 small"
        >
          {user.name ?? user.login}
        </Nav.Link>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="py-1"
        >
          {isLoggingOut ? (
            <Spinner size="sm" aria-label={copy.signOut} />
          ) : (
            copy.signOut
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center gap-2">
      <Nav.Link
        as={LocalizedLinkClient}
        href="/signin"
        className="text-body-secondary py-md-1 small"
      >
        {copy.signIn}
      </Nav.Link>
      <LocalizedLinkClient
        href="/signup"
        className="btn btn-warning btn-sm text-dark border-0 py-1 text-decoration-none"
      >
        {copy.signUp}
      </LocalizedLinkClient>
    </div>
  );
}
