import "./App.css";
import Main from "./components/Main";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";

function App() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minWidth: "448px",
        height: "100vh",
      }}
    >
      <header className="App-header text-white text-lg bg-[#3A5A40]">
        <Typography
          color="#F7F7F7"
          variant="h5"
          fontWeight={600}
          letterSpacing={1}
        >
          TaskMate
        </Typography>
      </header>
      <Main />
      <footer
        className="
        flex flex-col justify-center items-center
        h-10 sticky bottom-0 text-white w-full bg-[#3A5A40]"
      >
        <Typography variant="subtitle2">
          Copyright © 2022 Bubu Labs. All rights reserved.
        </Typography>
      </footer>
    </Box>
  );
}

export default App;
