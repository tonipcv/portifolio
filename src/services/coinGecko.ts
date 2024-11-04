import { Asset } from '@/types/portfolio'

const API_BASE_URL = '/api'

export interface CoinPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  image: string
}

export async function getCoinsMarkets(): Promise<CoinPrice[]> {
  const response = await fetch(`${API_BASE_URL}/coins`)
  if (!response.ok) throw new Error('Falha ao buscar dados de mercado')
  return response.json()
}

export async function getCoinPrices(coinIds: string[]): Promise<Record<string, number>> {
  if (coinIds.length === 0) return {}
  
  const response = await fetch(
    `${API_BASE_URL}/simple/price?ids=${coinIds.join(',')}&vs_currency=brl`
  )
  if (!response.ok) throw new Error('Falha ao buscar preços')
  return response.json()
}

export async function updateAssetPrices(assets: Asset[]): Promise<Asset[]> {
  if (!assets || assets.length === 0) return []

  try {
    const prices = await getCoinsMarkets()
    console.log('Preços obtidos:', prices) // Debug

    return assets.map(asset => {
      const coinData = prices.find(p => p.symbol.toLowerCase() === asset.symbol.toLowerCase())
      if (!coinData) return asset

      const updatedAsset = {
        ...asset,
        current_price: coinData.current_price,
        price_change_24h: coinData.price_change_percentage_24h,
        total_value: asset.quantity * coinData.current_price
      }
      console.log('Ativo atualizado:', updatedAsset) // Debug
      return updatedAsset
    })
  } catch (error) {
    console.error('Erro ao atualizar preços:', error)
    return assets
  }
} 