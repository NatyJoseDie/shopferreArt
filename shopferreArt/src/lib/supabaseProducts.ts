import { supabase } from './supabaseClient';

export interface Product {
  id: string;
  name: string;
  description?: string;
  cost_price: number;
  stock: number;
  category?: string;
  image_url?: string;
  created_at: string;
}

export interface ProductInput {
  name: string;
  description?: string;
  cost_price: number;
  stock: number;
  category?: string;
  image_url?: string;
}

// Obtener todos los productos
export async function getAllProducts(): Promise<{ data: Product[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Error inesperado al obtener productos' };
  }
}

// Obtener un producto por ID
export async function getProductById(id: string): Promise<{ data: Product | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Error inesperado al obtener producto' };
  }
}

// Crear un nuevo producto
export async function createProduct(product: ProductInput): Promise<{ data: Product | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Error inesperado al crear producto' };
  }
}

// Actualizar un producto
export async function updateProduct(id: string, updates: Partial<ProductInput>): Promise<{ data: Product | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Error inesperado al actualizar producto' };
  }
}

// Eliminar un producto
export async function deleteProduct(id: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return { error: 'Error inesperado al eliminar producto' };
  }
}

// Actualizar stock de un producto
export async function updateProductStock(id: string, newStock: number): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', id);

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    return { error: 'Error inesperado al actualizar stock' };
  }
}

// Obtener productos con stock bajo
export async function getLowStockProducts(threshold: number = 5): Promise<{ data: Product[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .lte('stock', threshold)
      .order('stock', { ascending: true });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return { data: null, error: 'Error inesperado al obtener productos con stock bajo' };
  }
}

