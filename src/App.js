import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [input, setInput] = useState("");
  const [voices, setVoices] = useState([]);
  const speech = new SpeechSynthesisUtterance();
  const [pitch, setPitch] = useState(() =>
    JSON.parse(localStorage.getItem("pitch"))
      ? JSON.parse(localStorage.getItem("pitch"))
      : 1
  );
  const [rate, setRate] = useState(() =>
    JSON.parse(localStorage.getItem("rate"))
      ? JSON.parse(localStorage.getItem("rate"))
      : 1
  );
  const [volume, setVolume] = useState(() =>
    JSON.parse(localStorage.getItem("volume"))
      ? JSON.parse(localStorage.getItem("volume"))
      : 1
  );
  const [lang, setLang] = useState(() =>
    JSON.parse(localStorage.getItem("lang"))
      ? JSON.parse(localStorage.getItem("lang"))
      : { name: "", lang: "" }
  );
  const [select, setSelect] = useState(lang.name && lang.lang);

  useEffect(() => {
    (speechSynthesis.speaking || speechSynthesis.paused) &&
      speechSynthesis.cancel();
    speechSynthesis.addEventListener("voiceschanged", function () {
      setVoices(this.getVoices());
    });
  }, []);

  function startSpeak() {
    speech.text = input;
    const temp = voices.find(
      (e) => e.name === lang.name && e.lang === lang.lang
    );
    speech.rate = rate;
    speech.pitch = pitch;
    speech.volume = volume;
    speech.voice = temp;
    speechSynthesis.speak(speech);
  }

  function handleLang(event) {
    const getLang = voices.find((e) => e.name === event.target.value);
    localStorage.setItem(
      "lang",
      JSON.stringify({ name: getLang.name, lang: getLang.lang })
    );
    setLang({ name: getLang.name, lang: getLang.lang });
  }

  function handlePitch(event) {
    speechSynthesis.speaking && speechSynthesis.cancel();
    localStorage.setItem("pitch", JSON.stringify(event.target.value));
    setPitch(event.target.value);
    startSpeak();
  }

  function handleRate(event) {
    speechSynthesis.speaking && speechSynthesis.cancel();
    localStorage.setItem("rate", JSON.stringify(event.target.value));
    setRate(event.target.value);
    startSpeak();
  }
  function handleVolume(event) {
    speechSynthesis.speaking && speechSynthesis.cancel();
    localStorage.setItem("volume", JSON.stringify(event.target.value));
    setVolume(event.target.value);
    startSpeak();
  }

  function reset() {
    setSelect(false);
    localStorage.clear("lang");
    setLang({ name: "", lang: "" });
    speechSynthesis.cancel();
  }

  return (
    <div className="App">
      <select onChange={handleLang}>
        {voices.length ? (
          select ? (
            <option defaultValue={lang.name}>{lang.name}</option>
          ) : (
            voices.map((item, index) => (
              <option key={item.name + index} defaultValue={item.name}>
                {item.name}
              </option>
            ))
          )
        ) : (
          <option>Something Went Wrong!</option>
        )}
      </select>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter Input"
      />
      <button onClick={startSpeak}>Speak!</button>
      <button onClick={() => speechSynthesis.pause()}>Pause!</button>
      <button onClick={() => speechSynthesis.resume()}>Resume!</button>
      <button onClick={() => speechSynthesis.cancel()}>Stop!</button>
      <button onClick={reset}>Reset Language</button>
      <label htmlFor="pitch">Pitch</label>
      <input
        id={"pitch"}
        type="range"
        value={pitch}
        onChange={handlePitch}
        max={"3"}
        step={"0.1"}
      />
      <label htmlFor="rate">Rate</label>
      <input
        id={"rate"}
        type="range"
        value={rate}
        onChange={handleRate}
        max={"2"}
        step={"0.1"}
      />
      <label htmlFor="volume">Volume</label>
      <input
        id={"volume"}
        type="range"
        value={volume}
        onChange={handleVolume}
        max={"1"}
        min={"0"}
        step={"0.1"}
      />
    </div>
  );
}
