import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// 👇 Inicialitza Supabase amb variables d'entorn
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SupabaseTest() {
  const [status, setStatus] = useState('⌛ Connectant...');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('br1') // substitueix pel nom correcte de la teva taula
          .select('*')
          .limit(1);

        if (error) {
          setStatus(`❌ Error: ${error.message}`);
        } else {
          setStatus('✅ Connexió correcta amb Supabase!');
          setData(data[0]);
        }
      } catch (err: any) {
        setStatus(`🔥 Error inesperat: ${err.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🔍 Test Connexió Supabase</h1>
      <p>{status}</p>
      {data && (
        <pre style={{ marginTop: '1rem', backgroundColor: '#f0f0f0', padding: '1rem' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
