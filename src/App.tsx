import logo from "./logo.svg";
import "./App.css";
import Main from "./components/Main";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

function App() {
  return (
    <Box
      sx={{
        textAlign: "center",
        minWidth: "320px",
      }}
    >
      <header className="App-header text-white text-lg bg-[#35605A]">
        <Typography color="#F7F7F7" variant="h5">
          Task Tracker
        </Typography>
      </header>
      <Main />
      <footer
        className="
        flex flex-col justify-center items-center
        h-10 bottom-0 text-white bg-[#35605A] w-full"
      >
        <Typography variant="subtitle2">
          Copyright © 2022 Bubu Labs. All rights reserved.
        </Typography>
      </footer>
    </Box>
  );
}

export default App;
