const translations = {
  es: {
    generate_title: "Generador de Ideas IA",
    mode_label: "Modo de generación:",
    mode_multi: "Multi-redes (una idea por red seleccionada)",
    mode_single: "Una red (tres ideas distintas)",
    networks_label: "Ideas para:",
    keyword_label: "Idea o palabra clave:",
    effect_label: "¿Qué efecto quieres generar?",
    copy_label: "Tipo de copy:",
    generate_button: "Generar Ideas",
    results_title: "Resultados Generados",
    generate_more: "Generar Nuevas Ideas"
  },
  en: {
    generate_title: "AI Idea Generator",
    mode_label: "Generation mode:",
    mode_multi: "Multi-network (one idea per selected network)",
    mode_single: "One network (three distinct ideas)",
    networks_label: "Ideas for:",
    keyword_label: "Idea or keyword:",
    effect_label: "Which effect do you want to generate?",
    copy_label: "Copy type:",
    generate_button: "Generate Ideas",
    results_title: "Generated Results",
    generate_more: "Generate New Ideas"
  },
  pt: {
    generate_title: "Gerador de Ideias IA",
    mode_label: "Modo de geração:",
    mode_multi: "Multi-redes (uma ideia por rede selecionada)",
    mode_single: "Uma rede (três ideias distintas)",
    networks_label: "Ideias para:",
    keyword_label: "Ideia ou palavra-chave:",
    effect_label: "Que efeito você quer gerar?",
    copy_label: "Tipo de copy:",
    generate_button: "Gerar Ideias",
    results_title: "Resultados Gerados",
    generate_more: "Gerar Novas Ideias"
  }
};

function translate(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

// Persistencia de idioma seleccionado
document.addEventListener("DOMContentLoaded", () => {
  const langSelector = document.getElementById("languageSelect");
  const lang = localStorage.getItem("language") || "es";
  translate(lang);
  if (langSelector) {
    langSelector.value = lang;
    langSelector.addEventListener("change", () => {
      const selectedLang = langSelector.value;
      localStorage.setItem("language", selectedLang);
      translate(selectedLang);
    });
  }
});
