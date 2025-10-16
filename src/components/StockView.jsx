import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus, Minus, TrendingUp, TrendingDown, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';

export default function StockView() {
  const { products, updateStock } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentType, setAdjustmentType] = useState('in'); // 'in' ou 'out'
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('');
  const [adjustmentNote, setAdjustmentNote] = useState('');

  const categories = ['Todos', ...new Set(products.map(p => p.category))];

  const handleAdjustment = () => {
    if (selectedProduct && adjustmentQuantity) {
      const quantity = parseInt(adjustmentQuantity);
      const finalQuantity = adjustmentType === 'in' ? quantity : -quantity;
      
      updateStock(selectedProduct.id, finalQuantity);
      
      // Limpar formulário
      setSelectedProduct(null);
      setAdjustmentQuantity('');
      setAdjustmentNote('');
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Estatísticas
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Controle de Estoque</h2>
        <p className="text-muted-foreground">Gerencie entradas e saídas de produtos</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-primary" />
            <span className="text-3xl font-bold">{totalProducts}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total de Produtos</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-500" />
            <span className="text-3xl font-bold text-green-500">R$ {totalStockValue.toFixed(2)}</span>
          </div>
          <p className="text-sm text-muted-foreground">Valor em Estoque</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <span className="text-3xl font-bold text-yellow-500">{lowStockProducts}</span>
          </div>
          <p className="text-sm text-muted-foreground">Estoque Baixo (&lt;10)</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-8 h-8 text-destructive" />
            <span className="text-3xl font-bold text-destructive">{outOfStockProducts}</span>
          </div>
          <p className="text-sm text-muted-foreground">Sem Estoque</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="search">Buscar Produto</Label>
          <Input
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o nome ou categoria"
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="category">Categoria</Label>
          <select
            id="category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full mt-2 px-3 py-2 bg-input border border-border rounded-md text-foreground"
          >
            <option value="all">Todos</option>
            {categories.filter(c => c !== 'Todos').map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de produtos */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-lg font-semibold mb-3">Produtos</h3>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <p className="text-muted-foreground">Nenhum produto encontrado</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`bg-card border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedProduct?.id === product.id
                      ? 'border-primary shadow-lg'
                      : 'border-border hover:border-primary/50'
                  } ${product.stock === 0 ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-lg">{product.name}</h4>
                        <span className="category-badge">{product.category}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                      <p className="text-sm text-primary font-semibold mt-2">
                        R$ {product.price.toFixed(2)} / unidade
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${
                        product.stock === 0 ? 'text-destructive' :
                        product.stock < 10 ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {product.stock}
                      </div>
                      <p className="text-xs text-muted-foreground">em estoque</p>
                      {product.stock < 10 && product.stock > 0 && (
                        <p className="text-xs text-yellow-500 mt-1">⚠️ Estoque baixo</p>
                      )}
                      {product.stock === 0 && (
                        <p className="text-xs text-destructive mt-1">❌ Sem estoque</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Painel de ajuste */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Ajustar Estoque</h3>
            
            {selectedProduct ? (
              <div className="space-y-4">
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <p className="font-bold text-lg mb-1">{selectedProduct.name}</p>
                  <p className="text-sm text-muted-foreground mb-2">{selectedProduct.category}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">{selectedProduct.stock}</span>
                    <span className="text-sm text-muted-foreground">unidades</span>
                  </div>
                </div>

                <div>
                  <Label>Tipo de Movimentação</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      variant={adjustmentType === 'in' ? 'default' : 'outline'}
                      onClick={() => setAdjustmentType('in')}
                      className="gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Entrada
                    </Button>
                    <Button
                      variant={adjustmentType === 'out' ? 'default' : 'outline'}
                      onClick={() => setAdjustmentType('out')}
                      className="gap-2"
                    >
                      <Minus className="w-4 h-4" />
                      Saída
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                   id="quantity"
  type="number"
  min="1"
  value={adjustmentQuantity}
  onChange={(e) => setAdjustmentQuantity(e.target.value)}
  placeholder="Qtd"
  className="mt-2 w-14 h-8 px-2 text-sm rounded-md border border-gray-600 bg-gray-900 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="note">Observação (opcional)</Label>
                  <Input
                    id="note"
                    value={adjustmentNote}
                    onChange={(e) => setAdjustmentNote(e.target.value)}
                    placeholder="Ex: Compra, perda, etc."
                    className="mt-2"
                  />
                </div>

                {adjustmentQuantity && (
                  <div className="bg-muted/30 rounded-lg p-3 text-sm">
                    <p className="text-muted-foreground mb-1">Novo estoque:</p>
                    <p className="text-2xl font-bold text-primary">
                      {adjustmentType === 'in'
                        ? selectedProduct.stock + parseInt(adjustmentQuantity)
                        : selectedProduct.stock - parseInt(adjustmentQuantity)
                      } unidades
                    </p>
                  </div>
                )}

                <Button
                  onClick={handleAdjustment}
                  disabled={!adjustmentQuantity}
                  className="w-full"
                >
                  {adjustmentType === 'in' ? 'Adicionar ao Estoque' : 'Remover do Estoque'}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedProduct(null);
                    setAdjustmentQuantity('');
                    setAdjustmentNote('');
                  }}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Selecione um produto para ajustar o estoque
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

