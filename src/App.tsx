import { useState } from "react";
import type { ShapeKind } from "./components/shapes";
import { LearnScreen } from "./screens/LearnScreen";
import { QuizScreen } from "./screens/QuizScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { StartScreen } from "./screens/StartScreen";

type Screen = "start" | "learn" | "quiz" | "result";
type LearnTab = ShapeKind | "combo";

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [name, setName] = useState("");
  const [results, setResults] = useState<boolean[]>([]);
  const [round, setRound] = useState(0);
  const [learnTab, setLearnTab] = useState<LearnTab>("square");
  const [learnKey, setLearnKey] = useState(0);

  const displayName = name.trim() || "Teman";

  const startGame = () => {
    setResults([]);
    setRound((r) => r + 1);
    setScreen("quiz");
    window.scrollTo({ top: 0 });
  };

  const openLearn = (tab: LearnTab = "square") => {
    setLearnTab(tab);
    setLearnKey((k) => k + 1);
    setScreen("learn");
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="wood-bg min-h-screen">
      {screen === "start" && (
        <StartScreen
          name={name}
          onNameChange={setName}
          onStart={startGame}
          onLearn={() => openLearn("square")}
          onOpenShape={openLearn}
        />
      )}

      {screen === "learn" && (
        <LearnScreen
          key={learnKey}
          initialTab={learnTab}
          onBack={() => setScreen("start")}
          onPlay={startGame}
        />
      )}

      {screen === "quiz" && (
        <QuizScreen
          key={round}
          name={displayName}
          onFinish={(r) => {
            setResults(r);
            setScreen("result");
          }}
          onExit={() => setScreen("start")}
        />
      )}

      {screen === "result" && (
        <ResultScreen
          name={displayName}
          results={results}
          onRestart={startGame}
          onLearn={() => openLearn("square")}
          onHome={() => setScreen("start")}
        />
      )}
    </div>
  );
}
