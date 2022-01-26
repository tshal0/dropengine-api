import { Box, Card, Link, Typography, styled } from '@mui/material';
import React from 'react';
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const FooterWrapper = styled(Card)(
  ({ theme }) => `
        border-radius: 0;
        margin-top: ${theme.spacing(4)};
`
);

export function Footer() {
  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        p={4}
        display={{ xs: 'block', md: 'flex' }}
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
        justifyContent="space-between"
      >
        <Box>
          <Typography variant="subtitle1">
            &copy; 2022 - DropEngine™
          </Typography>
        </Box>
        <Typography
          sx={{
            pt: { xs: 2, md: 0 }
          }}
          variant="subtitle1"
        >
          Crafted by{' '}
          <Link
            href="https://www.valknot.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            Thomas Shallenberger
          </Link>
        </Typography>
      </Box>
    </FooterWrapper>
  );
}

