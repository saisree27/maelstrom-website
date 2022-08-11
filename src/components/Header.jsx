import "../css/header.css";

export default function Header() {
  return (
    <div className="App">
      <header className="App-header">
        <img src="/maelstrom-logo.png" className="App-logo" alt="logo" />
        <h1>MAELSTROM</h1>
        <p>UCI Chess Engine written from scratch in Golang</p>
        <div className="link-container">
          <a target="_blank" className="flex-link">
            View Games
          </a>
          <a target="_blank" className="flex-link">
            Development
          </a>
          <a
            target="_blank"
            className="flex-link"
            href="https://github.com/saisree27/Maelstrom"
          >
            GitHub
          </a>
        </div>
      </header>
    </div>
  );
}
