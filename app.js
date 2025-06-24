document.addEventListener("DOMContentLoaded", () => {
  const effectSelect = document.getElementById("desiredEffect");
  const effectDescription = document.getElementById("effectDescription");
  const copySelect = document.getElementById("copyType");
  const copyDescription = document.getElementById("copyDescription");
  const generateButton = document.getElementById("generateBtn");
  const modeRadios = document.getElementsByName("mode");

  // Efectos posibles
  const effects = {
    "Aspiración": "Generar deseo de superación, logro o alcanzar un ideal.",
    "Credibilidad/Autoridad": "Transmitir experiencia, conocimientos sólidos y respaldo profesional.",
    "Curiosidad": "Despertar el interés, la intriga o el deseo de saber más.",
    "Empatía": "Mostrar comprensión, conexión emocional o identificación con la audiencia.",
    "Motivación": "Impulsar a la acción positiva, generar entusiasmo y energía.",
    "Reflexión": "Invitar a pensar, cuestionar o analizar un tema en profundidad.",
    "Seguridad/Confianza": "Generar tranquilidad, certeza y sensación de respaldo.",
    "Simplemente informar": "Comunicar hechos o datos de manera objetiva y directa."
  };

  // Tipos de copy posibles
  const copyTypes = {
    "De beneficio o solución": "Presenta cómo el producto o servicio resuelve un problema.",
    "De novedad o lanzamiento": "Enfatiza algo nuevo, exclusivo o recién lanzado.",
    "De interacción o pregunta": "Involucra a la audiencia haciendo preguntas o fomentando respuestas.",
    "De urgencia o escasez": "Genera sensación de tiempo limitado o pocas unidades disponibles.",
    "Informativo o educativo": "Brinda conocimiento o datos útiles al público.",
    "Informal": "Lenguaje relajado, cercano y cotidiano.",
    "Llamada a la acción (CTA)": "Instruye claramente qué acción debe realizar el lector.",
    "Narrativo o storytelling": "Cuenta una historia o experiencia emocional.",
    "Posicionamiento o branding": "Refuerza la identidad o valores de la marca.",
    "Testimonio o prueba social": "Muestra validación social con opiniones, reseñas o casos de éxito.",
    "Técnico o profesional": "Contenido especializado, detallado o para públicos expertos.",
    "Venta directa o persuasivo": "Enfocado directamente en la conversión a compra o contratación."
  };

  // Cargar efectos en el select
  for (const [key, desc] of Object.entries(effects)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    effectSelect.appendChild(option);
  }

  // Cargar tipos de copy en el select
  for (const [key, desc] of Object.entries(copyTypes)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    copySelect.appendChild(option);
  }

  // Mostrar descripción de efecto
  effectSelect.addEventListener("change", () => {
    const selected = effectSelect.value;
    effectDescription.textContent = effects[selected] || "";
  });

  // Mostrar descripción de tipo de copy
  copySelect.addEventListener("change", () => {
    const selected = copySelect.value;
    copyDescription.textContent = copyTypes[selected] || "";
  });

  generateButton.addEventListener("click", async () => {
    const keyword = document.getElementById("keyword").value.trim();
    const desiredEffect = effectSelect.value;
    const copyType = copySelect.value;
    const networkCheckboxes = document.querySelectorAll("input[name='networks']:checked");
    const networks = Array.from(networkCheckboxes).map(cb => cb.value);
    let mode = "";
    modeRadios.forEach(radio => { if (radio.checked) mode = radio.value; });

    if (!keyword || !desiredEffect || !copyType || networks.length === 0 || !mode) {
      alert("Por favor completa todos los campos y selecciona al menos una red social.");
      return;
    }

    generateButton.disabled = true;
    generateButton.textContent = "Generando...";

    try {
      const response = await fetch("https://us-central1-brain-storm-8f0d8.cloudfunctions.net/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, desiredEffect, copyType, networks, mode })
      });

      if (!response.ok) {
        throw new Error("Error al generar las ideas");
      }

      const data = await response.json();
      console.log("Ideas generadas:", data);

      alert("¡Ideas generadas correctamente! Revisa consola para verlas.");
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al generar las ideas.");
    }

    generateButton.disabled = false;
    generateButton.textContent = "Generar Ideas";
  });
});
