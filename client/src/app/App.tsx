import * as React from "react";
import { Route, useRoutes } from "react-router-dom";

import AdapterDateFns from "@mui/lab/AdapterDateFns";

import { CssBaseline } from "@mui/material";
import router from "router/Router";
import ThemeProvider from "theme/ThemeProvider";

function App() {
  const content = useRoutes(router);

  return (
    <ThemeProvider>
      <CssBaseline />
      {content}
    </ThemeProvider>
  );
}
export default App;
