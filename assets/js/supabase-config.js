/* =============================================================
   supabase-config.js — Cliente Supabase para o Frontend
   ============================================================= */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Pegar variáveis do window.ENV (injetadas pelo build)
const url = window.ENV?.SUPABASE_URL || 'https://ubxqubqkjktifrsvvzir.supabase.co';
const key = window.ENV?.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVieHF1YXFqa2t0aWZyc3Z2emlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMjQ3NzAsImV4cCI6MjA0OTYwMDc3MH0.7YpDvJhHmYJzL3kX8mF2tQwRzZ4JkLmNpQrS6tV8wXk';

console.log('🔌 Inicializando Supabase...', { url });

// Criar cliente
const supabase = createClient(url, key);

// Expor globalmente para outros scripts
window.supabaseClient = supabase;

// Teste de conexão
async function testarConexao() {
    console.log('🧪 Testando conexão com tabela "presentes"...');
    
    try {
        // Tentar buscar dados da tabela presentes
        const { data, error, status } = await supabase
            .from('presentes')
            .select('*')
            .limit(5);
        
        console.log('📊 Resposta do Supabase:', { status, error: error?.message, dataLength: data?.length });
        
        if (error) {
            console.error('❌ Erro na consulta:', error.message);
            console.error('   Código:', error.code);
            console.error('   Detalhes:', error.details);
            console.error('   Hint:', error.hint);
            
            if (error.code === '42501' || error.message.includes('permission')) {
                console.warn('⚠️ Problema de permissão RLS. Verifique as políticas da tabela.');
            }
            if (error.code === '42P01' || error.message.includes('does not exist')) {
                console.warn('⚠️ Tabela "presentes" não existe. Crie a tabela no Supabase.');
            }
            return;
        }
        
        if (data && data.length > 0) {
            console.log('✅ Conexão OK! Encontrados', data.length, 'presentes');
            console.log('📦 Primeiro item:', data[0]);
        } else {
            console.warn('⚠️ Tabela "presentes" está vazia ou RLS bloqueia leitura anônima');
        }
        
    } catch (e) {
        console.error('❌ Erro de conexão:', e);
    }
}

// Executar teste
testarConexao();

export default supabase;