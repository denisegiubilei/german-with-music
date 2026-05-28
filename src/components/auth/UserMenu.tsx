"use client";

import classNames from "classnames";
import { forwardRef } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { Dropdown, Nav, Spinner } from "react-bootstrap";
import { useAppSelector } from "@/store";
import { useLogoutMutation } from "@/integrations/lyric-palette";
import { useLocale } from "@/i18n/locale-context";
import { localizedPath } from "@/lib/localized-path";
import { LocalizedLinkClient } from "@/components/localized-link/LocalizedLinkClient";
import styles from "./UserMenu.module.scss";

interface UserMenuCopy {
  signIn: string;
  signUp: string;
  myAccount: string;
  signOut: string;
}

type ToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const UserMenuToggle = forwardRef<HTMLButtonElement, ToggleProps>(
  function UserMenuToggle({ children, className = "", ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        {...rest}
        className={classNames(styles.toggle, className)}
      >
        {children}
      </button>
    );
  },
);

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
      <Dropdown align="end">
        <Dropdown.Toggle
          as={UserMenuToggle}
          id="user-menu-toggle"
          aria-label={copy.myAccount}
        >
          <User size={20} aria-hidden />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item as={LocalizedLinkClient} href="/me">
            {copy.myAccount}
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Spinner size="sm" className="me-2" aria-hidden />
                {copy.signOut}
              </>
            ) : (
              copy.signOut
            )}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
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
