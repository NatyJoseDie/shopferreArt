'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  DollarSign, 
  Package, 
  User,
  CheckCircle,
  AlertCircle,
  Minus
} from 'lucide-react';

// Productos disponibles para venta
const availableProducts = [
  { id: '1', name: 'Plancha de Pelo Oryx', cost_price: 15000, stock: 2, category: 'BEAUTY' },
  { id: '2', name: 'Freidora de Aire 3.5L', cost_price: 45000, stock: 1, category: 'HOME' },
  { id: '3', name: 'Auricular M25', cost_price: 8000, stock: 3, category: 'TECNO' },
  { id: '4', name: 'Cafetera Express', cost_price: 75000, stock: 8, category: 'HOME' },
  { id: '5', name: 'Smartwatch Pro', cost_price: 25000, stock: 12, category: 'TECNO' }
];

// Clientes mayoristas
const wholesaleClients = [
  { id: '1', name: 'Distribuidora Norte', markup: 20 },
  { id: '2', name: 'Comercial Sur', markup: 25 },
  { id: '3', name: 'Mayorista Centro', markup: 15 }
];

export default function VentasPage() {
  const [saleItems, setSaleItems] = useState([]);
  const [saleType, setSaleType] = useState('consumidor_final');
  const [selectedClient, setSelectedClient] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const addSaleItem = (productId) => {
    const product = availableProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = saleItems.find(item => item.product_id === productId);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setSaleItems(saleItems.map(item =>
          item.product_id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setSaleItems([...saleItems, {
        id: Date.now(),
        product_id: productId,
        product_name: product.name,
        quantity: 1,
        cost_price: product.cost_price,
        sale_price: calculateSalePrice(product.cost_price),
        max_stock: product.stock
      }]);
    }
  };

  const removeSaleItem = (productId) => {
    setSaleItems(saleItems.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeSaleItem(productId);
      return;
    }

    const product = availableProducts.find(p => p.id === productId);
    if (newQuantity > product.stock) return;

    setSaleItems(saleItems.map(item =>
      item.product_id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const calculateSalePrice = (costPrice) => {
    if (saleType === 'consumidor_final') {
      return costPrice * 1.4; // 40% markup para consumidor final
    } else {
      const client = wholesaleClients.find(c => c.id === selectedClient);
      const markup = client ? client.markup : 20;
      return costPrice * (1 + markup / 100);
    }
  };

  const updateSalePrices = () => {
    setSaleItems(saleItems.map(item => ({
      ...item,
      sale_price: calculateSalePrice(item.cost_price)
    })));
  };

  // Actualizar precios cuando cambia el tipo de venta o cliente
  useState(() => {
    updateSalePrices();
  }, [saleType, selectedClient]);

  const calculateTotal = () => {
    return saleItems.reduce((total, item) => total + (item.sale_price * item.quantity), 0);
  };

  const calculateProfit = () => {
    return saleItems.reduce((profit, item) => 
      profit + ((item.sale_price - item.cost_price) * item.quantity), 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      if (saleItems.length === 0) {
        throw new Error('Agrega al menos un producto a la venta');
      }

      if (saleType === 'mayorista' && !selectedClient) {
        throw new Error('Selecciona un cliente mayorista');
      }

      // Verificar stock disponible
      for (const item of saleItems) {
        const product = availableProducts.find(p => p.id === item.product_id);
        if (item.quantity > product.stock) {
          throw new Error(`Stock insuficiente para ${item.product_name}. Disponible: ${product.stock}`);
        }
      }

      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Aquí iría la lógica para:
      // 1. Crear la venta en la tabla sales
      // 2. Crear los items en sale_items
      // 3. Actualizar el stock de productos
      // 4. Registrar la ganancia

      setSubmitMessage('¡Venta registrada exitosamente! El stock se ha actualizado automáticamente.');
      
      // Limpiar formulario
      setSaleItems([]);
      setSelectedClient('');

    } catch (error) {
      setSubmitMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = calculateTotal();
  const totalProfit = calculateProfit();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Registrar Venta</h1>
          <p className="text-gray-600 mt-2">Registra ventas a consumidores finales y actualiza automáticamente el stock.</p>
        </div>

        {/* Tipo de Venta */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Tipo de Venta
            </CardTitle>
            <CardDescription>
              Selecciona el tipo de cliente para calcular los precios correctos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Tipo de Cliente</Label>
                <Select value={saleType} onValueChange={setSaleType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consumidor_final">Consumidor Final (+40%)</SelectItem>
                    <SelectItem value="mayorista">Cliente Mayorista</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {saleType === 'mayorista' && (
                <div>
                  <Label>Cliente Mayorista</Label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {wholesaleClients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} (+{client.markup}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Productos Disponibles */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Productos Disponibles
            </CardTitle>
            <CardDescription>
              Haz clic en los productos para agregarlos a la venta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableProducts.map(product => {
                const salePrice = calculateSalePrice(product.cost_price);
                const isInCart = saleItems.some(item => item.product_id === product.id);
                const cartItem = saleItems.find(item => item.product_id === product.id);
                
                return (
                  <div key={product.id} className={`p-4 border rounded-lg transition-colors ${
                    product.stock === 0 ? 'bg-gray-100 opacity-50' : 
                    isInCart ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <Badge variant={product.stock > 5 ? 'default' : product.stock > 0 ? 'secondary' : 'destructive'}>
                        Stock: {product.stock}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">Categoría: {product.category}</div>
                      <div className="text-lg font-bold text-green-600">
                        ${salePrice.toLocaleString('es-AR')}
                      </div>
                      <div className="text-xs text-gray-500">
                        Costo: ${product.cost_price.toLocaleString('es-AR')}
                      </div>
                    </div>
                    
                    {product.stock > 0 ? (
                      <div className="mt-3">
                        {!isInCart ? (
                          <Button
                            onClick={() => addSaleItem(product.id)}
                            className="w-full"
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="flex-1 text-center font-medium">
                              {cartItem.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                              disabled={cartItem.quantity >= product.stock}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3">
                        <Button disabled className="w-full" size="sm">
                          Sin Stock
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Carrito de Venta */}
        {saleItems.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
                Carrito de Venta ({saleItems.length} productos)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {saleItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <div className="text-sm text-gray-600">
                        ${item.sale_price.toLocaleString('es-AR')} x {item.quantity}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          ${(item.sale_price * item.quantity).toLocaleString('es-AR')}
                        </div>
                        <div className="text-xs text-gray-500">
                          Ganancia: ${((item.sale_price - item.cost_price) * item.quantity).toLocaleString('es-AR')}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSaleItem(item.product_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resumen y Total */}
        {saleItems.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Resumen de la Venta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600">Total de Productos</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {saleItems.reduce((total, item) => total + item.quantity, 0)}
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600">Total de la Venta</div>
                  <div className="text-2xl font-bold text-green-900">
                    ${totalAmount.toLocaleString('es-AR')}
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-sm text-purple-600">Ganancia Total</div>
                  <div className="text-2xl font-bold text-purple-900">
                    ${totalProfit.toLocaleString('es-AR')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mensaje de Estado */}
        {submitMessage && (
          <Alert className={`mb-6 ${submitMessage.includes('Error') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <AlertCircle className={`h-4 w-4 ${submitMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`} />
            <AlertDescription className={submitMessage.includes('Error') ? 'text-red-800' : 'text-green-800'}>
              {submitMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Botones de Acción */}
        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || saleItems.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Registrar Venta
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            Volver al Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

