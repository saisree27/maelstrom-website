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

  const id = "board-" + "breh";

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
        boardSize: "500",
        orientation: flip,
      });
    }
  });

  useInterval(() => {
    fetchCurrentPGN();
  }, 5000);

  return (
    <div className="viewgames">
      <div className="live">
        <h2>Live Game / Most Recent Game</h2>

        <div className="lichess">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <p>
                {white} (W) vs. {black} (B) {result}
              </p>
              <div id={id}></div>
            </div>
          )}
        </div>
      </div>
      <div className="statsandplay"></div>
    </div>
  );
}
