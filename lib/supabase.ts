// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Asset } from '@/types/portfolio';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções de autenticação
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getUserAssets(userId: string) {
  const { data, error } = await supabase
    .from('holdings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Asset[]
}

export async function addAsset(asset: Omit<Asset, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('holdings')
    .insert([asset])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateAsset(id: string, updates: Partial<Asset>) {
  const { data, error } = await supabase
    .from('holdings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteAsset(id: string) {
  const { error } = await supabase
    .from('holdings')
    .delete()
    .eq('id', id)

  if (error) throw error
}
