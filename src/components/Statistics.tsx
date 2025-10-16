import { useMemo } from 'react';
import { Tire } from '../lib/supabase';
import { TrendingUp, DollarSign, Package, PieChart } from 'lucide-react';

interface StatisticsProps {
  tires: Tire[];
}

export default function Statistics({ tires }: StatisticsProps) {
  const stats = useMemo(() => {
    const byBrand = tires.reduce((acc, tire) => {
      acc[tire.brand] = (acc[tire.brand] || 0) + tire.stock;
      return acc;
    }, {} as Record<string, number>);

    const byVehicleType = tires.reduce((acc, tire) => {
      acc[tire.vehicle_type] = (acc[tire.vehicle_type] || 0) + tire.stock;
      return acc;
    }, {} as Record<string, number>);

    const bySeason = tires.reduce((acc, tire) => {
      acc[tire.season] = (acc[tire.season] || 0) + tire.stock;
      return acc;
    }, {} as Record<string, number>);

    const byCondition = tires.reduce((acc, tire) => {
      acc[tire.condition] = (acc[tire.condition] || 0) + tire.stock;
      return acc;
    }, {} as Record<string, number>);

    const totalStock = tires.reduce((sum, tire) => sum + tire.stock, 0);
    const totalValue = tires.reduce((sum, tire) => sum + (tire.price * tire.stock), 0);
    const avgPrice = tires.length > 0 ? tires.reduce((sum, tire) => sum + tire.price, 0) / tires.length : 0;

    const topBrands = Object.entries(byBrand)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const topValueTires = [...tires]
      .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
      .slice(0, 5);

    const lowStockTires = tires.filter(tire => tire.stock <= tire.min_stock);

    return {
      byBrand,
      byVehicleType,
      bySeason,
      byCondition,
      totalStock,
      totalValue,
      avgPrice,
      topBrands,
      topValueTires,
      lowStockTires,
    };
  }, [tires]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Estadísticas y Análisis</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Stock Total</h3>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{stats.totalStock}</p>
          <p className="text-sm text-gray-600">Neumáticos en inventario</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Valor Total</h3>
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">${stats.totalValue.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Valor del inventario</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Precio Promedio</h3>
            <div className="bg-orange-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">${stats.avgPrice.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Por neumático</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-2 rounded-lg">
              <PieChart className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Distribución por Marca</h3>
          </div>
          <div className="space-y-4">
            {stats.topBrands.map(([brand, count]) => {
              const percentage = (count / stats.totalStock) * 100;
              return (
                <div key={brand}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{brand}</span>
                    <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <PieChart className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Distribución por Vehículo</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.byVehicleType).map(([type, count]) => {
              const percentage = (count / stats.totalStock) * 100;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                    <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-2 rounded-lg">
              <PieChart className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Distribución por Temporada</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.bySeason).map(([season, count]) => {
              const percentage = (count / stats.totalStock) * 100;
              return (
                <div key={season}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{season}</span>
                    <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <PieChart className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Distribución por Condición</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(stats.byCondition).map(([condition, count]) => {
              const percentage = (count / stats.totalStock) * 100;
              return (
                <div key={condition}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">{condition}</span>
                    <span className="text-sm text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-amber-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Top 5 - Mayor Valor en Inventario</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Marca/Modelo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tamaño</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Precio Unit.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Valor Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.topValueTires.map((tire) => (
                <tr key={tire.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-gray-900">{tire.brand}</p>
                      <p className="text-sm text-gray-600">{tire.model}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm">{tire.size}</td>
                  <td className="px-4 py-3 font-semibold">{tire.stock}</td>
                  <td className="px-4 py-3">${tire.price.toFixed(2)}</td>
                  <td className="px-4 py-3 font-bold text-green-600">
                    ${(tire.price * tire.stock).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {stats.lowStockTires.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">
            Alertas de Stock Bajo ({stats.lowStockTires.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.lowStockTires.map((tire) => (
              <div key={tire.id} className="bg-white rounded-lg p-4 border border-red-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{tire.brand} {tire.model}</p>
                    <p className="text-sm text-gray-600">{tire.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Stock</p>
                    <p className="text-xl font-bold text-red-600">{tire.stock}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
