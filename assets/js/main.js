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
            education_title: "Educación",
            education_status: "En curso · 1º",
            nav_home: "Inicio",
            nav_education: "Educación",
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
            education_title: "Education",
            education_status: "In progress · Year 1",
            nav_home: "Home",
            nav_education: "Education",
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
            education_title: "Ausbildung",
            education_status: "Laufend · 1. Jahr",
            nav_home: "Startseite",
            nav_education: "Ausbildung",
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
            education_title: "Menntun",
            education_status: "Í gangi · 1. ár",
            nav_home: "Heim",
            nav_education: "Menntun",
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
            return currentLang === 'es' ? 'Hoy' : (currentLang === 'en' ? 'Today' : (currentLang === 'de' ? 'Heute' : 'Í dag'));
        }

        let value, unit;
        if (days < 30) { value = days; unit = 'day'; }
        else if (days < 365) { value = Math.floor(days / 30); unit = 'month'; }
        else { value = Math.floor(days / 365); unit = 'year'; }

        const labels = {
            day: { es: ['día', 'días'], en: ['day', 'days'], de: ['Tag', 'Tage'], is: ['dagur', 'dagar'] },
            month: { es: ['mes', 'meses'], en: ['month', 'months'], de: ['Monat', 'Monate'], is: ['mánuður', 'mánuðir'] },
            year: { es: ['año', 'años'], en: ['year', 'years'], de: ['Jahr', 'Jahre'], is: ['ár', 'ár'] }
        };
        const [singular, plural] = labels[unit][currentLang] || labels[unit].es;
        const word = value === 1 ? singular : plural;

        if (currentLang === 'en') return `${value} ${word} ago`;
        if (currentLang === 'de') return `Vor ${value} ${word}`;
        if (currentLang === 'is') return `Fyrir ${value} ${word}`;
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
            const hasCustomPreview = netScanner || centroPlus || githubProfile || etsDam || zeeBoard;

            card.className = `repo-card panel panel-hover repo-card-reveal${hasCustomPreview ? ' repo-card-featured' : ''}`;

            const updatedText = currentLang === 'es' ? 'Actualizado' : (currentLang === 'en' ? 'Updated' : (currentLang === 'de' ? 'Aktualisiert' : 'Uppfært'));
            const viewCodeText = currentLang === 'es' ? 'Ver código' : (currentLang === 'en' ? 'View code' : (currentLang === 'de' ? 'Code ansehen' : 'Skoða kóða'));
            const compositionText = currentLang === 'es' ? 'Composición' : (currentLang === 'en' ? 'Composition' : (currentLang === 'de' ? 'Zusammensetzung' : 'Samsetning'));
            const activityText = currentLang === 'es' ? 'Actividad' : (currentLang === 'en' ? 'Activity' : (currentLang === 'de' ? 'Aktivität' : 'Virkni'));
            const languageText = currentLang === 'es' ? 'Lenguaje' : (currentLang === 'en' ? 'Language' : (currentLang === 'de' ? 'Sprache' : 'Tungumál'));
            const hasSocialStats = repo.stargazers_count > 0 || repo.forks_count > 0;

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
