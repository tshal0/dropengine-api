import { Box, Tooltip, Badge, styled, useTheme, Paper } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const LogoWrapper = styled(Box)(
  ({ theme }) => `
        color: ${theme.colors.alpha.trueWhite[100]};
        padding: ${theme.spacing(0, 0, 1, 0)};
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};
`
);

const LogoPaperWrapper = styled(Paper)(
  ({ theme }) => `
        color: ${theme.colors.alpha.trueWhite[100]};
        padding: ${theme.spacing(1, 1, 1, 1)};
        display: flex;
        text-decoration: none;
        font-weight: ${theme.typography.fontWeightBold};
`
);

import image from 'assets/drop-engine-logo-icon.png';

export function CreateAccountWizardLogo() {
  const theme = useTheme();

  return (
    <LogoWrapper >
      <LogoPaperWrapper>
        <img alt="drop-engine-logo" height={100} src={image} />

      </LogoPaperWrapper>
    </LogoWrapper>
  );
}

