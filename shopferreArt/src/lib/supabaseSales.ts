import { supabase } from './supabaseClient';

export interface Sale {
  id: string;
  user_id?: string;
  sale_type: 'consumidor_final' | 'mayorista';
  total_amount: number;
  sale_date: string;
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  price_at_sale: number;
}

export interface SaleInput {
  user_id?: string;
  sale_type: 'consumidor_final' | 'mayorista';
  total_amount: number;
  items: {
    product_id: string;
    quantity: number;
    price_at_sale: number;
  }[];
}

// Crear una nueva venta
export async function createSale(sale: SaleInput): Promise<{ data: Sale | null; error: string | null }> {
  try {
    // Verificar stock disponible antes de procesar la venta
    for (const item of sale.items) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();

      if (productError) {
        return { data: null, error: `Error al verificar producto: ${productError.message}` };
      }

      if (product.stock < item.quantity) {
        return { data: null, error: `Stock insuficiente para el producto. Stock disponible: ${product.stock}` };
      }
    }

    // Crear la venta
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .insert([{
        user_id: sale.user_id,
        sale_type: sale.sale_type,
        total_amount: sale.total_amount,
      }])
      .select()
      .single();

    if (saleError) {
      return { data: null, error: saleError.message };
    }

    // Insertar items de la venta
    const saleItems = sale.items.map(item => ({
      sale_id: saleData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_sale: item.price_at_sale,
    }));

    const { error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems);

    if (itemsError) {
      return { data: null, error: itemsError.message };
    }

    // Actualizar stock de productos
    for (const item of sale.items) {
      const { data: currentProduct, error: getError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', item.product_id)
        .single();

      if (getError) {
        console.error('Error al obtener producto:', getError);
        continue;
      }

      const newStock = currentProduct.stock - item.quantity;
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', item.product_id);

      if (updateError) {
        console.error('Error al actualizar stock:', updateError);
      }
    }

    return { data: saleData, error: null };
  } catch (error) {
    return { data: null, error: 'Error inesperado al crear venta' };
  }
}

// Obtener todas las ventas
export async function getAllSales(): Promise<{ data: Sale[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('sale_date', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Error inesperado al obtener ventas' };
  }
}

// Obtener una venta con sus items
export async function getSaleWithItems(id: string): Promise<{ 
  data: { sale: Sale; items: SaleItem[] } | null; 
  error: string | null 
}> {
  try {
    const { data: saleData, error: saleError } = await supabase
      .from('sales')
      .select('*')
      .eq('id', id)
      .single();

    if (saleError) {
      return { data: null, error: saleError.message };
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from('sale_items')
      .select('*')
      .eq('sale_id', id);

    if (itemsError) {
      return { data: null, error: itemsError.message };
    }

    return { 
      data: { 
        sale: saleData, 
        items: itemsData 
      }, 
      error: null 
    };
  } catch (error) {
    return { data: null, error: 'Error inesperado al obtener venta' };
  }
}

// Obtener productos más vendidos
export async function getTopSellingProducts(limit: number = 10): Promise<{ 
  data: { product_id: string; product_name: string; total_sold: number }[] | null; 
  error: string | null 
}> {
  try {
    const { data, error } = await supabase
      .from('sale_items')
      .select(`
        product_id,
        quantity,
        products!inner(name)
      `)
      .order('quantity', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    // Agrupar por producto y sumar cantidades
    const productSales: { [key: string]: { name: string; total: number } } = {};
    
    data.forEach((item: any) => {
      if (!productSales[item.product_id]) {
        productSales[item.product_id] = {
          name: item.products.name,
          total: 0
        };
      }
      productSales[item.product_id].total += item.quantity;
    });

    // Convertir a array y ordenar
    const result = Object.entries(productSales)
      .map(([product_id, data]) => ({
        product_id,
        product_name: data.name,
        total_sold: data.total
      }))
      .sort((a, b) => b.total_sold - a.total_sold)
      .slice(0, limit);

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: 'Error inesperado al obtener productos más vendidos' };
  }
}

// Obtener resumen de ventas por período
export async function getSalesSummary(startDate?: string, endDate?: string): Promise<{ 
  data: { 
    total_sales: number; 
    total_amount: number; 
    consumer_sales: number; 
    wholesale_sales: number 
  } | null; 
  error: string | null 
}> {
  try {
    let query = supabase.from('sales').select('sale_type, total_amount');

    if (startDate) {
      query = query.gte('sale_date', startDate);
    }
    if (endDate) {
      query = query.lte('sale_date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    const summary = data.reduce((acc, sale) => {
      acc.total_sales += 1;
      acc.total_amount += sale.total_amount;
      
      if (sale.sale_type === 'consumidor_final') {
        acc.consumer_sales += sale.total_amount;
      } else {
        acc.wholesale_sales += sale.total_amount;
      }
      
      return acc;
    }, {
      total_sales: 0,
      total_amount: 0,
      consumer_sales: 0,
      wholesale_sales: 0
    });

    return { data: summary, error: null };
  } catch (error) {
    return { data: null, error: 'Error inesperado al obtener resumen de ventas' };
  }
}

