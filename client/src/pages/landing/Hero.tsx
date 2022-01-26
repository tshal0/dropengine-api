
import { Card } from "@mui/material";
import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import Container from "@mui/material/Container/Container";
import Grid from "@mui/material/Grid/Grid";
import Icon from "@mui/material/Icon/Icon";
import Paper from "@mui/material/Paper/Paper";
import Stack from "@mui/material/Stack/Stack";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography/Typography";
import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import sample_ws from 'assets/sample-workstation-screenshot.png';


const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
`
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);
const TypographyH4 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);
const ImgWrapper = styled(Box)(
  ({ theme }) => `
    position: relative;
    z-index: 5;
    width: 100%;
    overflow: hidden;
    border-radius: ${theme.general.borderRadiusLg};
    box-shadow: 0 0rem 14rem 0 rgb(255 255 255 / 20%), 0 0.8rem 2.3rem rgb(111 130 156 / 3%), 0 0.2rem 0.7rem rgb(17 29 57 / 15%);

    img {
      display: block;
      width: 100%;
    }
  `
);


const BaseCreateAccountButton = (props: any) => {
  const { t }: { t: any; } = useTranslation();

  return (
    <Button
      {...props}
      component={RouterLink}
      to="/register"
      size="large"
      variant="contained"
    >
      {t("Create Account")}
    </Button >
  );
};
const CreateAccountButton = styled(BaseCreateAccountButton)(
  ({ theme }) => `
    color: ${theme.palette.common.white};
    font-weight: 500;
`
);

const BlowWrapper = styled(Box)(
  ({ theme }) => `
    position: relative;
    margin-top: ${theme.spacing(5)};
`
);

const Blob1 = styled(Box)(
  ({ theme }) => `
  background: ${theme.palette.background.default};
  width: 260px;
    height: 260px;
    position: absolute;
    z-index: 5;
    top: -${theme.spacing(9)};
    right: -${theme.spacing(7)};
    border-radius: 30% 70% 82% 18% / 26% 22% 78% 74%;
`
);

const Blob2 = styled(Box)(
  ({ theme }) => `
    background: ${theme.palette.background.default};
    width: 140px;
    bottom: -${theme.spacing(5)};
    left: -${theme.spacing(5)};
    position: absolute;
    z-index: 5;
    height: 140px;
    border-radius: 77% 23% 30% 70% / 81% 47% 53% 19% ;
`
);

const ScreenshotWrapper = styled(Card)(
  ({ theme }) => `
    perspective: 700px;
    display: flex;
    overflow: visible;
    background: ${theme.palette.background.default};
`
);

const Screenshot = styled('img')(
  ({ theme }) => `
    width: 100%;
    height: auto;
    transform: rotateY(-35deg);
    border-radius: ${theme.general.borderRadius};
`
);

const ImageWrapper = styled('img')(
  ({ theme }) => `
        margin-right: ${theme.spacing(1)};
        width: 44px;
`
);

const CardImageWrapper = styled(Card)(
  () => `
    display: flex;
    position: relative;
    z-index: 6;

    img {
      width: 100%;
      height: auto;
    }
`
);
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export function Hero() {
  const { t }: { t: any; } = useTranslation();

  return (
    <Container maxWidth="lg">
      <Offset />
      <Grid
        spacing={{ xs: 6, md: 10 }}
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        container
      >
        <Grid item md={12}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            alignItems="center"
            justifyContent="center"
          >
            <Box
              display="flex"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="center"
            >
              <Icon color="success">done</Icon>
              <TypographyH4
                sx={{
                  m: 2,
                }}
                variant="h4"
              >
                {t("Free To Use")}
              </TypographyH4>
            </Box>
            <Box
              display="flex"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="center"
            >
              <Icon color="success">done</Icon>
              <TypographyH4
                sx={{
                  m: 2,
                }}
                variant="h4"
              >
                {t("Hundreds Of Products")}
              </TypographyH4>
            </Box>
            <Box
              display="flex"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="center"
            >
              <Icon color="success">done</Icon>
              <TypographyH4
                sx={{
                  m: 2,
                }}
                variant="h4"
              >
                {t("Customer Personalization")}
              </TypographyH4>
            </Box>
            <Box
              display="flex"
              flexDirection={"row"}
              alignItems="center"
              justifyContent="center"
            >
              <Icon color="success">done</Icon>
              <TypographyH4
                sx={{
                  m: 2,
                }}
                variant="h4"
              >
                {t("Fulfillment Network")}
              </TypographyH4>
            </Box>
          </Stack>

          <TypographyH1
            sx={{
              mb: 2,
            }}
            variant="h1"
          >
            {t("Manufacturing On Demand")}
          </TypographyH1>
          <TypographyH2
            sx={{
              lineHeight: 1.5,
            }}
            variant="h3"
            color="text.secondary"
            fontWeight="lighter"
          >
            {t(
              `The print on demand market is getting over-saturated. The dropshipping model hasn't changed since the 80's.`
            )}
          </TypographyH2>
          <TypographyH2
            sx={{
              lineHeight: 1.5,
              pb: 4,
            }}
            variant="h3"
            color="text.secondary"
            fontWeight="lighter"
          >
            {t(`Stand out with products nobody else can offer.`)}
          </TypographyH2>
          <CreateAccountButton />

        </Grid>

      </Grid>
     
    </Container>
  );
}
