export interface Asset {
  id: string
  user_id: string
  name: string
  symbol: string
  quantity: number
  purchase_price: number
  created_at?: string
  updated_at?: string
}

export interface Portfolio {
  total_value: number
  assets: Asset[]
  last_updated: string
} 