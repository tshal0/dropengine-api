import { Box, Tooltip, Badge, styled, useTheme } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const LogoWrapper = styled(Link)(
  ({ theme }) => `
        color: ${theme.colors.alpha.trueWhite[100]};
        padding: ${theme.spacing(0, 1, 0, 0)};
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};
`
);

import image from 'assets/drop-engine-logo-icon.png';

export function RegisterPageLogo() {
  const theme = useTheme();

  return (
    <LogoWrapper to="/">
      <img alt="drop-engine-logo" height={100} src={image} />
    </LogoWrapper>
  );
}

