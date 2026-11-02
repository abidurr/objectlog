import styled from "styled-components";
import { theme } from "./theme";

export const Container = styled.div`
  /* margin-top: 100px; */
  max-width: 800px;
  margin: 80px auto;

  @media (max-width: ${theme.MOBILE_WIDTH}) {
    margin: 24px;
  }

  /* background: black; */
`;
