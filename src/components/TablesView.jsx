import { useState } from 'react';
import { useApp } from '../contexts/AppContext'; // Assumindo que AppContext lida com o estado global
import { Plus, X, Utensils, CheckCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';

// Importar o novo componente de seleção de produtos
import ProductsSelectionView from './ProductsSelectionView';

// Dados de exemplo atualizados para incluir todas as mesas do layout do usuário
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
        if (updatedTable) {
            // Recalcula o estado da mesa selecionada com os dados atualizados
            const existingItem = updatedTable.order.find(item => item.id === productData.id);
            let newOrder;
            if (existingItem) {
                newOrder = updatedTable.order.map(item =>
                    item.id === productData.id ? { ...item, qty: item.qty + 1 } : item
                );
            } else {
                newOrder = [...updatedTable.order, { ...productData, qty: 1 }];
            }
            const newStatus = updatedTable.status === 'available' ? 'occupied' : updatedTable.status;
            return { ...updatedTable, status: newStatus, order: newOrder };
        }
        return prevTable;
    });
    
    // Após adicionar o produto, volta para a visualização da comanda
    setIsAddingProducts(false);
  };

  const TableCard = ({ table }) => {
    const isOccupied = table.status === 'occupied';
    // Ajuste de cores para tema escuro e melhor visibilidade
    const statusColor = isOccupied ? 'border-red-600 bg-red-950 text-red-100' : 'border-green-600 bg-green-950 text-green-100';
    const statusText = isOccupied ? 'Ocupada' : 'Disponível';
    const totalOrder = table.order.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // Adiciona classes específicas para mesas redondas (Bistrôs)
    // Ajuste: Nos bistrôs, removemos o CardHeader e CardContent padrão para centralizar melhor o conteúdo.
    const isBistro = table.name.includes('Bistro');
    // Ajuste: Aumentando o tamanho dos bistrôs para melhor visualização
    const shapeClass = isBistro ? 'rounded-full h-40 w-40 flex flex-col items-center justify-center text-center p-2' : 'rounded-lg';
    
    // Adiciona o grid-area para posicionamento
    const gridAreaClass = `area-${table.name.toLowerCase().replace(/ /g, '-').replace('á', 'a')}`;

    return (
      <Card 
        className={`cursor-pointer transition-all hover:shadow-lg ${statusColor} ${shapeClass} ${gridAreaClass}`}
        onClick={() => handleSelectTable(table)}
      >
        {isBistro ? (
          // Layout simplificado e centralizado para Bistrôs
          <div className="flex flex-col items-center justify-center h-full">
            <CardTitle className="text-xl font-medium text-white">{table.name}</CardTitle>
            <div className="text-2xl font-bold mt-2">{isOccupied ? `R$ ${totalOrder.toFixed(2)}` : 'Livre'}</div>
            <p className={`text-sm font-semibold mt-1 ${isOccupied ? 'text-red-400' : 'text-green-400'}`}>
              {statusText}
            </p>
          </div>
        ) : (
          // Layout padrão para Mesas (retangulares)
          <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-medium text-white">{table.name}</CardTitle>
              {isOccupied ? (
                <Utensils className="h-6 w-6 text-red-400" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-400" />
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold">{isOccupied ? `R$ ${totalOrder.toFixed(2)}` : 'Livre'}</div>
              <p className={`text-sm font-semibold ${isOccupied ? 'text-red-400' : 'text-green-400'}`}>
                {statusText}
              </p>
              {isOccupied && (
                <p className="text-xs text-red-200 mt-1">
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
            // Exibir o componente de seleção de produtos
            <ProductsSelectionView 
                onProductSelect={handleAddProductToOrder}
                onCancel={() => setIsAddingProducts(false)} // Volta para a OrderView
            />
        ) : (
            // Exibir a comanda da mesa selecionada
            <OrderView table={selectedTable} />
        )}
      </div>
    );
  }

  // Visualização de Mesas com Layout Personalizado
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Mesas e Comandas</h2>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Mesa
        </Button>
      </div>

      {/* 
        Ajuste do Layout com CSS Grid e grid-template-areas para replicar o desenho.
        As classes de grid-area (ex: area-mesa-1) são adicionadas no componente TableCard.
        
        Você precisará garantir que essas classes CSS personalizadas sejam carregadas 
        no seu projeto (ex: no seu arquivo global de estilos ou via um plugin do Tailwind).
      */}
      <style jsx>{`
        .tables-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr) 100px; /* 6 colunas para mesas + 1 para bistrôs */
          grid-template-rows: repeat(3, 100px) 100px; /* 3 linhas para mesas + 1 para espaçamento */
          gap: 20px;
          grid-template-areas:
            "mesa-1 mesa-2 mesa-3 mesa-4 mesa-5 sinuca bistro-1"
            ". . . . . sinuca ."
            ". . . mesa-6 mesa-7 . bistro-2"
            ". . . . . . ."; /* Linha extra para espaçamento inferior */
        }

        .area-mesa-1 { grid-area: mesa-1; }
        .area-mesa-2 { grid-area: mesa-2; }
        .area-mesa-3 { grid-area: mesa-3; }
        .area-mesa-4 { grid-area: mesa-4; }
        .area-mesa-5 { grid-area: mesa-5; }
        .area-mesa-6 { grid-area: mesa-6; }
        .area-mesa-7 { grid-area: mesa-7; }
        .area-sinuca { grid-area: sinuca; }
        .area-bistro-1 { grid-area: bistro-1; }
        .area-bistro-2 { grid-area: bistro-2; }
      `}</style>

      <div className="tables-grid">
        {tables.map(table => (
          <TableCard key={table.id} table={table} />
        ))}
      </div>
    </div>
  );
}
