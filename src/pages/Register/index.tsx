import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import CustomInput from "../../components/CustomInput";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";


interface RegisterDataProps {
    name: string;
    email: string;
    password: string;
}

interface ErrorTextProps {
    name?: string;
    email?: string;
    password?: string;
}

const Register = () => {
    const navigate = useNavigate();
    const loggedUser =
        localStorage.getItem("loggedUser") !== null
            ? JSON.parse(localStorage.getItem("loggedUser") || "")
            : null;
    const userData =
        localStorage.getItem("users") !== null
            ? JSON.parse(localStorage.getItem("users") || "[]")
            : [];
    const [registerData, setRegisterData] = useState<RegisterDataProps>({
        name: "",
        email: "",
        password: "",
    });
    const [errorText, setErrorText] = useState<ErrorTextProps>({});

    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({ ...registerData, [evt.target.name]: evt.target.value });
    };

    const handleValidation = () => {
        const errors: ErrorTextProps = {}; 
        let isError = false;

        if (!name) {
            errors.name = "Please enter name";
            isError = true;
        }
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

    const handleEncrypt = (value: string) => {
        const encryptedPassword = CryptoJS.AES.encrypt(
            value,
            import.meta.env.VITE_REACT_APP_KEY
        ).toString();
        return encryptedPassword;
    };

    const handleSubmit = () => {
        const validate = handleValidation();
        if (!validate) {
            const temp = userData;
            const encryptPassword = handleEncrypt(password);

            temp.push({ id: Date.now(), name, email, password: encryptPassword });
            localStorage.setItem("users", JSON.stringify(temp));
            navigate("/login");
        }
    };

    if (loggedUser) {
        return <Navigate to={"/"} />;
    }

    const { name, email, password } = registerData;

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
            <h2>Register</h2>

            <Card sx={{ width: 400 }}>
                <CardContent>
                    <Box sx={{ mb: 3 }}>
                        <CustomInput
                            label="Name"
                            name="name"
                            onChange={handleChange}
                            helperText={errorText?.name}
                        />
                    </Box>
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
                            Register
                        </Button>
                        <Typography>
                            Already have an account
                            <Link
                                style={{ textDecoration: "none", marginLeft: "3px" }}
                                to={"/login"}
                            >
                                login
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Register;
