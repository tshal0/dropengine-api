import { Box } from '@mui/material';
import HeaderNotifications from './Notifications/HeaderNotificationsButton';
import React from 'react';
import HeaderSignIn from './SignIn/HeaderSignInButton';

function HeaderButtons() {
  return (
    <Box
      sx={{
        mr: 1
      }}
    >
      <HeaderSignIn />
    </Box>
  );
}

export default HeaderButtons;
