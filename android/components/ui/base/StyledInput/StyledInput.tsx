import { theme } from "@/styles/theme";
import React, { useState } from "react";
import {
  StyleProp,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import styledDefault, { css } from "styled-components/native";

interface InputWrapperProps {
  isFocused: boolean;
  hasError: boolean;
  fullWidth?: boolean;
}

const InputWrapper = styledDefault.View<InputWrapperProps>`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 2px;
  border-bottom-color: ${({ isFocused, hasError }: InputWrapperProps) =>
    hasError
      ? theme.colors.error
      : isFocused
      ? theme.colors.primary
      : theme.colors.inputBorder};

  ${({ fullWidth }: InputWrapperProps) =>
    fullWidth &&
    css`
      width: 100%;
    `}
`;

const StyledInput = styledDefault.TextInput`
  flex: 1;
  padding: 8px 4px;
  font-size: ${theme.fontSize.md}px;
  color: ${theme.colors.text};
`;

const ErrorText = styledDefault.Text`
  margin-top: 4px;
  color: ${theme.colors.error};
  font-size: ${theme.fontSize.sm}px;
`;

interface StandardInputProps extends TextInputProps {
  error?: string;
  fullWidth?: boolean;
  wrapperStyle?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  onLeftIconPress?: () => void;
}

const StandardInput: React.FC<StandardInputProps> = ({
  onFocus,
  onBlur,
  error,
  fullWidth = false,
  wrapperStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  onLeftIconPress,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={wrapperStyle}>
      <InputWrapper
        isFocused={isFocused}
        hasError={!!error}
        fullWidth={fullWidth}
      >
        {leftIcon && (
          <TouchableOpacity
            onPress={onLeftIconPress}
            disabled={!onLeftIconPress}
          >
            <View style={{ marginRight: 8 }}>{leftIcon}</View>
          </TouchableOpacity>
        )}

        <StyledInput
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={theme.colors.placeholder}
          selectionColor={theme.colors.primary}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          returnKeyType="done"
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <View style={{ marginLeft: 8 }}>{rightIcon}</View>
          </TouchableOpacity>
        )}
      </InputWrapper>

      {error && <ErrorText>{error}</ErrorText>}
    </View>
  );
};

export default StandardInput;
