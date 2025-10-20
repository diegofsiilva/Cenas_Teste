import { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext'; // Assumindo que useApp fornece 'products'
import { Plus, Image as ImageIcon, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';

// Componente ProductsSelectionView: Exibe categorias e produtos para seleção e adição à comanda
export default function ProductsSelectionView({ onProductSelect, onCancel }) {
  // Assumindo que useApp fornece a lista de produtos (products)
  // No código original, o componente era ProductsView e usava:
  // const { products, addProduct, updateProduct, deleteProduct } = useApp();
  // Aqui, vamos apenas usar a lista de produtos para seleção.
  const { products } = useApp(); 
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Lógica de categorias (extraída do TablesView original)
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    return uniqueCategories.filter(Boolean).sort();
  }, [products]);

  // Lógica de filtro de produtos (extraída do TablesView original)
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Função para lidar com a seleção de um produto
  const handleSelectProduct = (product) => {
    // Chama a função passada pelo pai (TablesView) para adicionar o produto à comanda
    // Passamos apenas os dados essenciais para a comanda
    onProductSelect({
        id: product.id,
        name: product.name,
        price: product.price,
        // A quantidade será tratada no componente pai (TablesView)
    });
  };

  // Renderização condicional: Categorias ou Produtos
  if (!selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Selecione uma Categoria</h2>
          <Button variant="outline" onClick={onCancel}>
            Voltar para Comanda
          </Button>
        </div>

        {/* Lista de Categorias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.length > 0 ? (
            categories.map(category => (
              <div
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="category-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-center text-center"
              >
                <ImageIcon className="w-10 h-10 text-primary mb-3" />
                <h3 className="font-bold text-lg">{category}</h3>
                <p className="text-sm text-muted-foreground">({products.filter(p => p.category === category).length} produtos)</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <p className="text-muted-foreground text-lg">Nenhuma categoria encontrada.</p>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    // Visualização de produtos dentro da categoria selecionada
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setSelectedCategory(null)} className="mr-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-2xl font-bold">Produtos em: {selectedCategory}</h2>
          </div>
          <Button variant="outline" onClick={onCancel}>
            Voltar para Comanda
          </Button>
        </div>

        {/* Filtro de busca dentro da categoria */}
        <div className="mb-4 flex items-center space-x-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Buscar produto em ${selectedCategory}...`}
              className="flex-1"
            />
        </div>

        {/* Lista de produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="product-card p-4 border rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleSelectProduct(product)} // Ação de seleção principal
              >
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-md mb-2" />
                ) : (
                  <div className="w-full h-32 bg-muted rounded-md mb-2 flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                
                <div className="space-y-1">
                  <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
                  <span className="category-badge text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{product.category}</span>
                  <p className="text-xl font-bold text-primary pt-1">R$ {product.price.toFixed(2)}</p>
                </div>
                <Button size="sm" className="w-full mt-3">
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <p className="text-muted-foreground text-lg">Nenhum produto encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
