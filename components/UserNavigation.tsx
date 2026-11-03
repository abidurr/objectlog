import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { auth0 } from "@/lib/auth0";
import { theme } from "./theme";

type UserNavigationProps = {
  session?: Awaited<ReturnType<typeof auth0.getSession>>;
};

const userNavLinks = [
  { href: "/", label: "Home" },
  { href: "/objects", label: "Objects" },
  { href: "/fields", label: "Fields" },
  { href: "/views", label: "Views" },
  { href: "/organizations", label: "Organizations" },
  { href: "/users", label: "Users" },
  { href: "/about", label: "About" },
  { href: "/documentation", label: "Documentation" },
  { href: "/profile", label: "My Account" },
];

export async function UserNavigation({
  session: providedSession,
}: UserNavigationProps = {}) {
  const session =
    providedSession === undefined ? await auth0.getSession() : providedSession;

  if (!session?.user) {
    return null;
  }

  return (
    <UserNav aria-label="User navigation">
      <div className="user-profile">
        {session.user.picture && (
          <Image
            className="user-image"
            src={session.user.picture}
            alt=""
            width={40}
            height={40}
          />
        )}
        <div className="user-details">
          <span className="user-name">
            {session.user.name ?? session.user.email}
          </span>
          {session.user.email && session.user.email !== session.user.name && (
            <span
              style={{ color: `${theme.PRIMARY_500}`, fontSize: "22px" }}
              className="user-email"
            >
              {session.user.email}
            </span>
          )}
        </div>
        <span className="chevron" aria-hidden="true" />
      </div>
      <ul className="menu-links">
        {userNavLinks.map((link) => (
          <li key={link.href}>
            <Link style={{ fontSize: "14px" }} href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
        <li key={"log-out"}>
          <Link
            style={{ fontSize: "14px", color: "red" }}
            href={"/auth/logout"}
          >
            Log Out
          </Link>
        </li>
      </ul>
    </UserNav>
  );
}

const UserNav = styled.nav`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 10;
  width: max-content;
  min-width: 190px;
  max-width: min(320px, calc(100vw - 32px));
  color: ${theme.BLACK_TEXT_COLOR};

  .user-profile {
    position: relative;
    z-index: 1;
    display: flex;
    min-height: 64px;
    width: max-content;
    max-width: 100%;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border: 1px solid rgba(0, 0, 102, 0.2);
    border-radius: 14px;
    background: linear-gradient(
      135deg,
      rgba(182, 204, 254, 0.99),
      rgba(226, 234, 252, 0.94)
    );
    box-shadow: 0 10px 30px rgba(0, 24, 82, 0.2);
    box-sizing: border-box;
    backdrop-filter: blur(12px);
    transition: border-color 180ms ease;
  }

  &:hover .user-profile,
  &:focus-within .user-profile {
    border-color: ${theme.PRIMARY_500};
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    box-shadow: none;
  }

  .user-image {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    border: 1px solid rgba(0, 0, 102, 0.25);
    border-radius: 50%;
    object-fit: cover;
  }

  .user-details {
    display: grid;
    flex: 1;
    min-width: 0;
    gap: 2px;
  }

  .user-name {
    overflow: hidden;
    font-size: 14px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .user-email {
    overflow: hidden;
    color: rgba(0, 0, 102, 0.72);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chevron {
    width: 9px;
    height: 9px;
    flex: 0 0 9px;
    margin-left: 8px;
    border-right: 2px solid ${theme.BLACK_TEXT_COLOR};
    border-bottom: 2px solid ${theme.BLACK_TEXT_COLOR};
    transform: rotate(45deg) translateY(-2px);
    transition: transform 180ms ease;
  }

  &:hover .chevron,
  &:focus-within .chevron {
    transform: rotate(225deg) translate(-2px, -1px);
  }

  .menu-links {
    position: absolute;
    right: 0;
    bottom: calc(100% - 2px);
    display: grid;
    gap: 3px;
    width: 100%;
    max-height: 0;
    margin: 0;
    padding: 0 8px;
    overflow: hidden;
    border: 1px solid transparent;
    border-bottom: 0;
    border-radius: 14px 14px 0 0;
    background: linear-gradient(
      160deg,
      rgba(182, 204, 254, 0.99),
      rgba(226, 234, 252, 0.94)
    );
    box-shadow: 0 12px 30px rgba(0, 24, 82, 0.2);
    list-style: none;
    opacity: 0;
    pointer-events: none;
    transform: translateY(10px);
    transform-origin: bottom;
    backdrop-filter: blur(12px);
    box-sizing: border-box;
    transition:
      max-height 220ms ease,
      opacity 180ms ease,
      padding 220ms ease,
      transform 180ms ease,
      border-color 180ms ease;
  }

  &:hover .menu-links,
  &:focus-within .menu-links {
    max-height: fit-content;
    padding: 8px;
    border-color: rgba(0, 0, 102, 0.2);
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .menu-links a {
    display: block;
    width: 100%;
    padding: 11px 12px;
    border-radius: 9px;
    color: ${theme.BLACK_TEXT_COLOR};
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 0.5px;
    text-decoration: none;
    text-align: center;
    box-sizing: border-box;
    transition:
      background-color 160ms ease,
      color 160ms ease;
  }

  .menu-links a:hover,
  .menu-links a:focus-visible,
  .menu-links a:active {
    background: ${theme.PRIMARY_500};
    color: ${theme.BLACK_TEXT_COLOR};
  }

  .menu-links a:focus-visible {
    outline: 2px solid ${theme.PRIMARY_400};
    outline-offset: -2px;
  }

  @media (max-width: 600px) {
    right: 16px;
    bottom: 16px;
  }

  @media (hover: none) {
    .menu-links {
      max-height: fit-content;
      padding: 8px;
      border-color: rgba(0, 0, 102, 0.2);
      opacity: 1;
      pointer-events: auto;
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .user-profile,
    .chevron,
    .menu-links,
    .menu-links a {
      transition: none;
    }
  }
`;
