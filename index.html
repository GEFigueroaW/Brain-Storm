<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FeedFlow 2.0 - Generador IA</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    .descripcion { font-style: italic; color: #555; font-size: 0.875rem; margin-top: 5px; }
    .resultado { white-space: pre-wrap; background: #f9f9f9; border-radius: 8px; padding: 10px; }
  </style>
</head>
<body class="bg-light">

<div class="container py-5">
  <h1 class="mb-4 text-center">FeedFlow 2.0 - Generador de Ideas IA</h1>

  <div class="card shadow-lg p-4">

    <div class="mb-4">
      <label class="form-label">Modo de generación:</label>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="mode" id="multiMode" value="multi" checked>
        <label class="form-check-label" for="multiMode">Multi-redes (una idea por red seleccionada)</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="mode" id="singleMode" value="single">
        <label class="form-check-label" for="singleMode">Una red (tres ideas distintas)</label>
      </div>
    </div>

    <div class="mb-4">
      <label class="form-label">Ideas para:</label>
      <div class="row row-cols-2 row-cols-md-3 g-2">
        <div><input type="checkbox" value="Facebook"> Facebook</div>
        <div><input type="checkbox" value="Instagram"> Instagram</div>
        <div><input type="checkbox" value="LinkedIn"> LinkedIn</div>
        <div><input type="checkbox" value="X"> X (antes Twitter)</div>
        <div><input type="checkbox" value="WhatsApp"> WhatsApp</div>
        <div><input type="checkbox" value="Telegram"> Telegram</div>
        <div><input type="checkbox" value="Reddit"> Reddit</div>
        <div><input type="checkbox" value="TikTok"> TikTok</div>
        <div><input type="checkbox" value="YouTube"> YouTube</div>
      </div>
    </div>

    <div class="mb-4">
      <label class="form-label">Idea o palabra clave:</label>
      <input type="text" id="keyword" class="form-control" placeholder="Escribe aquí...">
    </div>

    <div class="mb-4">
      <label class="form-label">¿Qué efecto quieres generar?</label>
      <select id="desiredEffect" class="form-select">
        <option value="" selected disabled>Selecciona un efecto</option>
        <option value="Aspiración">Aspiración</option>
        <option value="Credibilidad/Autoridad">Credibilidad/Autoridad</option>
        <option value="Curiosidad">Curiosidad</option>
        <option value="Empatía">Empatía</option>
        <option value="Motivación">Motivación</option>
        <option value="Reflexión">Reflexión</option>
        <option value="Seguridad/Confianza">Seguridad/Confianza</option>
        <option value="Simplemente informar">Simplemente informar</option>
      </select>
      <div id="effectDesc" class="descripcion"></div>
    </div>

    <div class="mb-4">
      <label class="form-label">Tipo de copy:</label>
      <select id="copyType" class="form-select">
        <option value="" selected disabled>Selecciona un tipo</option>
        <option value="De beneficio o solución">De beneficio o solución</option>
        <option value="De novedad o lanzamiento">De novedad o lanzamiento</option>
        <option value="De interacción o pregunta">De interacción o pregunta</option>
        <option value="De urgencia o escasez">De urgencia o escasez</option>
        <option value="Informativo o educativo">Informativo o educativo</option>
        <option value="Informal">Informal</option>
        <option value="Llamada a la acción (CTA)">Llamada a la acción (CTA)</option>
        <option value="Narrativo o storytelling">Narrativo o storytelling</option>
        <option value="Posicionamiento o branding">Posicionamiento o branding</option>
        <option value="Testimonio o prueba social">Testimonio o prueba social</option>
        <option value="Técnico o profesional">Técnico o profesional</option>
        <option value="Venta directa o persuasivo">Venta directa o persuasivo</option>
      </select>
      <div id="copyDesc" class="descripcion"></div>
    </div>

    <div class="d-grid">
      <button id="generateBtn" class="btn btn-primary btn-lg">Generar Ideas</button>
    </div>
  </div>

  <div id="results" class="mt-5"></div>
</div>

<!-- Scripts -->
<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-functions.js";

const firebaseConfig = {
  apiKey: "AIzaSyCScJA-UGs3WcBnfAm-6K94ybZ4bzBahz8",
  authDomain: "brain-storm-8f0d8.firebaseapp.com",
  projectId: "brain-storm-8f0d8",
  storageBucket: "brain-storm-8f0d8.appspot.com",
  messagingSenderId: "401208607043",
  appId: "1:401208607043:web:6f35fc81fdce7b3fbeaff6"
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
const generateIdeas = httpsCallable(functions, 'generateIdeas');

const effectDescriptions = {
  "Aspiración": "Generar deseo de superación, logro o alcanzar un ideal.",
  "Credibilidad/Autoridad": "Transmitir experiencia, conocimientos sólidos y respaldo profesional.",
  "Curiosidad": "Despertar el interés, la intriga o el deseo de saber más.",
  "Empatía": "Mostrar comprensión, conexión emocional o identificación con la audiencia.",
  "Motivación": "Impulsar a la acción positiva, generar entusiasmo y energía.",
  "Reflexión": "Invitar a pensar, cuestionar o analizar un tema en profundidad.",
  "Seguridad/Confianza": "Generar tranquilidad, certeza y sensación de respaldo.",
  "Simplemente informar": "Comunicar hechos o datos de manera objetiva y directa."
};

const copyDescriptions = {
  "De beneficio o solución": "Muestra cómo se resuelve un problema o se logra un beneficio concreto.",
  "De novedad o lanzamiento": "Presenta algo nuevo, exclusivo o recientemente lanzado.",
  "De interacción o pregunta": "Involucra a la audiencia haciendo preguntas o fomentando respuestas.",
  "De urgencia o escasez": "Incentiva acción rápida mostrando limitación de tiempo o cantidad.",
  "Informativo o educativo": "Brinda conocimiento, datos o explicación sobre un tema.",
  "Informal": "Lenguaje cercano, casual, desenfadado.",
  "Llamada a la acción (CTA)": "Directo en inducir al usuario a realizar una acción específica.",
  "Narrativo o storytelling": "Cuenta una historia o relato para conectar emocionalmente.",
  "Posicionamiento o branding": "Refuerza la identidad de marca, misión o valores.",
  "Testimonio o prueba social": "Muestra validación social con opiniones, reseñas o casos de éxito.",
  "Técnico o profesional": "Contenido especializado, detallado o para públicos expertos.",
  "Venta directa o persuasivo": "Enfocado directamente en la conversión a compra o contratación."
};

document.getElementById('desiredEffect').addEventListener('change', e => {
  document.getElementById('effectDesc').textContent = effectDescriptions[e.target.value] || "";
});

document.getElementById('copyType').addEventListener('change', e => {
  document.getElementById('copyDesc').textContent = copyDescriptions[e.target.value] || "";
});

// Evento de generación

document.getElementById('generateBtn').addEventListener('click', async () => {
  const keyword = document.getElementById('keyword').value.trim();
  const desiredEffect = document.getElementById('desiredEffect').value;
  const copyType = document.getElementById('copyType').value;
  const mode = document.querySelector('input[name="mode"]:checked').value;

  const selectedNetworks = [];
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    if (cb.checked) selectedNetworks.push(cb.value);
  });

  if (!keyword || !desiredEffect || !copyType || selectedNetworks.length === 0 || !mode) {
    alert('Por favor completa todos los campos.');
    return;
  }

  document.getElementById('results').innerHTML = '<div class="alert alert-info">Generando ideas, por favor espera...</div>';

  try {
    const response = await generateIdeas({ keyword, desiredEffect, copyType, networks: selectedNetworks, mode });
    const ideas = response.data.ideas;

    let output = '<h4>Resultados generados:</h4>';
    ideas.forEach(item => {
      output += `<div class="mb-3 p-3 border rounded">
        <h5>${item.network}</h5>
        <div class="resultado">${item.result}</div>
      </div>`;
    });

    document.getElementById('results').innerHTML = output;
  } catch (error) {
    console.error(error);
    document.getElementById('results').innerHTML = '<div class="alert alert-danger">Error al generar las ideas.</div>';
  }
});
</script>

</body>
</html>
