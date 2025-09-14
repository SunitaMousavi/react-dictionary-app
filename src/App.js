import "./App.css";
import Dictionary from "./Dictionary";

function App() {
  return (
    <div className="App container">
      <main>
        <Dictionary />
      </main>
      <footer className="App-footer text-center">
        Coded by{" "}
        <a
          href="https://github.com/SunitaMousavi"
          target="_blank"
          rel="noopener noreferrer">
          Sunita Mousavi
        </a>
        , open-sourced on{" "}
        <a
          href="https://github.com/SunitaMousavi/react-weather"
          target="_blank"
          rel="noopener noreferrer">
          GitHub
        </a>{" "}
        and hosted on{" "}
        <a
          href="https://reactweatherapp-sunitamousavi.netlify.app"
          target="_blank"
          rel="noopener noreferrer">
          Netlify
        </a>
      </footer>
    </div>
  );
}

export default App;
