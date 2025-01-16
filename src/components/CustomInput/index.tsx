import { TextField } from "@mui/material";
import { FC } from "react";

interface InputProps {
    variant?:"outlined" | "filled" | "standard"
    name:string;
    onChange:(evt: React.ChangeEvent<HTMLInputElement>) => void;
    label:string;
    size?: "small" | "medium";
    helperText?:string;
    fullWidth?: boolean;
    type?:string;
  }

const CustomInput: FC<InputProps> = ({
  variant = "outlined",
  name,
  onChange,
  label,
  size = "medium",
  helperText="",
  fullWidth=true,
  type="text"
}) => {
  return (
    <>
      <TextField
        id="outlined-basic"
        label={label}
        variant={variant}
        size={size}
        error={helperText ? true : false}
        onChange={onChange}
        name={name}
        helperText={helperText}
        fullWidth={fullWidth}
        type={type}
      />
    </>
  );
};

export default CustomInput;
