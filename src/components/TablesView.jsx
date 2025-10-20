import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus, X, Utensils, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import ProductsSelectionView from './ProductsSelectionView';

const dummyTables = [
  { id: 1, name: 'Mesa 1', status: 'available', order: [] },
  { id: 2, name: 'Mesa 2', status: 'occupied', order: [{ id: 'prod-1', name: 'Cerveja', price: 10.00, qty: 2 }] },
  { id: 3, name: 'Mesa 3', status: 'available', order: [] },
  { id: 4, name: 'Mesa 4', status: 'occupied', order: [{ id: 'prod-2', name: 'Porção Fritas', price: 25.00, qty: 1 }] },
  { id: 5, name: 'Mesa 5', status: 'available', order: [] },
  { id: 6, name: 'Mesa 6', status: 'occupied', order: [{ id: 'prod-3', name: 'Água', price: 5.00, qty: 3 }] },
  { id: 7, name: 'Mesa 7', status: 'available', order: [] },
  { id: 8, name: 'Sinuca', status: 'occupied', order: [{ id: 'prod-4', name: 'Rodada', price: 15.00, qty: 1 }] },
  { id: 9, name: 'Bistro 1', status: 'available', order: [] },
  { id: 10, name: 'Bistro 2', status: 'occupied', order: [{ id: 'prod-5', name: 'Café', price: 8.00, qty: 1 }] },
];

export default function TablesView() {
  const [tables, setTables] = useState(dummyTables);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isAddingProducts, setIsAddingProducts] = useState(false);

  const handleSelectTable = (table) => setSelectedTable(table);
  const handleBackToTables = () => {
    setSelectedTable(null);
    setIsAddingProducts(false);
  };
  const handleOpenAddProducts = () => setIsAddingProducts(true);

  const handleAddProductToOrder = (productData) => {
    if (!selectedTable) return;

    setTables(prevTables =>
      prevTables.map(table => {
        if (table.id === selectedTable.id) {
          const existingItem = table.order.find(item => item.id === productData.id);
          const newOrder = existingItem
            ? table.order.map(item =>
                item.id === productData.id ? { ...item, qty: item.qty + 1 } : item
              )
            : [...table.order, { ...productData, qty: 1 }];
          const newStatus = table.status === 'available' ? 'occupied' : table.status;
          return { ...table, status: newStatus, order: newOrder };
        }
        return table;
      })
    );
    setIsAddingProducts(false);
  };

  // 🔹 Card de cada mesa
  const TableCard = ({ table }) => {
    const isOccupied = table.status === 'occupied';
    const statusColor = isOccupied
      ? 'border border-red-300 bg-red-500/70 text-white hover:bg-red-500/90'
      : 'border border-green-300 bg-green-700/70 text-white hover:bg-green-700/90';

    const statusText = isOccupied ? 'Ocupada' : 'Disponível';
    const totalOrder = table.order.reduce((sum, item) => sum + item.price * item.qty, 0);
    const isBistro = table.name.includes('Bistro');
    const shapeClass = isBistro
      ? 'rounded-full h-40 w-40 flex flex-col items-center justify-center text-center p-3'
      : 'rounded-xl p-4 flex flex-col justify-between text-center';
    const gridAreaClass = `area-${table.name.toLowerCase().replace(/ /g, '-').replace('á', 'a')}`;

    return (
      <Card
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${statusColor} ${shapeClass} ${gridAreaClass}`}
        onClick={() => handleSelectTable(table)}
      >
        {isBistro ? (
          <div className="flex flex-col items-center justify-center h-full">
            <CardTitle className="text-lg font-semibold">{table.name}</CardTitle>
            <div className="text-2xl font-bold mt-1">
              {isOccupied ? `R$ ${totalOrder.toFixed(2)}` : 'Livre'}
            </div>
            <p className={`text-sm font-medium mt-1 ${isOccupied ? 'text-red-200' : 'text-green-200'}`}>
              {statusText}
            </p>
          </div>
        ) : (
          <>
            <CardHeader className="flex flex-col items-center justify-center pb-0">
              <CardTitle className="text-lg font-semibold">{table.name}</CardTitle>
              {isOccupied ? (
                <Utensils className="h-5 w-5 text-red-200 mt-1" />
              ) : (
                <CheckCircle className="h-5 w-5 text-green-200 mt-1" />
              )}
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center mt-1">
              <div className="text-2xl font-bold mb-1">
                {isOccupied ? `R$ ${totalOrder.toFixed(2)}` : 'Livre'}
              </div>
              <p className={`text-sm font-medium ${isOccupied ? 'text-red-200' : 'text-green-200'}`}>
                {statusText}
              </p>
              {isOccupied && (
                <p className="text-xs text-red-100 mt-1">
                  {table.order.length} {table.order.length === 1 ? 'item' : 'itens'} na comanda
                </p>
              )}
            </CardContent>
          </>
        )}
      </Card>
    );
  };

  const OrderView = ({ table }) => {
    const total = table.order.reduce((sum, item) => sum + item.price * item.qty, 0);

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Comanda da {table.name}</h3>
          <Button onClick={handleOpenAddProducts}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produtos
          </Button>
        </div>

        <div className="space-y-3">
          {table.order.length === 0 ? (
            <p className="text-muted-foreground">Nenhum item na comanda. Adicione produtos!</p>
          ) : (
            table.order.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg bg-white">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {item.price.toFixed(2)} x {item.qty}
                  </p>
                </div>
                <p className="font-bold">R$ {(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4 flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" className="flex-1">
            Fechar Comanda
          </Button>
          <Button variant="destructive" className="flex-1">
            Transferir Mesa
          </Button>
        </div>
      </div>
    );
  };

  if (selectedTable) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={handleBackToTables} className="mr-2">
            <X className="w-5 h-5" />
          </Button>
          <h2 className="text-3xl font-bold">Gerenciando {selectedTable.name}</h2>
        </div>

        {isAddingProducts ? (
          <ProductsSelectionView
            onProductSelect={handleAddProductToOrder}
            onCancel={() => setIsAddingProducts(false)}
          />
        ) : (
          <OrderView table={selectedTable} />
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Mesas e Comandas</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Mesa
        </Button>
      </div>

      <style jsx>{`
        .tables-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr) 100px;
          grid-template-rows: repeat(3, 100px) 100px;
          gap: 20px;
          grid-template-areas:
