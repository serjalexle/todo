import { theme } from "@/styles/theme";
import React, { useState } from "react";
import { TextInputProps } from "react-native";
import styled from "styled-components/native";

const InputWrapper = styled.View<{ isFocused: boolean }>`
  border-bottom-width: 2px;
  border-bottom-color: ${({ isFocused }: { isFocused: boolean }) =>
    isFocused ? theme.colors.primary : theme.colors.inputBorder};
`;

const StyledInput = styled.TextInput`
  padding: 8px 4px;
  font-size: ${theme.fontSize.md}px;
  color: ${theme.colors.text};
  transition: 0.3s;
`;

const StandardInput = (props: TextInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <InputWrapper isFocused={isFocused}>
      <StyledInput
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={theme.colors.placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="default"
        returnKeyType="done"
        selectionColor={theme.colors.primary}
      />
    </InputWrapper>
  );
};

export default StandardInput;
