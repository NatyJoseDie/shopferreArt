import { supabase } from './supabaseClient';

export interface Purchase {
  id: string;
  purchase_date: string;
  total_cost: number;
  payment_method: 'efectivo' | 'transferencia';
  supplier?: string;
  created_at: string;
}

export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id?: string;
  product_name: string;
  quantity: number;
  unit_cost: number;
  category?: string;
}

export interface PurchaseInput {
  total_cost: number;
  payment_method: 'efectivo' | 'transferencia';
  supplier?: string;
  items: {
    product_id?: string;
    product_name: string;
    quantity: number;
    unit_cost: number;
    category?: string;
  }[];
}

// Crear una nueva compra
export async function createPurchase(purchase: PurchaseInput): Promise<{ data: Purchase | null; error: string | null }> {
  try {
    // Iniciar transacción
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('purchases')
      .insert([{
        total_cost: purchase.total_cost,
        payment_method: purchase.payment_method,
        supplier: purchase.supplier,
      }])
      .select()
      .single();

    if (purchaseError) {
      return { data: null, error: purchaseError.message };
    }

    // Insertar items de la compra
    const purchaseItems = purchase.items.map(item => ({
      purchase_id: purchaseData.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_cost: item.unit_cost,
      category: item.category,
    }));

    const { error: itemsError } = await supabase
      .from('purchase_items')
      .insert(purchaseItems);

    if (itemsError) {
      return { data: null, error: itemsError.message };
    }

    // Actualizar stock de productos existentes y crear nuevos productos
    for (const item of purchase.items) {
      if (item.product_id) {
        // Producto existente: actualizar stock
        const { data: currentProduct, error: getError } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();

        if (getError) {
          console.error('Error al obtener producto:', getError);
          continue;
        }

        const newStock = currentProduct.stock + item.quantity;
        const { error: updateError } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.product_id);

        if (updateError) {
          console.error('Error al actualizar stock:', updateError);
        }
      } else {
        // Producto nuevo: crear en la tabla products
        const { error: createError } = await supabase
          .from('products')
          .insert([{
            name: item.product_name,
            cost_price: item.unit_cost,
            stock: item.quantity,
            category: item.category,
          }]);

        if (createError) {
          console.error('Error al crear nuevo producto:', createError);
        }
      }
    }

    return { data: purchaseData, error: null };
  } catch (error) {
    return { data: null, error: 'Error inesperado al crear compra' };
  }
}

// Obtener todas las compras
export async function getAllPurchases(): Promise<{ data: Purchase[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .order('purchase_date', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Error inesperado al obtener compras' };
  }
}

// Obtener una compra con sus items
export async function getPurchaseWithItems(id: string): Promise<{ 
  data: { purchase: Purchase; items: PurchaseItem[] } | null; 
  error: string | null 
}> {
  try {
    const { data: purchaseData, error: purchaseError } = await supabase
      .from('purchases')
      .select('*')
      .eq('id', id)
      .single();

    if (purchaseError) {
      return { data: null, error: purchaseError.message };
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('purchase_items')
      .select('*')
      .eq('purchase_id', id);

    if (itemsError) {
      return { data: null, error: itemsError.message };
    }

    return { 
      data: { 
        purchase: purchaseData, 
        items: itemsData 
      }, 
      error: null 
    };
  } catch (error) {
    return { data: null, error: 'Error inesperado al obtener compra' };
  }
}

