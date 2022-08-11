import { useState, useLayoutEffect } from "react";
import { useInterval } from "../hooks/useInterval";

import "../css/viewgames.css";
import axios from "axios";
import { pgnView, pgnBoard, pgnPrint } from "@mliebelt/pgn-viewer";
import { parse } from "@mliebelt/pgn-parser";

export default function ViewGames() {
  const [pgn, setPGN] = useState("");
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState("*");
  const [white, setWhite] = useState("None");
  const [black, setBlack] = useState("None");
  const [move, setMove] = useState(0);
  const [flip, setFlip] = useState("white");
  const [online, setOnline] = useState(false);

  const [blitzRating, setBlitzRating] = useState(0);
  const [bulletRating, setBulletRating] = useState(0);
  const [rapidRating, setRapidRating] = useState(0);
  const [classicalRating, setClassicalRating] = useState(0);

  const id = "board";

  const fetchCurrentPGN = () => {
    axios
      .get("https://lichess.org/api/user/Maelstrom-Chess/current-game", {
        evals: false,
      })
      .then((res) => {
        setLoading(false);
        setPGN(res.data);

        let game = parse(res.data)[0];

        setMove(game.moves.length);
        setResult(game.tags.Result);

        if (game.tags.WhiteTitle == "") {
          setWhite(game.tags.White);
        } else {
          setWhite(game.tags.WhiteTitle + " " + game.tags.White);
        }

        if (game.tags.BlackTitle == "") {
          setBlack(game.tags.Black);
        } else {
          setBlack(game.tags.BlackTitle + " " + game.tags.Black);
        }

        if (game.tags.White == "Maelstrom-Chess") {
          setFlip("white");
        } else {
          setFlip("black");
        }
      });
  };

  const fetchStatistics = () => {
    axios.get("https://lichess.org/api/user/Maelstrom-Chess").then((res) => {
      setOnline(res.data.online);
      setBlitzRating(res.data.perfs.blitz.rating);
      setRapidRating(res.data.perfs.rapid.rating);
      setBulletRating(res.data.perfs.bullet.rating);
      setClassicalRating(res.data.perfs.classical.rating);
    });
  };

  useLayoutEffect(() => {
    if (pgn != "") {
      console.log(move);
      pgnView(id, {
        pgn: pgn,
        timerTime: "1",
        locale: "pl",
        startPlay: move,
        showResult: true,
        layout: "top",
        colorMarker: true,
        boardSize: "550",
        orientation: flip,
      });
    }
  });

  useInterval(() => {
    fetchCurrentPGN();
    fetchStatistics();
  }, 5000);

  return (
    <div className="viewgames">
      <div className="live">
        <h2>Live Game / Most Recent Game</h2>

        <div className="lichess">
          {loading ? (
            <p>Loading Game...</p>
          ) : (
            <div>
              <p>
                {white} (W) vs. {black} (B) {result}
              </p>
              <div id={id}></div>
              <p>
                Note: live games will be 3 moves behind realtime on Lichess,
                which is a feature implemented by the Lichess API to avoid
                cheating.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="statsandplay">
        <h2>Statistics</h2>
        {loading ? (
          <p>Loading Statistics...</p>
        ) : (
          <div>
            <div className="status">
              <a className="currently lichess-link" href="https://lichess.org/@/Maelstrom-Chess"><strong>Maelstrom</strong></a>
              <p className="currently"> is currently </p>
              {online ? (
                <p className="online">online</p>
              ) : (
                <p className="offline">offline</p>
              )}
              <p className="currently">
                {online ? " on Lichess." : " on Lichess. Please check back later!"}
              </p>
            </div>

            <div className="statistics">
              <p>Bullet Rating: {bulletRating}</p>
              <p>Blitz Rating: {blitzRating}</p>
              <p>Rapid Rating: {rapidRating}</p>

              <p className="currently">View all previous games{' '}</p>
              <a className="currently lichess-link" href="https://lichess.org/@/Maelstrom-Chess/all">here</a>
              <p className="currently">.</p>
            </div>
          </div>
        )}
        <h2>How to Play</h2>
        <div>
          <p>When Maelstrom is online on Lichess and not playing a live game, you can challenge it on Lichess! You will need a Lichess account, which is quick and easy to create.</p>
        </div>
      </div>
    </div>
  );
}
