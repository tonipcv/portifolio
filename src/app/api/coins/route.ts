import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=brl&order=market_cap_desc&per_page=100&page=1&sparkline=false',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 } // Cache por 60 segundos
      }
    )

    if (!response.ok) {
      throw new Error('Falha ao buscar dados da API')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao buscar moedas:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar dados das moedas' },
      { status: 500 }
    )
  }
} 