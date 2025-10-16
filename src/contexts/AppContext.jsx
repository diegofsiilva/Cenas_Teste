import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Estado das mesas
  const [tables, setTables] = useLocalStorage('tables', [
    { id: 1, name: 'Mesa 1', type: 'table', position: 'left', status: 'available', orderId: null },
    { id: 2, name: 'Mesa 2', type: 'table', position: 'left', status: 'available', orderId: null },
    { id: 3, name: 'Mesa 3', type: 'table', position: 'left', status: 'available', orderId: null },
    { id: 4, name: 'Mesa 4', type: 'table', position: 'left', status: 'available', orderId: null },
    { id: 5, name: 'Mesa 5', type: 'table', position: 'left', status: 'available', orderId: null },
    { id: 6, name: 'Mesa 6', type: 'table', position: 'top-right', status: 'available', orderId: null },
    { id: 7, name: 'Mesa 7', type: 'table', position: 'top-right', status: 'available', orderId: null },
    { id: 8, name: 'Mesa Sinuca', type: 'billiard', position: 'bottom', status: 'available', orderId: null },
    { id: 9, name: 'Bistrô 1', type: 'bistro', position: 'bottom', status: 'available', orderId: null },
    { id: 10, name: 'Bistrô 2', type: 'bistro', position: 'bottom', status: 'available', orderId: null },
  ]);

  // Estado dos produtos
  const [products, setProducts] = useLocalStorage('products', [
    {
      id: 1,
      name: 'Cerveja Heineken',
      category: 'Bebidas',
      price: 12.00,
      description: 'Cerveja long neck 330ml',
      image: '',
      stock: 50
    },
    {
      id: 2,
      name: 'Narguilé Premium',
      category: 'Narguilé',
      price: 45.00,
      description: 'Narguilé completo com essência',
      image: '',
      stock: 10
    },
    {
      id: 3,
      name: 'Hora Sinuca',
      category: 'Sinuca',
      price: 15.00,
      description: 'Uma hora de sinuca',
      image: '',
      stock: 999
    },
  ]);

  // Estado das comandas/pedidos
  const [orders, setOrders] = useLocalStorage('orders', []);

  // Estado do histórico de vendas
  const [salesHistory, setSalesHistory] = useLocalStorage('salesHistory', []);

  // Estado das configurações visuais
  const [visualSettings, setVisualSettings] = useLocalStorage('visualSettings', {
    primaryColor: 'oklch(0.55 0.18 250)',
    secondaryColor: 'oklch(0.25 0.04 250)',
    logo: '',
    backgroundImage: ''
  });

  // Funções auxiliares para mesas
  const updateTableStatus = (tableId, status, orderId = null) => {
    setTables(tables.map(table => 
      table.id === tableId ? { ...table, status, orderId } : table
    ));
  };

  // Funções auxiliares para produtos
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
    };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (productId, updatedData) => {
    setProducts(products.map(product =>
      product.id === productId ? { ...product, ...updatedData } : product
    ));
  };

  const deleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  const updateStock = (productId, quantity) => {
    setProducts(products.map(product =>
      product.id === productId 
        ? { ...product, stock: product.stock + quantity }
        : product
    ));
  };

  // Funções auxiliares para pedidos
  const createOrder = (tableId, customerName = '') => {
    const newOrder = {
      id: Date.now(),
      tableId,
      customerName,
      items: [],
      total: 0,
      discount: 0,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setOrders([...orders, newOrder]);
    updateTableStatus(tableId, 'occupied', newOrder.id);
    return newOrder;
  };

  const addItemToOrder = (orderId, product, quantity = 1, customPrice = null) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const price = customPrice !== null ? customPrice : product.price;
        const existingItemIndex = order.items.findIndex(item => item.productId === product.id && item.price === price);
        
        let newItems;
        if (existingItemIndex >= 0) {
          newItems = order.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...order.items, {
            productId: product.id,
            name: product.name,
            price,
            quantity,
            subtotal: price * quantity
          }];
        }

        const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
        
        return { ...order, items: newItems, total };
      }
      return order;
    }));

    // Atualizar estoque
    updateStock(product.id, -quantity);
  };

  const removeItemFromOrder = (orderId, itemIndex) => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        const removedItem = order.items[itemIndex];
        const newItems = order.items.filter((_, index) => index !== itemIndex);
        const total = newItems.reduce((sum, item) => sum + item.subtotal, 0);
        
        // Devolver ao estoque
        const product = products.find(p => p.id === removedItem.productId);
        if (product) {
          updateStock(product.id, removedItem.quantity);
        }
        
        return { ...order, items: newItems, total };
      }
      return order;
    }));
  };

  const applyDiscount = (orderId, discount) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, discount } : order
    ));
  };

  const closeOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Adicionar ao histórico
      const closedOrder = {
        ...order,
        status: 'closed',
        closedAt: new Date().toISOString(),
        finalTotal: order.total - order.discount
      };
      setSalesHistory([...salesHistory, closedOrder]);
      
      // Remover da lista de pedidos ativos
      setOrders(orders.filter(o => o.id !== orderId));
      
      // Liberar mesa
      updateTableStatus(order.tableId, 'available', null);
    }
  };

  const value = {
    tables,
    setTables,
    updateTableStatus,
    products,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    orders,
    setOrders,
    createOrder,
    addItemToOrder,
    removeItemFromOrder,
    applyDiscount,
    closeOrder,
    salesHistory,
    setSalesHistory,
    visualSettings,
    setVisualSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

