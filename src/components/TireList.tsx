import { Tire } from '../lib/supabase';
import { Pencil, Trash2, AlertTriangle } from 'lucide-react';

interface TireListProps {
  tires: Tire[];
  loading: boolean;
  onEdit: (tire: Tire) => void;
  onDelete: (id: string) => void;
}

export default function TireList({ tires, loading, onEdit, onDelete }: TireListProps) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        <p className="mt-4 text-gray-600">Cargando neumáticos...</p>
      </div>
    );
  }

  if (tires.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">No se encontraron neumáticos</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Imagen
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Marca / Modelo
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Tamaño
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Vehículo
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Temporada
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Condición
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Precio
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tires.map((tire) => {
            const isLowStock = tire.stock <= tire.min_stock;
            const imageUrl = tire.images && tire.images.length > 0 ? tire.images[0] : null;

            return (
              <tr key={tire.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`${tire.brand} ${tire.model}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Sin foto</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="font-semibold text-gray-900">{tire.brand}</p>
                    <p className="text-sm text-gray-600">{tire.model}</p>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="font-mono text-sm text-gray-900">{tire.size}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                    {tire.vehicle_type}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-900 capitalize">{tire.season}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    tire.condition === 'nuevo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tire.condition}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${
                      isLowStock ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {tire.stock}
                    </span>
                    {isLowStock && (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="font-semibold text-gray-900">${tire.price.toFixed(2)}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(tire)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(tire.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Package({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
      />
    </svg>
  );
}
