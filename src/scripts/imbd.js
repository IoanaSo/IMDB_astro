import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = "https://xelucutthalopkgvijrw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlbHVjdXR0aGFsb3BrZ3ZpanJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4ODE1MjgsImV4cCI6MjA2NzQ1NzUyOH0.xW1gtB2J7V1yVCmueQ5qOOFO0bsTueRa3V9cmwiK5NA";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const input = document.getElementById('searchInput');
const resultsList = document.getElementById('resultsList');
const searchType = document.getElementById('searchType');
const moviesCarousel = document.getElementById('moviesCarousel');
const seriesCarousel = document.getElementById('seriesCarousel');

// 🔍 Cercador interactiu
const modal = document.getElementById('detailsModal');
const modalTitle = document.getElementById('modalTitle');
const modalInfo = document.getElementById('modalInfo');
const closeModal = document.getElementById('closeModal');
const submitRating = document.getElementById('submitRating');

        
const clearSearch = document.getElementById('clearSearch');

// Mostrar o amagar la "X" segons si hi ha text
searchInput.addEventListener('input', () => {
  if (searchInput.value.trim() !== '') {
  clearSearch.classList.remove('hidden');
  } else {
    clearSearch.classList.add('hidden');
    resultsList.classList.add('hidden');
  }
});

// Esborrar el contingut i amagar resultats
clearSearch.addEventListener('click', () => {
  searchInput.value = '';
  clearSearch.classList.add('hidden');
  resultsList.classList.add('hidden');
  searchInput.focus();
});


// 🛑 Tancar modal
closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
});
        
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("dropdownToggle");
  const menu = document.getElementById("dropdownMenu");
  
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  });
  
  window.addEventListener("click", (e) => {
    if (!toggle.contains(e.target)) {
      menu.style.display = "none";
    }
  });
});


// 🔄 Cercador amb modal
input.addEventListener('input', async () => {
  const query = input.value.trim().toLowerCase();
  const type = searchType.value;
  resultsList.innerHTML = '';
  if (!query) return;

  let table = type === 'actors' ? 'namebasics1' : 'br1';
  let field = type === 'actors' ? 'primaryName' : 'primaryTitle';

  const { data } = await supabase.from(table).select('*').ilike(field, `%${query}%`).limit(10);
  if (data && data.length > 0) {
    resultsList.classList.remove('hidden');
    data.forEach(item => {
      const li = document.createElement('li');
      li.className = 'hover:bg-purple-100 p-2 rounded cursor-pointer transition';
      li.textContent = item[field];
      li.addEventListener('click', () => {
        // 🧾 Mostrar informació
        modalTitle.textContent = item[field];
        modalInfo.innerHTML = `
          <strong>Tipus:</strong> ${item.titleType ?? '—'}<br>
          <strong>Any:</strong> ${item.startYear ?? '—'}<br>
          <strong>Gèneres:</strong>  ${Array.isArray(item.genres) ? item.genres.join(', ') : item.genres.replace(/^\{|\}$/g, '') ?? '—'}<br>
          <strong>Puntuació mitjana:</strong> ${item.averageRating ?? '—'}<br>
          <strong>Vots:</strong> ${item.numVotes ?? '—'}<br><br>
          <a href="https://www.google.com/search?q=${encodeURIComponent(item[field])}" target="_blank" class="bg-gray-100 text-indigo-700 px-3 py-1 rounded inline-block mt-2 hover:bg-gray-200">
            🔎 Consulta a Google
          </a>
          `;

        modal.classList.remove('hidden');

          // ✍️ Enviar valoració
          
        const ratingButtonsContainer = document.getElementById('ratingButtons');
        let selectedRating = null;

          // 🧹 Netejar botons anteriors
        ratingButtonsContainer.innerHTML = '';

         // Crear botons de 1 a 10
        for (let i = 1; i <= 10; i++) {
          const btn = document.createElement('button');
          btn.textContent = i;
          btn.className = 'px-3 py-1 border rounded hover:bg-indigo-100';
          btn.onclick = () => {
            selectedRating = i;
            // Ressaltar el botó seleccionat
            document.querySelectorAll('#ratingButtons button').forEach(b => b.classList.remove('bg-indigo-300'));
            btn.classList.add('bg-indigo-300');
            };
          ratingButtonsContainer.appendChild(btn);
        }
        document.getElementById('submitRating').onclick = () => {
          if (selectedRating !== null) {
            alert(`Has valorat l'obra amb un ${selectedRating}/10!`);
            modal.classList.add('hidden');

            // 🔢 Actualitzar numVotes i averageRating
            item.numVotes = (item.numVotes ?? 0) + 1;
            item.averageRating = (((item.averageRating ?? 0) * (item.numVotes - 1) + selectedRating) / item.numVotes).toFixed(1); // Arrodonir a 1 decimal

            // 🔄 Actualitzar visualment la targeta (si cal)
            const updatedStars = '★'.repeat(Math.round(item.averageRating)) + '☆'.repeat(5 - Math.round(item.averageRating));
            card.querySelector('p.text-yellow-500').textContent = updatedStars;
            card.querySelector('p.text-gray-700').textContent = `${item.averageRating} / 10`;
            card.querySelector('p.text-gray-500').textContent = `🗳️ ${item.numVotes} vots`;

            // 🔄 Actualitzar també el contingut del modal
            modalInfo.innerHTML = `
              <strong>Tipus:</strong> ${item.titleType ?? '—'}<br>
              <strong>Any:</strong> ${item.startYear ?? '—'}<br>
              <strong>Gèneres:</strong> ${Array.isArray(item.genres) ? item.genres.join(', ') : (item.genres?.replace(/^\{|\}$/g, '') ?? '—')}<br>
              <strong>Puntuació mitjana:</strong> ${item.averageRating}<br>
              <strong>Vots:</strong> ${item.numVotes}<br><br>
              <a href="https://www.google.com/search?q=${encodeURIComponent(item[field])}" target="_blank" class="bg-gray-100 text-indigo-700 px-3 py-1 rounded inline-block mt-2 hover:bg-gray-200">
                🔎 Consulta a Google
              </a>
            `;
            modal.classList.add('hidden');
          } else {
              alert("Si us plau, selecciona una valoració entre 0 i 10.");
            }
        };
      });

        resultsList.appendChild(li);
      });
  } else {
    resultsList.innerHTML = "<li>No s'han trobat resultats.</li>";
   };
});
        

const createGenreBadges = (genresRaw) => {
  let genres = [];
  try {
    const parsed = typeof genresRaw === 'string' ? JSON.parse(genresRaw) : genresRaw;
      genres = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      genres = typeof genresRaw === 'string' ? genresRaw.replace(/^\{|\}$/g, '').split(',') : [genresRaw];
    }
    return genres.map(genre => `<span class="inline-block bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full mr-1">${genre.trim()}</span>`).join('');
  };


  // 🎞️ Pel·lícules millor valorades de `br1`

        
let currentPage = 0;
const itemsPerPage = 5;
const cardWidth = 220; // amplada de cada targeta + espai
const loadMovies = async () => {
  const { data: movies, error } = await supabase
    .from('br1')
    .select('primaryTitle, startYear, genres, averageRating, numVotes')
    .eq('titleType', 'movie')
    .gt('numVotes', 100000)
    .order('averageRating', { ascending: false })
    .limit(10);

  if (error) {
    console.error("Error carregant pel·lícules:", error);
    return;
  }

  movies.forEach(movie => {
    if (!movie.primaryTitle || movie.averageRating == null || isNaN(movie.averageRating)) return;
    const ratingOutOfFive = Math.max(0, Math.min(10, movie.averageRating)) / 2;
    const fullStars = Math.floor(ratingOutOfFive);
    const hasHalfStar = ratingOutOfFive % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const stars = '★'.repeat(fullStars) +(hasHalfStar ? '⯪' : '') + //  '⭒', '⯨' ,'⯪', o una icona SVG
    '☆'.repeat(emptyStars);
    const card = document.createElement('div');
    card.className = "min-w-[220px] bg-white rounded-lg p-4 shadow-lg text-center transform transition hover:scale-105 mx-3";
    const genreBadges = createGenreBadges(movie.genres);

    card.innerHTML = `
      <img src="/assets/top10.jpg" alt="TOP 10 BEST MOVIES" class="w-full rounded-lg shadow-md border border-gray-200 object-contain mb-3"/>
      <h3 class="text-lg font-bold text-indigo-600">${movie.primaryTitle}</h3>
      <p class="text-xl text-yellow-500 font-semibold">${stars}</p>
      <p class="text-sm text-gray-700">${movie.averageRating} / 10</p>
      <p class="text-xs text-gray-500">🗳️ ${movie.numVotes ?? '—'} vots</p>
      <div class="text-xs text-gray-600 mt-1">${genreBadges}<br> <b>${movie.startYear ?? '—'}<b></div>
    `;

    card.addEventListener('click', () => {
      modalTitle.textContent = movie.primaryTitle;
      modalInfo.innerHTML = `
        <strong>Any:</strong> ${movie.startYear ?? '—'}<br>
        <strong>Gèneres:</strong> ${Array.isArray(movie.genres) ? movie.genres.join(', ') : (movie.genres?.replace(/^\{|\}$/g, '') ?? '—')}<br>
        <strong>Puntuació mitjana:</strong> ${movie.averageRating ?? '—'}<br>
        <strong>Vots:</strong> ${movie.numVotes ?? '—'}<br><br>
        <a href="https://www.google.com/search?q=${encodeURIComponent(movie.primaryTitle)}" target="_blank" class="bg-gray-100 text-indigo-700 px-3 py-1 rounded inline-block mt-2 hover:bg-gray-200">
          🔎 Consulta a Google
        </a>
      `;
       modal.classList.remove('hidden');

     // ✍️ Enviar valoració
    const ratingButtonsContainer = document.getElementById('ratingButtons');
    ratingButtonsContainer.innerHTML = ''; // netejar abans de crear
    let selectedRating = null;

    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = 'px-3 py-1 border rounded hover:bg-indigo-100';
      btn.onclick = () => {
        selectedRating = i;
        document.querySelectorAll('#ratingButtons button').forEach(b => b.classList.remove('bg-indigo-300'));
        btn.classList.add('bg-indigo-300');
      };
      ratingButtonsContainer.appendChild(btn);
    }

    document.getElementById('submitRating').onclick = () => {
      if (selectedRating !== null) {
        alert(`Has valorat l'obra amb un ${selectedRating}/10!`);
        modal.classList.add('hidden');
        // 🔢 Actualitzar numVotes i averageRating
        movie.numVotes = (movie.numVotes ?? 0) + 1;
        movie.averageRating = (((movie.averageRating ?? 0) * (movie.numVotes - 1) + selectedRating) / movie.numVotes).toFixed(1); // Arrodonir a 1 decimal

      // 🔄 Actualitzar visualment la targeta (si cal)
          const updatedStars = '★'.repeat(Math.round(movie.averageRating)) + '☆'.repeat(5 - Math.round(movie.averageRating));
          card.querySelector('p.text-yellow-500').textContent = updatedStars;
          card.querySelector('p.text-gray-700').textContent = `${movie.averageRating} / 10`;
          card.querySelector('p.text-gray-500').textContent = `🗳️ ${movie.numVotes} vots`;
          
           // 🔄 Actualitzar també el contingut del modal
          modalInfo.innerHTML = `
            <strong>Tipus:</strong> ${movie.titleType ?? '—'}<br>
            <strong>Any:</strong> ${movie.startYear ?? '—'}<br>
            <strong>Gèneres:</strong> ${Array.isArray(movie.genres) ? movie.genres.join(', ') : (movie.genres?.replace(/^\{|\}$/g, '') ?? '—')}<br>
            <strong>Puntuació mitjana:</strong> ${movie.averageRating}<br>
            <strong>Vots:</strong> ${movie.numVotes}<br><br>
            <a href="https://www.google.com/search?q=${encodeURIComponent(item[field])}" target="_blank" class="bg-gray-100 text-indigo-700 px-3 py-1 rounded inline-block mt-2 hover:bg-gray-200">
              🔎 Consulta a Google
            </a>
          `;
          modal.classList.add('hidden');
        } else {
          alert("Si us plau, selecciona una valoració entre 0 i 10.");
        }
      };
    });
    moviesCarousel.appendChild(card);
  });
};

        
document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentPage < 1) {
    currentPage++;
    moviesCarousel.style.transform = `translateX(-${itemsPerPage * cardWidth}px)`;
  }
});

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage--;
    moviesCarousel.style.transform = `translateX(-${currentPage * itemsPerPage * cardWidth}px)`;
  }
});

document.addEventListener("DOMContentLoaded", loadMovies);

 // 📺 Sèries millor valorades de `br1` (formato pel·lícula)
const loadSeries = async () => {
const { data: series, error } = await supabase
  .from('br1')
  .select('primaryTitle, startYear, genres, averageRating, numVotes')
  .eq('titleType', 'tvSeries')
  .gt('numVotes', 100000)
  .order('averageRating', { ascending: false })
  .limit(10);

  if (error) {
    console.error("Error carregant sèries:", error);
    return;
  }

  series.forEach(serie => {
    if (!serie.primaryTitle || serie.averageRating == null || isNaN(serie.averageRating)) return;
    const ratingOutOfFive = Math.max(0, Math.min(10, serie.averageRating)) / 2;
    const fullStars = Math.floor(ratingOutOfFive);
    const hasHalfStar = ratingOutOfFive % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars ='★'.repeat(fullStars) + hasHalfStar ? '⯪' : '') + //  '⭒', '⯪', '⯨', , o una icona SVG
              '☆'.repeat(emptyStars);  
    const card = document.createElement('div');
    card.className = "min-w-[220px] bg-white rounded-lg p-4 shadow-lg text-center transform transition hover:scale-105 mx-3";
    const genreBadges = createGenreBadges(serie.genres);

    card.innerHTML = `
      <img src="/assets/tops.10.jpg" alt="TOP 10 BEST SERIES" class="w-full rounded-lg shadow-md border border-gray-200 object-contain mb-3"/>
      <h3 class="text-lg font-bold text-red-600">${serie.primaryTitle}</h3>
      <p class="text-xl text-yellow-500 font-semibold">${stars}</p>
      <p class="text-sm text-gray-700">${serie.averageRating} / 10</p>
      <p class="text-xs text-gray-500">🗳️ ${serie.numVotes ?? '—'} vots</p>
      <div class="text-xs text-gray-600 mt-1">${genreBadges} <br><b> ${serie.startYear ?? '—'}</b></div>
    `;

  // 🔗 Comportament de clic: 
  card.addEventListener('click', () => {
    modalTitle.textContent = serie.primaryTitle;
    modalInfo.innerHTML = `
      <strong>Any:</strong> ${serie.startYear ?? '—'}<br>
      <strong>Gèneres:</strong> ${Array.isArray(serie.genres) ? serie.genres.join(', ') : (serie.genres?.replace(/^\{|\}$/g, '') ?? '—')}<br>
      <strong>Puntuació mitjana:</strong> ${serie.averageRating ?? '—'}<br>
      <strong>Vots:</strong> ${serie.numVotes ?? '—'}<br><br>
      <a href="https://www.google.com/search?q=${encodeURIComponent(serie.primaryTitle)}" target="_blank" class="bg-gray-100 text-indigo-700 px-3 py-1 rounded inline-block mt-2 hover:bg-gray-200">
        🔎 Consulta a Google
      </a>
    `;
    modal.classList.remove('hidden');
    // ✍️ Enviar valoració
  
              const ratingButtonsContainer = document.getElementById('ratingButtons');
              ratingButtonsContainer.innerHTML = ''; // netejar abans de crear

              let selectedRating = null;

              for (let i = 1; i <= 10; i++) {
                const btn = document.createElement('button');
                btn.textContent = i;
                btn.className = 'px-3 py-1 border rounded hover:bg-indigo-100';
                btn.onclick = () => {
                  selectedRating = i;
                  document.querySelectorAll('#ratingButtons button').forEach(b => b.classList.remove('bg-indigo-300'));
                  btn.classList.add('bg-indigo-300');
                };
                ratingButtonsContainer.appendChild(btn);
              }

              document.getElementById('submitRating').onclick = () => {
                if (selectedRating !== null) {
                  alert(`Has valorat l'obra amb un ${selectedRating}/10!`);
                  modal.classList.add('hidden');
              // 🔢 Actualitzar numVotes i averageRating
                  serie.numVotes = (serie.numVotes ?? 0) + 1;
                  serie.averageRating = (
                    ((serie.averageRating ?? 0) * (serie.numVotes - 1) + selectedRating) / serie.numVotes
                  ).toFixed(1); // Arrodonir a 1 decimal

                  // 🔄 Actualitzar visualment la targeta (si cal)
                  //const updatedStars = '★'.repeat(Math.round(serie.averageRating)) + '☆'.repeat(5 - Math.round(serie.averageRating));
                  
                  const ratingOutOfFive = (serie.averageRating / 10) * 5;
                  const fullStars = Math.floor(ratingOutOfFive);
                  const hasHalfStar = ratingOutOfFive % 1 >= 0.5;
                  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

                  const updatedStars =
                    '★'.repeat(fullStars) +
                    (hasHalfStar ? '⯪' : '') + // pots substituir '⯨'per una icona que representi mitja estrella
                    '☆'.repeat(emptyStars);

                  card.querySelector('p.text-yellow-500').textContent = updatedStars;
                  card.querySelector('p.text-gray-700').textContent = `${serie.averageRating} / 10`;
                  card.querySelector('p.text-gray-500').textContent = `🗳️ ${serie.numVotes} vots`;

                  // 🔄 Actualitzar també el contingut del modal
                  modalInfo.innerHTML = `
                    <strong>Tipus:</strong> ${serie.titleType ?? '—'}<br>
                    <strong>Any:</strong> ${serie.startYear ?? '—'}<br>
                    <strong>Gèneres:</strong> ${Array.isArray(serie.genres) ? serie.genres.join(', ') : (serie.genres?.replace(/^\{|\}$/g, '') ?? '—')}<br>
                    <strong>Puntuació mitjana:</strong> ${serie.averageRating}<br>
                    <strong>Vots:</strong> ${serie.numVotes}<br><br>
                    <a href="https://www.google.com/search?q=${encodeURIComponent(item[field])}" target="_blank" class="bg-gray-100 text-indigo-700 px-3 py-1 rounded inline-block mt-2 hover:bg-gray-200">
                      🔎 Consulta a Google
                    </a>
                    `;
                  modal.classList.add('hidden');                
                } else {
                  alert("Si us plau, selecciona una valoració entre 0 i 10.");
                }
              };
            });
            seriesCarousel.appendChild(card);
        });
        };
          
        document.getElementById("nextBtnS").addEventListener("click", () => {
          if (currentPage < 1) {
            currentPage++;
            seriesCarousel.style.transform = `translateX(-${itemsPerPage * cardWidth}px)`;
          }
        });

        document.getElementById("prevBtnS").addEventListener("click", () => {
          if (currentPage > 0) {
            currentPage--;
            seriesCarousel.style.transform = `translateX(-${currentPage * itemsPerPage * cardWidth}px)`;
          }
        });

        document.addEventListener("DOMContentLoaded", loadSeries);

        //loadSeries();
        
      

      document.addEventListener("DOMContentLoaded", () => {
        const btnMovies = document.getElementById("btnMovies");
        const btnSeries = document.getElementById("btnSeries");
        const sortSelect = document.getElementById("sortSelect");
        const genreSelect = document.getElementById("genreSelect");
        const mediaGrid = document.getElementById("mediaGrid");

        let currentType = "movie";

        const loadMedia = async () => {
          mediaGrid.innerHTML = "";

          const { data, error } = await supabase
            .from("br1")
            .select("primaryTitle, startYear, genres, averageRating, numVotes, titleType")
            .eq("titleType", currentType)
            .gt("numVotes", 10000)
            .limit(100); // obtenim més per poder filtrar

          if (error) {
            console.error("Error carregant dades:", error);
            return;
          }

          let filtered = data;

          // Filtrar per gènere
          const selectedGenre = genreSelect.value;
          if (selectedGenre) {
            filtered = filtered.filter(item =>
              item.genres?.toLowerCase().includes(selectedGenre.toLowerCase())
            );
          }

          // Ordenar
          const sort = sortSelect.value;
          if (sort === "rating") {
            filtered.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
          } else if (sort === "az") {
            filtered.sort((a, b) => (a.primaryTitle ?? "").localeCompare(b.primaryTitle ?? ""));
          } else if (sort === "za") {
            filtered.sort((a, b) => (b.primaryTitle ?? "").localeCompare(a.primaryTitle ?? ""));
          }

          // Mostrar màxim 20
          filtered.slice(0, 20).forEach(item => {
            
            const ratingOutOfFive = (item.averageRating / 10) * 5;
            const fullStars = Math.floor(ratingOutOfFive);
            const hasHalfStar = ratingOutOfFive % 1 >= 0.5;
            const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

            const updatedStars =
             '★'.repeat(fullStars) +
              (hasHalfStar ? '⯪' : '') + // pots substituir '⯨', '⯪' per una icona que representi mitja estrella
              '☆'.repeat(emptyStars);

            const card = document.createElement("div");
            card.className = "bg-white rounded-lg p-4 shadow text-center hover:scale-105 transition cursor-pointer";
            
            const imageSrc = currentType === "movie" ? "/assets/movies.jpg" : "/assets/series.png";

            card.innerHTML = `
              <img src="${imageSrc}" alt="${item.primaryTitle}" class="w-full h-40 object-cover rounded mb-2" />
              <h3 class="text-sm font-bold text-indigo-700">${item.primaryTitle}</h3>
              <p class="text-yellow-500">${updatedStars}</p>
              <p class="text-xs text-gray-600">${item.averageRating ?? '—'} / 10</p>
              <p class="text-xs text-gray-500">${item.startYear ?? '—'}</p>
            `;

            card.addEventListener('click', () => {
              modalTitle.textContent = item.primaryTitle;
              modalInfo.innerHTML = `
                <strong>Tipus:</strong> ${item.titleType ?? '—'}<br>
                <strong>Any:</strong> ${item.startYear ?? '—'}<br>
                <strong>Gèneres:</strong> ${Array.isArray(item.genres) ? item.genres.join(', ') : (item.genres?.replace(/^\{|\}$/g, '') ?? '—')}<br>
                <strong>Puntuació mitjana:</strong> ${item.averageRating ?? '—'}<br>
                <strong>Vots:</strong> ${item.numVotes ?? '—'}<br><br>
                <a href="https://www.google.com/search?q=${encodeURIComponent(item.primaryTitle)}" target="_blank" class="bg-gray-100 text-indigo-700 px-3 py-1 rounded inline-block mt-2 hover:bg-gray-200">
                    🔎 Consulta a Google
                </a>
                `;
              modal.classList.remove('hidden');

                // ✍️ Enviar valoració
  
              const ratingButtonsContainer = document.getElementById('ratingButtons');
              ratingButtonsContainer.innerHTML = ''; // netejar abans de crear

              let selectedRating = null;

              for (let i = 1; i <= 10; i++) {
                const btn = document.createElement('button');
                btn.textContent = i;
                btn.className = 'px-3 py-1 border rounded hover:bg-indigo-100';
                btn.onclick = () => {
                  selectedRating = i;
                  document.querySelectorAll('#ratingButtons button').forEach(b => b.classList.remove('bg-indigo-300'));
                  btn.classList.add('bg-indigo-300');
                };
                ratingButtonsContainer.appendChild(btn);
              }

              document.getElementById('submitRating').onclick = () => {
                if (selectedRating !== null) {
                  alert(`Has valorat l'obra amb un ${selectedRating}/10!`);
                  modal.classList.add('hidden');
                   // 🔢 Actualitzar numVotes i averageRating
                  item.numVotes = (item.numVotes ?? 0) + 1;
                  item.averageRating = (
                    ((item.averageRating ?? 0) * (item.numVotes - 1) + selectedRating) / item.numVotes
                  ).toFixed(1); // Arrodonir a 1 decimal

                  // 🔄 Actualitzar visualment la targeta (si cal)
                  //const updatedStars = '★'.repeat(Math.round(item.averageRating)) + '☆'.repeat(5 - Math.round(item.averageRating));
                  const updatedStars =
                    '★'.repeat(fullStars) +
                    (hasHalfStar ? '⯨' : '') + // pots substituir '⯨' per una icona que representi mitja estrella
                    '☆'.repeat(emptyStars);
                  
                  const ratingOutOfFive = (item.averageRating / 10) * 5;
                  const fullStars = Math.floor(ratingOutOfFive);
                  const hasHalfStar = ratingOutOfFive % 1 >= 0.5;
                  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

                  

                  card.querySelector('p.text-yellow-500').textContent = updatedStars;
                  card.querySelector('p.text-gray-700').textContent = `${item.averageRating} / 10`;
                  card.querySelector('p.text-gray-500').textContent = `🗳️ ${item.numVotes} vots`;

                  // 🔄 Actualitzar també el contingut del modal
                  modalInfo.innerHTML = `
                    <strong>Tipus:</strong> ${item.titleType ?? '—'}<br>
                    <strong>Any:</strong> ${item.startYear ?? '—'}<br>
                    <strong>Gèneres:</strong> ${Array.isArray(item.genres) ? item.genres.join(', ') : (item.genres?.replace(/^\{|\}$/g, '') ?? '—')}<br>
                    <strong>Puntuació mitjana:</strong> ${item.averageRating}<br>
                    <strong>Vots:</strong> ${item.numVotes}<br><br>
                    <a href="https://www.google.com/search?q=${encodeURIComponent(item[field])}" target="_blank" class="bg-gray-100 text-indigo-700 px-3 py-1 rounded inline-block mt-2 hover:bg-gray-200">
                      🔎 Consulta a Google
                    </a>
                    `;
                  modal.classList.add('hidden');                
                } else {
                  alert("Si us plau, selecciona una valoració entre 0 i 10.");
                }
              };
            });

            mediaGrid.appendChild(card);
          });
        };

        // Event listeners
        btnMovies.addEventListener("click", () => {
          currentType = "movie";
          loadMedia();
        });

        btnSeries.addEventListener("click", () => {
          currentType = "tvSeries";
          loadMedia();
        });

        sortSelect.addEventListener("change", loadMedia);
        genreSelect.addEventListener("change", loadMedia);

        // Carrega inicial
        loadMedia();
      });

      document.addEventListener("DOMContentLoaded", () => {
        const btnTop10 = document.getElementById("showTop10");
        const btnExplorer = document.getElementById("showExplorer");

        const top10 = document.getElementById("top10Section");
        const series = document.getElementById("seriesSection");
        const explorer = document.getElementById("explorerSection");

        btnTop10.addEventListener("click", () => {
          top10.style.display = "block";
          series.style.display = "block";
          explorer.style.display = "none";
        });

        btnExplorer.addEventListener("click", () => {
          top10.style.display = "none";
          series.style.display = "none";
          explorer.style.display = "block";
        });

        // Opcional: mostrar només Top 10 per defecte
        btnTop10.click();
      });