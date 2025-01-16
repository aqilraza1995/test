import { Box, Button, Card, CardContent, Stack } from "@mui/material";
import CustomTable from "../../components/CustomTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CustomModal from "../../components/CustomModal";
import CustomInput from "../../components/CustomInput";

interface Song {
    id: string;
    name: string;
    href: string;
  }

interface Column {
  id:  string;
  label: string;
}

interface ErrorText {
  name?: string;
  description?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const songList =
    localStorage.getItem("songs") !== null
      ? JSON.parse(localStorage.getItem("songs") || "[]")
      : [];

  const column: Column[] = [
    { id:"id", label: "ID" },
    { id:"name", label: "Name" },
    { id:"href", label: "Description" },
  ];

  const [open, setOpen] = useState<boolean>(false);
  const [songData, setSongData] = useState({
    name: "",
    href: "",
  });
  const [errorText, setErrorText] = useState<ErrorText>({});

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setSongData({ ...songData, [evt.target.name]: evt.target.value });
  };

  const handleValidation = () => {
    const errors: ErrorText = {};
    let isError = false;
    if (!name) {
      errors.name = "Please enter name";
      isError = true;
    }
    if (!href) {
      errors.description = "Please enter description";
      isError = true;
    } 

    setErrorText(errors);
    return isError;
  };

  const handleSubmit = () => {
    const validate = handleValidation();
    if (!validate) {
        const temp: Song[] = [...songList];

      temp.push({ id: Date.now().toString(), name, href });
      localStorage.setItem("songs", JSON.stringify(temp));
      handleClose();
    }
  };

  const handleClose = () => {
    setSongData({ name: "", href: "" });
    setErrorText({});
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  useEffect(() => {
    const fetchTokenAndPlaylists = async () => {
      try {
        const tokenResponse = await axios.post(
          import.meta.env.VITE_REACT_APP_SPOTIFY_TOKEN_API_ENDPOINT,
          new URLSearchParams({
            grant_type: "client_credentials",
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization:
                "Basic " +
                btoa(
                  `${import.meta.env.VITE_REACT_APP_KEY_CLIENT_ID}:${
                    import.meta.env.VITE_REACT_APP_KEY_CLIENT_SECRET
                  }`
                ),
            },
          }
        );

        const accessToken = tokenResponse.data.access_token;

        const response = await axios.get(
          import.meta.env.VITE_REACT_APP_SPOTIFY_DATA_API_ENDPOINT,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { q: "s", type: "track", limit: 10 },
          }
        );

        if (!songList?.length) {
          localStorage.setItem(
            "songs",
            JSON.stringify(response?.data?.tracks?.items)
          );
        }
      } catch (error) {
        console.error("Error fetching playlists:", error );
      }
    };

    fetchTokenAndPlaylists();
  }, []);

  const { name, href } = songData;
  return (
    <Box
      display="flex"
      justifyContent="center"
      px={{ sm: 6, xs: 1 }}
      flexDirection={"row"}
      py={{ sm: 5, xs: 3 }}
    >
      <Card sx={{ width: 1200 }}>
        <CardContent>
          <Stack flexDirection="row" justifyContent="space-between">
            <Button variant="contained" onClick={() => setOpen(true)}>
              Add Song
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Stack>
          <CustomTable columns={column} rows={songList} />
        </CardContent>
      </Card>

      <CustomModal
        title="Add Song"
        open={open}
        handleClose={handleClose}
        onClick={handleSubmit}
      >
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
            label="Description"
            name="href"
            onChange={handleChange}
            helperText={errorText?.description}
          />
        </Box>
      </CustomModal>
    </Box>
  );
};

export default Dashboard;
