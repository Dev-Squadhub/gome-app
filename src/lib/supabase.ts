import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Tire {
  id: string;
  brand: string;
  model: string;
  size: string;
  vehicle_type: string;
  price: number;
  stock: number;
  min_stock: number;
  season: string;
  load_index: string;
  speed_rating: string;
  condition: string;
  notes: string;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface TireMovement {
  id: string;
  tire_id: string;
  movement_type: string;
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  created_at: string;
  created_by: string | null;
}
