"use client";

import { styled } from "styled-components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { theme } from ".";

const ACTIVE_TAB_COLOR = `${theme.PRIMARY_300}`;
const INACTIVE_TAB_COLOR = `${theme.PRIMARY_700}`;
const HOVER_TAB_COLOR = `${theme.PRIMARY_500}`;

const StyledNav = styled.div`
  /* background-color: rgb(10, 153, 3); */
  width: fit-content;
  position: sticky;
  box-shadow: 2px 2px 5px rgba(200, 200, 200, 0.7);
  z-index: 3;
  font-size: 12px;
  top: 24px;
  font-size: 1em;
  border-radius: 4px;
  margin: 0px auto;

  ul {
    /* display: inline-block; */
    margin: 0;
    padding: 0;
    list-style: none;
    overflow: hidden;
    /* background-color: rgba(5, 150, 3, 0.4); */
    border-radius: 4px;
    display: flex;
    width: fit-content;
    align-items: center;
    justify-content: center;
    /* margin: 0px auto; */
  }

  ul a {
    color: ${theme.PRIMARY_800};
    display: block;
    outline: 1px solid rgba(10, 150, 0, 0.4);
    padding: 12px 28px;
    border-right: gray;
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
  ul:hover {
    /* color: rgba(10, 150, 0, 0.6);
    transition: ease-in 400ms; */
  }
  a:active {
    background-color: ${HOVER_TAB_COLOR};
    transition: ease-in 400ms;
  }

  @media (max-width: 800px) {
    ul {
      flex-direction: column;
      width: 100%;
    }
    li {
      width: 100%;
    }
    li:first-child {
      border-radius: 16px 16px 0 0;
    }
    li:last-child {
      border-radius: 0 0 16px 16px;
    }
  }
`;

export const Header = () => {
  const pathname = usePathname();
  return (
    <StyledNav>
      <ul>
        <li
          style={{
            backgroundColor:
              pathname == "/" ? ACTIVE_TAB_COLOR : INACTIVE_TAB_COLOR,
          }}
        >
          <Link href="/">Home</Link>
        </li>
        <li
          style={{
            backgroundColor:
              pathname == "/objects" ? ACTIVE_TAB_COLOR : INACTIVE_TAB_COLOR,
          }}
        >
          <Link href="/objects">Objects</Link>
        </li>
        <li
          style={{
            backgroundColor:
              pathname == "/fields" ? ACTIVE_TAB_COLOR : INACTIVE_TAB_COLOR,
          }}
        >
          <Link href="/fields">Fields</Link>
        </li>

        <li
          style={{
            backgroundColor:
              pathname == "/organizations"
                ? ACTIVE_TAB_COLOR
                : INACTIVE_TAB_COLOR,
          }}
        >
          <Link href="/organizations">Organizations</Link>
        </li>
        <li
          style={{
            backgroundColor:
              pathname == "/views" ? ACTIVE_TAB_COLOR : INACTIVE_TAB_COLOR,
          }}
        >
          <Link href="/views">Views</Link>
        </li>
        <li
          style={{
            backgroundColor:
              pathname == "/documentation"
                ? ACTIVE_TAB_COLOR
                : INACTIVE_TAB_COLOR,
          }}
        >
          <Link href="/documentation">Documentation</Link>
        </li>
        <li
          style={{
            backgroundColor:
              pathname == "/users" ? ACTIVE_TAB_COLOR : INACTIVE_TAB_COLOR,
          }}
        >
          <Link href="/users">Users</Link>
        </li>
        <li
          style={{
            backgroundColor:
              pathname == "/about" ? ACTIVE_TAB_COLOR : INACTIVE_TAB_COLOR,
          }}
        >
          <Link href="/about">About</Link>
        </li>
      </ul>
    </StyledNav>
  );
};
