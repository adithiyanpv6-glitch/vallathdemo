import React, { useState } from 'react';
import { DemoProvider, useDemo } from './context/DemoContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { StartHere } from './components/StartHere';
import { AskVallath } from './components/AskVallath';
import { PracticeEngine } from './components/PracticeEngine';
import { FeedbackDesk } from './components/FeedbackDesk';
import { ContentStudio } from './components/ContentStudio';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

const AppContent: React.FC = () => {
  const { activeTab } = useDemo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'start-here':
        return <StartHere />;
      case 'ask-vallath':
        return <AskVallath />;
      case 'practice-engine':
        return <PracticeEngine />;
      case 'feedback-desk':
        return <FeedbackDesk />;
      case 'content-studio':
        return <ContentStudio />;
      default:
        return <StartHere />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col font-sans selection:bg-maroon-100 selection:text-maroon-900">
      {/* Top Header */}
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Center Main Module Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-5xl">
          {renderActiveModule()}
        </main>
      </div>

      {/* Global Footer */}
      <Footer />

      {/* Floating Toasts */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <DemoProvider>
      <AppContent />
    </DemoProvider>
  );
};

export default App;
