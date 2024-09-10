import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const CountrySelect = ({
  countries,
  onChange,
  onBlur,
  value,
  error,
  helperText,
}) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="country-label">Country</InputLabel>
      <Select
        labelId="country-label"
        id="country"
        name="country"
        label="Country"
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        error={error}
        helperText={helperText}
      >
        {countries.map((country) => (
          <MenuItem key={country.code} value={country.label}>
            {country.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CountrySelect;
