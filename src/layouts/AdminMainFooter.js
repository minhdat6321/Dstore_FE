import React from "react";
import { Link, Typography } from "@mui/material";

function AdminMainFooter() {
  return (
    <Typography variant="body2" color="text.secondary" align="center" p={1}>
      {"Copyright © "}
      <Link color="inherit" href="https://www.instagram.com/_tnmdat.3612_/">
        DiAyTiO6
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default AdminMainFooter
