import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Card,
  Box,
  TablePagination,
  Container,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import SearchInput from "../../components/SearchInput";
import ProductTable from "./ProductTable";
import { getProducts } from "./productSlice";
import ProductSort from "./ProductSort";
import ProductFilter from "./ProductFilter";
import { FormProvider } from "../../components/form";
import LoadingScreen from "../../components/LoadingScreen";

function ProductInfo() {
  const dispatch = useDispatch();

  const [keySearch, setKeySearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isPublished, setIsPublished] = useState(true); // New state for isPublished

  const { products, isLoading, count } = useSelector((state) => state.product);

  const defaultValues = {
    category,
    priceRange,
    sort,
    keySearch,
  };

  const methods = useForm({ defaultValues });
  const { reset } = methods;

  const handleSubmit = (keySearch) => {
    setKeySearch(keySearch);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "category") {
      setCategory(value);
    } else if (filterType === "priceRange") {
      setPriceRange(value);
    }
    setPage(1);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  // New function to toggle the isPublished state
  const handleTogglePublished = (event) => {
    setIsPublished(event.target.checked);
  };

  // Ensure useEffect is outside any condition
  useEffect(() => {
    dispatch(getProducts({ keySearch, page, limit: rowsPerPage, sort, category, priceRange, isPublished }));
  }, [keySearch, page, rowsPerPage, sort, category, priceRange, isPublished, dispatch]);

  // Moved isLoading check to JSX return section
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Products' Info
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }}>
        <FormProvider methods={methods}>
          <ProductFilter
            resetFilter={reset}
            onFilterChange={handleFilterChange}
            selectedCategory={category}
            selectedPriceRange={priceRange}
          />
        </FormProvider>
        <Stack sx={{ flexGrow: 1 }}>
          <Card sx={{ p: 3 }}>
            {isLoading ? (
              <LoadingScreen />
            ) : (
              <Stack spacing={2}>
                <Stack direction={{ xs: "row", md: "column" }} alignItems="center">
                  <Stack
                    spacing={2}
                    direction={{ xs: "column", sm: "row" }}
                    alignItems={{ sm: "center" }}
                    justifyContent="space-between"
                    mb={2}
                  >
                    <SearchInput handleSubmit={handleSubmit} />
                    <Box sx={{ flexGrow: 1 }} />

                    <FormProvider methods={methods}>
                      <ProductSort onSortChange={handleSortChange} selectedSort={sort} />
                    </FormProvider>
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Toggle Button for Public or Private products */}
                    <FormControlLabel
                      control={<Switch checked={isPublished} onChange={handleTogglePublished} />}
                      label={isPublished ? "Public" : "Private"}
                    />
                  </Stack>

                  <Typography variant="subtitle" sx={{ color: "text.secondary", ml: 1 }}>
                    {count > 1 ? `${count} products found` : count === 1 ? `${count} product found` : "No product found"}
                  </Typography>

                  <Box sx={{ flexGrow: 1 }} />

                  <TablePagination
                    sx={{
                      "& .MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon": {
                        display: { xs: "none", md: "block" },
                      },
                    }}
                    component="div"
                    count={count ? count : 0}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Stack>
                <ProductTable products={products} />
              </Stack>
            )}
          </Card>
        </Stack>
      </Stack>
    </Container>
  );
}

export default ProductInfo;
