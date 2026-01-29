import React, { useState } from "react";
import "./App.css";
import EditorPage from "./features/editor/EditorPage";
import LandingPage from "./features/landing/LandingPage";
import ProjectSetup from "./features/landing/ProjectSetup";

function App() {
  const [step, setStep] = useState('landing'); // 'landing', 'setup', 'editor'
  const [projectType, setProjectType] = useState(null);
  const [projectConfig, setProjectConfig] = useState(null);

  const handleTypeSelect = (type) => {
    setProjectType(type);
    setStep('setup');
  };

  const handleSetupComplete = (config) => {
    setProjectConfig(config);
    setStep('editor');
  };

  const handleBackToLanding = () => {
    setStep('landing');
    setProjectType(null);
    setProjectConfig(null);
  };

  return (
    <div className="App">
      {step === 'landing' && (
        <LandingPage onSelect={handleTypeSelect} />
      )}

      {step === 'setup' && (
        <ProjectSetup
          projectType={projectType}
          onComplete={handleSetupComplete}
          onBack={handleBackToLanding}
        />
      )}

      {step === 'editor' && (
        <EditorPage
          projectConfig={projectConfig}
          onBack={handleBackToLanding}
        />
      )}
    </div>
  );
}



export default App;
