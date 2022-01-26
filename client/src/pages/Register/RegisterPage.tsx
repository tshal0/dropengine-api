import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Card,
  Container,
  Divider,
  Link,
  ListItemText,
  ListItem,
  List,
  ListItemIcon,
  IconButton,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import ChevronRightTwoToneIcon from "@mui/icons-material/ChevronRightTwoTone";
import ChevronLeftTwoToneIcon from "@mui/icons-material/ChevronLeftTwoTone";
import React from "react";
import { Logo } from "components/LogoSign";
import { Scrollbar } from "components/Scrollbar";
import useAuth from "hooks/useAuth";
import { RegisterPageLogo } from "./RegisterPageLogo";
import { CreateAccountWizard } from "./CreateAccountWizard";

const icons = {
  Auth0: "/static/images/logo/auth0.svg",
  FirebaseAuth: "/static/images/logo/firebase.svg",
  JWT: "/static/images/logo/jwt.svg",
  Amplify: "/static/images/logo/amplify.svg",
};

const Content = styled(Box)(
  () => `
    display: flex;
    flex: 1;
    width: 100%;
`
);

const MainContent = styled(Box)(
  () => `
    padding: 0 0 0 500px;
    width: 100%;
    display: flex;
    align-items: center;
`
);

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 500px;
  background: ${theme.colors.gradients.blue3};
`
);

const SidebarContent = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: ${theme.spacing(6)};

`
);

const CardImg = styled(Card)(
  ({ theme }) => `
    border-radius: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 11px solid ${theme.colors.alpha.trueWhite[10]};
    transition: ${theme.transitions.create(["border"])};
    width: ${theme.spacing(16)};
    height: ${theme.spacing(16)};
    margin-bottom: ${theme.spacing(3)};
`
);

const SwipeIndicator = styled(IconButton)(
  ({ theme }) => `
        color: ${theme.colors.alpha.trueWhite[50]};
        width: ${theme.spacing(6)};
        height: ${theme.spacing(6)};
        border-radius: 100px;
        transition: ${theme.transitions.create(["background", "color"])};

        &:hover {
          color: ${theme.colors.alpha.trueWhite[100]};
          background: ${theme.colors.alpha.trueWhite[10]};
        }
`
);

const LogoWrapper = styled(Box)(
  ({ theme }) => `
    position: fixed;
    left: ${theme.spacing(4)};
    top: ${theme.spacing(4)};
`
);
const BoxLogoWrapper = styled(Box)(
  ({ theme }) => `
  margin-right: ${theme.spacing(2)};

  @media (min-width: ${theme.breakpoints.values.lg}px) {
    width: calc(${theme.sidebar.width} - ${theme.spacing(4)});
  }
  justify-content: center;
  align-items: center;
  display: flex;
`
);
const TypographyPrimary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.trueWhite[100]};
`
);

const TypographySecondary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.trueWhite[70]};
`
);

const DividerWrapper = styled(Divider)(
  ({ theme }) => `
      background: ${theme.colors.alpha.trueWhite[10]};
      width: 100%;
`
);

const ListItemTextWrapper = styled(ListItemText)(
  ({ theme }) => `
      color: ${theme.colors.alpha.trueWhite[70]};
`
);
const ListItemIconWrapper = styled(ListItemIcon)(
  ({ theme }) => `
      color: ${theme.colors.success.main};
      min-width: 32px;
`
);

const SwiperWrapper = styled(Box)(
  ({ theme }) => `
      .swiper-pagination {
        .swiper-pagination-bullet {
          background: ${theme.colors.alpha.trueWhite[30]};
          opacity: 1;
          transform: scale(1);

          &.swiper-pagination-bullet-active {
            background: ${theme.colors.alpha.trueWhite[100]};
            width: 16px;
            border-radius: 6px;
          }
        }
      }
`
);
const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

export function RegisterPage() {
  const { method } = useAuth() as any;
  const { t }: { t: any; } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <Offset />
      <Content>
        <SidebarWrapper
          sx={{
            display: { xs: "none", md: "inline-block" },
          }}
        >
          <Scrollbar>
            <SidebarContent>
              <Box display="flex" alignItems="center" justifyContent={"center"} flexDirection="column">
                <TypographyPrimary
                  variant="h3"
                >
                  {t("DropEngine™")}
                </TypographyPrimary>
                <TypographyPrimary
                  variant="h3"
                  sx={{
                    mb: 3,
                  }}
                >
                  {t("We'll make your shit!")}
                </TypographyPrimary>
                <RegisterPageLogo />
                <TypographyPrimary
                  variant="h5"
                  sx={{
                    mt: 6,
                  }}
                >
                  {t("New User Creation")}
                </TypographyPrimary>
              </Box>
              <DividerWrapper
                sx={{
                  mt: 3,
                  mb: 4,
                }}
              />
              <Box>
                <TypographyPrimary
                  variant="h3"
                  sx={{
                    mb: 3,
                  }}
                >
                  {t("Always free. Get started today!")}
                </TypographyPrimary>

                <List
                  dense
                  sx={{
                    mb: 3,
                  }}
                >
                  <ListItem disableGutters>
                    <ListItemIconWrapper>
                      <CheckCircleOutlineTwoToneIcon />
                    </ListItemIconWrapper>
                    <ListItemTextWrapper
                      primaryTypographyProps={{ variant: "h6" }}
                      primary={t("premium features included")}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIconWrapper>
                      <CheckCircleOutlineTwoToneIcon />
                    </ListItemIconWrapper>
                    <ListItemTextWrapper
                      primaryTypographyProps={{ variant: "h6" }}
                      primary={t("no risks/obligations")}
                    />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIconWrapper>
                      <CheckCircleOutlineTwoToneIcon />
                    </ListItemIconWrapper>
                    <ListItemTextWrapper
                      primaryTypographyProps={{ variant: "h6" }}
                      primary={t("hundreds of products")}
                    />
                  </ListItem>
                </List>
              </Box>
            </SidebarContent>
          </Scrollbar>
        </SidebarWrapper>
        <CreateAccountWizard />
      </Content>
    </>
  );
}
