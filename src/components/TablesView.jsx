import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Users, Clock, DollarSign, X, Plus, Minus, Trash2, CreditCard, Smartphone, Banknote } from 'lucide-react';
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');

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
    setShowConfirmModal(true);
  };

  const confirmCloseOrder = () => {
    if (selectedTable && selectedTable.orderId) {
      closeOrder(selectedTable.orderId, paymentMethod);
      setSelectedTable(null);
      setShowOrderModal(false);
      setShowConfirmModal(false);
      setPaymentMethod('dinheiro');
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

      {/* Modal de Comanda */}
      {showOrderModal && selectedTable && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">{selectedTable.name}</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowOrderModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {selectedTable.status === 'available' ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Nome do Cliente (opcional)</Label>
                  <Input
                    id="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Digite o nome do cliente"
                    className="mt-2"
                  />
                </div>
                <Button onClick={handleOpenOrder} className="w-full">
                  Abrir Comanda
                </Button>
              </div>
            ) : currentOrder ? (
              <div className="space-y-6">
                {/* Informações da comanda */}
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  {currentOrder.customerName && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-semibold">{currentOrder.customerName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Aberta em: {new Date(currentOrder.createdAt).toLocaleString('pt-BR')}</span>
                  </div>
                </div>

                {/* Itens da comanda */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-lg">Itens</h4>
                    <Button size="sm" onClick={() => setShowProductModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Produto
                    </Button>
                  </div>

                  {currentOrder.items.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Nenhum item adicionado</p>
                  ) : (
                    <div className="space-y-2">
                      {currentOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-card border border-border rounded-lg p-3">
                          <div className="flex-1">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity}x R$ {item.price.toFixed(2)} = R$ {item.subtotal.toFixed(2)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItemFromOrder(currentOrder.id, index)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Desconto */}
                <div className="space-y-2">
                  <Label htmlFor="discount">Aplicar Desconto (R$)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="discount"
                      type="number"
                      step="0.01"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder="0.00"
                    />
                    <Button onClick={handleApplyDiscount}>Aplicar</Button>
                  </div>
                  {currentOrder.discount > 0 && (
                    <p className="text-sm text-green-500">Desconto aplicado: R$ {currentOrder.discount.toFixed(2)}</p>
                  )}
                </div>

                {/* Total */}
                <div className="bg-primary/10 border-2 border-primary rounded-lg p-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-semibold">Subtotal:</span>
                    <span>R$ {currentOrder.total.toFixed(2)}</span>
                  </div>
                  {currentOrder.discount > 0 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Desconto:</span>
                      <span>- R$ {currentOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-2xl font-bold mt-2 pt-2 border-t border-primary/30">
                    <span>Total:</span>
                    <span className="text-primary">R$ {(currentOrder.total - currentOrder.discount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Botão de fechar */}
                              <Button
                  onClick={handleCloseOrder}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Fechar Comanda
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Modal de Adicionar Produto */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Adicionar Produto</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowProductModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
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

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`product-card ${selectedProduct?.id === product.id ? 'border-primary shadow-lg' : ''}`}
                  >
                    {product.image && (
                      <img src={product.image} alt={product.name} />
                    )}
                    <h4 className="font-semibold text-sm">{product.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                    <p className="text-primary font-bold">R$ {product.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Estoque: {product.stock}</p>
                  </div>
                ))}
              </div>

              {selectedProduct && (
                <div className="space-y-4 pt-4 border-t border-border">
                  <div>
                    <Label htmlFor="quantity">Quantidade</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customPrice">Preço Customizado (opcional)</Label>
                    <Input
                      id="customPrice"
                      type="number"
                      step="0.01"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      placeholder={`Preço padrão: R$ ${selectedProduct.price.toFixed(2)}`}
                      className="mt-2"
                    />
                  </div>

                  <Button onClick={handleAddProduct} className="w-full">
                    Adicionar à Comanda
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
       )}

      {/* Modal de Confirmação de Fechamento */}
      {showConfirmModal && currentOrder && (
        <div className="modal-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-content p-6 max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Confirmar Fechamento</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowConfirmModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Resumo da comanda */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Mesa:</span>
                  <span>{selectedTable?.name}</span>
                </div>
                {currentOrder.customerName && (
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Cliente:</span>
                    <span>{currentOrder.customerName}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Itens:</span>
                  <span>{currentOrder.items.length}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-bold text-primary pt-2 border-t border-border">
                  <span>Total:</span>
                  <span>R$ {(currentOrder.total - currentOrder.discount).toFixed(2)}</span>
                </div>
              </div>

              {/* Seleção de forma de pagamento */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Forma de Pagamento</Label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setPaymentMethod('dinheiro')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'dinheiro'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Banknote className="w-6 h-6" />
                    <span className="text-sm font-semibold">Dinheiro</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('cartao')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'cartao'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <CreditCard className="w-6 h-6" />
                    <span className="text-sm font-semibold">Cartão</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Smartphone className="w-6 h-6" />
                    <span className="text-sm font-semibold">Pix</span>
                  </button>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmCloseOrder}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Confirmar Fechamento
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
  );
}

