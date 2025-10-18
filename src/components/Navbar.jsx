import { Home, Package, BarChart3, Settings, Archive, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { useState } from 'react';

export default function Navbar({ currentView, setCurrentView }) {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navItems = [
    { 
      id: 'tables', 
      label: 'Mesas', 
      icon: Home,
      subItems: [
        { id: 'active-tables', label: 'Mesas Ativas' },
        { id: 'table-history', label: 'Histórico' }
      ]
    },
    { 
      id: 'products', 
      label: 'Produtos', 
      icon: Package,
      subItems: [
        { id: 'catalog', label: 'Catálogo' },
        { id: 'categories', label: 'Categorias' }
      ]
    },
    { 
      id: 'stock', 
      label: 'Estoque', 
      icon: Archive,
      subItems: [
        { id: 'inventory', label: 'Inventário' },
        { id: 'movements', label: 'Movimentações' }
      ]
    },
    { 
      id: 'reports', 
      label: 'Relatórios', 
      icon: BarChart3,
      subItems: [
        { id: 'sales', label: 'Vendas' },
        { id: 'analytics', label: 'Análises' }
      ]
    },
    { 
      id: 'settings', 
      label: 'Configurações', 
      icon: Settings,
      subItems: [
        { id: 'profile', label: 'Perfil' },
        { id: 'preferences', label: 'Preferências' }
      ]
    },
  ];

  return (
    <nav className="navbar sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center">
          <div className="flex items-center gap-3 mr-8">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-xl">
              CL
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Cenas Bar e Lounge</h1>
              <p className="text-xs text-muted-foreground">Registro de vendas CL</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="relative">
                  <Button
                    variant={currentView === item.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setCurrentView(item.id);
                      setActiveDropdown(activeDropdown === item.id ? null : item.id);
                    }}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  {activeDropdown === item.id && (
                    <div className="dropdown active">
                      {item.subItems.map(subItem => (
                        <a
                          key={subItem.id}
                          href="#"
                          className="dropdown-item"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentView(subItem.id);
                            setActiveDropdown(null);
                          }}
                        >
                          {subItem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );

  
}