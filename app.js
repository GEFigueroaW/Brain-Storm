// app.js profesional y definitivo

// Mapas de descripciones
const efectos = {
    "Aspiración": "Generar deseo de superación, logro o alcanzar un ideal.",
    "Credibilidad/Autoridad": "Transmitir experiencia, conocimientos sólidos y respaldo profesional.",
    "Curiosidad": "Despertar el interés, la intriga o el deseo de saber más.",
    "Empatía": "Mostrar comprensión, conexión emocional o identificación con la audiencia.",
    "Motivación": "Impulsar a la acción positiva, generar entusiasmo y energía.",
    "Reflexión": "Invitar a pensar, cuestionar o analizar un tema en profundidad.",
    "Seguridad/Confianza": "Generar tranquilidad, certeza y sensación de respaldo.",
    "Simplemente informar": "Comunicar hechos o datos de manera objetiva y directa."
};

const tiposCopy = {
    "De beneficio o solución": "Enfocado en mostrar cómo se resuelve un problema o necesidad.",
    "De novedad o lanzamiento": "Anuncia algo nuevo o innovador.",
    "De interacción o pregunta": "Involucra a la audiencia haciendo preguntas o fomentando respuestas.",
    "De urgencia o escasez": "Genera sensación de inmediatez o limitada disponibilidad.",
    "Informativo o educativo": "Entrega conocimiento o datos relevantes.",
    "Informal": "Lenguaje cercano, relajado y coloquial.",
    "Llamada a la acción (CTA)": "Invita directamente a realizar una acción específica.",
    "Narrativo o storytelling": "Cuenta una historia o experiencia para conectar emocionalmente.",
    "Posicionamiento o branding": "Fortalece la identidad de marca.",
    "Testimonio o prueba social": "Muestra validación social con opiniones, reseñas o casos de éxito.",
    "Técnico o profesional": "Contenido especializado, detallado o para públicos expertos.",
    "Venta directa o persuasivo": "Enfocado directamente en la conversión a compra o contratación."
};

// Referencias de DOM
const efectoSelect = document.getElementById("desiredEffect");
const efectoDesc = document.getElementById("desiredEffectDescription");
const copySelect = document.getElementById("copyType");
const copyDesc = document.getElementById("copyTypeDescription");
const generarBtn = document.getElementById("generateBtn");

// Carga inicial de descripciones
efectoSelect.addEventListener("change", () => {
    const valor = efectoSelect.value;
    efectoDesc.textContent = efectos[valor] || "";
});

copySelect.addEventListener("change", () => {
    const valor = copySelect.value;
    copyDesc.textContent = tiposCopy[valor] || "";
});

// Función principal de generación
generarBtn.addEventListener("click", async () => {
    const modo = document.querySelector('input[name="generationMode"]:checked')?.value;
    const keyword = document.getElementById("keyword").value.trim();
    const redesSeleccionadas = Array.from(document.querySelectorAll('input[name="networks"]:checked')).map(cb => cb.value);
    const efecto = efectoSelect.value;
    const tipoCopy = copySelect.value;

    if (!modo || !keyword || redesSeleccionadas.length === 0 || !efecto || !tipoCopy) {
        alert("Por favor completa todos los campos y selecciona al menos una red social.");
        return;
    }

    try {
        generarBtn.disabled = true;
        generarBtn.textContent = "Generando...";

        const response = await fetch("https://us-central1-brain-storm-8f0d8.cloudfunctions.net/api", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mode: modo,
                keyword: keyword,
                networks: redesSeleccionadas,
                desiredEffect: efecto,
                copyType: tipoCopy
            })
        });

        if (!response.ok) throw new Error("Error en el servidor");

        const data = await response.json();
        console.log("Ideas generadas:", data);
        alert("¡Ideas generadas con éxito (ver consola para resultados)!");
        // Aquí luego conectaremos con results.html para presentar profesionalmente

    } catch (error) {
        console.error("Error al generar las ideas:", error);
        alert("Ocurrió un error al generar las ideas.");
    } finally {
        generarBtn.disabled = false;
        generarBtn.textContent = "Generar Ideas";
    }
});
