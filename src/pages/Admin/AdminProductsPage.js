import React, { useState } from "react";
import { Container, Tab, Box, Tabs, Typography } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ShareIcon from "@mui/icons-material/Share";
// import AccountGeneral from "../features/user/AccountGeneral";
// import AccountSocialLinks from "../features/user/AccountSocialLinks";
import { capitalCase } from "change-case";
import ProductCreate from "../../features/product/ProductCreate";
import ProductUpdate from "../../features/product/ProductUpdate";
import ProductInfo from "../../features/product/ProductInfo";


function AdminProductsPage() {
  const [currentTab, setCurrentTab] = useState("product_update");

  const ADMIN_PRODUCT_TAB = [
    {
      value: "product_update",
      icon: <ShareIcon sx={{ fontSize: 30 }} />,
      component: <ProductUpdate profile={{}} />,
    },

    {
      value: "product_create",
      icon: <AccountBoxIcon sx={{ fontSize: 30 }} />,
      component: <ProductCreate />,
    },

    {
      value: "product_info",
      icon: <AccountBoxIcon sx={{ fontSize: 30 }} />,
      component: <ProductInfo />,
    },
  ];

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Products Control
      </Typography>
      <Tabs
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setCurrentTab(value)}
      >
        {ADMIN_PRODUCT_TAB.map((tab) => (
          <Tab
            disableRipple
            key={tab.value}
            label={capitalCase(tab.value)}
            icon={tab.icon}
            value={tab.value}
          />
        ))}
      </Tabs>

      <Box sx={{ mb: 5 }} />

      {ADMIN_PRODUCT_TAB.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Container>
  );
}

export default AdminProductsPage;