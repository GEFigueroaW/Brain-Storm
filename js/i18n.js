const translations = {
    es: {
        welcomeTitle: "Bienvenido a FeedFlow",
        loginWithGoogle: "Iniciar sesión con Google",
        mainTitle: "Generar Contenido - FeedFlow",
        logout: "Cerrar sesión",
        welcome: "¡Hola",
        ideaKeyword: "Idea o palabra clave",
        generationMode: "Modo de generación",
        multiMode: "Multi-redes (1 idea por red)",
        singleMode: "Una red (3 ideas diferentes)",
        socialNetworks: "Redes sociales",
        copyType: "Tipo de copy",
        desiredEffect: "Efecto deseado",
        generateButton: "¡Que fluyan las ideas!",
        remainingCredits: "Generaciones restantes esta semana:",
        
        // Descripciones de copy types
        informative_desc: "Brinda datos, enseñanza o formación",
        informal_desc: "Tono cercano, cotidiano y relajado",
        technical_desc: "Informa con precisión técnica para especialistas",
        
        // Descripciones de efectos
        motivation_desc: "Impulsa a la acción positiva, genera entusiasmo y energía",
        reflection_desc: "Invita a pensar, cuestionar o analizar en profundidad",
        inform_desc: "Comunica hechos o datos de manera objetiva y directa"
    },
    en: {
        // Traducciones en inglés
    },
    pt: {
        // Traducciones en portugués
    }
};

let currentLanguage = 'es';

function setLanguage(lang) {
    currentLanguage = lang;
    applyTranslations();
    localStorage.setItem('feedflow_lang', lang);
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = translations[currentLanguage][key] || key;
    });
    
    // Actualizar descripciones dinámicas
    updateDynamicDescriptions();
}

// Cargar idioma guardado
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('feedflow_lang') || 'es';
    setLanguage(savedLang);
    
    // Selectores de idioma
    document.querySelectorAll('.language-selector button').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.getAttribute('data-lang'));
        });
    });
});