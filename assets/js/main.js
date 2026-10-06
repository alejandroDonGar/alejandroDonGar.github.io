    const GITHUB_USERNAME = 'alejandroDonGar';
    const API_REPOS = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;
    const reposPerPage = 4;
    const CACHE_MINUTES = 30;

    let currentLang = 'es';
    let showcaseRepos = [];   // proyectos propios (topic "showcase")
    let courseRepos = [];     // repositorios de asignaturas
    let activeTab = 'showcase';
    let currentPage = 1;

    // Devuelve el texto en el idioma actual: t('Hola', 'Hello')
    const t = (es, en) => (currentLang === 'en' ? en : es);

    // ------------------------------------------------------------------
    // Idiomas (ES / EN)
    // Los textos traducibles llevan el inglés en data-en. El español
    // original se guarda en data-es la primera vez que se cambia.
    // ------------------------------------------------------------------
    function switchLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-en]').forEach(el => {
            if (el.dataset.es === undefined) el.dataset.es = el.innerHTML;
            el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.es;
        });

        document.querySelectorAll('[data-en-title]').forEach(el => {
            if (el.dataset.esTitle === undefined) el.dataset.esTitle = el.getAttribute('aria-label') || '';
            const label = lang === 'en' ? el.dataset.enTitle : el.dataset.esTitle;
            el.setAttribute('aria-label', label);
            el.title = label;
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        try { localStorage.setItem('lang', lang); } catch (e) { /* sin almacenamiento */ }

        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        setTheme(currentTheme);

        if (showcaseRepos.length || courseRepos.length) updatePagination();
    }

    // ------------------------------------------------------------------
    // Caché de la API de GitHub (sessionStorage)
    // GitHub permite 60 peticiones/hora sin autenticar: guardamos las
    // respuestas un rato para no repetirlas en cada página o idioma.
    // ------------------------------------------------------------------
    async function fetchJsonCached(url) {
        const key = `gh-cache:${url}`;
        try {
            const saved = JSON.parse(sessionStorage.getItem(key));
            if (saved && Date.now() - saved.time < CACHE_MINUTES * 60000) return saved.data;
        } catch (e) { /* caché no disponible o corrupta */ }

        const response = await fetch(url);
        if (!response.ok) {
            if (response.status === 403) throw new Error(t('Límite de la API de GitHub alcanzado. Espera unos minutos.', 'GitHub API rate limit reached. Please wait a few minutes.'));
            throw new Error(t(`GitHub respondió con estado ${response.status}`, `GitHub responded with status ${response.status}`));
        }

        const data = await response.json();
        try { sessionStorage.setItem(key, JSON.stringify({ time: Date.now(), data })); } catch (e) { /* sin espacio */ }
        return data;
    }

    async function fetchGitHubData() {
        const container = document.getElementById('repos-container');
        if (!container) return;

        container.innerHTML = `<div style="text-align:center; padding:4rem;"><i class="fa-solid fa-circle-notch fa-spin fa-2x"></i><p style="margin-top:1rem;">${t('Conectando con GitHub...', 'Connecting to GitHub...')}</p></div>`;

        try {
            const data = await fetchJsonCached(API_REPOS);
            if (!Array.isArray(data)) throw new Error(t('La respuesta de la API no es válida.', 'Invalid API response.'));

            const repos = data
                .filter(repo => repo.name.toLowerCase() !== 'alejandrodongar.github.io' && !repo.fork)
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

            // Pestañas: proyectos propios (topic "showcase") y asignaturas (el resto)
            showcaseRepos = repos.filter(repo => (repo.topics || []).includes('showcase'));
            courseRepos = repos.filter(repo => !(repo.topics || []).includes('showcase'));

            if (repos.length === 0) {
                container.innerHTML = `<div style="text-align:center; padding:2rem;">${t('No se encontraron repositorios públicos.', 'No public repositories found.')}</div>`;
                return;
            }

            if (showcaseRepos.length === 0) activeTab = 'course';
            currentPage = 1;
            updatePagination();
        } catch (error) {
            console.error('Error al cargar GitHub:', error);
            container.innerHTML = `
                <div style="text-align:center; padding:3rem; background: rgba(239, 68, 68, 0.1); border-radius: 20px; border: 1px solid rgba(239, 68, 68, 0.2);">
                    <i class="fa-solid fa-triangle-exclamation fa-3x" style="color:#ef4444;"></i>
                    <h3 style="margin-top:1.5rem;">${t('No se pudieron cargar los proyectos', 'Projects could not be loaded')}</h3>
                    <p style="opacity:0.8; margin: 1rem 0;">${error.message}</p>
                    <button onclick="location.reload()" class="btn btn-primary" style="background:#ef4444;">
                        <i class="fa-solid fa-rotate"></i> ${t('Intentar de nuevo', 'Try again')}
                    </button>
                </div>
            `;
        }
    }

    function activeRepos() {
        return activeTab === 'showcase' ? showcaseRepos : courseRepos;
    }

    function updatePagination() {
        const repos = activeRepos();
        const totalPages = Math.max(1, Math.ceil(repos.length / reposPerPage));
        currentPage = Math.min(currentPage, totalPages);
        const start = (currentPage - 1) * reposPerPage;

        renderRepos(repos.slice(start, start + reposPerPage));

        document.querySelectorAll('.projects-tab').forEach(tab => {
            const selected = tab.dataset.tab === activeTab;
            tab.classList.toggle('active', selected);
            tab.setAttribute('aria-selected', selected);
        });
        document.querySelector('[data-tab="showcase"] .projects-tab-count').textContent = showcaseRepos.length;
        document.querySelector('[data-tab="course"] .projects-tab-count').textContent = courseRepos.length;

        document.getElementById('page-info').textContent = `${t('Página', 'Page')} ${currentPage} / ${totalPages}`;
        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = currentPage === totalPages;
    }

    document.querySelectorAll('.projects-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            activeTab = tab.dataset.tab;
            currentPage = 1;
            updatePagination();
        });
    });

    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        const totalPages = Math.ceil(activeRepos().length / reposPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        }
    });

    function isNetScannerRepo(repo) {
        const normalizedName = repo.name.toLowerCase();
        const topics = (repo.topics || []).map(topic => topic.toLowerCase());

        return (
            normalizedName.includes('escaner-de-red-netscanner') ||
            normalizedName.includes('netscanner') ||
            (topics.includes('scapy') && topics.includes('nmap')) ||
            (topics.includes('scapy') && topics.includes('django'))
        );
    }

    function isCentroPlusRepo(repo) {
        const normalizedName = repo.name.toLowerCase();
        const topics = (repo.topics || []).map(topic => topic.toLowerCase());

        return (
            normalizedName.includes('centroplus-connect') ||
            normalizedName.includes('centroplus') ||
            (topics.includes('spring') && topics.includes('javafx')) ||
            (topics.includes('swagger') && topics.includes('junit'))
        );
    }


    function isGitHubProfileRepo(repo) {
        const normalizedName = repo.name.toLowerCase();
        return normalizedName === 'alejandrodongar';
    }

    function isEtsDamRepo(repo) {
        const normalizedName = repo.name.toLowerCase();
        return normalizedName === 'etsdam_alejandro' || normalizedName.includes('etsdam');
    }

    function isZeeBoardRepo(repo) {
        const normalizedName = repo.name.toLowerCase();
        const topics = (repo.topics || []).map(topic => topic.toLowerCase());

        return (
            normalizedName.includes('zeeboard') ||
            normalizedName.includes('zee-board') ||
            (topics.includes('commissions') && topics.includes('kanban')) ||
            (topics.includes('tauri-app') && topics.includes('typescript')) ||
            (topics.includes('react') && topics.includes('sqlite') && topics.includes('typescript'))
        );
    }

    function isPmdmRepo(repo) {
        const normalizedName = repo.name.toLowerCase();
        return normalizedName.includes('programacion-multimedia') || normalizedName.includes('pokedex');
    }

    // Preview de Programación Multimedia: de momento muestra la Mini-Pokédex retro (UT1)
    function createPokedexPreview() {
        const sprite = (id, back) =>
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${back ? 'back/' : ''}${id}.png`;

        const cards = [
            { id: 4, name: 'Charmander' },
            { id: 5, name: 'Charmeleon' },
            { id: 6, name: 'Charizard' }
        ].map(({ id, name }) => `
            <div class="pokedex-card">
                <small>Nº${String(id).padStart(3, '0')}</small>
                <span class="pokedex-sprite">
                    <img class="sprite-back" src="${sprite(id, true)}" alt="${name} de espaldas" loading="lazy">
                    <img class="sprite-front" src="${sprite(id, false)}" alt="${name} de frente" loading="lazy">
                </span>
                <strong>${name}</strong>
                <span class="pokedex-type type-fire">Fire</span>
            </div>
        `).join('');

        return `
            <div class="repo-pokedex-preview" aria-label="Preview visual de la Mini-Pokédex retro: PokéAPI, búsqueda, filtros y panel de detalles">
                <div class="pokedex-topbar">
                    <span class="pokedex-ball" aria-hidden="true"></span>
                    <strong>MINI-POKéDEX</strong>
                    <small>UT1 · en curso</small>
                </div>

                <div class="pokedex-body">
                    <div class="pokedex-grid-zone">
                        <div class="pokedex-search" aria-hidden="true">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <span class="pokedex-query">char<span class="pokedex-caret"></span></span>
                            <span class="pokedex-filter">FIRE ▾</span>
                        </div>
                        <div class="pokedex-cards">${cards}</div>
                    </div>

                    <div class="pokedex-panel" aria-hidden="true">
                        <small>Nº006</small>
                        <strong>CHARIZARD</strong>
                        <div class="pokedex-panel-types">
                            <span class="pokedex-type type-fire">Fire</span>
                            <span class="pokedex-type type-flying">Flying</span>
                        </div>
                        <div class="pokedex-stat"><span>PS</span><i style="--v: 39%"></i></div>
                        <div class="pokedex-stat"><span>ATQ</span><i style="--v: 42%"></i></div>
                        <div class="pokedex-stat"><span>AT.E</span><i style="--v: 55%"></i></div>
                        <div class="pokedex-stat"><span>VEL</span><i style="--v: 50%"></i></div>
                    </div>
                </div>

                <div class="pokedex-stack" aria-label="Tecnologías de la Mini-Pokédex">
                    <span><i class="fa-brands fa-html5"></i> HTML</span>
                    <span><i class="fa-brands fa-css3-alt"></i> CSS</span>
                    <span><i class="fa-brands fa-js"></i> JavaScript</span>
                    <span><i class="fa-solid fa-plug"></i> PokéAPI</span>
                    <span><i class="fa-solid fa-arrows-rotate"></i> fetch · Promise.all</span>
                    <span><i class="fa-solid fa-window-restore"></i> &lt;dialog&gt;</span>
                </div>
            </div>
        `;
    }

    function createGitHubProfilePreview() {
        return `
            <div class="repo-profile-readme-preview" aria-label="Preview visual del README principal de GitHub">
                <div class="repo-profile-topbar">
                    <span>alejandroDonGar / README.md</span>
                    <i class="fa-solid fa-pen"></i>
                </div>

                <div class="repo-profile-readme-body">
                    <div class="repo-profile-avatar-wrap">
                        <div class="repo-profile-avatar">
                            <i class="fa-solid fa-user-astronaut"></i>
                        </div>
                        <span class="repo-profile-status-dot"></span>
                    </div>

                    <div class="repo-profile-content">
                        <div class="repo-profile-heading-row">
                            <div>
                                <h4>Hola, soy Alejandro Donate García 👋</h4>
                                <p>Estudiante DAM · Java · SQL · Web</p>
                            </div>
                        </div>

                        <div class="repo-profile-lines">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <div class="repo-profile-techs" aria-label="Tecnologías del perfil GitHub">
                            <span><i class="fa-brands fa-java"></i></span>
                            <span><i class="fa-solid fa-database"></i></span>
                            <span><i class="fa-brands fa-html5"></i></span>
                            <span><i class="fa-brands fa-css3-alt"></i></span>
                            <span><i class="fa-brands fa-js"></i></span>
                            <span><i class="fa-brands fa-github"></i></span>
                        </div>

                        <div class="repo-profile-meta-grid" aria-label="Resumen del perfil GitHub">
                            <div><strong>10+</strong><small>Repos</small></div>
                            <div><strong>Open</strong><small>Source</small></div>
                            <div><strong>C1</strong><small>Inglés</small></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function createEtsDamPreview() {
        return `
            <div class="repo-ets-terminal-preview" aria-label="Preview visual de Entornos de Desarrollo: terminal y workflow">
                <div class="repo-ets-terminal-header">
                    <div class="repo-ets-window-dots" aria-hidden="true">
                        <span></span><span></span><span></span>
                    </div>
                    <span><i class="fa-solid fa-terminal"></i> etsdam_alejandro</span>
                    <small>dev workflow</small>
                </div>

                <div class="repo-ets-terminal-body">
                    <div class="repo-ets-terminal-lines">
                        <p><span class="repo-ets-prompt">alejandro@etsdam</span>:~$ git status</p>
                        <p><i class="fa-solid fa-check"></i> rama main sincronizada</p>
                        <p><span class="repo-ets-prompt">alejandro@etsdam</span>:~$ mvn test</p>
                        <p><i class="fa-solid fa-check"></i> build success · tests passed</p>
                        <p><span class="repo-ets-prompt">alejandro@etsdam</span>:~$ git push origin main<span class="repo-ets-cursor">_</span></p>
                    </div>

                    <div class="repo-ets-flow" aria-hidden="true">
                        <span class="repo-ets-flow-line"></span>
                        <span class="repo-ets-flow-pulse"></span>

                        <div class="repo-ets-flow-node node-docs">
                            <i class="fa-solid fa-file-lines"></i>
                            <small>Docs</small>
                        </div>
                        <div class="repo-ets-flow-node node-git">
                            <i class="fa-brands fa-git-alt"></i>
                            <small>Git</small>
                        </div>
                        <div class="repo-ets-flow-node node-ide">
                            <i class="fa-solid fa-code"></i>
                            <small>IDE</small>
                        </div>
                        <div class="repo-ets-flow-node node-debug">
                            <i class="fa-solid fa-bug"></i>
                            <small>Debug</small>
                        </div>
                        <div class="repo-ets-flow-node node-test">
                            <i class="fa-solid fa-vial"></i>
                            <small>Tests</small>
                        </div>
                        <div class="repo-ets-flow-node node-opt">
                            <i class="fa-solid fa-bolt"></i>
                            <small>Opt</small>
                        </div>
                    </div>
                </div>

                <div class="repo-ets-tags">
                    <span>Git</span>
                    <span>GitHub</span>
                    <span>Maven</span>
                    <span>JUnit</span>
                    <span>UML</span>
                    <span>Optimización</span>
                </div>
            </div>
        `;
    }

    function createNetScannerWavePreview() {
        return `
            <div class="repo-wave-preview" aria-label="Animación de olas inspirada en NetScanner">
                <div class="repo-wave-label">
                    <i class="fa-solid fa-water"></i>
                    NetScanner scan
                </div>

                <div class="repo-wave-scene">
                    <div class="repo-pulse-glow repo-pulse-glow-1"></div>
                    <div class="repo-pulse-glow repo-pulse-glow-2"></div>

                    <div class="repo-network-overlay" aria-hidden="true">
                        <div class="repo-network-router">
                            <i class="fa-solid fa-wifi"></i>
                            <span>192.168.1.1</span>
                        </div>

                        <div class="repo-network-device repo-device-laptop">
                            <i class="fa-solid fa-laptop"></i>
                            <strong>DESKTOP-A12</strong>
                            <span>192.168.1.24</span>
                            <small>MAC · 3C:52</small>
                        </div>

                        <div class="repo-network-device repo-device-phone">
                            <i class="fa-solid fa-mobile-screen-button"></i>
                            <strong>Galaxy-S23</strong>
                            <span>192.168.1.37</span>
                            <small>MAC · A8:09</small>
                        </div>

                        <div class="repo-network-device repo-device-printer">
                            <i class="fa-solid fa-print"></i>
                            <strong>HP-OfficeJet</strong>
                            <span>192.168.1.52</span>
                            <small>MAC · E4:7B</small>
                        </div>

                        <div class="repo-scan-status">
                            <span class="repo-scan-dot"></span>
                            6 hosts online · ARP scan complete
                        </div>
                    </div>

                    <div class="repo-floating-tech repo-tech-python" title="Python">
                        <i class="fa-brands fa-python"></i>
                    </div>
                    <div class="repo-floating-tech repo-tech-mongodb" title="MongoDB">
                        <i class="fa-solid fa-leaf"></i>
                    </div>
                    <div class="repo-floating-tech repo-tech-django" title="Django">
                        <i class="fa-solid fa-server"></i>
                    </div>
                    <div class="repo-floating-tech repo-tech-scapy" title="Scapy">
                        <i class="fa-solid fa-network-wired"></i>
                    </div>

                    <div class="repo-liquid-layer repo-liquid-back">
                        <div class="repo-wave-track repo-wave-track-1">
                            <svg class="repo-wave-svg" viewBox="0 0 2880 1000" preserveAspectRatio="none">
                                <path d="M0,70 C240,20 480,20 720,70 C960,120 1200,120 1440,70 C1680,20 1920,20 2160,70 C2400,120 2640,120 2880,70 L2880,1000 L0,1000 Z"></path>
                            </svg>
                        </div>
                    </div>

                    <div class="repo-liquid-layer repo-liquid-mid">
                        <div class="repo-wave-track repo-wave-track-2">
                            <svg class="repo-wave-svg" viewBox="0 0 2880 1000" preserveAspectRatio="none">
                                <path d="M0,70 C240,40 480,40 720,70 C960,100 1200,100 1440,70 C1680,40 1920,40 2160,70 C2400,100 2640,100 2880,70 L2880,1000 L0,1000 Z"></path>
                            </svg>
                        </div>
                    </div>

                    <div class="repo-liquid-layer repo-liquid-front">
                        <div class="repo-wave-track repo-wave-track-3">
                            <svg class="repo-wave-svg" viewBox="0 0 2880 1000" preserveAspectRatio="none">
                                <path d="M0,75 C240,55 480,55 720,75 C960,95 1200,95 1440,75 C1680,55 1920,55 2160,75 C2400,95 2640,95 2880,75 L2880,1000 L0,1000 Z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function createZeeBoardPreview() {
        return `
            <div class="repo-zeeboard-preview" aria-label="Preview visual de ZeeBoard: gestor de comisiones tipo kanban">
                <div class="zeeboard-window">
                    <nav class="zeeboard-mini-sidebar" aria-hidden="true">
                        <div class="zeeboard-brand-row">
                            <div class="zeeboard-logo"><i class="fa-solid fa-feather-pointed"></i></div>
                            <div>
                                <strong>ZeeBoard</strong>
                                <span>Commission workspace</span>
                            </div>
                        </div>

                        <span class="active">Commissions</span>
                        <span>Clients</span>
                        <span>Tags</span>
                        <span>Templates</span>
                    </nav>

                    <div class="zeeboard-board-area">
                        <header class="zeeboard-header">
                            <div>
                                <small>Main workspace</small>
                                <strong>Commissions</strong>
                                <span>Organiza encargos, clientes, fechas y etiquetas.</span>
                            </div>
                            <button type="button">+ New</button>
                        </header>

                        <div class="zeeboard-metrics" aria-hidden="true">
                            <div><small>Total earned</small><strong>700€</strong></div>
                            <div><small>Active</small><strong>3</strong></div>
                            <div><small>Unpaid</small><strong>1</strong></div>
                        </div>

                        <div class="zeeboard-preview-main" aria-hidden="true">
                            <div class="zeeboard-kanban">
                                <section class="zeeboard-column">
                                    <div class="zeeboard-column-title"><span class="dot sketch"></span> Sketch</div>
                                    <article class="zeeboard-commission-card">
                                        <div class="zeeboard-card-top">
                                            <strong>Commission #01</strong>
                                            <span class="payment unpaid">Not paid</span>
                                        </div>
                                        <p>2 characters · render</p>
                                        <div class="zeeboard-thumb-lines"><span></span><span></span><span></span></div>
                                        <div class="zeeboard-progress-row"><span>33%</span><div><em style="width:33%"></em></div></div>
                                    </article>
                                </section>

                                <section class="zeeboard-column">
                                    <div class="zeeboard-column-title"><span class="dot lineart"></span> Lineart</div>
                                    <article class="zeeboard-commission-card focused">
                                        <div class="zeeboard-card-top">
                                            <strong>Commission #02</strong>
                                            <span class="payment paid">Paid</span>
                                        </div>
                                        <p>1 character · background</p>
                                        <div class="zeeboard-thumb-lines"><span></span><span></span><span></span></div>
                                        <div class="zeeboard-progress-row"><span>60%</span><div><em style="width:60%"></em></div></div>
                                    </article>
                                </section>
                            </div>

                            <aside class="zeeboard-calendar-card">
                                <small>Calendar</small>
                                <strong>Jun 2026</strong>
                                <div class="zeeboard-days">
                                    <span>24</span>
                                    <span class="today">25</span>
                                    <span class="due">26</span>
                                    <span>27</span>
                                    <span>28</span>
                                </div>
                                <div class="zeeboard-deadline">23 days left</div>
                            </aside>
                        </div>

                        <footer class="zeeboard-stack" aria-label="Stack de ZeeBoard">
                            <span>TypeScript</span>
                            <span>React</span>
                            <span>Tauri</span>
                            <span>Rust</span>
                            <span>SQLite</span>
                            <span>Node.js</span>
                            <span>Drag & Drop</span>
                        </footer>
                    </div>
                </div>
            </div>
        `;
    }

    function createCentroPlusApiPreview() {
        return `
            <div class="repo-centroplus-connect-preview" aria-label="Preview visual de CentroPlus Connect: dashboard, API REST y Swagger">
                <div class="centroplus-preview-topbar">
                    <div class="centroplus-preview-brand">
                        <span class="centroplus-logo-mark"><i class="fa-solid fa-plus"></i></span>
                        <div>
                            <strong>CentroPlus</strong>
                            <small>Connect</small>
                        </div>
                    </div>
                    <span class="centroplus-api-pill">API REST · JavaFX · SQLite</span>
                </div>

                <div class="centroplus-preview-main">
                    <div class="centroplus-dashboard-zone">
                        <div class="centroplus-metric metric-users">
                            <i class="fa-solid fa-user-group"></i>
                            <span>Usuarios</span>
                            <strong>3</strong>
                        </div>

                        <div class="centroplus-metric metric-activities">
                            <i class="fa-solid fa-chart-simple"></i>
                            <span>Actividades</span>
                            <strong>5</strong>
                        </div>

                        <div class="centroplus-metric metric-bookings">
                            <i class="fa-solid fa-calendar-check"></i>
                            <span>Reservas</span>
                            <strong>2</strong>
                        </div>

                        <div class="centroplus-metric metric-incidents">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                            <span>Incidencias</span>
                            <strong>2</strong>
                        </div>
                    </div>

                    <div class="centroplus-swagger-zone">
                        <div class="swagger-title-row">
                            <span><i class="fa-solid fa-book-open"></i> Swagger integrado</span>
                            <small>OAS 3.0</small>
                        </div>

                        <div class="swagger-endpoint endpoint-get"><strong>GET</strong><span>/api/v1/actividades</span></div>
                        <div class="swagger-endpoint endpoint-post"><strong>POST</strong><span>/api/v1/usuarios</span></div>
                        <div class="swagger-endpoint endpoint-patch"><strong>PATCH</strong><span>/api/v1/reservas/{id}</span></div>
                        <div class="swagger-endpoint endpoint-delete"><strong>DELETE</strong><span>/api/v1/incidencias/{id}</span></div>
                    </div>
                </div>

                <div class="centroplus-tech-row">
                    <span><i class="fa-brands fa-java"></i> Java 17</span>
                    <span><i class="fa-solid fa-leaf"></i> Spring</span>
                    <span><i class="fa-solid fa-database"></i> H2 DB</span>
                    <span><i class="fa-solid fa-code-branch"></i> JPA</span>
                    <span><i class="fa-solid fa-arrows-turn-to-dots"></i> MapStruct</span>
                    <span><i class="fa-solid fa-book-open"></i> Swagger</span>
                    <span><i class="fa-solid fa-vial"></i> JUnit</span>
                    <span><i class="fa-solid fa-mask"></i> Mockito</span>
                </div>
            </div>
        `;
    }

    function timeAgoText(dateStr) {
        const days = Math.max(0, Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000));

        if (days < 1) {
            return t('Hoy', 'Today');
        }

        let value, unit;
        if (days < 30) { value = days; unit = 'day'; }
        else if (days < 365) { value = Math.floor(days / 30); unit = 'month'; }
        else { value = Math.floor(days / 365); unit = 'year'; }

        const labels = {
            day: { es: ['día', 'días'], en: ['day', 'days'] },
            month: { es: ['mes', 'meses'], en: ['month', 'months'] },
            year: { es: ['año', 'años'], en: ['year', 'years'] }
        };
        const [singular, plural] = labels[unit][currentLang] || labels[unit].es;
        const word = value === 1 ? singular : plural;

        if (currentLang === 'en') return `${value} ${word} ago`;
        return `Hace ${value} ${word}`;
    }

    function renderRepos(repos) {
        const container = document.getElementById('repos-container');
        container.innerHTML = '';

        repos.forEach(repo => {
            const card = document.createElement('article');
            const netScanner = isNetScannerRepo(repo);
            const centroPlus = isCentroPlusRepo(repo);
            const githubProfile = isGitHubProfileRepo(repo);
            const etsDam = isEtsDamRepo(repo);
            const zeeBoard = isZeeBoardRepo(repo);
            const pmdm = isPmdmRepo(repo);
            const hasCustomPreview = netScanner || centroPlus || githubProfile || etsDam || zeeBoard || pmdm;

            card.className = `repo-card panel panel-hover repo-card-reveal${hasCustomPreview ? ' repo-card-featured' : ''}`;

            const updatedText = t('Actualizado', 'Updated');
            const viewCodeText = t('Ver código', 'View code');
            const compositionText = t('Composición', 'Composition');
            const activityText = t('Actividad', 'Activity');
            const languageText = t('Lenguaje', 'Language');
            const hasSocialStats = repo.stargazers_count > 0 || repo.forks_count > 0;

            let scene = '';
            if (netScanner) scene = createNetScannerWavePreview();
            else if (centroPlus) scene = createCentroPlusApiPreview();
            else if (githubProfile) scene = createGitHubProfilePreview();
            else if (etsDam) scene = createEtsDamPreview();
            else if (zeeBoard) scene = createZeeBoardPreview();
            else if (pmdm) scene = createPokedexPreview();

            card.innerHTML = `
                <div class="repo-card-grid">
                    <div class="repo-info">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || '...'}</p>
                        <ul class="repo-topics">
                            ${(repo.topics || []).filter(topic => topic !== 'showcase').map(topic => `<li class="chip">#${topic}</li>`).join('')}
                        </ul>
                        <div class="repo-actions">
                            <a href="${repo.html_url}" target="_blank" class="btn btn-primary"><i class="fa-brands fa-github"></i> ${viewCodeText}</a>
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="btn btn-outline"><i class="fa-solid fa-play"></i> ${t('Probar demo', 'Live demo')}</a>` : ''}
                        </div>
                        <div class="repo-updated"><i class="fa-regular fa-calendar"></i> ${updatedText}: ${new Date(repo.updated_at).toLocaleDateString()}</div>
                    </div>

                    ${scene}

                    <div class="repo-stats">
                        <div class="repo-stats-row">
                            ${hasSocialStats ? `
                                <div class="repo-stat">
                                    <i class="fa-regular fa-star"></i>
                                    <strong>${repo.stargazers_count}</strong>
                                    <span>Stars</span>
                                </div>
                                <div class="repo-stat">
                                    <i class="fa-solid fa-code-branch"></i>
                                    <strong>${repo.forks_count}</strong>
                                    <span>Forks</span>
                                </div>
                            ` : `
                                <div class="repo-stat repo-stat-compact">
                                    <i class="fa-regular fa-clock"></i>
                                    <strong>${timeAgoText(repo.updated_at)}</strong>
                                    <span>${activityText}</span>
                                </div>
                                <div class="repo-stat repo-stat-compact">
                                    <i class="fa-solid fa-code"></i>
                                    <strong>${repo.language || '—'}</strong>
                                    <span>${languageText}</span>
                                </div>
                            `}
                        </div>
                        <p class="repo-langs-label">${compositionText}</p>
                        <div id="langs-${repo.id}"></div>
                    </div>
                </div>
            `;
            container.appendChild(card);

            fetch(repo.languages_url).then(r => r.json()).then(langs => {
                const langDiv = document.getElementById(`langs-${repo.id}`);
                if (!langDiv) return;
                const total = Object.values(langs).reduce((a, b) => a + b, 0);
                langDiv.innerHTML = Object.entries(langs).slice(0, 4).map(([l, v]) => `
                    <div class="repo-lang-row"><span>${l}</span><span>${total ? ((v / total) * 100).toFixed(1) : '0.0'}%</span></div>
                    <div class="repo-lang-track"><div class="repo-lang-fill" style="width: ${total ? (v / total) * 100 : 0}%;"></div></div>
                `).join('');
            });
        });
    }

    // Smooth Scroll & Active Link
    document.querySelectorAll('.sidebar-link, .scroll-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    // Actualizar clase activa si es un link de sidebar
                    if (this.classList.contains('sidebar-link')) {
                        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                    }
                }
            }
        });
    });

    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Timeline paginado: una página por curso (1º DAM / 2º DAM)
    const roadmapPages = document.querySelectorAll('.roadmap-page');
    let roadmapIndex = 0;

    function showRoadmapPage(index) {
        roadmapIndex = Math.max(0, Math.min(index, roadmapPages.length - 1));
        roadmapPages.forEach((page, i) => { page.hidden = i !== roadmapIndex; });
    }

    document.querySelectorAll('.roadmap-prev').forEach(btn => {
        btn.addEventListener('click', () => showRoadmapPage(roadmapIndex - 1));
    });

    document.querySelectorAll('.roadmap-next').forEach(btn => {
        btn.addEventListener('click', () => showRoadmapPage(roadmapIndex + 1));
    });

    // Event Listeners para botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => switchLanguage(btn.getAttribute('data-lang')));
    });

    function copyEmail() {
        const email = 'AlexDoGa.work@gmail.com';
        const emailText = document.getElementById('email-text');
        const originalText = emailText.textContent;
        
        navigator.clipboard.writeText(email).then(() => {
            emailText.textContent = t('Correo copiado', 'Email copied');
            emailText.style.color = '#22c55e';
            
            setTimeout(() => {
                emailText.textContent = originalText;
                emailText.style.color = '';
            }, 2000);
        });
    }

    // Botón "Descargar CV": abre la impresión del navegador (Guardar como PDF).
    // El diseño para papel está en assets/css/print.css
    document.getElementById('print-cv')?.addEventListener('click', () => window.print());

    // Lógica de Temas (Luz/Oscuro)
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = document.getElementById('theme-text');
    const html = document.documentElement;

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (theme === 'light') {
            themeIcon.className = 'fa-solid fa-sun';
            themeText.textContent = t('Modo claro', 'Light mode');
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            themeText.textContent = t('Modo oscuro', 'Dark mode');
        }
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // Inicializar tema al cargar
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    document.addEventListener('DOMContentLoaded', () => {
        let savedLang = 'es';
        try { savedLang = localStorage.getItem('lang') || 'es'; } catch (e) { /* sin almacenamiento */ }
        if (savedLang === 'en') switchLanguage('en');
        fetchGitHubData();
    });
