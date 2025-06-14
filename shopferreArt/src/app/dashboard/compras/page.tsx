'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ShoppingBag, 
  Plus, 
  Trash2, 
  DollarSign, 
  Package, 
  Calendar,
  CreditCard,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const categories = ['BEAUTY', 'HOME', 'TECNO', 'DEPORTES', 'ROPA'];
const paymentMethods = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia' }
];

// Productos existentes para autocompletar
const existingProducts = [
  { id: '1', name: 'Plancha de Pelo Oryx', category: 'BEAUTY' },
  { id: '2', name: 'Freidora de Aire 3.5L', category: 'HOME' },
  { id: '3', name: 'Auricular M25', category: 'TECNO' },
  { id: '4', name: 'Cafetera Express', category: 'HOME' },
  { id: '5', name: 'Smartwatch Pro', category: 'TECNO' }
];

export default function ComprasPage() {
  const [purchaseItems, setPurchaseItems] = useState([
    {
      id: Date.now(),
      product_name: '',
      existing_product_id: '',
      quantity: '',
      unit_cost: '',
      category: '',
      is_new_product: false
    }
  ]);
  
  const [purchaseData, setPurchaseData] = useState({
    supplier: '',
    payment_method: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const addPurchaseItem = () => {
    setPurchaseItems([
      ...purchaseItems,
      {
        id: Date.now() + Math.random(),
        product_name: '',
        existing_product_id: '',
        quantity: '',
        unit_cost: '',
        category: '',
        is_new_product: false
      }
    ]);
  };

  const removePurchaseItem = (id) => {
    if (purchaseItems.length > 1) {
      setPurchaseItems(purchaseItems.filter(item => item.id !== id));
    }
  };

  const updatePurchaseItem = (id, field, value) => {
    setPurchaseItems(purchaseItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Si selecciona un producto existente, llenar datos automáticamente
        if (field === 'existing_product_id' && value) {
          const existingProduct = existingProducts.find(p => p.id === value);
          if (existingProduct) {
            updatedItem.product_name = existingProduct.name;
            updatedItem.category = existingProduct.category;
            updatedItem.is_new_product = false;
          }
        }
        
        // Si cambia el nombre manualmente, marcar como nuevo producto
        if (field === 'product_name' && value && !item.existing_product_id) {
          updatedItem.is_new_product = true;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return purchaseItems.reduce((total, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitCost = parseFloat(item.unit_cost) || 0;
      return total + (quantity * unitCost);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Validaciones
      if (!purchaseData.payment_method) {
        throw new Error('Selecciona un método de pago');
      }

      const validItems = purchaseItems.filter(item => 
        item.product_name && 
        parseFloat(item.quantity) > 0 && 
        parseFloat(item.unit_cost) > 0
      );

      if (validItems.length === 0) {
        throw new Error('Agrega al menos un producto válido');
      }

      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Aquí iría la lógica para:
      // 1. Crear la compra en la tabla purchases
      // 2. Crear los items en purchase_items
      // 3. Actualizar el stock de productos existentes
      // 4. Crear nuevos productos si es necesario

      setSubmitMessage('¡Compra registrada exitosamente! El stock se ha actualizado automáticamente.');
      
      // Limpiar formulario
      setPurchaseItems([{
        id: Date.now(),
        product_name: '',
        existing_product_id: '',
        quantity: '',
        unit_cost: '',
        category: '',
        is_new_product: false
      }]);
      setPurchaseData({ supplier: '', payment_method: '', notes: '' });

    } catch (error) {
      setSubmitMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalAmount = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Registrar Compra</h1>
          <p className="text-gray-600 mt-2">Registra nuevas compras y actualiza automáticamente el stock de productos.</p>
        </div>

        {/* Información de la Compra */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-green-600" />
              Información de la Compra
            </CardTitle>
            <CardDescription>
              Datos generales de la compra que estás registrando.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="supplier">Proveedor</Label>
                <Input
                  id="supplier"
                  value={purchaseData.supplier}
                  onChange={(e) => setPurchaseData({...purchaseData, supplier: e.target.value})}
                  placeholder="Nombre del proveedor (opcional)"
                />
              </div>
              
              <div>
                <Label htmlFor="payment_method">Método de Pago *</Label>
                <Select 
                  value={purchaseData.payment_method} 
                  onValueChange={(value) => setPurchaseData({...purchaseData, payment_method: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={purchaseData.notes}
                  onChange={(e) => setPurchaseData({...purchaseData, notes: e.target.value})}
                  placeholder="Notas adicionales sobre la compra (opcional)"
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Productos de la Compra */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Productos de la Compra
            </CardTitle>
            <CardDescription>
              Agrega los productos que estás comprando. Si el producto ya existe, se actualizará el stock automáticamente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {purchaseItems.map((item, index) => (
                <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Producto #{index + 1}</h4>
                    {purchaseItems.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePurchaseItem(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="md:col-span-2">
                      <Label>Producto Existente</Label>
                      <Select 
                        value={item.existing_product_id} 
                        onValueChange={(value) => updatePurchaseItem(item.id, 'existing_product_id', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar producto existente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nuevo">Producto nuevo</SelectItem>
                          {existingProducts.map(product => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} ({product.category})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label>Nombre del Producto *</Label>
                      <Input
                        value={item.product_name}
                        onChange={(e) => updatePurchaseItem(item.id, 'product_name', e.target.value)}
                        placeholder="Nombre del producto"
                        disabled={!!item.existing_product_id}
                      />
                      {item.is_new_product && (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-blue-600">Producto nuevo - se creará automáticamente</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <Label>Cantidad *</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updatePurchaseItem(item.id, 'quantity', e.target.value)}
                        placeholder="0"
                        min="1"
                      />
                    </div>
                    
                    <div>
                      <Label>Costo Unitario *</Label>
                      <Input
                        type="number"
                        value={item.unit_cost}
                        onChange={(e) => updatePurchaseItem(item.id, 'unit_cost', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    
                    <div>
                      <Label>Categoría {item.is_new_product && '*'}</Label>
                      <Select 
                        value={item.category} 
                        onValueChange={(value) => updatePurchaseItem(item.id, 'category', value)}
                        disabled={!!item.existing_product_id}
                      >
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
                    
                    <div>
                      <Label>Subtotal</Label>
                      <div className="text-lg font-semibold text-green-600 mt-2">
                        ${((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_cost) || 0)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addPurchaseItem}
                className="w-full border-dashed"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Otro Producto
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resumen y Total */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Resumen de la Compra
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600">Total de Productos</div>
                <div className="text-2xl font-bold text-blue-900">
                  {purchaseItems.filter(item => item.product_name && parseFloat(item.quantity) > 0).length}
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600">Cantidad Total</div>
                <div className="text-2xl font-bold text-green-900">
                  {purchaseItems.reduce((total, item) => total + (parseFloat(item.quantity) || 0), 0)}
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600">Total a Pagar</div>
                <div className="text-2xl font-bold text-purple-900">
                  ${totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
            disabled={isSubmitting || totalAmount === 0}
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
                Registrar Compra
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

