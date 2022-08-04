import logo from "./logo.svg";
import "./App.css";
import Main from "./components/Main";

function App() {
  return (
    <div className="text-center">
      <header className="App-header text-white text-lg bg-zinc-800">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>React-Typescript App</h1>
      </header>
      <Main />
    </div>
  );
}

export default App;
