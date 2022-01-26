import {
  alpha,
  Button,
  IconButton,
  useTheme,
  Tooltip,
  styled
} from '@mui/material';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';



function HeaderSignIn() {
  const theme = useTheme();
  const navigate = useNavigate();

  const { t }: { t: any; } = useTranslation();
  const onSignIn = () => {
    navigate(`/login`);
  };
  return (
    <>
      <Button
        size="small"
        sx={{
          mx: 1
        }}
        variant="outlined"
        onClick={onSignIn}
      >
        {t('Sign In')}
      </Button>
    </>
  );
}

export default HeaderSignIn;
