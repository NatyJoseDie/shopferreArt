'use client';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">¡Bienvenido a Distribuidora FerreArt!</h1>
          <p className="text-gray-600 mt-2">Aquí puedes administrar productos, compras, ventas y más.</p>
        </div>

        {/* Resumen Ejecutivo */}
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-blue-500 mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
              📊 Resumen Ejecutivo
            </h2>
            <p className="text-gray-600 mb-6">Un vistazo general a tu actividad comercial.</p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Ingresos Totales */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-green-800">Ingresos Totales</h3>
                  <span className="text-green-600">📈</span>
                </div>
                <div className="text-2xl font-bold text-green-900">$125.000,00</div>
                <p className="text-xs text-green-700">45 ventas realizadas</p>
              </div>

              {/* Productos Activos */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-blue-800">Productos Activos</h3>
                  <span className="text-blue-600">📦</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">5</div>
                <p className="text-xs text-blue-700">En catálogo</p>
              </div>

              {/* Stock Crítico */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-orange-800">Stock Crítico</h3>
                  <span className="text-orange-600">⚠️</span>
                </div>
                <div className="text-2xl font-bold text-orange-900">3</div>
                <p className="text-xs text-orange-700">Productos con stock bajo</p>
              </div>

              {/* Ganancias del Mes */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-purple-800">Ganancias del Mes</h3>
                  <span className="text-purple-600">💰</span>
                </div>
                <div className="text-2xl font-bold text-purple-900">$45.000,00</div>
                <p className="text-xs text-purple-700">Margen del 36%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alertas de Stock */}
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-orange-500 mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              🚨 Alertas de Stock
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div>
                  <span className="font-medium text-red-800">Plancha de Pelo Oryx</span>
                  <span className="ml-2 text-sm text-red-600">Stock: 2 unidades</span>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">CRÍTICO</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div>
                  <span className="font-medium text-orange-800">Auricular M25</span>
                  <span className="ml-2 text-sm text-orange-600">Stock: 3 unidades</span>
                </div>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">BAJO</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <span className="font-medium text-yellow-800">Freidora de Aire 3.5L</span>
                  <span className="ml-2 text-sm text-yellow-600">Stock: 8 unidades</span>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">MODERADO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              ⚡ Acciones Rápidas
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <button 
                onClick={() => handleNavigation('/dashboard/productos')}
                className="h-auto p-4 flex flex-col items-center gap-2 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                <span className="text-2xl">📦</span>
                <span className="font-medium text-gray-900">Gestionar Productos</span>
                <span className="text-sm text-gray-600">Ver y editar catálogo</span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/dashboard/compras')}
                className="h-auto p-4 flex flex-col items-center gap-2 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
              >
                <span className="text-2xl">🛒</span>
                <span className="font-medium text-gray-900">Registrar Compra</span>
                <span className="text-sm text-gray-600">Añadir nuevo stock</span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/dashboard/ventas')}
                className="h-auto p-4 flex flex-col items-center gap-2 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <span className="text-2xl">💰</span>
                <span className="font-medium text-gray-900">Registrar Venta</span>
                <span className="text-sm text-gray-600">Venta al consumidor final</span>
              </button>
              
              <button 
                onClick={() => handleNavigation('/dashboard/ventas-mayorista')}
                className="h-auto p-4 flex flex-col items-center gap-2 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
              >
                <span className="text-2xl">🏢</span>
                <span className="font-medium text-gray-900">Venta Mayorista</span>
                <span className="text-sm text-gray-600">Gestión de mayoristas</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

