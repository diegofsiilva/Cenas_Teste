import React, { useState, useMemo } from "react";

/*
ProductsCenterMenu.jsx
- Menu central tipo "hamburguer" (modal) com categorias
- Quantidade: input number editável + apenas botões externos (+ / -)
- Adicionar produto ao pedido
- Permite fechar comanda vazia
- Botões de pagamento: Pix, Cartão, Dinheiro (placeholders para integração)
- Faz validações simples e dá feedback via console (substitua por toasts se quiser)
*/

const sampleProducts = [
  { id: "p1", name: "Coca-Cola 350ml", price: 5.5, category: "Bebidas" },
  { id: "p2", name: "Suco Laranja", price: 6.0, category: "Bebidas" },
  { id: "p3", name: "X-Burger", price: 18.0, category: "Lanches" },
  { id: "p4", name: "X-Burger Duplo", price: 24.0, category: "Lanches" },
  { id: "p5", name: "Pudim", price: 8.0, category: "Sobremesas" },
  { id: "p6", name: "Sorvete", price: 10.0, category: "Sobremesas" },
];

export default function ProductsCenterMenu({
  products = sampleProducts,
  initialOrder = [],
  onExportOrder = null, // função opcional para enviar pedido pro backend
}) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [order, setOrder] = useState(initialOrder);
  const [quantityMap, setQuantityMap] = useState({}); // {productId: qty}

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return cats;
  }, [products]);

  // garante categoria ativa
  React.useEffect(() => {
    if (!activeCategory && categories.length) setActiveCategory(categories[0]);
  }, [categories, activeCategory]);

  // helpers quantidade
  const setQty = (productId, value) => {
    const n = Number(value);
    if (Number.isNaN(n) || n < 0) return;
    setQuantityMap((s) => ({ ...s, [productId]: n }));
  };

  const incQty = (productId) => {
    setQuantityMap((s) => {
      const cur = Number(s[productId] ?? 0);
      return { ...s, [productId]: cur + 1 };
    });
  };

  const decQty = (productId) => {
    setQuantityMap((s) => {
      const cur = Number(s[productId] ?? 0);
      const next = cur - 1;
      return { ...s, [productId]: next >= 0 ? next : 0 };
    });
  };

  const addProductToOrder = (product) => {
    const qty = Number(quantityMap[product.id] ?? 1);
    if (qty <= 0) {
      console.warn("Quantidade deve ser maior que zero");
      return;
    }

    setOrder((prev) => {
      // se já existe no pedido, soma quantidade
      const found = prev.find((i) => i.id === product.id);
      if (found) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...product, qty }];
    });

    // reset quantidade para 1 após adicionar (opcional)
    setQuantityMap((s) => ({ ...s, [product.id]: 1 }));
    console.log(`${qty}x ${product.name} adicionado(s)`);
  };

  const removeItem = (productId) => {
    setOrder((prev) => prev.filter((i) => i.id !== productId));
  };

  const clearOrder = () => {
    setOrder([]);
    console.log("Comanda limpa");
  };

  const closeOrder = (paymentMethod = null) => {
    // permite fechar mesmo vazio
    if (order.length === 0) {
      console.log("Fechando comanda vazia");
    } else {
      console.log("Fechando comanda com itens:", order);
    }
    console.log("Método de pagamento:", paymentMethod);
    // chamada para backend, se necessário:
    if (onExportOrder) {
      try {
        onExportOrder({ order, paymentMethod });
      } catch (e) {
        console.error("Erro ao exportar pedido", e);
      }
    }
    // fechar modal e resetar pedido se quiser
    setOpen(false);
  };

  // UI
  return (
    <>
      {/* Botão hamburguer que abre o menu central */}
      <button
        aria-label="Abrir menu de produtos"
        onClick={() => setOpen(true)}
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          border: "1px solid #ddd",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        {/* Icone simples */}
        <div style={{ width: 22 }}>
          <div style={{ height: 3, background: "#333", margin: "4px 0" }} />
          <div style={{ height: 3, background: "#333", margin: "4px 0" }} />
          <div style={{ height: 3, background: "#333", margin: "4px 0" }} />
        </div>
      </button>

      {/* Modal central */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            padding: 20,
          }}
          onMouseDown={(e) => {
            // fecha clicando fora do modal
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: 1100,
              maxHeight: "90vh",
              overflow: "auto",
              background: "#fff",
              borderRadius: 12,
              padding: 20,
              boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <h2 style={{ margin: 0 }}>Produtos</h2>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button
                  onClick={() => {
                    // permite fechar comanda vazia
                    closeOrder(null);
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid #ddd",
                    background: "#f5f5f5",
                    cursor: "pointer",
                  }}
                >
                  Fechar comanda (sem pagamento)
                </button>

                <button
                  onClick={() => {
                    setOpen(false);
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "none",
                    background: "#e74c3c",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>

            {/* Categorias (abas) */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: activeCategory === cat ? "2px solid #2563eb" : "1px solid #ddd",
                    background: activeCategory === cat ? "#eef2ff" : "#fff",—
