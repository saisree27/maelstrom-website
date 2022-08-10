import "../css/viewgames.css";

export default function ViewGames() {
  return (
    <div className="viewgames">
      <div className="live">
        <h2>Live Match</h2>
        <iframe src="https://lichess.org/tv/frame?theme=auto&bg=auto" frameBorder="0" className="lichess">
        </iframe>
      </div>
      <div className="statsandplay">
        <h2>Stats</h2>
      </div>
    </div>
  );
}
