/**
 * https://www.npmjs.com/package/mathjs
 */
import {
  atan2,
  chain,
  derivative,
  e,
  evaluate,
  log,
  pi,
  pow,
  round,
  sqrt,
  parse,
  format,
} from "mathjs";
import { useState } from "react";

/** 계산기 만들기  */
function Calc() {
  const [myinput, setMyinput] = useState("");
  const [result, setMyresult] = useState("");
  const [errmsg, setErrmsg] = useState("");

  function onCalc(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!myinput?.trim()) {
      return;
    }
    if (!e?.code?.toLowerCase().includes("enter")) {
      return;
    }
    try {
      let _result = evaluate(myinput);
      setMyresult(_result);
      console.log(`result : `, result);
    } catch (error: any) {
      alert(`! err: ${error?.message}`);
      setErrmsg(error?.message);
    }
  }

  return (
    <div>
      <h1>Calc</h1>
      <div>
        <label>수식을 입력하세요:</label>
        <input
          value={myinput}
          onChange={(e) => {
            setMyinput(e?.target?.value);
          }}
          onKeyDown={(e) => {
            onCalc(e);
          }}
        />
        <span> = {result}</span>
      </div>
    </div>
  );
}

export default Calc;
