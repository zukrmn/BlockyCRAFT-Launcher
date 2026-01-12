export const translations: Record<string, Record<string, string>> = {
    "en-US": {
        "ui.donate": "Donate",
        "ui.play": "Play",
        "ui.username_placeholder": "Username",
        "ui.donators": "Donators",
        "ui.changelog": "Changelog",
        "ui.close": "Close",
        "status.launching": "Launching...",
        "status.error": "Error launching: "
    },
    "pt-BR": {
        "ui.donate": "Doar",
        "ui.play": "Jogar",
        "ui.username_placeholder": "Nome de Usuário",
        "ui.donators": "Apoiadores",
        "ui.changelog": "Novidades",
        "ui.close": "Fechar",
        "status.launching": "Iniciando...",
        "status.error": "Erro ao iniciar: "
    },
    "es-ES": {
        "ui.donate": "Donar",
        "ui.play": "Jugar",
        "ui.username_placeholder": "Nombre de Usuario",
        "ui.donators": "Apoyadores",
        "ui.changelog": "Novedades",
        "ui.close": "Cerrar",
        "status.launching": "Iniciando...",
        "status.error": "Error al iniciar: "
    }
};

let currentLang = $state("pt-BR");

export const i18n = {
    get lang() {
        return currentLang;
    },
    setLang(lang: "en-US" | "pt-BR" | "es-ES") {
        currentLang = lang;
    },
    t(key: string) {
        const langData = translations[currentLang] as Record<string, string>;
        return langData[key] || key;
    }
};
