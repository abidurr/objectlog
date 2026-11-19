import styled from "styled-components";
import { theme } from "@/components/theme";

export const IconAndTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 20px;
  margin-bottom: 16px;
  h3 {
    font-size: 32px;
    margin: 18px 0;
  }
`;

export const ObjectBox = styled.div`
  border: 1px solid #ccc;
  padding: 24px;
  margin-bottom: 10px;
  border-radius: 12px;
  background-color: ${theme.PRIMARY_800};
  color: ${theme.BLACK_TEXT_COLOR};
  width: fit-content;
  &:hover {
    background-color: ${theme.PRIMARY_700};
    transition: ease-out 300ms;
  }
`;

export const ObjectTableContainer = styled(ObjectBox)`
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow-x: auto;
  padding: 12px;
`;

export const ObjectTable = styled.table`
  width: 100%;
  min-width: 560px;
  border-collapse: separate;
  border-spacing: 0;
  text-align: left;

  th,
  td {
    padding: 11px 14px;
    border-bottom: 1px solid ${theme.PRIMARY_400};
    vertical-align: top;
    color: ${theme.BLACK_TEXT_COLOR};
  }

  th {
    background: ${theme.DARK_COLOR_TEXT};
    color: ${theme.PRIMARY_200};
    font-size: 0.82rem;
    font-weight: 650;
    white-space: nowrap;
  }

  thead th:first-child {
    border-top-left-radius: 6px;
  }

  thead th:last-child {
    border-top-right-radius: 6px;
  }

  th:has(button) {
    padding: 0;
  }

  th button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    min-height: 42px;
    box-sizing: border-box;
    padding: 11px 14px;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
  }

  th button:hover {
    color: ${theme.PRIMARY_300};
  }

  th button:focus-visible {
    outline: 2px solid ${theme.PRIMARY_200};
    outline-offset: 3px;
  }

  th button svg {
    flex: none;
    color: ${theme.PRIMARY_200};
  }

  th.numeric-column,
  td.numeric-column {
    text-align: right;
  }

  th.numeric-column button {
    justify-content: flex-end;
    text-align: right;
  }

  tbody tr:nth-child(even) {
    background: ${theme.PRIMARY_700};
  }

  tbody tr:hover {
    background: ${theme.PRIMARY_600};
  }

  tbody tr:last-child > * {
    border-bottom: 0;
  }

  tbody th[scope="row"] {
    font-weight: 600;
    text-align: left;
  }

  tbody .record-name-cell {
    background: ${theme.PRIMARY_800};
    color: ${theme.BLACK_TEXT_COLOR};
    font-size: 16px;
  }

  tbody tr.last-record-row > .record-name-cell {
    border-bottom-left-radius: 6px;
  }
`;

export const ColorPill = styled.div<{
  $textclr: string;
  $bgclr: string;
}>`
  display: flex;
  height: 24px;
  border-radius: 16px;
  font-size: 16px;
  margin: 0px;
  padding: 4px 16px;
  line-height: 24px;
  font-family: monospace;
  /* border 2px solid ${(p) => p.$textclr || "grey"}; */
  box-shadow: 2.4px 4.8px 4.8px hsla(0deg 0% 0% / 0.43, 0.4);
  color: ${(p) => p.$textclr || "black"};
  background-color: ${(p) => p.$bgclr || "white"};
`;

export const LetterIcon = styled.div<{
  $bgcolor?: string;
  $color?: string;
}>`
  min-width: 48px;
  min-height: 48px;
  border-radius: 50%;
  /* color: ${theme.BLACK_TEXT_COLOR}; */

  color: ${(p) => p.$color || theme.BLACK_TEXT_COLOR};
  background-color: ${(p) => p.$bgcolor || theme.PRIMARY_300};
  opacity: 0.6;
  /* color: rgba(0, 0, 0, 0.3); */
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 32px;
  text-transform: uppercase;
  text-align: bottom;
  border: 2px solid rgba(0, 0, 0, 0.1);
  line-height: 40px;

  h3 {
    font-size: 24px;
    color: ${(p) => p.$color || theme.BLACK_TEXT_COLOR};
    /* opacity: 0.4; */
  }
`;

export const StyledButton = styled.button<{
  $btnclr?: "red" | "blue" | "green" | "yellow" | "orange";
}>`
  background-color: ${(p) => {
    switch (p.$btnclr) {
      case "red":
        return theme.TRANSLUCENT.RED1;
      case "blue":
        return theme.TRANSLUCENT.BLUE1;
      case "green":
        return theme.TRANSLUCENT.GREEN1;
      case "yellow":
        return theme.TRANSLUCENT.YELLOW1;
      case "orange":
        return theme.TRANSLUCENT.ORANGE1;
      default:
        return theme.TRANSLUCENT.BLUE1;
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: bottom:
  height: 36px;
  color: rgba(0,0,0, 0.8)
  border: none;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  /* text-decoration: none; */
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.5px;
  box-shadow: ${theme.BOX_SHADOW.ELEVATION_3};
  &:hover {
    text-decoration: none;
    background-color: ${(p) => {
      switch (p.$btnclr) {
        case "red":
          return theme.TRANSLUCENT.RED2;
        case "blue":
          return theme.TRANSLUCENT.BLUE2;
        case "green":
          return theme.TRANSLUCENT.GREEN2;
        case "yellow":
          return theme.TRANSLUCENT.YELLOW2;
        case "orange":
          return theme.TRANSLUCENT.ORANGE2;
        default:
          return theme.TRANSLUCENT.BLUE2;
      }
    }};
  }
`;

export const FieldLabelSpan = styled.span`
  display: inline-block;
  /* color: ${theme.PRIMARY_800}; */
  opacity: 0.4;
  font-family: monospace;
  font-size: 16px;
  margin-right: 8px;
  min-width: 80px;
`;

export const FieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  p {
    margin: 0;
    padding: 0;
  }
`;

export const StyledInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 16px;
  box-shadow: ${theme.BOX_SHADOW.ELEVATION_1};
`;

export const StyledSelect = styled.select`
  padding: 8px;
  border-radius: 4px;
  /* border: 1px solid #ccc; */
  border: 0px;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 16px;
  box-shadow: ${theme.BOX_SHADOW.ELEVATION_1};
`;

export const ObjectsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  @media (max-width: ${theme.MOBILE_WIDTH}) {
    grid-template-columns: 1fr;
  }
`;
export const FieldInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
