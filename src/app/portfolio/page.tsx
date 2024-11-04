'use client'
import { useState, useEffect } from 'react'
import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { 
  Bars3Icon, 
  BellIcon, 
  XMarkIcon,
  ChartBarIcon,
  HomeIcon,
  DocumentChartBarIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import AddAssetModal from '@/components/AddAssetModal'
import { supabase } from '@/lib/supabase'
import { Asset } from '@/types/portfolio'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/portfolio', current: true, icon: HomeIcon },
  { name: 'Portfólio', href: '/portfolio', current: false, icon: ChartBarIcon },
  { name: 'Relatórios', href: '#', current: false, icon: DocumentChartBarIcon },
  { name: 'Configurações', href: '#', current: false, icon: Cog6ToothIcon },
]

const userNavigation = [
  { name: 'Seu Perfil', href: '#', icon: UserCircleIcon },
  { name: 'Configurações', href: '#', icon: Cog6ToothIcon },
  { name: 'Sair', href: '#', icon: ArrowRightOnRectangleIcon, isLogout: true },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Portfolio() {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkUser()
    fetchAssets()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
      } else {
        setUser(user)
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
      router.push('/auth/login')
    }
  }

  const fetchAssets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('holdings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAssets(data || [])
    } catch (error) {
      console.error('Erro ao carregar ativos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAsset = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este ativo?')) return

    try {
      const { error } = await supabase
        .from('holdings')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Atualiza a lista de ativos
      fetchAssets()
    } catch (error) {
      console.error('Erro ao excluir ativo:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/auth/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <>
      <div className="min-h-full bg-gray-900">
        <Disclosure as="nav" className="bg-gray-800 border-b border-green-600/20">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8"
                        src="https://tailwindui.com/img/logos/mark.svg?color=green&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-green-600 text-white'
                                : 'text-gray-300 hover:bg-green-600/20 hover:text-white',
                              'rounded-md px-3 py-2 text-sm font-medium flex items-center gap-2'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            <item.icon className="h-5 w-5" aria-hidden="true" />
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Ver notificações</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Abrir menu do usuário</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-green-600/20">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    onClick={(e) => {
                                      e.preventDefault()
                                      if (item.isLogout) {
                                        handleSignOut()
                                      }
                                    }}
                                    className={classNames(
                                      active ? 'bg-gray-700' : '',
                                      'block px-4 py-2 text-sm text-gray-300 hover:text-white flex items-center gap-2 cursor-pointer'
                                    )}
                                  >
                                    <item.icon className="h-4 w-4" aria-hidden="true" />
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Abrir menu principal</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </Disclosure>

        <header className="bg-gray-800 shadow-lg border-b border-green-600/20">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold tracking-tight text-white">Meu Portfólio</h1>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <PlusCircleIcon className="h-5 w-5" />
                Adicionar Ativo
              </button>
            </div>
          </div>
        </header>
        
        <main className="bg-gray-900">
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="bg-gray-800 shadow-xl overflow-hidden sm:rounded-lg border border-green-600/20">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider flex items-center gap-2">
                      <BanknotesIcon className="h-4 w-4" />
                      Ativo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider flex items-center gap-2">
                      <ArrowTrendingUpIcon className="h-4 w-4" />
                      Símbolo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Preço de Compra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-300">
                        Carregando...
                      </td>
                    </tr>
                  ) : assets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-300">
                        Nenhum ativo encontrado. Adicione seu primeiro ativo!
                      </td>
                    </tr>
                  ) : (
                    assets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-gray-700/50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {asset.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {asset.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {asset.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(asset.purchase_price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <button
                            onClick={() => router.push(`/portfolio/edit-asset/${asset.id}`)}
                            className="text-green-400 hover:text-green-300 mr-3 transition-colors duration-150 flex items-center gap-1"
                          >
                            <PencilSquareIcon className="h-4 w-4" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteAsset(asset.id)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-150 flex items-center gap-1"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <AddAssetModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          fetchAssets()
        }}
      />
    </>
  )
} 