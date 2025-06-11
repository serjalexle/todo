import { theme } from "@/styles/theme";
import styled from "styled-components/native";

export const ContainerStyled = styled.View`
  flex: 1;
  justify-content: center;
  padding: 24px;
  gap: ${theme.spacing.md}px;
`;

export const Container = (
  props: React.PropsWithChildren<{ backgroundColor: string }>
) => {
  return (
    <ContainerStyled
      {...props}
      style={{
        backgroundColor: props.backgroundColor || theme.colors.background,
      }}
    >
      {props.children}
    </ContainerStyled>
  );
};
