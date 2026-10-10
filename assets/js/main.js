    const GITHUB_USERNAME = 'alejandroDonGar';
    const API_REPOS = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`;
    const reposPerPage = 4;
    const CACHE_MINUTES = 30;

    let currentLang = 'es';
    let courseRepos = [];     // repositorios de asignaturas
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

        if (courseRepos.length) updatePagination();
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

            // Los proyectos y el perfil tienen su propia sección: aquí solo asignaturas
            const isOwnProject = repo =>
                ['zeeboard', 'netscanner', 'escaner-de-red-netscanner', 'centroplus-connect', 'alejandrodongar'].includes(repo.name.toLowerCase());
            courseRepos = repos.filter(repo => !isOwnProject(repo));

            if (courseRepos.length === 0) {
                container.innerHTML = `<div style="text-align:center; padding:2rem;">${t('No se encontraron repositorios públicos.', 'No public repositories found.')}</div>`;
                return;
            }

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

    function updatePagination() {
        const totalPages = Math.max(1, Math.ceil(courseRepos.length / reposPerPage));
        currentPage = Math.min(currentPage, totalPages);
        const start = (currentPage - 1) * reposPerPage;

        renderRepos(courseRepos.slice(start, start + reposPerPage));

        document.getElementById('page-info').textContent = `${t('Página', 'Page')} ${currentPage} / ${totalPages}`;
        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = currentPage === totalPages;
    }

    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        const totalPages = Math.ceil(courseRepos.length / reposPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
        }
    });

    function isEtsDamRepo(repo) {
        const normalizedName = repo.name.toLowerCase();
        return normalizedName === 'etsdam_alejandro' || normalizedName.includes('etsdam');
    }

    function isPmdmRepo(repo) {
        const normalizedName = repo.name.toLowerCase();
        return normalizedName.includes('programacion-multimedia') || normalizedName.includes('pokedex');
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

    // Carrusel de capturas reales: la activa al centro y las vecinas atenuadas a los lados.
    // Cada entrada es solo un dato: carpeta en assets/img, capturas y pastillas del stack.
    const SHOWCASES = {
        pokedex: {
            label: 'Mini-Pokédex: práctica de JavaScript con PokéAPI',
            slides: [
                ['coleccion', 'Los 151 Pokémon cargados desde PokéAPI'],
                ['busqueda', 'Búsqueda en tiempo real por nombre o número'],
                ['filtro', 'Filtro por tipo, combinable con la búsqueda'],
                ['detalle', 'Panel de detalles con estadísticas base'],
            ],
            stack: [
                ['fa-brands fa-html5', 'HTML'], ['fa-brands fa-css3-alt', 'CSS'], ['fa-brands fa-js', 'JavaScript'],
                ['fa-solid fa-plug', 'PokéAPI'], ['fa-solid fa-arrows-rotate', 'fetch · Promise.all'],
                ['fa-solid fa-window-restore', '<dialog>'],
            ],
        },
    };

    function showcaseSlidePos(index, active, total) {
        let distance = (index - active + total) % total;
        if (distance > total / 2) distance -= total;
        return Math.abs(distance) > 1 ? 'far' : distance;
    }

    function setShowcaseSlide(stage, active) {
        const slides = stage.querySelectorAll('.zb-slide');
        stage.dataset.active = (active + slides.length) % slides.length;
        slides.forEach((slide, index) => {
            slide.dataset.pos = showcaseSlidePos(index, Number(stage.dataset.active), slides.length);
        });
    }

    // The stage grows to fit the tallest capture so none is cropped (slide is 92% wide, plus a little air)
    document.addEventListener('load', event => {
        if (!event.target.matches?.('.zb-slide')) return;
        const stage = event.target.closest('.zb-stage');
        const tallest = Math.max(...[...stage.querySelectorAll('.zb-slide')]
            .filter(img => img.naturalWidth)
            .map(img => img.naturalHeight / img.naturalWidth));
        stage.style.setProperty('--r', Math.max(0.64, 0.92 * tallest + 0.06).toFixed(3));
    }, true);

    document.addEventListener('click', event => {
        const arrow = event.target.closest('.zb-arrow');
        if (!arrow) return;
        const stage = arrow.closest('.zb-stage');
        setShowcaseSlide(stage, Number(stage.dataset.active) + Number(arrow.dataset.step));
    });

    // Avanza solo, salvo con el ratón encima o si se piden menos animaciones
    setInterval(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        document.querySelectorAll('.zb-stage').forEach(stage => {
            if (!stage.parentElement.matches(':hover')) setShowcaseSlide(stage, Number(stage.dataset.active) + 1);
        });
    }, 4000);

    function createShowcase(key) {
        const { label, slides, stack } = SHOWCASES[key];
        const total = slides.length;

        return `
            <div class="repo-showcase" aria-label="Capturas de ${label}">
                <div class="zb-stage" data-active="0">
                    <button type="button" class="zb-arrow" data-step="-1" aria-label="Anterior"><i class="fa-solid fa-chevron-left"></i></button>
                    ${slides.map(([name, alt], index) => `
                        <img class="zb-slide" data-pos="${showcaseSlidePos(index, 0, total)}" src="assets/img/${key}/${name}.webp" alt="${alt}">
                    `).join('')}
                    <button type="button" class="zb-arrow" data-step="1" aria-label="Siguiente"><i class="fa-solid fa-chevron-right"></i></button>
                </div>
                <div class="showcase-stack">
                    ${stack.map(([icon, text]) => `<span><i class="${icon}"></i> ${text.replace(/</g, '&lt;')}</span>`).join('')}
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
            const etsDam = isEtsDamRepo(repo);
            const pmdm = isPmdmRepo(repo);
            const hasCustomPreview = etsDam || pmdm;

            card.className = `repo-card panel panel-hover repo-card-reveal${hasCustomPreview ? ' repo-card-featured' : ''}`;

            const updatedText = t('Actualizado', 'Updated');
            const viewCodeText = t('Ver código', 'View code');
            const compositionText = t('Composición', 'Composition');
            const activityText = t('Actividad', 'Activity');
            const languageText = t('Lenguaje', 'Language');
            const hasSocialStats = repo.stargazers_count > 0 || repo.forks_count > 0;

            let scene = '';
            if (etsDam) scene = createEtsDamPreview();
            else if (pmdm) scene = createShowcase('pokedex');

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
