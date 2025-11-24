
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase baseada nas credenciais fornecidas
// Em produção, recomenda-se usar variáveis de ambiente (import.meta.env.VITE_SUPABASE_URL)
const SUPABASE_URL = 'https://gwazzcbshytwxygtlavn.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Y6dh33YPQ9SXra_fI9ufrg_RQFr5TaY'; 

// Criação do cliente único
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
