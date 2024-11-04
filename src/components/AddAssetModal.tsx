'use client'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { supabase } from '@/lib/supabase'
import { 
  XMarkIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  CalculatorIcon,
  CurrencyDollarIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline'

interface AddAssetModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AddAssetModal({ isOpen, onClose }: AddAssetModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    quantity: '',
    purchase_price: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Usuário não autenticado')
      }

      const { error } = await supabase
        .from('holdings')
        .insert([
          {
            user_id: user.id,
            symbol: formData.symbol.toUpperCase(),
            name: formData.name,
            quantity: parseFloat(formData.quantity),
            purchase_price: parseFloat(formData.purchase_price)
          }
        ])

      if (error) throw error

      setFormData({ symbol: '', name: '', quantity: '', purchase_price: '' })
      onClose()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 shadow-xl border border-green-600/20">
          <Dialog.Title className="text-lg font-bold mb-4 text-white">
            Adicionar Novo Ativo
          </Dialog.Title>

          {error && (
            <div className="mb-4 p-2 bg-red-900/50 text-red-200 rounded border border-red-500/50">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-200 mb-1 flex items-center gap-2">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                Símbolo
              </label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-200 mb-1 flex items-center gap-2">
                <BanknotesIcon className="h-4 w-4" />
                Nome do Ativo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-200 mb-1 flex items-center gap-2">
                <CalculatorIcon className="h-4 w-4" />
                Quantidade
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-green-500 focus:border-green-500"
                required
                step="any"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-200 mb-1 flex items-center gap-2">
                <CurrencyDollarIcon className="h-4 w-4" />
                Preço de Compra
              </label>
              <input
                type="number"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-green-500 focus:border-green-500"
                required
                step="any"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
                disabled={loading}
              >
                <XMarkIcon className="h-4 w-4" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adicionando...
                  </>
                ) : (
                  <>
                    <PlusCircleIcon className="h-4 w-4" />
                    Adicionar
                  </>
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
} 