import { GameBoard2D } from './components/GameBoard2D';

function App() {
  return (
    <div className="h-screen overflow-hidden">
      {/* Mobile rotation overlay */}
      <div className="rotation-overlay">
        <div className="rotate-icon">📱</div>
        <h2 className="text-2xl font-bold mb-4">Please Rotate Your Device</h2>
        <p className="text-lg opacity-90">
          This game requires landscape mode for the best experience
        </p>
        <div className="mt-6 text-sm opacity-75">
          Rotate your device to landscape orientation to continue
        </div>
      </div>
      
      {/* Main game content */}
      <div className="main-content h-full">
        <GameBoard2D />
      </div>
    </div>
  );
}

export default App;