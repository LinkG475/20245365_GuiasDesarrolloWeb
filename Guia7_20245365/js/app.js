const API_CONFIG = {
  BASE_URL: 'https://free-to-play-games-database.p.rapidapi.com/api',
  HEADERS: {
    'x-rapidapi-key': 'f7b78f38c6msh6200aca71c98009p1a8b2ajsn27712a965ec3',
    'x-rapidapi-host': 'free-to-play-games-database.p.rapidapi.com'
  }
};

// Estado local para búsqueda instantánea sin saturar la cuota de la API
let currentGamesList = [];

// Referencias al DOM
const gamesGrid = document.getElementById('gamesGrid');
const resultsCount = document.getElementById('resultsCount');
const feedbackContainer = document.getElementById('feedbackContainer');
const retryBtn = document.getElementById('retryBtn');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const detailModal = document.getElementById('detailModal');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModalBtn');


async function fetchFromRapidAPI(endpointPath) {
  const response = await fetch(`${API_CONFIG.BASE_URL}${endpointPath}`, {
    method: 'GET',
    headers: API_CONFIG.HEADERS
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Clave de RapidAPI inválida o no suscrita al plan gratuito (HTTP 401/403).');
    }
    if (response.status === 429) {
      throw new Error('Se alcanzó el límite de peticiones del plan gratuito (HTTP 429).');
    }
    throw new Error(`Error en el servidor de la API (Código HTTP: ${response.status}).`);
  }

  return await response.json();
}

/**
 * ENDPOINT 1: Listado de recursos (/games o /games?category=...)
 */
async function loadGamesList(category = '') {
  renderSkeletonLoaders(8);
  hideFeedback();
  resultsCount.textContent = 'Consultando listado de recursos en RapidAPI...';

  try {
    const queryParam = category ? `/games?category=${encodeURIComponent(category)}` : '/games';
    const data = await fetchFromRapidAPI(queryParam);

    // Guardamos los primeros 36 elementos para un renderizado ágil
    currentGamesList = data.slice(0, 36);
    renderGamesGrid(currentGamesList);
  } catch (error) {
    gamesGrid.innerHTML = '';
    resultsCount.textContent = 'Error al cargar el catálogo.';
    showFeedback(error.message);
  }
}

/**
 * ENDPOINT 2: Detalle de un recurso específico (/game?id={id})
 */
async function loadGameDetails(gameId) {
  detailModal.showModal();
  modalContent.innerHTML = `
    <div style="padding: 2.5rem; text-align: center;">
      <p>Cargando información detallada del recurso #${gameId}...</p>
    </div>
  `;

  try {
    const detail = await fetchFromRapidAPI(`/game?id=${encodeURIComponent(gameId)}`);
    renderGameDetailModal(detail);
  } catch (error) {
    modalContent.innerHTML = `
      <div class="feedback-box">
        <h3>No se pudo obtener el detalle del recurso</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
}

/**
 * Renderiza las tarjetas del listado en el DOM
 */
function renderGamesGrid(games) {
  gamesGrid.innerHTML = '';

  if (games.length === 0) {
    resultsCount.textContent = '0 resultados encontrados.';
    gamesGrid.innerHTML = `<p>No se encontraron elementos con ese criterio.</p>`;
    return;
  }

  resultsCount.textContent = `Mostrando ${games.length} recursos disponibles`;

  const fragment = document.createDocumentFragment();

  games.forEach((game) => {
    const article = document.createElement('article');
    article.className = 'card';
    article.innerHTML = `
      <img class="card-img" src="${game.thumbnail}" alt="${game.title}" loading="lazy">
      <div class="card-body">
        <div class="card-tags">
          <span class="tag">${game.genre}</span>
          <span>${game.platform}</span>
        </div>
        <h2 class="card-title">${game.title}</h2>
        <p class="card-desc">${game.short_description}</p>
        <button class="btn-primary" data-id="${game.id}">Ver ficha técnica</button>
      </div>
    `;
    fragment.appendChild(article);
  });

  gamesGrid.appendChild(fragment);
}

/**
 * Renderiza la respuesta del Endpoint 2 dentro del modal sin recargar la página
 */
function renderGameDetailModal(game) {
  const sysReq = game.minimum_system_requirements;
  const screenshotsHTML = (game.screenshots || [])
    .slice(0, 3)
    .map((s) => `<img src="${s.image}" alt="Captura de ${game.title}" loading="lazy">`)
    .join('');

  modalContent.innerHTML = `
    <img class="detail-banner" src="${game.thumbnail}" alt="${game.title}">
    <span class="tag">${game.genre}</span>
    <h2 style="font-size: 1.7rem; margin: 0.5rem 0;">${game.title}</h2>
    <p style="color: var(--text-muted); margin-bottom: 1rem;">${game.description}</p>

    <div class="specs-grid">
      <div><strong>Desarrollador:</strong><br>${game.developer}</div>
      <div><strong>Publicador:</strong><br>${game.publisher}</div>
      <div><strong>Lanzamiento:</strong><br>${game.release_date}</div>
      <div><strong>Estado:</strong><br>${game.status}</div>
    </div>

    ${sysReq ? `
      <h3 style="margin-top: 1rem;">Requisitos mínimos del sistema</h3>
      <div class="specs-grid">
        <div><strong>SO:</strong> ${sysReq.os || 'N/A'}</div>
        <div><strong>Procesador:</strong> ${sysReq.processor || 'N/A'}</div>
        <div><strong>Memoria:</strong> ${sysReq.memory || 'N/A'}</div>
        <div><strong>Gráficos:</strong> ${sysReq.graphics || 'N/A'}</div>
      </div>
    ` : ''}

    ${screenshotsHTML ? `
      <h3 style="margin-top: 1rem;">Capturas del recurso</h3>
      <div class="screenshots-row">${screenshotsHTML}</div>
    ` : ''}

    <div style="margin-top: 1.5rem;">
      <a href="${game.game_url}" target="_blank" rel="noopener" class="btn-primary" style="display:inline-block; text-align:center; text-decoration:none;">
        Visitar sitio oficial
      </a>
    </div>
  `;
}

/**
 * Utilidades de interfaz para estados de carga y errores
 */
function renderSkeletonLoaders(count = 8) {
  gamesGrid.innerHTML = Array.from({ length: count })
    .map(() => `<div class="skeleton" aria-hidden="true"></div>`)
    .join('');
}

function showFeedback(message) {
  feedbackContainer.textContent = `⚠️ ${message}`;
  feedbackContainer.classList.remove('hidden');
  retryBtn.classList.remove('hidden');
}

function hideFeedback() {
  feedbackContainer.classList.add('hidden');
  retryBtn.classList.add('hidden');
}

/**
 * Eventos de la interfaz (Delegación de eventos para no recargar la página)
 */
gamesGrid.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-id]');
  if (!button) return;
  loadGameDetails(button.dataset.id);
});

categorySelect.addEventListener('change', (event) => {
  searchInput.value = '';
  loadGamesList(event.target.value);
});

searchInput.addEventListener('input', (event) => {
  const term = event.target.value.toLowerCase().trim();
  const filtered = currentGamesList.filter((game) =>
    game.title.toLowerCase().includes(term) ||
    game.genre.toLowerCase().includes(term)
  );
  renderGamesGrid(filtered);
});

retryBtn.addEventListener('click', () => loadGamesList(categorySelect.value));
closeModalBtn.addEventListener('click', () => detailModal.close());
detailModal.addEventListener('click', (event) => {
  if (event.target === detailModal) detailModal.close();
});

// Inicialización al cargar el documento
document.addEventListener('DOMContentLoaded', () => loadGamesList());