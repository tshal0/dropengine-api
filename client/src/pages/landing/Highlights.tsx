
import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import Container from "@mui/material/Container/Container";
import Grid from "@mui/material/Grid/Grid";
import Icon from "@mui/material/Icon/Icon";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper/Paper";
import Stack from "@mui/material/Stack/Stack";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography/Typography";
import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import image from 'assets/stock-img.png';
import sample_ss from 'assets/sample-mfg-screenshot.png';
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
const BoxAccent = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadiusLg};
    background: ${theme.palette.background.default};
    width: 100%;
    height: 100%;
    position: absolute;
    left: -40px;
    bottom: -40px;
    display: block;
    z-index: 4;
  `
);
const BoxContent = styled(Box)(
  () => `
  width: 150%;
  position: relative;
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(4)};
    height: ${theme.spacing(4)};
`
);

const BoxRtl = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.alpha.white[100]};
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

const CardImg = styled(Card)(
  ({ theme }) => `
    position: absolute;
    border-radius: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid ${theme.colors.alpha.black[10]};
    transition: ${theme.transitions.create(['border'])};

    &:hover {
      border-color: ${theme.colors.primary.main};
    }
`
);

const TypographyH1Primary = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(36)};
`
);



const BoxHighlights = styled(Box)(
  () => `
    position: relative;
    z-index: 5;
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

const TypographyHeading = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(36)};
`
);

const TypographySubHeading = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);

const TypographyFeature = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
    color: ${theme.colors.primary.main};
    font-weight: bold;
    margin-bottom: -${theme.spacing(1)};
    display: block;
`
);

const AvatarWrapperSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.lighter};
      color:  ${theme.colors.success.main};
`
);
const TabsContainerWrapper = styled(Box)(
  ({ theme }) => `

  .MuiTabs-root {
    height: 54px;
    min-height: 54px;

    .MuiTabs-flexContainer {
      justify-content: center;
    }
  }

  .MuiTabs-indicator {
    min-height: 54px;
    height: 54px;
    box-shadow: none;
    border-radius: 50px;
    border: 0;
    background: ${theme.colors.primary.main};
  }

  .MuiTab-root {
    &.MuiButtonBase-root {
        position: relative;
        height: 54px;
        min-height: 54px;
        border-radius: 50px;
        font-size: ${theme.typography.pxToRem(16)};
        color: ${theme.colors.primary.main};
        padding: 0 ${theme.spacing(4)};

        .MuiTouchRipple-root {
          opacity: 0;
        }

        &:hover {
          color: ${theme.colors.alpha.black[100]};
        }
    }

    &.Mui-selected {
        color: ${theme.colors.alpha.white[100]};

        &:hover {
          color: ${theme.colors.alpha.white[100]};
        }
    }
}
`
);

const BoxLayouts = styled(Box)(
  ({ theme }) => `
      background: ${theme.colors.gradients.blue1};
      padding: ${theme.spacing(16, 0)};
      margin: ${theme.spacing(10, 0, 0)};
      position: relative;

      .typo-heading,
      .typo-feature {
        color: ${theme.colors.alpha.trueWhite[100]};
      }

      .typo-subheading {
        color: ${theme.colors.alpha.trueWhite[70]};
      }
`
);

const BoxLayoutsImage = styled(Box)(
  () => `
    background-size: cover;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: .5;
`
);

const BoxLayoutsContent = styled(Container)(
  ({ theme }) => `
      z-index: 5;
      position: relative;
      color: ${theme.colors.alpha.trueWhite[100]};
`
);

const BoxWave = styled(Box)(
  ({ theme }) => `
    position: absolute;
    top: -10px;
    left: 0;
    width: 100%;
    z-index: 5;

    svg path {
	    fill: ${theme.colors.alpha.white[100]};
	}
`
);

const BoxWaveAlt = styled(Box)(
  ({ theme }) => `
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    z-index: 2;

    svg path {
	    fill: ${theme.colors.alpha.white[100]};
	}
`
);

const LayoutImgButton = styled(RouterLink)(
  ({ theme }) => `
    overflow: hidden;
    border-radius: ${theme.general.borderRadiusXl};
    display: block;
    position: relative;
    box-shadow: 0 0rem 14rem 0 rgb(0 0 0 / 20%), 0 0.8rem 2.3rem rgb(0 0 0 / 3%), 0 0.2rem 0.7rem rgb(0 0 0 / 15%);

    .MuiTypography-root {
      position: absolute;
      right: ${theme.spacing(3)};
      bottom: ${theme.spacing(3)};
      color: ${theme.colors.alpha.trueWhite[100]};;
      background: rgba(0,0,0,.8);
      padding: ${theme.spacing(2, 4.5)};
      border-radius: ${theme.general.borderRadiusXl};
      z-index: 5;
    }

    img {
      width: 100%;
      height: auto;
      display: block;
      opacity: 1;
      transition: opacity .2s;
    }

    &:hover {
      img {
        opacity: .8;
      }
    }
`
);
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export function Highlights() {
  const { t }: { t: any; } = useTranslation();

  return (
    <Container maxWidth="md">
      <TypographyH1
        id="highlights"
        textAlign="center"
        sx={{
          mt: 8,
          mb: 2
        }}
        variant="h1"
      >
        {t('Highlights')}
      </TypographyH1>

      <Container maxWidth="sm">
        <TypographyH2
          sx={{
            pb: 4,
            lineHeight: 1.5
          }}
          textAlign="center"
          variant="h4"
          color="text.secondary"
          fontWeight="300"
        >
          {t(
            'Some of the features that make DropEngine a disruptor in the POD/Dropshipping market'
          )}
        </TypographyH2>
        <BlowWrapper>
          <Blob1 />
          <Blob2 />
          <CardImageWrapper>
            <img
              src={sample_ss}
              alt="DropEngine Manufacturing"
            />
          </CardImageWrapper>
        </BlowWrapper>
      </Container>
      <Grid
        sx={{
          mt: 8
        }}
        container
        spacing={4}
      >
        <Grid item xs={12} md={6}>
          <Typography sx={{ mb: 1 }} variant="h2">
            {t(`We are operations minded.`)}
          </Typography>
          <Typography sx={{ mb: 1 }} variant="h2">
            {t(`Awesome products are useless if you can't scale production.`)}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              "We've built DropEngine on top of advanced industry standards and practices."
            )}
            .
          </Typography>
          <List
            disablePadding
            sx={{
              mt: 2
            }}
          >
            <ListItem>
              <AvatarSuccess
                sx={{
                  mr: 2
                }}
              >
                <CheckTwoToneIcon />
              </AvatarSuccess>
              <ListItemText
                primary={t(
                  'Manufacturing Mesh Network ensuring we always have capacity for your production'
                )}
              />
            </ListItem>
            <ListItem>
              <AvatarSuccess
                sx={{
                  mr: 2
                }}
              >
                <CheckTwoToneIcon />
              </AvatarSuccess>
              <ListItemText
                primary={t(
                  'Best pricing and fastest lead times in the industry'
                )}
              />
            </ListItem>
            <ListItem>
              <AvatarSuccess
                sx={{
                  mr: 2
                }}
              >
                <CheckTwoToneIcon />
              </AvatarSuccess>
              <ListItemText
                primary={t(
                  'High converting, personalized products imported in one click'
                )}
              />
            </ListItem>
            <ListItem>
              <AvatarSuccess
                sx={{
                  mr: 2
                }}
              >
                <CheckTwoToneIcon />
              </AvatarSuccess>
              <ListItemText
                primary={t(
                  'Unique product types that set yourself apart from the average T-shirt salesmen'
                )}
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <BlowWrapper>
            <Blob1 />
            <Blob2 />
            <CardImageWrapper>
              <img
                src={image}
                alt="DropEngine Performance"
              />
            </CardImageWrapper>
          </BlowWrapper>
        </Grid>
      </Grid>
    </Container>
  );
}
