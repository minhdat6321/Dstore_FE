import { useFormContext, Controller } from "react-hook-form";
import {
  Radio,
  RadioGroup,
  FormHelperText,
  FormControlLabel,
} from "@mui/material";

function FRadioGroup({ name, options, getOptionLabel, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <RadioGroup
            {...field}
            row
            onChange={(event) => {
              const value = event.target.value;
              // Update the field based on the value
              if (value === "true" || value === "false") {
                field.onChange(value === "true"); // Update as boolean
              } else {
                field.onChange(value); // Update as string
              }
            }}
            {...other}
          >
            {options.map((option, index) => (
              <FormControlLabel
                key={option}
                value={option.toString()} // Set value as string
                control={<Radio />}
                label={getOptionLabel?.length ? getOptionLabel[index] : option}
              />
            ))}
          </RadioGroup>

          {!!error && (
            <FormHelperText error sx={{ px: 2 }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

export default FRadioGroup;
