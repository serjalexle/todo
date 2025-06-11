import { theme } from "@/styles/theme";
import React from "react";
import { GestureResponderEvent, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components/native";

interface Props {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

const ButtonContainer = styled(TouchableOpacity)`
  border-radius: 999px;
  overflow: hidden;
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

const ButtonText = styled(Text)`
  color: white;
  font-weight: 600;
  font-size: 16px;
`;
const GradientWrapper = styled(LinearGradient)`
  padding: 14px 24px;
  border-radius: 999px;
  align-items: center;
  justify-content: center;
`;


const GradientButton: React.FC<Props> = ({ title, onPress, disabled }) => {
  return (
    <ButtonContainer onPress={onPress} activeOpacity={0.8} disabled={disabled}>
      <GradientWrapper
        colors={[theme.colors.primary, theme.colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <ButtonText>{title}</ButtonText>
      </GradientWrapper>
    </ButtonContainer>
  );
};

export default GradientButton;
