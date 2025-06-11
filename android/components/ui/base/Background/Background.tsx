// @ts-ignore;
import bgImage from "@/assets/images/background.png";

import { ImageBackground } from "react-native";
import styled from "styled-components/native";

export const Background = styled(ImageBackground).attrs({
  source: bgImage,
  resizeMode: "cover",
})`
  flex: 1;
  justify-content: center;
`;
