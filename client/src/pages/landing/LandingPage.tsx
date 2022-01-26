import { Box, Card, Container, Button, styled } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Logo } from 'components/LogoSign';
import { Hero } from './Hero';
import { Highlights } from './Highlights';
import { Footer } from 'components/Footer';
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);


const LandingPageWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
);

export function LandingPage() {
  const { t }: { t: any; } = useTranslation();

  return (
    <LandingPageWrapper>
      
      <Hero />
      <Highlights />
      <Offset />
      <Footer />
    </LandingPageWrapper>
  );
}

