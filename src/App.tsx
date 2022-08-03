import logo from "./logo.svg";
import "./App.css";
import Main from "./components/Main";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Typescript App</h1>
      </header>
      <Main />
    </div>
  );
}

export default App;
