'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getUserAssets, updateAsset, deleteAsset } from '@/lib/supabase'
import { Asset } from '@/types/portfolio'

export default function EditAssetPage({ params }: { params: { id: string } }) {
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    async function loadAsset() {
      try {
        if (!user) return
        const assets = await getUserAssets(user.id)
        const currentAsset = assets.find((a: Asset) => a.id === params.id)
        if (currentAsset) {
          setAsset(currentAsset)
        }
      } catch (error) {
        console.error('Erro ao carregar ativo:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAsset()
  }, [user, params.id, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!asset) return

    setLoading(true)
    try {
      await updateAsset(asset.id, asset)
      router.push('/portfolio')
    } catch (error) {
      console.error('Erro ao atualizar ativo:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!asset || !confirm('Tem certeza que deseja excluir este ativo?')) return

    setLoading(true)
    try {
      await deleteAsset(asset.id)
      router.push('/portfolio')
    } catch (error) {
      console.error('Erro ao excluir ativo:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Carregando...</div>
  if (!asset) return <div>Ativo não encontrado</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Ativo</h1>

      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Quantidade</label>
            <input
              type="number"
              step="any"
              value={asset.quantity}
              onChange={(e) => setAsset(prev => prev ? { ...prev, quantity: Number(e.target.value) } : null)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Preço de Compra (USD)</label>
            <input
              type="number"
              step="any"
              value={asset.purchase_price}
              onChange={(e) => setAsset(prev => prev ? { ...prev, purchase_price: Number(e.target.value) } : null)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded disabled:bg-blue-300"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded disabled:bg-red-300"
            >
              {loading ? 'Excluindo...' : 'Excluir Ativo'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
} 