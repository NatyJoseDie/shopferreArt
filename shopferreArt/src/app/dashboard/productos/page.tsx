'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  DollarSign,
  Camera,
  Filter
} from 'lucide-react';

// Datos de demostración
const demoProducts = [
  {
    id: '1',
    name: 'Plancha de Pelo Oryx',
    description: 'Plancha de pelo profesional con tecnología cerámica',
    cost_price: 15000,
    stock: 2,
    category: 'BEAUTY',
    image_url: null,
    created_at: '2024-01-15'
  },
  {
    id: '2',
    name: 'Freidora de Aire 3.5L',
    description: 'Freidora de aire compacta para cocina moderna',
    cost_price: 45000,
    stock: 1,
    category: 'HOME',
    image_url: null,
    created_at: '2024-01-10'
  },
  {
    id: '3',
    name: 'Auricular M25',
    description: 'Auriculares inalámbricos con cancelación de ruido',
    cost_price: 8000,
    stock: 3,
    category: 'TECNO',
    image_url: null,
    created_at: '2024-01-20'
  },
  {
    id: '4',
    name: 'Cafetera Express',
    description: 'Cafetera automática con molinillo integrado',
    cost_price: 75000,
    stock: 8,
    category: 'HOME',
    image_url: null,
    created_at: '2024-01-05'
  },
  {
    id: '5',
    name: 'Smartwatch Pro',
    description: 'Reloj inteligente con GPS y monitor cardíaco',
    cost_price: 25000,
    stock: 12,
    category: 'TECNO',
    image_url: null,
    created_at: '2024-01-25'
  }
];

const categories = ['BEAUTY', 'HOME', 'TECNO', 'DEPORTES', 'ROPA'];

export default function ProductsPage() {
  const [products, setProducts] = useState(demoProducts);
  const [filteredProducts, setFilteredProducts] = useState(demoProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    cost_price: '',
    stock: '',
    category: ''
  });

  // Filtrar productos
  useEffect(() => {
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.cost_price || !newProduct.category) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const product = {
      id: Date.now().toString(),
      ...newProduct,
      cost_price: parseFloat(newProduct.cost_price),
      stock: parseInt(newProduct.stock) || 0,
      image_url: null,
      created_at: new Date().toISOString().split('T')[0]
    };

    setProducts([...products, product]);
    setNewProduct({ name: '', description: '', cost_price: '', stock: '', category: '' });
    setIsAddDialogOpen(false);
  };

  const handleDeleteProduct = (id) => {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <Badge variant="destructive">SIN STOCK</Badge>;
    } else if (stock <= 5) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">BAJO STOCK</Badge>;
    } else {
      return <Badge variant="default" className="bg-green-100 text-green-800">EN STOCK</Badge>;
    }
  };

  const lowStockCount = products.filter(p => p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.cost_price * p.stock), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600 mt-2">Administra tu inventario y controla el stock de productos.</p>
        </div>

        {/* Métricas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Productos</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{products.length}</div>
              <p className="text-xs text-blue-700">En tu inventario</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">
                ${totalValue.toLocaleString('es-AR')}
              </div>
              <p className="text-xs text-green-700">Valor del inventario</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800">Stock Bajo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{lowStockCount}</div>
              <p className="text-xs text-orange-700">Productos con ≤5 unidades</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Sin Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{outOfStockCount}</div>
              <p className="text-xs text-red-700">Productos agotados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Buscar productos</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Buscar por nombre o descripción..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <Label>Categoría</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Producto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                      <DialogDescription>
                        Completa la información del producto para agregarlo al inventario.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          placeholder="Nombre del producto"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                          id="description"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          placeholder="Descripción del producto"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="cost_price">Precio Costo *</Label>
                          <Input
                            id="cost_price"
                            type="number"
                            value={newProduct.cost_price}
                            onChange={(e) => setNewProduct({...newProduct, cost_price: e.target.value})}
                            placeholder="0"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="stock">Stock Inicial</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label>Categoría *</Label>
                        <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button onClick={handleAddProduct} className="flex-1">
                          Agregar Producto
                        </Button>
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Productos */}
        <Card>
          <CardHeader>
            <CardTitle>
              Productos ({filteredProducts.length})
            </CardTitle>
            <CardDescription>
              Lista completa de productos en tu inventario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Camera className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-gray-500">Categoría: {product.category}</span>
                        <span className="text-sm font-medium text-green-600">
                          ${product.cost_price.toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Stock</div>
                      <div className="font-semibold">{product.stock}</div>
                    </div>
                    
                    {getStockBadge(product.stock)}
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
                  <p className="text-gray-600">Intenta ajustar los filtros o agregar nuevos productos.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

