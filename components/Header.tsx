"use client";

import { styled } from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { theme } from "./theme";

const ACTIVE_TAB_COLOR = `${theme.PRIMARY_300}`;
const INACTIVE_TAB_COLOR = `${theme.PRIMARY_700}`;
const HOVER_TAB_COLOR = `${theme.PRIMARY_500}`;

const navItems = [
  { href: "/", label: "Home" },
  { href: "/documentation", label: "Documentation" },
  { href: "/about", label: "About" },
  { href: "/objects", label: "Objects" },
  { href: "/views", label: "Views" },
  { href: "/profile", label: "Profile" },
  // { href: "/fields", label: "Fields" },
  // { href: "/organizations", label: "Organizations" },
  // { href: "/users", label: "Users" },
];

const StyledNav = styled.nav<{ $isOpen: boolean; $isScrolled: boolean }>`
  width: fit-content;
  position: sticky;
  z-index: 3;
  top: ${({ $isScrolled }) => ($isScrolled ? "16px" : "32px")};
  font-size: 1em;
  border-radius: 8px;
  margin: 0px auto;
  background-color: ${({ $isScrolled }) =>
    $isScrolled ? "rgba(237, 242, 251, 0.5)" : "rgba(237, 242, 251, 0.2)"};
  box-shadow: ${({ $isScrolled }) =>
    $isScrolled ? theme.BOX_SHADOW.ELEVATION_8 : theme.BOX_SHADOW.ELEVATION_2};
  backdrop-filter: ${({ $isScrolled }) =>
    $isScrolled ? "blur(12px)" : "none"};
  transition:
    top 220ms ease-out,
    background-color 180ms ease-out,
    box-shadow 180ms ease-out,
    backdrop-filter 180ms ease-out;

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  .menu-toggle {
    display: none;
  }

  .mobile-header {
    display: none;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    overflow: hidden;
    border-radius: 4px;
    display: flex;
    width: fit-content;
    align-items: center;
    justify-content: center;
    /* margin: 0px auto; */
  }

  ul a {
    color: ${theme.BLACK_TEXT_COLOR};
    display: block;
    outline: 1px solid rgba(10, 150, 0, 0.4);
    padding: 12px 28px;
    text-decoration: none;
    text-align: center;
  }
  li {
    display: inline-block;
  }
  li:hover {
    background-color: ${HOVER_TAB_COLOR};
    opacity: 0.8;
    transition: ease-out 300ms;
  }
  li:first-child {
    border-radius: 4px 0 0 4px;
  }

  /* .active {
    background-color: rgba(150, 150, 0, 0.8);
    transition: ease-out 400ms;
  } */

  li:last-child {
    border-radius: 0 4px 4px 0;
  }

  a:active {
    background-color: ${HOVER_TAB_COLOR};
    transition: ease-in 400ms;
  }

  @media (max-width: ${theme.MOBILE_WIDTH}) {
    width: min(calc(100% - 24px), 360px);
    top: ${({ $isScrolled }) => ($isScrolled ? "16px" : "32px")};

    .mobile-header {
      display: flex;
      min-height: 44px;
      align-items: center;
      justify-content: space-between;
      padding: 4px 16px;
    }

    .mobile-brand {
      color: ${theme.BLACK_TEXT_COLOR};
      font-size: 1.15em;
      font-weight: 700;
      text-decoration: none;
    }

    .menu-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border: 0;
      border-radius: 4px;
      background: ${theme.PRIMARY_700};
      color: ${theme.BLACK_TEXT_COLOR};
      cursor: pointer;
    }

    .menu-icon {
      position: relative;
      display: block;
      width: 20px;
      height: 2px;
      background: ${({ $isOpen }) =>
        $isOpen ? "transparent" : "currentColor"};
      transition: background-color 180ms ease;
    }

    .menu-icon::before,
    .menu-icon::after {
      position: absolute;
      left: 0;
      width: 100%;
      height: 2px;
      background: currentColor;
      content: "";
      transition: transform 180ms ease;
    }

    .menu-icon::before {
      top: -6px;
      transform: ${({ $isOpen }) =>
        $isOpen ? "translateY(6px) rotate(45deg)" : "none"};
    }

    .menu-icon::after {
      top: 6px;
      transform: ${({ $isOpen }) =>
        $isOpen ? "translateY(-6px) rotate(-45deg)" : "none"};
    }

    @media (prefers-reduced-motion: reduce) {
      .menu-icon,
      .menu-icon::before,
      .menu-icon::after {
        transition: none;
      }
    }

    ul {
      position: absolute;
      top: 100%;
      right: 0;
      left: 0;
      display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
      flex-direction: column;
      width: 100%;
      align-items: stretch;
      background: ${theme.PRIMARY_700};
      /* box-shadow: 2px 2px 5px rgba(200, 200, 200, 0.7); */
    }

    li {
      width: 100%;
    }

    ul a {
      padding: 14px 18px;
      text-align: left;
    }

    li:first-child {
      border-radius: 0;
    }

    li:last-child {
      border-radius: 0;
    }
  }
`;

export const Header = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 24);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <StyledNav $isOpen={isOpen} $isScrolled={isScrolled}>
      <div className="mobile-header">
        <Link
          className="mobile-brand"
          href="/"
          onClick={() => setIsOpen(false)}
        >
          <p
            style={{
              color: isScrolled ? theme.BLACK_TEXT_COLOR : theme.PRIMARY_700,
              fontWeight: "normal",
              letterSpacing: "0.5px",
              fontSize: "18px",
            }}
          >
            ObjectLog
          </p>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="menu-icon" aria-hidden="true" />
        </button>
      </div>
      <ul id="primary-navigation">
        {navItems.map(({ href, label }) => {
          const isActive =
            pathname === href ||
            (href !== "/" && pathname.startsWith(`${href}/`));

          return (
            <li
              key={href}
              style={{
                backgroundColor: isActive
                  ? ACTIVE_TAB_COLOR
                  : INACTIVE_TAB_COLOR,
              }}
            >
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </StyledNav>
  );
};
