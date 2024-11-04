import { createClient } from '@supabase/supabase-js';
import { Asset } from '@/types/portfolio';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function addAsset(asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) {
  console.log('Dados enviados para addAsset:', asset) // Debug
  
  try {
    const { data, error } = await supabase
      .from('holdings')
      .insert([{
        user_id: asset.user_id,
        symbol: asset.symbol.toLowerCase(),
        name: asset.name,
        quantity: asset.quantity,
        purchase_price: asset.purchase_price,
        current_price: asset.current_price || asset.purchase_price,
        price_change_24h: 0,
        total_value: asset.quantity * asset.purchase_price
      }])
      .select('*')
      .single()

    if (error) {
      console.error('Erro do Supabase:', error) // Debug
      throw error
    }

    console.log('Resposta do Supabase:', data) // Debug
    return data
  } catch (error) {
    console.error('Erro ao adicionar ativo:', error)
    throw error
  }
}

// ... resto do código ... 