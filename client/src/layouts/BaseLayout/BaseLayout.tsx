import React, { FC, ReactNode } from 'react';
import { Box, useTheme, styled } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { ThemeSettings } from 'components/ThemeSettings';
import { Header } from './Header';




interface BaseLayoutProps {
  children?: ReactNode;
}

export const BaseLayout: FC<BaseLayoutProps> = () => {
  const theme = useTheme();

  return (
    <>
      <Header />
      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          flex: 1,
          display: 'flex',
          pt: `${theme.header.height}`,
          [theme.breakpoints.up('lg')]: {
            // pl: `${theme.sidebar.width}`
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <Box flexGrow={1}>
            <Outlet />
          </Box>
        </Box>
        <ThemeSettings />
      </Box>
    </>
  );
};