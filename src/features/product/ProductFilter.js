import { Box, Button, Stack, Typography } from "@mui/material";
import { FMultiCheckbox, FRadioGroup } from "../../components/form";
import ClearAllIcon from "@mui/icons-material/ClearAll";

export const SORT_BY_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "priceDesc", label: "Price: High-Low" },
  { value: "priceAsc", label: "Price: Low-High" },
];


export const FILTER_CATEGORY_OPTIONS = [
  "All",
  "Phone",
  "Tablet",
  "Watch",
  "Accessory",
];

export const FILTER_PRICE_OPTIONS = [
  { value: "below", label: "Below $200" },
  { value: "between", label: "Between $200 - $750" },
  { value: "above", label: "Above $750" },
];

function ProductFilter({ resetFilter, onFilterChange, selectedCategory, selectedPriceRange }) {
  // Define default values for category and price range
  const defaultCategory = "All";
  const defaultPriceRange = "below";

  // Reset function to set the filter state to default values
  const reset = () => {
    onFilterChange("category", defaultCategory);
    onFilterChange("priceRange", defaultPriceRange);
    resetFilter(); // Call the external resetFilter function if needed
  };

  const handleCategorySelect = (event) => {
    onFilterChange("category", event.target.value);
  };

  const handlePriceRangeSelect = (event) => {
    onFilterChange("priceRange", event.target.value);
  };

  return (
    <Stack spacing={3} sx={{ p: 3, width: 250 }}>
      <Stack spacing={1}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Category
        </Typography>
        <FRadioGroup
          name="category"
          options={FILTER_CATEGORY_OPTIONS}
          value={selectedCategory}
          row={false}
          onChange={handleCategorySelect} // Call handleCategorySelect on change

        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Price
        </Typography>
        <FRadioGroup
          name="priceRange"
          options={FILTER_PRICE_OPTIONS.map((item) => item.value)}
          getOptionLabel={FILTER_PRICE_OPTIONS.map((item) => item.label)}
          value={selectedPriceRange}
          onChange={handlePriceRangeSelect}
        />
      </Stack>

      <Box>
        <Button
          size="large"
          type="submit"
          color="inherit"
          variant="outlined"
          onClick={reset} // Call the reset function on click
          startIcon={<ClearAllIcon />}
        >
          Clear All
        </Button>
      </Box>
    </Stack>
  );
}

export default ProductFilter;