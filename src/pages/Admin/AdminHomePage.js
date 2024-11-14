import React, { useEffect, useState } from "react";
import { Alert, Box, Container, Pagination, Stack, TablePagination, Typography } from "@mui/material";
import ProductFilter from "../../features/product/ProductFilter";
import ProductSearch from "../../features/product/ProductSearch";
import ProductSort from "../../features/product/ProductSort";
import ProductList from "../../features/product/ProductList";
import { useForm } from 'react-hook-form'; // Import useForm
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../features/product/productSlice"; // Import your action
import LoadingScreen from "../../components/LoadingScreen";
import { FormProvider } from "../../components/form";
import apiService from "../../app/apiService";
import SearchInput from "../../components/SearchInput";

function AdminHomePage() {



  const dispatch = useDispatch();
  const [keySearch, setKeySearch] = useState("");
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("All");// ["All","Phone","Tablet","Watch","Accessory",]
  const [priceRange, setPriceRange] = useState(""); // State for price filter

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  let { products, isLoading, error, count, totalPages } = useSelector((state) => state.product);

  let defaultValues = {
    category,
    priceRange,
    sort,
    keySearch,
  }

  const methods = useForm({
    defaultValues,
  });
  // const { reset } = methods;

  const reset = async () => {
    setKeySearch("");
    setPage(1);
    setRowsPerPage(5);
    setSort("");
    setCategory("All");
    setPriceRange("");
  }
  const handleSubmit = (keySearch) => {
    setKeySearch(keySearch);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Unified handler for category and price range changes
  const handleFilterChange = (filterType, value) => {
    if (filterType === "category") {
      setCategory(value);
    } else if (filterType === "priceRange") {
      setPriceRange(value);
    }
    setPage(0); // Reset to the first page whenever a filter changes
  };


  // Handler for sorting
  const handleSortChange = (event) => {
    setSort(event.target.value);
  };


  useEffect(() => {
    console.log("before dispatch products: ", products)
    dispatch(getProducts({ keySearch, page, limit: rowsPerPage, sort, category, priceRange }));
    console.log("after dispatch products: ", products)
  }, [keySearch, page, rowsPerPage, sort, category, priceRange, dispatch]);



  return (
    <Container sx={{ display: "flex", minHeight: "100vh", mt: 3 }}>
      <Stack direction={{ xs: "column", md: "row" }}>
        <FormProvider methods={methods}>
          <ProductFilter
            resetFilter={reset} // Pass reset function to reset filters
            onFilterChange={handleFilterChange} // Pass the unified filter change handler
            selectedCategory={category}
            selectedPriceRange={priceRange} // Pass down selected price range
          />
        </FormProvider>
        <Stack sx={{ flexGrow: 1 }}>
          <Stack
            spacing={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            justifyContent="space-between"
            mb={2}
          >
            <SearchInput handleSubmit={handleSubmit} />
            <FormProvider methods={methods}>
              <ProductSort onSortChange={handleSortChange} selectedSort={sort} />
            </FormProvider>

            <Box sx={{ flexGrow: 1 }} />
          </Stack>
          <Box sx={{ position: "relative", height: 1 }}>
            {isLoading ? (
              <LoadingScreen />
            ) : (
              <>
                {error ? (
                  <Alert severity="error">{error}</Alert>
                ) : products.length === 0 ? ( // Check if there are no products
                  <Typography variant="h6" color="textSecondary" align="center">
                    No Product matches the given query
                  </Typography>
                ) : (
                  <>
                    <ProductList products={products} />
                    <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
                      <Pagination
                        // count={Math.ceil(count / rowsPerPage)} // Calculate total pages
                        count={totalPages} // Calculate total pages
                        page={page}
                        onChange={handleChangePage}
                        color="secondary"
                      />
                    </Stack>
                  </>
                )}
              </>
            )}
          </Box>
        </Stack>
      </Stack>

    </Container>
  );
}




export default AdminHomePage;
