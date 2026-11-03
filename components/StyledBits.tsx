import styled from "styled-components";
import { theme } from "@/components/theme";

export const IconAndTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size:: 20px
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

export const LetterIcon = styled.div<{ color?: string }>`
  min-width: 48px;
  min-height: 48px;
  border-radius: 50%;
  color: ${theme.BLACK_TEXT_COLOR};
  background-color: ${(p) => p.color || theme.PRIMARY_300};
  opacity: 0.4;
  /* color: rgba(0, 0, 0, 0.4); */
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
    color: ${(p) => p.color || theme.BLACK_TEXT_COLOR};
    opacity: 1;
  }
`;

export const StyledButton = styled.button<{
  buttonColor?: "red" | "blue" | "green" | "yellow" | "orange";
}>`
  background-color: ${(p) => {
    switch (p.buttonColor) {
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
  color: ${theme.BLACK_TEXT_COLOR};
  border: none;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  margin-bottom: 16px;
  font-size: 16px;
  box-shadow: ${theme.BOX_SHADOW.ELEVATION_5};
  &:hover {
    text-decoration: none;
    background-color: ${(p) => {
      switch (p.buttonColor) {
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
`;

export const StyledSelect = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 16px;
`;

export const ObjectsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
`;
export const FieldInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
