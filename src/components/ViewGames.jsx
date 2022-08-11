import { useState, useLayoutEffect } from "react";
import { useInterval } from "../hooks/useInterval";

import "../css/viewgames.css";
import axios from "axios";
import { pgnView, pgnBoard, pgnPrint } from '@mliebelt/pgn-viewer';



export default function ViewGames() {
  const [pgn, setPGN] = useState("");
  const [move, setMove] = useState(0);
  const id = 'board-' +'breh';

  const fetchCurrentPGN = () => {
    axios.get(
      "https://lichess.org/api/user/Maelstrom-Chess/current-game", { "evals": false }
    ).then((res) => {
      console.log(res);
      console.log(res.data);
      setPGN(res.data);

      let split = res.data.split("} ");
      console.log(split);

      let moveNum = split[split.length - 2];
      if (moveNum !== undefined) {
        if (moveNum.includes("...")) {
          console.log(split[split.length - 2].split("...")[0]);
          setMove(parseInt(split[split.length - 2].split("...")[0], 10) * 2);
        } else {
          console.log(split[split.length - 2].split(".")[0]);
          setMove(parseInt(split[split.length - 2].split(".")[0], 10) * 2 - 1);
        }
      }
    });
  }

  useLayoutEffect(() => {
    if (pgn != "") {
      console.log(move);
      pgnView(id,
        {
          pgn: pgn,
          timerTime: '1',
          locale: 'pl',
          startPlay: move,
          showResult: true,
          layout: "left",
          colorMarker: true,
        }
      )
    }
  })

  useInterval(() => {
    fetchCurrentPGN();
  }, 5000);

  return (
    <div className="viewgames">
      <div className="live">
        <h2>Live Match</h2>

        <div id={id} className="lichess"></div>
      </div>
      <div className="statsandplay">
      </div>
    </div>
  );
}
