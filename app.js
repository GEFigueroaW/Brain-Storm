// Definición de los selectores
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

const copyTypes = {
  "De beneficio o solución": "Enfocado en cómo el producto o servicio mejora la vida del usuario.",
  "De novedad o lanzamiento": "Anunciar algo nuevo o recientemente disponible.",
  "De interacción o pregunta": "Involucra a la audiencia haciendo preguntas o fomentando respuestas.",
  "De urgencia o escasez": "Generar sensación de urgencia o limitación de disponibilidad.",
  "Informativo o educativo": "Brindar información o conocimiento útil.",
  "Informal": "Lenguaje coloquial, cercano, relajado y casual.",
  "Llamada a la acción (CTA)": "Indicar claramente el siguiente paso que debe tomar el usuario.",
  "Narrativo o storytelling": "Contar historias o casos que conecten emocionalmente.",
  "Posicionamiento o branding": "Fortalecer la identidad y reputación de la marca.",
  "Testimonio o prueba social": "Mostrar validación social con opiniones, reseñas o casos de éxito.",
  "Técnico o profesional": "Contenido especializado, detallado o para públicos expertos.",
  "Venta directa o persuasivo": "Enfocado directamente en la conversión a compra o contratación."
};

// Cargar selectores al iniciar
window.addEventListener("DOMContentLoaded", () => {
  const effectSelect = document.getElementById("desiredEffect");
  const copySelect = document.getElementById("copyType");
  const effectDesc = document.getElementById("effectDescription");
  const copyDesc = document.getElementById("copyDescription");

  for (const [key, desc] of Object.entries(effects)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    effectSelect.appendChild(option);
  }

  for (const [key, desc] of Object.entries(copyTypes)) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    copySelect.appendChild(option);
  }

  effectSelect.addEventListener("change", () => {
    const selected = effectSelect.value;
    effectDesc.textContent = effects[selected] || "";
  });

  copySelect.addEventListener("change", () => {
    const selected = copySelect.value;
    copyDesc.textContent = copyTypes[selected] || "";
  });
});

// Generar ideas IA
document.getElementById("generateBtn").addEventListener("click", async () => {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const selectedNetworks = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(el => el.value);
  const keyword = document.getElementById("keyword").value.trim();
  const desiredEffect = document.getElementById("desiredEffect").value;
  const copyType = document.getElementById("copyType").value;

  if (!keyword || !desiredEffect || !copyType || selectedNetworks.length === 0) {
    alert("Por favor completa todos los campos y selecciona al menos una red social.");
    return;
  }

  document.getElementById("generateBtn").disabled = true;
  document.getElementById("generateBtn").textContent = "Generando...";

  try {
    const response = await fetch("https://us-central1-brain-storm-8f0d8.cloudfunctions.net/api/generateIdeas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword, desiredEffect, copyType, networks: selectedNetworks, mode })
    });

    if (!response.ok) throw new Error("Error en el servidor");

    const data = await response.json();
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = "";

    data.ideas.forEach(item => {
      const ideaDiv = document.createElement("div");
      ideaDiv.innerHTML = `<h3>${item.network}</h3><pre>${item.result}</pre>`;
      resultContainer.appendChild(ideaDiv);
    });

  } catch (error) {
    console.error("Error al generar las ideas:", error);
    alert("Ocurrió un error al generar las ideas.");
  } finally {
    document.getElementById("generateBtn").disabled = false;
    document.getElementById("generateBtn").textContent = "Generar Ideas";
  }
});
