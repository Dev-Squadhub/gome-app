import { useState, useEffect } from 'react';
import { supabase, Tire } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  AlertTriangle,
  LogOut,
  Plus,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import TireList from './TireList';
import TireForm from './TireForm';
import Statistics from './Statistics';

type View = 'dashboard' | 'inventory' | 'statistics';

export default function Dashboard() {
  const [view, setView] = useState<View>('dashboard');
  const [tires, setTires] = useState<Tire[]>([]);
  const [filteredTires, setFilteredTires] = useState<Tire[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTire, setEditingTire] = useState<Tire | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    vehicleType: '',
    season: '',
    condition: '',
    lowStock: false,
  });
  const { signOut } = useAuth();

  const [stats, setStats] = useState({
    totalTires: 0,
    totalValue: 0,
    lowStock: 0,
    categories: 0,
  });

  useEffect(() => {
    loadTires();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tires, searchTerm, filters]);

  const loadTires = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tires')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading tires:', error);
    } else if (data) {
      setTires(data as Tire[]);
      calculateStats(data as Tire[]);
    }
    setLoading(false);
  };

  const calculateStats = (tiresData: Tire[]) => {
    const totalTires = tiresData.reduce((sum, tire) => sum + tire.stock, 0);
    const totalValue = tiresData.reduce((sum, tire) => sum + (tire.price * tire.stock), 0);
    const lowStock = tiresData.filter(tire => tire.stock <= tire.min_stock).length;
    const categories = new Set(tiresData.map(tire => `${tire.brand}-${tire.model}`)).size;

    setStats({ totalTires, totalValue, lowStock, categories });
  };

  const applyFilters = () => {
    let filtered = [...tires];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(tire =>
        tire.brand.toLowerCase().includes(term) ||
        tire.model.toLowerCase().includes(term) ||
        tire.size.toLowerCase().includes(term)
      );
    }

    if (filters.vehicleType) {
      filtered = filtered.filter(tire => tire.vehicle_type === filters.vehicleType);
    }

    if (filters.season) {
      filtered = filtered.filter(tire => tire.season === filters.season);
    }

    if (filters.condition) {
      filtered = filtered.filter(tire => tire.condition === filters.condition);
    }

    if (filters.lowStock) {
      filtered = filtered.filter(tire => tire.stock <= tire.min_stock);
    }

    setFilteredTires(filtered);
  };

  const handleAddTire = () => {
    setEditingTire(null);
    setShowForm(true);
  };

  const handleEditTire = (tire: Tire) => {
    setEditingTire(tire);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTire(null);
    loadTires();
  };

  const handleDeleteTire = async (id: string) => {
    if (confirm('¿Está seguro de eliminar este neumático?')) {
      const { error } = await supabase
        .from('tires')
        .delete()
        .eq('id', id);

      if (!error) {
        loadTires();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Gomería Pro</h1>
                <p className="text-xs text-gray-500">Sistema de Gestión</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  view === 'dashboard'
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>

              <button
                onClick={() => setView('inventory')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  view === 'inventory'
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Inventario</span>
              </button>

              <button
                onClick={() => setView('statistics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  view === 'statistics'
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Estadísticas</span>
              </button>

              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Neumáticos</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalTires}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Valor Total</p>
                    <p className="text-3xl font-bold text-gray-900">${stats.totalValue.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Stock Bajo</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.lowStock}</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Categorías</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.categories}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <LayoutDashboard className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Neumáticos con Stock Bajo</h2>
                <button
                  onClick={handleAddTire}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Neumático
                </button>
              </div>

              {loading ? (
                <p className="text-center text-gray-500 py-8">Cargando...</p>
              ) : (
                <div className="space-y-3">
                  {tires.filter(tire => tire.stock <= tire.min_stock).slice(0, 5).map(tire => (
                    <div key={tire.id} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{tire.brand} {tire.model}</p>
                        <p className="text-sm text-gray-600">{tire.size} - {tire.vehicle_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Stock</p>
                        <p className="text-lg font-bold text-red-600">{tire.stock} unidades</p>
                      </div>
                    </div>
                  ))}
                  {tires.filter(tire => tire.stock <= tire.min_stock).length === 0 && (
                    <p className="text-center text-gray-500 py-8">No hay neumáticos con stock bajo</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'inventory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Inventario de Neumáticos</h2>
              <button
                onClick={handleAddTire}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg font-semibold"
              >
                <Plus className="w-5 h-5" />
                Agregar Neumático
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={filters.vehicleType}
                  onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Todos los vehículos</option>
                  <option value="auto">Auto</option>
                  <option value="camioneta">Camioneta</option>
                  <option value="camión">Camión</option>
                  <option value="moto">Moto</option>
                </select>

                <select
                  value={filters.season}
                  onChange={(e) => setFilters({ ...filters, season: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Todas las temporadas</option>
                  <option value="verano">Verano</option>
                  <option value="invierno">Invierno</option>
                  <option value="all-season">All Season</option>
                </select>

                <select
                  value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Todas las condiciones</option>
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                </select>

                <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={filters.lowStock}
                    onChange={(e) => setFilters({ ...filters, lowStock: e.target.checked })}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">Stock bajo</span>
                </label>
              </div>

              <TireList
                tires={filteredTires}
                loading={loading}
                onEdit={handleEditTire}
                onDelete={handleDeleteTire}
              />
            </div>
          </div>
        )}

        {view === 'statistics' && (
          <Statistics tires={tires} />
        )}
      </main>

      {showForm && (
        <TireForm
          tire={editingTire}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
