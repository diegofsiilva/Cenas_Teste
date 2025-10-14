import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Users, Clock, DollarSign, X, Plus, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';

export default function TablesView() {
  const { tables, orders, createOrder, closeOrder, addItemToOrder, removeItemFromOrder, applyDiscount, products } = useApp();
  const [selectedTable, setSelectedTable] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customPrice, setCustomPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [discountValue, setDiscountValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleTableClick = (table) => {
    setSelectedTable(table);
    if (table.status === 'available') {
      setShowOrderModal(true);
    } else {
      setShowOrderModal(true);
    }
  };

  const handleOpenOrder = () => {
    if (selectedTable) {
      createOrder(selectedTable.id, customerName);
      setCustomerName('');
      setShowOrderModal(false);
    }
  };

  const handleAddProduct = () => {
    if (selectedTable && selectedProduct) {
      const order = orders.find(o => o.id === selectedTable.orderId);
      if (order) {
        const price = customPrice ? parseFloat(customPrice) : null;
        addItemToOrder(order.id, selectedProduct, quantity, price);
        setShowProductModal(false);
        setSelectedProduct(null);
        setCustomPrice('');
        setQuantity(1);
        setSearchTerm('');
      }
    }
  };

  const handleCloseOrder = () => {
    if (selectedTable && selectedTable.orderId) {
      closeOrder(selectedTable.orderId);
      setSelectedTable(null);
      setShowOrderModal(false);
    }
  };

  const handleApplyDiscount = () => {
    if (selectedTable && selectedTable.orderId && discountValue) {
      applyDiscount(selectedTable.orderId, parseFloat(discountValue));
      setDiscountValue('');
    }
  };

  const currentOrder = selectedTable?.orderId ? orders.find(o => o.id === selectedTable.orderId) : null;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedTables = {
    left: tables.filter(t => t.position === 'left'),
    topRight: tables.filter(t => t.position === 'top-right'),
    bottom: tables.filter(t => t.position === 'bottom'),
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Controle de Mesas</h2>
        <p className="text-muted-foreground">Clique em uma mesa para abrir ou gerenciar a comanda</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mesas à esquerda */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Mesas Principais</h3>
          <div className="grid grid-cols-2 gap-3">
            {groupedTables.left.map(table => (
              <div
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`table-card ${table.status === 'occupied' ? 'occupied' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{table.name}</span>
                  {table.status === 'occupied' && (
                    <div className="w-3 h-3 bg-accent rounded-full pulse-glow"></div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {table.status === 'occupied' ? (
                    <span className="text-accent font-semibold">Ocupada</span>
                  ) : (
                    <span className="text-green-500">Disponível</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mesas superior direita */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Área Superior</h3>
          <div className="grid grid-cols-2 gap-3">
            {groupedTables.topRight.map(table => (
              <div
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`table-card ${table.status === 'occupied' ? 'occupied' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{table.name}</span>
                  {table.status === 'occupied' && (
                    <div className="w-3 h-3 bg-accent rounded-full pulse-glow"></div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {table.status === 'occupied' ? (
                    <span className="text-accent font-semibold">Ocupada</span>
                  ) : (
                    <span className="text-green-500">Disponível</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sinuca e Bistrô */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary">Área de Lazer</h3>
          <div className="space-y-3">
            {groupedTables.bottom.map(table => (
              <div
                key={table.id}
                onClick={() => handleTableClick(table)}
                className={`table-card ${table.status === 'occupied' ? 'occupied' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{table.name}</span>
                  {table.status === 'occupied' && (
                    <div className="w-3 h-3 bg-accent rounded-full pulse-glow"></div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {table.status === 'occupied' ? (
                    <span className="text-accent font-semibold">Ocupada</span>
                  ) : (
                    <span className="text-green-500">Disponível</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

     // Função atualizada
const handleOpenOrder = () => {
  const newOrder = {
    customerName,
    createdAt: new Date(),
    items: [],
    discount: 0,
    total: 0,
  };

  setCurrentOrder(newOrder);
  setSelectedTable(prev => ({ ...prev, status: 'occupied' }));

  // Removido: setShowOrderModal(false);
};
