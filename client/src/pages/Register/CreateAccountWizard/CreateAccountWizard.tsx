import { useState, ReactElement, Children } from 'react';
import {
  Typography,
  Container,
  Button,
  Card,
  CircularProgress,
  Grid,
  Box,
  Step,
  StepLabel,
  Stepper,
  Link,
  Collapse,
  Alert,
  Avatar,
  IconButton,
  styled
} from '@mui/material';
import { Field, Form, Formik, FormikConfig, FormikValues } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-mui';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';

import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { RegisterPageLogo } from '../RegisterPageLogo';
import { CreateAccountWizardLogo } from './CreateAccountWizardLogo';
import wretch from "wretch";

const MainContent = styled(Box)(
  ({ theme }) => `

    @media (min-width: ${theme.breakpoints.values.sm}px) {
      padding: 0 0 0 0;
    }
    @media (min-width: ${theme.breakpoints.values.md}px) {
      padding: 0 0 0 500px;
    }
    @media (min-width: ${theme.breakpoints.values.lg}px) {
      padding: 0 0 0 500px;
    }
    
    width: 100%;
    display: flex;
    align-items: center;
`
);

const BoxActions = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[5]}
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};
      box-shadow: ${theme.colors.shadows.success};
      margin-left: auto;
      margin-right: auto;

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const sleep = (time: number) => new Promise((acc) => setTimeout(acc, time));

function NextStepButton(props: { isSubmitting: boolean, isLastStep: () => boolean; }) {
  const { t }: { t: any; } = useTranslation();
  const { isLastStep, isSubmitting } = props;
  return <Button
    startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
    disabled={isSubmitting}
    variant="contained"
    color="primary"
    type="submit"
    sx={{ color: 'white' }}
  >
    {isSubmitting
      ? t('Submitting')
      : isLastStep()
        ? t('Complete registration')
        : t('Next step')}
  </Button>;
}

export interface CreateAccountWizardFormData {
  first_name: string;
  last_name: string;
  terms: boolean;
  promo: boolean;
  password: string;
  password_confirm: string;
  email: string;
  phone: string;
  company_name: string;
  company_size: string;
  company_role: string;
}

export function CreateAccountWizard() {
  const { t }: { t: any; } = useTranslation();
  const [openAlert, setOpenAlert] = useState(true);

  const initialAccountValues: CreateAccountWizardFormData = {
    first_name: 'Thomas',
    last_name: 'Shallen',
    terms: true,
    promo: true,
    password: 'Password123!',
    password_confirm: 'Password123!',
    email: 'thomas@myeasymfg.com',
    phone: '',
    company_name: 'Sample Company',
    company_size: '3',
    company_role: 'Sample Role'
  };
  return (
    <>
      {/* <Helmet>
        <title>Register - Wizard</title>
      </Helmet> */}
      <MainContent>
        <Container
          sx={{
            my: 4
          }}
          maxWidth="md"
        >

          <Card
            sx={{
              mt: 3,
              pt: 4
            }}
          >
            <Box px={4} display="flex" alignItems={"center"}>
              {/* <CreateAccountWizardLogo /> */}
              <Box sx={{ ml: "8px" }}>
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1
                  }}
                >
                  {t('Create account')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  {t('Fill in the fields below to sign up for an account.')}
                </Typography>
              </Box>

            </Box>

            <FormikStepper
              initialValues={initialAccountValues}
              onSubmit={onCreateAccountSubmit}
            >
              <FormikStep
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .email(
                      t('The email provided should be a valid email address')
                    )
                    .max(255)
                    .required(t('The email field is required')),
                  first_name: Yup.string()
                    .max(255)
                    .required(t('The first name field is required')),
                  last_name: Yup.string()
                    .max(255)
                    .required(t('The first name field is required')),
                  password: Yup.string()
                    .min(8)
                    .max(255)
                    .required(t('The password field is required')),
                  password_confirm: Yup.string()
                    .oneOf(
                      [Yup.ref('password')],
                      t('Both password fields need to be the same')
                    )
                    .required(t('This field is required'))
                })}
                label={t('Personal Informations')}
              >
                <Box p={4}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Field
                        fullWidth
                        name="first_name"
                        component={TextField}
                        label={t('First name')}
                        placeholder={t('Write your first name here...')}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        fullWidth
                        name="last_name"
                        component={TextField}
                        label={t('Last name')}
                        placeholder={t('Write your last name here...')}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        fullWidth
                        name="email"
                        component={TextField}
                        label={t('Email')}
                        placeholder={t('Write your email here...')}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} />
                    <Grid item xs={12} md={6}>
                      <Field
                        fullWidth
                        type="password"
                        name="password"
                        component={TextField}
                        label={t('Password')}
                        placeholder={t('Write a password here...')}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        fullWidth
                        type="password"
                        name="password_confirm"
                        component={TextField}
                        label={t('Confirm password')}
                        placeholder={t('Confirm password here...')}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        fullWidth
                        name="phone"
                        type="number"
                        component={TextField}
                        label={t('Phone number')}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        name="promo"
                        type="checkbox"
                        component={CheckboxWithLabel}
                        Label={{
                          label: t(
                            'Yes, I want to receive monthly promotional materials.'
                          )
                        }}
                      />
                      <br />
                      <Field
                        name="terms"
                        type="checkbox"
                        component={CheckboxWithLabel}
                        Label={{
                          label: (
                            <Typography variant="body2">
                              {t('I accept the')}{' '}
                              <Link component="a" href="#">
                                {t('terms and conditions')}
                              </Link>
                              .
                            </Typography>
                          )
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </FormikStep>
              <FormikStep
                validationSchema={Yup.object().shape({
                  company_size: Yup.string()
                    .max(55)
                    .required(t('The first name field is required')),
                  company_name: Yup.string()
                    .max(255)
                    .required(t('The first name field is required')),
                  company_role: Yup.string()
                    .max(255)
                    .required(t('The first name field is required'))
                })}
                label={t('Company Details')}
              >
                <Box p={4}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Field
                        fullWidth
                        name="company_name"
                        component={TextField}
                        label={t('Company name')}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        fullWidth
                        name="company_size"
                        type="number"
                        component={TextField}
                        label={t('Company size')}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        fullWidth
                        name="company_role"
                        component={TextField}
                        label={t('Company role')}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </FormikStep>
              <FormikStep label={t('Complete Registration')}>
                <Box px={4} py={8}>
                  <Container maxWidth="sm">
                    <AvatarSuccess>
                      <CheckTwoToneIcon />
                    </AvatarSuccess>
                    <Collapse in={openAlert}>
                      <Alert
                        sx={{
                          mt: 5
                        }}
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setOpenAlert(false);
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                        severity="info"
                      >
                        {t(
                          'A confirmation has been sent to your email address'
                        )}
                      </Alert>
                    </Collapse>

                    <Typography
                      align="center"
                      sx={{
                        pt: 5,
                        pb: 4,
                        lineHeight: 1.5,
                        px: 10
                      }}
                      variant="h2"
                    >
                      {t(
                        'Check your email to confirm your email and start using your account'
                      )}
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      href="/login"
                    >
                      Continue to sign in
                    </Button>
                  </Container>
                </Box>
              </FormikStep>
            </FormikStepper>
          </Card>
        </Container>
      </MainContent>
    </>
  );
  async function onCreateAccountSubmit(values: CreateAccountWizardFormData) {
    const payload = {
      email: values.email,
      password: values.password,
      firstName: values.first_name,
      lastName: values.last_name
    };
    console.info({ values, payload });
    wretch("/api/users")
      .post(payload)
      .json(json => {
        console.log(json);
      })
      .catch(err => {
        console.error(err);
      });

    await sleep(3000);
  };
}

export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
  label: string;
}

export function FormikStep({ children }: FormikStepProps) {
  return <>{children}</>;
}

export function FormikStepper({
  children,
  ...props
}: FormikConfig<FormikValues>) {
  const childrenArray = Children.toArray(
    children
  ) as ReactElement<FormikStepProps>[];
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step];
  const [completed, setCompleted] = useState(false);
  const { t }: { t: any; } = useTranslation();

  function isLastStep() {
    return step === childrenArray.length - 2;
  }

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setCompleted(true);
          setStep((s) => s + 1);
        } else {
          setStep((s) => s + 1);
          helpers.setTouched({});
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form autoComplete="off">
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step
                key={child.props.label}
                completed={step > index || completed}
              >
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentChild}
          {!completed ? (
            <BoxActions
              p={4}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                disabled={isSubmitting || step === 0}
                variant="outlined"
                color="primary"
                type="button"
                onClick={() => setStep((s) => s - 1)}
              >
                {t('Previous')}
              </Button>

              <NextStepButton isLastStep={isLastStep} isSubmitting={isSubmitting} />
            </BoxActions>
          ) : null}
        </Form>
      )}
    </Formik>
  );
}


