// catalogScript.js
import { supabase } from '../lib/spClient.js';

  import { createClient } from '@supabase/supabase-js';
  const supabase = createClient('https://uapfvdwbwfwhlwsqokbs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhcGZ2ZHdid2Z3aGx3c3Fva2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNzgyNTMsImV4cCI6MjA2ODc1NDI1M30.6MRmvrUNzP-sk-Msp7ckrEvRYh04vyeWIcQ5jI57Zpc');

  const { data, error } = await supabase.from('br1').select();
  console.log(data);


// ✅ Test de conexión
const testConnection = async () => {
  const { data, error } = await supabase.from('br1').select('*').limit(1);
  if (error) {
    console.error('❌ Error de Supabase:', error.message);
  } else {
    console.log('✅ Supabase conectado correctamente:', data);
  }
};
testConnection();

// 🌟 Elementos del DOM
const input = document.getElementById('searchInput');
const resultsList = document.getElementById('resultsList');
const searchType = document.getElementById('searchType');
const clearSearch = document.getElementById('clearSearch');
const modal = document.getElementById('detailsModal');
const modalTitle = document.getElementById('modalTitle');
const modalInfo = document.getElementById('modalInfo');
const closeModal = document.getElementById('closeModal');

// 🎯 Búsqueda interactiva
input?.addEventListener('input', async () => {
  const query = input.value.trim().toLowerCase();
  const type = searchType.value;
  resultsList.innerHTML = '';
  if (!query) return;

  let table = type === 'actors' ? 'namebasics1' : 'br1';
  let field = type === 'actors' ? 'primaryName' : 'primaryTitle';

  const { data } = await supabase.from(table).select('*').ilike(field, `%${query}%`).limit(10);
  if (data?.length) {
    resultsList.classList.remove('hidden');
    data.forEach(item => {
      const li = document.createElement('li');
      li.className = 'hover:bg-purple-100 p-2 rounded cursor-pointer transition';
      li.textContent = item[field];
      li.addEventListener('click', () => {
        modalTitle.textContent = item[field];
        modalInfo.innerHTML = `
          <strong>Tipus:</strong> ${item.titleType ?? '—'}<br>
          <strong>Any:</strong> ${item.startYear ?? '—'}<br>
          <strong>Gèneres:</strong> ${Array.isArray(item.genres) ? item.genres.join(', ') : item.genres?.replace(/^\{|\}$/g, '') ?? '—'}<br>
          <strong>Puntuació mitjana:</strong> ${item.averageRating ?? '—'}<br>
          <strong>Vots:</strong> ${item.numVotes ?? '—'}<br><br>
          <a href="https://www.imdb.com/find?q=${encodeURIComponent(item[field])}" target="_blank" class="bg-gray-100 text-indigo-700 px-3 py-1 rounded inline-block mt-2 hover:bg-gray-200">🔎 Consulta a IMDb</a>`;
        modal.classList.remove('hidden');
      });
      resultsList.appendChild(li);
    });
  } else {
    resultsList.classList.add('hidden');
  }
});

// 🧽 Limpiar búsqueda
clearSearch?.addEventListener('click', () => {
  input.value = '';
  clearSearch.classList.add('hidden');
  resultsList.classList.add('hidden');
  input.focus();
});

input?.addEventListener('input', () => {
  clearSearch.classList.toggle('hidden', input.value.trim() === '');
});

// 🛑 Cerrar modal
closeModal?.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// 🔽 Menú desplegable
const toggle = document.getElementById("dropdownToggle");
const menu = document.getElementById("dropdownMenu");

toggle?.addEventListener("click", (e) => {
  e.stopPropagation();
  menu.style.display = menu.style.display === "block" ? "none" : "block";
});
window.addEventListener("click", (e) => {
  if (!toggle?.contains(e.target)) {
    menu.style.display = "none";
  }
});
