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

import image from 'assets/drop-engine-logo-combo.png';

function Logo() {
  const theme = useTheme();

  return (
    <LogoWrapper to="/">
      <Tooltip
        arrow
        placement="right"
        title="DropEngine"
      >
        <img alt="drop-engine-logo" height={30} src={image} />
      </Tooltip>
    </LogoWrapper>
  );
}

export default Logo;
