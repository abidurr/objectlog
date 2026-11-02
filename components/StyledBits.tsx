import styled from "styled-components";
import { theme } from "@/components/theme";

export const IconAndTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size:: 20px
  h3 {
    font-size: 32px;
  }
`;

export const ObjectBox = styled.div<{ color?: string }>`
  border: 1px solid #ccc;
  padding: 24px;
  margin-bottom: 10px;
  border-radius: 12px;
  background-color: ${(p) => (!!p.color ? p.color : theme.PRIMARY_400)};
  color: ${theme.BLACK_TEXT_COLOR};
  min-width: 300px;
`;

export const LetterIcon = styled.div<{ color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(p) => p.color || theme.PRIMARY_600};
  color: ${theme.BLACK_TEXT_COLOR};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;
