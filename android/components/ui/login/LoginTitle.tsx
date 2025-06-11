import React from "react";
import styled from "styled-components/native";
import { theme } from "@/styles/theme";

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
  color: ${theme.colors.primary};
`;

interface Props {
  children: string;
}

const LoginTitle: React.FC<Props> = ({ children }) => {
  return <Title>{children}</Title>;
};

export default LoginTitle;
