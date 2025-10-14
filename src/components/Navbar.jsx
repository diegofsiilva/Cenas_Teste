import { Home, Package, BarChart3, Settings, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

export default function Navbar({ currentView, setCurrentView }) {
  const navItems = [
    { id: 'tables', label: 'Mesas', icon: Home },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'stock', label: 'Estoque', icon: Archive },
    { id: 'reports', label: 'Relatórios', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <nav className="navbar sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-xl">
              CB
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Cenas Bar e Lounge</h1>
              <p className="text-xs text-muted-foreground">Sistema de Ponto de Venda</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentView(item.id)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

