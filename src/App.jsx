import { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/Navbar';
import TablesView from './components/TablesView';
import ProductsView from './components/ProductsView';
import StockView from './components/StockView';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('tables');

  const renderView = () => {
    switch (currentView) {
      case 'tables':
        return <TablesView />;
      case 'products':
        return <ProductsView />;
      case 'stock':
        return <StockView />;
      case 'reports':
        return <ReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <TablesView />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-background">
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="pb-8">
          {renderView()}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Cenas Bar e Lounge - Sistema de Venda
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              
            </p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}

export default App;

