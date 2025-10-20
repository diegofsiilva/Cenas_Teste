import { useState } from 'react';
import { useApp } from '../contexts/AppContext'; // Assumindo que AppContext lida com o estado global
import { Plus, X, Utensils, CheckCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';

// Importar o novo componente que será criado na próxima fase
import ProductsSelectionView from './ProductsSelectionView';

// Dados de exemplo para simular mesas, já que não temos o AppContext
const dummyTables = [
  { id: 1, name: 'Mesa 1', status: 'available', order: [] },
  { id: 2, name: 'Mesa 2', status: 'occupied', order: [{ id: 'prod-1', name: 'Cerveja', price: 10.00, qty: 2 }] },
  { id: 3, name: 'Mesa 3', status: 'available', order: [] },
  { id: 4, name: 'Mesa 4', status: 'occupied', order: [{ id: 'prod-2', name: 'Porção Fritas', price: 25.00, qty: 1 }] },
  { id: 5, name: 'Mesa 5', status: 'available', order: [] },
];

export default function TablesView() {
  // No código real, você usaria o useApp para obter o estado das mesas e as funções de manipulação
  // Ex: const { tables, updateTableStatus, addProductToOrder } = useApp();
  
  const [tables, setTables] = useState(dummyTables);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isAddingProducts, setIsAddingProducts] = useState(false);

  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  const handleBackToTables = () => {
    setSelectedTable(null);
    setIsAddingProducts(false);
  };

  const handleOpenAddProducts = () => {
    setIsAddingProducts(true);
  };

  const handleAddProductToOrder = (productData) => {
    if (!selectedTable) return;

    setTables(prevTables => {
      return prevTables.map(table => {
        if (table.id === selectedTable.id) {
          const existingItem = table.order.find(item => item.id === productData.id);
          let newOrder;

          if (existingItem) {
            newOrder = table.order.map(item =>
              item.id === productData.id ? { ...item, qty: item.qty + 1 } : item
            );
          } else {
            newOrder = [...table.order, { ...productData, qty: 1 }];
          }

          // Simula a mudança de status para 'occupied' se a mesa estiver 'available'
          const newStatus = table.status === 'available' ? 'occupied' : table.status;

          return { ...table, status: newStatus, order: newOrder };
        }
        return table;
      });
    });

    // Atualiza o estado da mesa selecionada para refletir a mudança imediatamente
    setSelectedTable(prevTable => {
        const updatedTable = tables.find(t => t.id === prevTable.id);
        return updatedTable;
    });
    
    // Após adicionar o produto, volta para a visualização da comanda
    setIsAddingProducts(false);
  };

  const TableCard = ({ table }) => {
    const isOccupied = table.status === 'occupied';
    const statusColor = isOccupied ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50';
    const statusText = isOccupied ? 'Ocupada' : 'Disponível';
    const totalOrder = table.order.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${statusColor}`}
        onClick={() => handleSelectTable(table)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-medium">{table.name}</CardTitle>
          {isOccupied ? (
            <Utensils className="h-6 w-6 text-red-500" />
          ) : (
            <CheckCircle className="h-6 w-6 text-green-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isOccupied ? `R$ ${totalOrder.toFixed(2)}` : 'Livre'}</div>
          <p className={`text-xs ${isOccupied ? 'text-red-600' : 'text-green-600'}`}>
            {statusText}
          </p>
          {isOccupied && (
            <p className="text-xs text-muted-foreground mt-1">
              {table.order.length} {table.order.length === 1 ? 'item' : 'itens'} na comanda
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  const OrderView = ({ table }) => {
    const total = table.order.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold">Comanda da {table.name}</h3>
          <Button onClick={handleOpenAddProducts}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Produtos
          </Button>
        </div>

        {/* Lista de Itens da Comanda */}
        <div className="space-y-3">
          {table.order.length === 0 ? (
            <p className="text-muted-foreground">Nenhum item na comanda. Adicione produtos!</p>
          ) : (
            table.order.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg bg-white">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">R$ {item.price.toFixed(2)} x {item.qty}</p>
                </div>
                <p className="font-bold">R$ {(item.price * item.qty).toFixed(2)}</p>
              </div>
            ))
          )}
        </div>

        {/* Total da Comanda */}
        <div className="border-t pt-4 flex justify-between items-center text-xl font-bold">
          <span>Total:</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>

        {/* Ações da Mesa */}
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

  // Renderização principal
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
            // 3. Exibir o componente de seleção de produtos
            <ProductsSelectionView 
                onProductSelect={handleAddProductToOrder}
                onCancel={handleBackToTables} // Pode ser alterado para voltar para OrderView
            />
        ) : (
            // 2. Exibir a comanda da mesa selecionada
            <OrderView table={selectedTable} />
        )}
      </div>
    );
  }

  // 1. Visualização de Mesas
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Mesas e Comandas</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Mesa
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map(table => (
          <TableCard key={table.id} table={table} />
        ))}
      </div>
    </div>
  );
}
