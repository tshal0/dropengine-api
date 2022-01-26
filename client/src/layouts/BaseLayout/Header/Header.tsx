import { Box, Card, IconButton, alpha, styled, Container } from "@mui/material";
import HeaderButtons from "./Buttons/HeaderButtons";

import Logo from "./Logo/HeaderLogo";
import React from "react";

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
    height: ${theme.header.height};
    color: ${theme.header.textColor};
    padding: ${theme.spacing(0, 2)};
    right: 0;
    z-index: 6;
    background-color: ${alpha(theme.header.background, 0.95)};
    backdrop-filter: blur(3px);
    position: absolute;
    justify-content: space-between;
    width: 100%;
    max-width: 
    display: flex;
    align-items: center;
    border-radius: 0;
`
);

const IconButtonPrimary = styled(IconButton)(
  ({ theme }) => `
    background: ${theme.colors.alpha.trueWhite[10]};
    color: ${theme.colors.alpha.trueWhite[70]};
    padding: 0;
    width: 42px;
    height: 42px;
    border-radius: 100%;
    margin-left: ${theme.spacing(2)};

    &.active,
    &:active,
    &:hover {
      background: ${alpha(theme.colors.alpha.trueWhite[30], 0.2)};
      color: ${theme.colors.alpha.trueWhite[100]};
    }
`
);

const BoxLogoWrapper = styled(Box)(
  ({ theme }) => `
  margin-right: ${theme.spacing(2)};

  @media (min-width: ${theme.breakpoints.values.lg}px) {
    width: calc(${theme.sidebar.width} - ${theme.spacing(4)});
  }
    
`
);

const HeaderContainer = styled(Container)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
`
);

export function Header() {
  // const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  return (
    <HeaderWrapper>
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center">
          <BoxLogoWrapper>
            <Logo />
          </BoxLogoWrapper>
        </Box>
        <Box display="flex" alignItems="center">
          <HeaderButtons />
        </Box>
      </Container>
    </HeaderWrapper>
  );
}
