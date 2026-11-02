import styled from "styled-components";
import { theme } from "./theme";

export const LetterIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${theme.PRIMARY_600};
  color: ${theme.BLACK_TEXT_COLOR};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;
