import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import CustomInput from "../../components/CustomInput";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FC, useState } from "react";
import CryptoJS from "crypto-js";

interface ErrorTextProps {
    email?: string;
    password?: string;
}

interface LoginProps {
  setAuth: (authState: boolean) => void; // Assuming setAuth updates a boolean auth state
}

const Login: FC<LoginProps> = ({setAuth}) => {
  const navigate = useNavigate();
  const loggedUser = localStorage.getItem('loggedUser') !== null
  ? JSON.parse(localStorage.getItem('loggedUser')|| "")
  : null

  const users =
    localStorage.getItem("users") !== null
      ? JSON.parse(localStorage.getItem("users") ||"[]")
      : "";
  const [credential, setCredential] = useState<ErrorTextProps>({
    email: "",
    password: "",
  });
  const [errorText, setErrorText] = useState<ErrorTextProps>({});

  const handleChange = (evt:React.ChangeEvent<HTMLInputElement>) => {
    setCredential({ ...credential, [evt.target.name]: evt.target.value });
  };

  const handleValidation = () => {
    const errors :ErrorTextProps = {};
    let isError = false;
    if (!email) {
      errors.email = "Please enter email";
      isError = true;
    }
    if (!password) {
      errors.password = "Please enter password";
      isError = true;
    }

    setErrorText(errors);
    return isError;
  };

  const handleDecrypt = (encryptedPassword: string) => {
    const bytes = CryptoJS.AES.decrypt(
      encryptedPassword,
      import.meta.env.VITE_REACT_APP_KEY
    );
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedPassword;
  };

  const handleSubmit = () => {
    const validate = handleValidation();
    if (!validate) {
      console.log("users :", users);

      const loggedUser = users?.find(
        (item: { email: string | undefined; password: string; }) =>
          item?.email === email && handleDecrypt(item?.password) === password
      );
      localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
      setAuth(loggedUser)
      navigate("/");
    }
  };

  const { email, password } = credential;

  if(loggedUser){
   return <Navigate to={"/"} />
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "column",
      }}
    >
      <h2>Login</h2>

      <Card sx={{ width: 400 }}>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <CustomInput
              label="Email"
              name="email"
              onChange={handleChange}
              helperText={errorText?.email}
            />
          </Box>
          <Box sx={{ mb: 3 }}>
            <CustomInput
              label="Password"
              type="password"
              name="password"
              onChange={handleChange}
              helperText={errorText?.password}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="contained" onClick={handleSubmit}>
              Login
            </Button>
            <Typography>
              Don't have an account
              <Link
                style={{ textDecoration: "none", marginLeft: "3px" }}
                to={"/register"}
              >
                register
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
