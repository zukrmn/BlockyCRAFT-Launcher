export const translations: Record<string, Record<string, string>> = {
    "en-US": {
        "ui.donate": "Donate",
        "ui.play": "Play",
        "ui.username_placeholder": "Username",
        "ui.donators": "Donators",
        "ui.changelog": "Changelog",
        "ui.close": "Close",
        "ui.settings": "Settings",
        "ui.cancel": "Cancel",
        "ui.save": "Save",
        "settings.minMemory": "Minimum Memory",
        "settings.maxMemory": "Maximum Memory",
        "settings.javaArgs": "Java Arguments",
        "settings.javaArgsHint": "Advanced: Custom JVM arguments (e.g. -Dorg.lwjgl.opengl.Display.allowSoftwareOpenGL=true for VMs)",
        "status.launching": "Launching...",
        "status.error": "Error launching: ",
        "status.checkingUpdates": "Checking for updates...",
        "status.checkingJava": "Checking Java...",
        "status.downloadingJava": "Downloading Java...",
        "status.installingJava": "Installing Java...",
        "status.checkingVersion": "Checking version...",
        "status.downloadingLibraries": "Downloading libraries...",
        "status.downloadingNatives": "Downloading natives...",
        "status.configuringFabric": "Configuring Fabric/StationAPI...",
        "status.startingGame": "Starting game...",
        "status.downloading": "Downloading",
        "settings.tab.general": "General",
        "settings.tab.mods": "Mods",
        "settings.mods.empty": "No mods found.",
        "ui.tutorial_opened": "Opened in browser!",
        "ui.tutorial_title": "Tutorial",
        "ui.tutorial_subtitle": "Learn the server basics.",
        "settings.tab.overlay": "Overlay",
        "settings.overlay.hotkey": "Hotkey",
        "settings.overlay.hotkey_hint": "Press this key during gameplay to open the overlay.",
        "settings.overlay.hotkey_failed": "Failed to register hotkey. It may be in use by another application."
    },
    "pt-BR": {
        "ui.donate": "Doar",
        "ui.play": "Jogar",
        "ui.username_placeholder": "Nome de Usuário",
        "ui.donators": "Apoiadores",
        "ui.changelog": "Novidades",
        "ui.close": "Fechar",
        "ui.settings": "Configurações",
        "ui.cancel": "Cancelar",
        "ui.save": "Salvar",
        "settings.minMemory": "Memória Mínima",
        "settings.maxMemory": "Memória Máxima",
        "settings.javaArgs": "Argumentos Java",
        "settings.javaArgsHint": "Avançado: Argumentos JVM personalizados (ex: -Dorg.lwjgl.opengl.Display.allowSoftwareOpenGL=true para VMs)",
        "status.launching": "Iniciando...",
        "status.error": "Erro ao iniciar: ",
        "status.checkingUpdates": "Verificando atualizações...",
        "status.checkingJava": "Verificando Java...",
        "status.downloadingJava": "Baixando Java...",
        "status.installingJava": "Instalando Java...",
        "status.checkingVersion": "Verificando versão...",
        "status.downloadingLibraries": "Baixando bibliotecas...",
        "status.downloadingNatives": "Baixando nativos...",
        "status.configuringFabric": "Configurando Fabric/StationAPI...",
        "status.startingGame": "Iniciando Jogo...",
        "status.downloading": "Baixando",
        "settings.tab.general": "Geral",
        "settings.tab.mods": "Mods",
        "settings.mods.empty": "Nenhum mod encontrado.",
        "ui.tutorial_opened": "Aberto no navegador!",
        "ui.tutorial_title": "Tutorial",
        "ui.tutorial_subtitle": "Conheça o básico do servidor.",
        "settings.tab.overlay": "Overlay",
        "settings.overlay.hotkey": "Tecla de Atalho",
        "settings.overlay.hotkey_hint": "Pressione esta tecla durante o jogo para abrir o overlay.",
        "settings.overlay.hotkey_failed": "Falha ao registrar atalho. Pode estar em uso por outro aplicativo."
    },
    "es-ES": {
        "ui.donate": "Donar",
        "ui.play": "Jugar",
        "ui.username_placeholder": "Nombre de Usuario",
        "ui.donators": "Apoyadores",
        "ui.changelog": "Novedades",
        "ui.close": "Cerrar",
        "ui.settings": "Configuración",
        "ui.cancel": "Cancelar",
        "ui.save": "Guardar",
        "settings.minMemory": "Memoria Mínima",
        "settings.maxMemory": "Memoria Máxima",
        "settings.javaArgs": "Argumentos Java",
        "settings.javaArgsHint": "Avanzado: Argumentos JVM personalizados (ej: -Dorg.lwjgl.opengl.Display.allowSoftwareOpenGL=true para VMs)",
        "status.launching": "Iniciando...",
        "status.error": "Error al iniciar: ",
        "status.checkingUpdates": "Verificando actualizaciones...",
        "status.checkingJava": "Verificando Java...",
        "status.downloadingJava": "Descargando Java...",
        "status.installingJava": "Instalando Java...",
        "status.checkingVersion": "Verificando versión...",
        "status.downloadingLibraries": "Descargando bibliotecas...",
        "status.downloadingNatives": "Descargando nativos...",
        "status.configuringFabric": "Configurando Fabric/StationAPI...",
        "status.startingGame": "Iniciando juego...",
        "status.downloading": "Descargando",
        "settings.tab.general": "General",
        "settings.tab.mods": "Mods",
        "settings.mods.empty": "Ningún mod encontrado.",
        "ui.tutorial_opened": "¡Abierto en el navegador!",
        "ui.tutorial_title": "Tutorial",
        "ui.tutorial_subtitle": "Aprende lo básico del servidor.",
        "settings.tab.overlay": "Overlay",
        "settings.overlay.hotkey": "Atajo de Teclado",
        "settings.overlay.hotkey_hint": "Presiona esta tecla durante el juego para abrir el overlay.",
        "settings.overlay.hotkey_failed": "Error al registrar atajo. Puede estar en uso por otra aplicación."
    }
};

const STORAGE_KEY = 'launcher_language';

function getInitialLang(): "en-US" | "pt-BR" | "es-ES" {
    // 1. Check LocalStorage
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && (saved === 'en-US' || saved === 'pt-BR' || saved === 'es-ES')) {
            return saved;
        }
    } catch (e) {
        console.warn('Failed to access localStorage:', e);
    }

    // 2. Check System Language
    try {
        const systemLang = navigator.language || navigator.languages[0];
        if (systemLang) {
            if (systemLang.toLowerCase().startsWith('pt')) return 'pt-BR';
            if (systemLang.toLowerCase().startsWith('es')) return 'es-ES';
        }
    } catch (e) {
        console.warn('Failed to detect system language:', e);
    }

    // 3. Default fallback
    return 'en-US';
}

let currentLang = $state(getInitialLang());

export const i18n = {
    get lang() {
        return currentLang;
    },
    setLang(lang: "en-US" | "pt-BR" | "es-ES") {
        currentLang = lang;
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) {
            console.warn('Failed to save language preference:', e);
        }
    },
    t(key: string) {
        const langData = translations[currentLang] as Record<string, string>;
        return langData[key] || key;
    }
};
