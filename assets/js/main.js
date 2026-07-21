    const GITHUB_USERNAME = 'alejandroDonGar';
    const API_BASE = `https://api.github.com/users/${GITHUB_USERNAME}`;
    let allRepos = [];
    let currentPage = 1;
    let currentLang = 'es'; // Definir idioma actual globalmente
    const reposPerPage = 4;

    const translations = {
        es: {
            role_junior: "ESTUDIANTE 1º DAM",
            hero_title: "Alejandro Donate",
            hero_desc: "Estudiante de Desarrollo de Aplicaciones Multiplataforma, enfocado en Java, Python, bases de datos y desarrollo web. Construyendo proyectos para convertir conocimiento en experiencia.",
            btn_projects: "Explorar Proyectos",
            btn_about: "Sobre mí",
            about_title: "Sobre mí",
            goal_title: "Mi Objetivo",
            goal_desc: "Como estudiante de Desarrollo de Aplicaciones Multiplataforma, mi objetivo es seguir aprendiendo con proyectos prácticos y construir una base sólida en programación, bases de datos y desarrollo web.",
            about_card_title: "Desarrollo, aprendizaje y proyectos reales",
            about_card_desc: "Soy estudiante de Desarrollo de Aplicaciones Multiplataforma (DAM), con interés en el desarrollo backend, las bases de datos y la creación de aplicaciones web útiles. Me gusta aprender construyendo proyectos prácticos, documentarlos y convertir cada asignatura en una oportunidad para mejorar mi forma de programar.",
            lang_section: "Dominio del Inglés",
            projects_title: "Proyectos GitHub",
            stat_updated: "Actualizado",
            nav_home: "Inicio",
            nav_about: "Sobre mí",
            nav_tech: "Tecnologías",
            nav_projects: "Proyectos",
            nav_english: "Inglés"
        },
        en: {
            role_junior: "1st YEAR DAM STUDENT",
            hero_title: "Alejandro Donate",
            hero_desc: "Multiplatform Application Development student focused on Java, Python, databases and web development. Building projects to turn knowledge into experience.",
            btn_projects: "Explore Projects",
            btn_about: "About Me",
            about_title: "About Me",
            goal_title: "My Goal",
            goal_desc: "As a Multiplatform Application Development student, my goal is to keep learning through practical projects and build a solid foundation in programming, databases and web development.",
            about_card_title: "Development, learning and real projects",
            about_card_desc: "I am a Multiplatform Application Development student interested in backend development, databases and useful web applications. I enjoy learning by building practical projects, documenting them and turning each subject into an opportunity to improve the way I code.",
            lang_section: "English Proficiency",
            projects_title: "GitHub Projects",
            stat_updated: "Updated",
            nav_home: "Home",
            nav_about: "About Me",
            nav_tech: "Technologies",
            nav_projects: "Projects",
            nav_english: "English"
        },
        de: {
            role_junior: "DAM-STUDENT IM 1. JAHR",
            hero_title: "Alejandro Donate",
            hero_desc: "Student der plattformübergreifenden Anwendungsentwicklung mit Fokus auf Java, Python, Datenbanken und Webentwicklung. Ich baue Projekte, um Wissen in Erfahrung umzuwandeln.",
            btn_projects: "Projekte erkunden",
            btn_about: "Über mich",
            about_title: "Über mich",
            goal_title: "Mein Ziel",
            goal_desc: "Als Student der plattformübergreifenden Anwendungsentwicklung möchte ich durch praktische Projekte weiterlernen und eine solide Grundlage in Programmierung, Datenbanken und Webentwicklung aufbauen.",
            about_card_title: "Entwicklung, Lernen und echte Projekte",
            about_card_desc: "Ich bin Student der plattformübergreifenden Anwendungsentwicklung mit Interesse an Backend-Entwicklung, Datenbanken und nützlichen Webanwendungen. Ich lerne gerne durch praktische Projekte und nutze jedes Fach, um meine Programmierweise zu verbessern.",
            lang_section: "Englischkenntnisse",
            projects_title: "GitHub-Projekte",
            stat_updated: "Aktualisiert",
            nav_home: "Startseite",
            nav_about: "Über mich",
            nav_tech: "Technologien",
            nav_projects: "Projekte",
            nav_english: "Englisch"
        },
        is: {
            role_junior: "1. ÁRS DAM NEMANDI",
            hero_title: "Alejandro Donate",
            hero_desc: "Nemandi í þróun fjölvettvangsforrita með áherslu á Java, Python, gagnagrunna og vefþróun. Ég byggi verkefni til að breyta þekkingu í reynslu.",
            btn_projects: "Skoða verkefni",
            btn_about: "Um mig",
            about_title: "Um mig",
            goal_title: "Markmið mitt",
            goal_desc: "Sem nemandi í þróun fjölvettvangsforrita er markmið mitt að halda áfram að læra með hagnýtum verkefnum og byggja góðan grunn í forritun, gagnagrunnum og vefþróun.",
            about_card_title: "Þróun, nám og raunveruleg verkefni",
            about_card_desc: "Ég er nemandi í þróun fjölvettvangsforrita með áhuga á bakendaforritun, gagnagrunnum og nytsamlegum vefforritum. Mér finnst best að læra með hagnýtum verkefnum og nýta hvert fag til að bæta forritunina mína.",
            lang_section: "Enskukunnátta",
            projects_title: "GitHub verkefni",
            stat_updated: "Uppfært",
            nav_home: "Heim",
            nav_about: "Um mig",
            nav_tech: "Tækni",
            nav_projects: "Verkefni",
            nav_english: "Enska"
        }
    };

    function switchLanguage(lang) {
        currentLang = lang;
        document.querySelectorAll('[data-t]').forEach(el => {
            const key = el.getAttribute('data-t');
            if (translations[lang] && translations[lang][key]) {
                const icon = el.querySelector('i');
                el.textContent = translations[lang][key];
                if (icon) el.prepend(icon);
            }
        });
        
        document.querySelectorAll('.sidebar-link span').forEach(span => {
            const parent = span.parentElement;
            const id = parent.id.replace('nav-', '');
            const key = `nav_${id}`;
            if (translations[lang] && translations[lang][key]) {
                span.textContent = translations[lang][key];
            }
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Actualizar placeholders dinámicos
        document.getElementById('prev-page').title = lang === 'es' ? 'Anterior' : (lang === 'en' ? 'Previous' : 'Zurück');
        document.getElementById('next-page').title = lang === 'es' ? 'Siguiente' : (lang === 'en' ? 'Next' : 'Nächste');

        // Actualizar texto del tema al cambiar idioma
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        setTheme(currentTheme);

        updatePagination(); 
    }

    async function fetchGitHubData() {
        console.log('Iniciando carga de GitHub...');
        const container = document.getElementById('repos-container');
        if (!container) return;
        
        container.innerHTML = '<div style="text-align:center; padding:4rem;"><i class="fa-solid fa-circle-notch fa-spin fa-2x"></i><p style="margin-top:1rem;">Conectando con GitHub API...</p></div>';
        
        try {
            // Intentar fetch directo con manejo de errores robusto
            const response = await fetch('https://api.github.com/users/alejandroDonGar/repos?sort=updated&per_page=100');
            
            if (!response.ok) {
                if (response.status === 403) throw new Error("Límite de la API de GitHub alcanzado. Espera unos minutos.");
                throw new Error(`GitHub retornó estado: ${response.status}`);
            }

            const data = await response.json();
            
            if (Array.isArray(data)) {
                // Filtrar el repo del portfolio y forks, manteniendo el orden real por actualización.
                // La API ya devuelve los repositorios con sort=updated, así que no forzamos proyectos destacados arriba.
                allRepos = data
                    .filter(repo => {
                        const isNotPortfolio = repo.name.toLowerCase() !== 'alejandrodongar.github.io';
                        const isNotFork = !repo.fork;
                        return isNotPortfolio && isNotFork;
                    })
                    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

                console.log('Repositorios encontrados:', allRepos.length);
                
                if (allRepos.length === 0) {
                    container.innerHTML = '<div style="text-align:center; padding:2rem;">No se encontraron repositorios públicos.</div>';
                } else {
                    currentPage = 1;
                    updatePagination();
                }
            } else {
                throw new Error("La respuesta de la API no es válida.");
            }
        } catch (error) {
            console.error('ERROR CRÍTICO GITHUB:', error);
            container.innerHTML = `
                <div style="text-align:center; padding:3rem; background: rgba(239, 68, 68, 0.1); border-radius: 20px; border: 1px solid rgba(239, 68, 68, 0.2);">
                    <i class="fa-solid fa-triangle-exclamation fa-3x" style="color:#ef4444;"></i>
                    <h3 style="margin-top:1.5rem;">No se pudieron cargar los proyectos</h3>
                    <p style="opacity:0.8; margin: 1rem 0;">${error.message}</p>
                    <button onclick="location.reload()" class="btn btn-primary" style="background:#ef4444;">
                        <i class="fa-solid fa-rotate"></i> Intentar de nuevo
                    </button>
                </div>
            `;
        }
    }

    function updatePagination() {
        const totalPages = Math.ceil(allRepos.length / reposPerPage);
        const start = (currentPage - 1) * reposPerPage;
        const end = start + reposPerPage;
        const currentRepos = allRepos.slice(start, end);

        renderRepos(currentRepos);

        const pageText = currentLang === 'es' ? 'Página' : (currentLang === 'en' ? 'Page' : (currentLang === 'de' ? 'Seite' : 'Síða'));
        document.getElementById('page-info').textContent = `${pageText} ${currentPage} / ${totalPages}`;
        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = currentPage === totalPages;
    }

    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        }
    });

    document.getElementById('next-page').addEventListener('click', () => {
        const totalPages = Math.ceil(allRepos.length / reposPerPage);
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

    function sceneTopbar(title) {
        return `
            <div class="scene-topbar">
                <span class="scene-dots"><i></i><i></i><i></i></span>
                <span class="scene-title">${title}</span>
            </div>
        `;
    }

    function createGitHubProfilePreview() {
        return `
            <div class="repo-scene scene-profile" aria-label="Preview del README principal de GitHub">
                ${sceneTopbar('alejandroDonGar / README.md')}
                <div class="profile-body">
                    <div class="profile-avatar-wrap">
                        <div class="profile-avatar">
                            <i class="fa-solid fa-user-astronaut"></i>
                        </div>
                        <span class="profile-status"></span>
                    </div>
                    <div class="profile-info">
                        <h4>Hola, soy Alejandro 👋</h4>
                        <p>Estudiante DAM · Java · SQL · Web</p>
                        <div class="profile-lines" aria-hidden="true"><span></span><span></span><span></span></div>
                        <div class="profile-techs">
                            <i class="fa-brands fa-java" style="--i:0"></i>
                            <i class="fa-solid fa-database" style="--i:1"></i>
                            <i class="fa-brands fa-html5" style="--i:2"></i>
                            <i class="fa-brands fa-js" style="--i:3"></i>
                            <i class="fa-brands fa-github" style="--i:4"></i>
                        </div>
                    </div>
                </div>
                <div class="profile-stats">
                    <div><strong>10+</strong><span>Repos</span></div>
                    <div><strong>Open</strong><span>Source</span></div>
                    <div><strong>C1</strong><span>Inglés</span></div>
                </div>
            </div>
        `;
    }

    function createEtsDamPreview() {
        return `
            <div class="repo-scene scene-etsdam" aria-label="Preview de Entornos de Desarrollo: terminal y flujo de trabajo">
                ${sceneTopbar('etsdam_alejandro · terminal')}
                <div class="etsdam-terminal">
                    <p style="--i:0"><span class="prompt">alejandro@etsdam</span>:~$ git status</p>
                    <p class="ok" style="--i:1"><i class="fa-solid fa-check"></i> rama main sincronizada</p>
                    <p style="--i:2"><span class="prompt">alejandro@etsdam</span>:~$ mvn test</p>
                    <p class="ok" style="--i:3"><i class="fa-solid fa-check"></i> build success · tests passed</p>
                    <p style="--i:4"><span class="prompt">alejandro@etsdam</span>:~$ git push origin main<span class="cursor">_</span></p>
                </div>
                <div class="etsdam-flow" aria-hidden="true">
                    <span class="etsdam-flow-line"></span>
                    <span class="etsdam-flow-pulse"></span>
                    <div class="etsdam-node"><i class="fa-solid fa-file-lines"></i><small>Docs</small></div>
                    <div class="etsdam-node"><i class="fa-brands fa-git-alt"></i><small>Git</small></div>
                    <div class="etsdam-node"><i class="fa-solid fa-code"></i><small>IDE</small></div>
                    <div class="etsdam-node"><i class="fa-solid fa-bug"></i><small>Debug</small></div>
                    <div class="etsdam-node"><i class="fa-solid fa-vial"></i><small>Tests</small></div>
                    <div class="etsdam-node"><i class="fa-solid fa-bolt"></i><small>Opt</small></div>
                </div>
                <div class="scene-stack">Git · GitHub · Maven · JUnit · UML · Optimización</div>
            </div>
        `;
    }

    function createNetScannerWavePreview() {
        return `
            <div class="repo-scene scene-netscanner" aria-label="Preview de NetScanner: mapa de red">
                ${sceneTopbar('NetScanner · escaneo local')}
                <div class="netscan-map">
                    <div class="netscan-radar" aria-hidden="true"><span class="netscan-sweep"></span></div>
                    <div class="netscan-node netscan-router">
                        <i class="fa-solid fa-wifi"></i>
                        <span>192.168.1.1</span>
                    </div>
                    <div class="netscan-devices">
                        <div class="netscan-device" style="--d:0">
                            <i class="fa-solid fa-laptop"></i>
                            <strong>DESKTOP-A12</strong>
                            <span>.24</span>
                        </div>
                        <div class="netscan-device" style="--d:1">
                            <i class="fa-solid fa-mobile-screen-button"></i>
                            <strong>Galaxy-S23</strong>
                            <span>.37</span>
                        </div>
                        <div class="netscan-device" style="--d:2">
                            <i class="fa-solid fa-print"></i>
                            <strong>HP-OfficeJet</strong>
                            <span>.52</span>
                        </div>
                    </div>
                    <div class="netscan-tech netscan-tech-1" title="Python"><i class="fa-brands fa-python"></i></div>
                    <div class="netscan-tech netscan-tech-2" title="MongoDB"><i class="fa-solid fa-leaf"></i></div>
                    <div class="netscan-tech netscan-tech-3" title="Scapy"><i class="fa-solid fa-network-wired"></i></div>
                </div>
                <div class="scene-status"><span class="scene-status-dot"></span> 6 hosts detectados · ARP scan</div>
            </div>
        `;
    }

    function createZeeBoardPreview() {
        return `
            <div class="repo-scene scene-zeeboard" aria-label="Preview de ZeeBoard: gestor de comisiones tipo kanban">
                ${sceneTopbar('ZeeBoard · Commissions')}
                <div class="zee-app">
                    <nav class="zee-sidebar" aria-hidden="true">
                        <span class="active">Commissions</span>
                        <span>Clients</span>
                        <span>Tags</span>
                        <span>Templates</span>
                    </nav>
                    <div class="zee-main">
                        <div class="zee-board">
                            <div class="zee-col">
                                <div class="zee-col-title">Sketch</div>
                                <div class="zee-card">
                                    <strong>Commission #01</strong>
                                    <span class="zee-tag unpaid">Sin pagar</span>
                                    <p>2 personajes · render</p>
                                    <div class="zee-progress"><em style="--w: 33%;"></em></div>
                                </div>
                            </div>
                            <div class="zee-col">
                                <div class="zee-col-title">Lineart</div>
                                <div class="zee-card">
                                    <strong>Commission #02</strong>
                                    <span class="zee-tag paid">Pagado</span>
                                    <p>1 personaje · fondo</p>
                                    <div class="zee-progress"><em style="--w: 60%;"></em></div>
                                </div>
                            </div>
                        </div>
                        <div class="zee-calendar-strip">
                            <small><i class="fa-regular fa-calendar"></i> Jun 2026</small>
                            <div class="zee-days">
                                <span>24</span>
                                <span class="today">25</span>
                                <span class="due">26</span>
                                <span>27</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="scene-stack">TypeScript · React · Tauri · Rust · SQLite</div>
            </div>
        `;
    }

    function createCentroPlusApiPreview() {
        return `
            <div class="repo-scene scene-centroplus" aria-label="Preview de CentroPlus Connect: dashboard y API REST">
                ${sceneTopbar('CentroPlus Connect · API')}
                <div class="centro-metrics">
                    <div style="--i:0"><span>Usuarios</span><strong>3</strong></div>
                    <div style="--i:1"><span>Actividades</span><strong>5</strong></div>
                    <div style="--i:2"><span>Reservas</span><strong>2</strong></div>
                    <div style="--i:3"><span>Incidencias</span><strong>2</strong></div>
                </div>
                <div class="centro-endpoints">
                    <div class="endpoint get"><strong>GET</strong><span>/api/v1/actividades</span></div>
                    <div class="endpoint post"><strong>POST</strong><span>/api/v1/usuarios</span></div>
                    <div class="endpoint patch"><strong>PATCH</strong><span>/api/v1/reservas/{id}</span></div>
                    <div class="endpoint delete"><strong>DELETE</strong><span>/api/v1/incidencias/{id}</span></div>
                </div>
                <div class="scene-stack">Java 17 · Spring · H2 · JPA · Swagger · JUnit</div>
            </div>
        `;
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
            const hasCustomPreview = netScanner || centroPlus || githubProfile || etsDam || zeeBoard;

            card.className = `repo-card panel panel-hover repo-card-reveal${hasCustomPreview ? ' repo-card-featured' : ''}`;

            const updatedText = currentLang === 'es' ? 'Actualizado' : (currentLang === 'en' ? 'Updated' : (currentLang === 'de' ? 'Aktualisiert' : 'Uppfært'));
            const viewCodeText = currentLang === 'es' ? 'Ver código' : (currentLang === 'en' ? 'View code' : (currentLang === 'de' ? 'Code ansehen' : 'Skoða kóða'));
            const compositionText = currentLang === 'es' ? 'Composición' : (currentLang === 'en' ? 'Composition' : (currentLang === 'de' ? 'Zusammensetzung' : 'Samsetning'));

            let scene = '';
            if (netScanner) scene = createNetScannerWavePreview();
            else if (centroPlus) scene = createCentroPlusApiPreview();
            else if (githubProfile) scene = createGitHubProfilePreview();
            else if (etsDam) scene = createEtsDamPreview();
            else if (zeeBoard) scene = createZeeBoardPreview();

            card.innerHTML = `
                <div class="repo-card-grid">
                    <div class="repo-info">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || '...'}</p>
                        <ul class="repo-topics">
                            ${repo.topics ? repo.topics.map(t => `<li class="chip">#${t}</li>`).join('') : ''}
                        </ul>
                        <div class="repo-actions">
                            <a href="${repo.html_url}" target="_blank" class="btn btn-primary"><i class="fa-brands fa-github"></i> ${viewCodeText}</a>
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn btn-outline">Demo Live</a>` : ''}
                        </div>
                        <div class="repo-updated"><i class="fa-regular fa-calendar"></i> ${updatedText}: ${new Date(repo.updated_at).toLocaleDateString()}</div>
                    </div>

                    ${scene}

                    <div class="repo-stats">
                        <div class="repo-stats-row">
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

    // Event Listeners para botones de idioma
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => switchLanguage(btn.getAttribute('data-lang')));
    });

    function copyEmail() {
        const email = 'AlexDoGa.work@gmail.com';
        const emailText = document.getElementById('email-text');
        const originalText = emailText.textContent;
        
        navigator.clipboard.writeText(email).then(() => {
            emailText.textContent = 'Correo copiado';
            emailText.style.color = '#22c55e';
            
            setTimeout(() => {
                emailText.textContent = originalText;
                emailText.style.color = '';
            }, 2000);
        });
    }

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
            themeText.textContent = currentLang === 'es' ? 'Modo Claro' : (currentLang === 'en' ? 'Light Mode' : (currentLang === 'de' ? 'Heller Modus' : 'Ljós stilling'));
        } else {
            themeIcon.className = 'fa-solid fa-moon';
            themeText.textContent = currentLang === 'es' ? 'Modo Oscuro' : (currentLang === 'en' ? 'Dark Mode' : (currentLang === 'de' ? 'Dunkler Modus' : 'Dökk stilling'));
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
        currentPage = 1;
        fetchGitHubData();
    });
