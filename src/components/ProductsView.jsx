import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';

export default function ProductsView() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    stock: ''
  });

  const categories = ['Todos', ...new Set(products.map(p => p.category))];

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        description: product.description,
        image: product.image,
        stock: product.stock.toString()
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: '',
        price: '',
        description: '',
        image: '',
        stock: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      price: '',
      description: '',
      image: '',
      stock: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      category: formData.category,
      price: parseFloat(formData.price),
      description: formData.description,
      image: formData.image,
      stock: parseInt(formData.stock)
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    handleCloseModal();
  };

  const handleDelete = (productId) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      deleteProduct(productId);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Gestão de Produtos</h2>
          <p className="text-muted-foreground">Cadastre e gerencie os produtos do bar</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label htmlFor="search">Buscar</Label>
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

      {/* Lista de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="w-full h-32 bg-muted rounded-md mb-2 flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            
            <div className="space-y-2">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <span className="category-badge">{product.category}</span>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-2xl font-bold text-primary">R$ {product.price.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Estoque: {product.stock}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenModal(product)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Nenhum produto encontrado</p>
        </div>
      )}

      {/* Modal de Cadastro/Edição */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content p-6 max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="mt-2"
                    placeholder="Ex: Bebidas, Narguilé, Sinuca"
                  />
                </div>

                <div>
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Estoque Inicial *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2"
                  rows={3}
                  placeholder="Descreva o produto..."
                />
              </div>

              <div>
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-2"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-md border border-border"
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

