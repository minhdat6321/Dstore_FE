import React from "react";
import { FSelect } from "../../components/form";

function ProductSort({ onSortChange, selectedSort }) {
  return (
    <FSelect
      name="sortBy"
      label="Sort By"
      size="small"
      sx={{ width: 300 }}
      value={selectedSort}
      onChange={onSortChange} // Trigger sorting when selection changes
    >
      <option value=""></option> {/* Default blank option */}

      {[
        { value: "newest", label: "Newest" },
        { value: "priceDesc", label: "Price: High-Low" },
        { value: "priceAsc", label: "Price: Low-High" },
      ].map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </FSelect>
  );
}


export default ProductSort;