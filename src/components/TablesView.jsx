import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { Users, Clock, DollarSign, X, Plus, Minus, Trash2, CreditCard, QrCode, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from 'react-hot-toast'; // Para feedback visual

export default function TablesView() {
  const { tables, orders, createOrder, closeOrder, addItemToOrder, removeItemFromOrder, applyDiscount, products } = useApp();
  const [selectedTable, setSelectedTable] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [customPrice, setCustomPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [discountValue, setDiscountValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  // Agrupar produtos por categoria para exibição
  const groupedProducts = useMemo(() => {
    const groups = {};
    products.forEach(product => {
      if (!groups[product.category]) {
        groups[product.category] = [];
      }
      groups[product.category].push(product);
    });
    return groups;
  }, [products]);

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setShowOrderModal(true);
  };

  const handleOpenOrder = () => {
    if (selectedTable) {
      createOrder(selectedTable.id, customerName);
      setCustomerName('');
      setShowOrderModal(false);
    }
  };
  

  const handleAddProduct = () => {
    if (!selectedProduct) {
      toast.error('Selecione um produto para adicionar!');
      return;
    }
    if (quantity <= 0) {
      toast.error('A quantidade deve ser maior que zero!');
      return;
    }

    const order = orders.find(o => o.id === selectedTable.orderId);
    if (order) {
      const price = customPrice !== '' ? parseFloat(customPrice) : selectedProduct.price;
      addItemToOrder(order.id, selectedProduct, quantity, price);
      toast.success(`${quantity}x ${selectedProduct.name} adicionado(s) à comanda!`);
      setShowProductModal(false);
      setSelectedProduct(null);
      setCustomPrice('');
      setQuantity(1);
      setSearchTerm('');
    }
  };

  const handleCloseOrderClick = () => {
    setShowPaymentModal(true);
  };

  const processPayment = () => {
    if (!paymentMethod) {
      toast.error('Selecione um método de pagamento!');
      return;
    }

    if (selectedTable) {
      if (selectedTable.orderId) {
        // Comanda existente
        console.log(`Processando pagamento da comanda ${selectedTable.orderId} com ${paymentMethod}. Total: R$ ${calculateTotal().toFixed(2)}`);
        closeOrder(selectedTable.orderId, paymentMethod);
        toast.success(`Comanda ${selectedTable.orderId} fechada com ${paymentMethod}!`);
      } else {
        // Mesa disponível ou sem comanda, apenas liberar
        console.log(`Liberando mesa ${selectedTable.id} com ${paymentMethod}.`);
        closeOrder(selectedTable.id, paymentMethod); // Assumindo que closeOrder pode liberar a mesa mesmo sem orderId
        toast.success(`Mesa ${selectedTable.id} liberada!`);
      }
      setSelectedTable(null);
      setShowOrderModal(false);
      setShowPaymentModal(false);
      setPaymentMethod('');
    }
  };

  const handleApplyDiscount = () => {
    if (selectedTable && selectedTable.orderId && discountValue) {
      applyDiscount(selectedTable.orderId, parseFloat(discountValue));
      setDiscountValue('');
      toast.success(`Desconto de R$ ${parseFloat(discountValue).toFixed(2)} aplicado!`);
    }
  };

  const calculateTotal = () => {
    if (!currentOrder) return 0;
    const totalItems = currentOrder.items.reduce((sum, item) => sum + item.subtotal, 0);
    return totalItems - (currentOrder.discount || 0);
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

  // Resetar quantidade ao selecionar um novo produto
  useEffect(() => {
    setQuantity(1);
    setCustomPrice('');
  }, [selectedProduct]);

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
                    <span className="text-primary">R$ {calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Botão de fechar comanda que abre o modal de pagamento */}
                <Button
                  onClick={handleCloseOrderClick}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <DollarSign className="w-5 h-5 mr-2" />
                  Fechar Comanda
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">Nenhuma comanda aberta para esta mesa. Você pode abrir uma nova comanda ou liberar a mesa.</p>
                <Button onClick={handleOpenOrder} className="w-full">
                  Abrir Nova Comanda
                </Button>
                <Button onClick={handleCloseOrderClick} variant="outline" className="w-full">
                  Liberar Mesa
                </Button>
              </div>
            )}
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

              <div className="max-h-96 overflow-y-auto pr-2">
                {Object.keys(groupedProducts).map(category => (
                  <div key={category} className="mb-4">
                    <h4 className="text-lg font-semibold mb-2 sticky top-0 bg-white z-10 py-1">{category}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {groupedProducts[category].filter(product =>
                        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        product.category.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map(product => (
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
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        id="quantity"
                        type="text"
                        min="1"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setQuantity(isNaN(val) ? '' : Math.max(1, val));
                        }}
                        className="text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(prev => prev + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customPrice">Desconto (opcional)</Label>
                    <Input
                      id="customPrice"
                      type="text"
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

      {/* Modal de Pagamento */}
{showPaymentModal && (
  <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
    <div className="modal-content p-6" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">Finalizar Pagamento</h3>
        <Button variant="ghost" size="icon" onClick={() => setShowPaymentModal(false)}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="space-y-4">
        {currentOrder && currentOrder.items.length > 0 && (
          <p className="text-lg">
            Total a pagar:{" "}
            <span className="font-bold">R$ {calculateTotal().toFixed(2)}</span>
          </p>
        )}

        <Label className="block mb-3 text-lg font-medium">
          Selecione o método de pagamento:
        </Label>

        {/* Aparência moderna, mas 100% funcional */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={() => setPaymentMethod("Dinheiro")}
            className={`flex flex-col items-center justify-center gap-2 p-4 h-auto transition-all ${
              paymentMethod === "Dinheiro"
                ? "border-primary ring-2 ring-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Banknote className="w-6 h-6" />
            <span className="text-sm font-semibold">Dinheiro</span>
          </Button>

          <Button
            var
