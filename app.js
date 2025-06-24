// Inicialización de Firebase
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

// Datos estáticos

const effectOptions = {
  "Aspiración": "Generar deseo de superación, logro o alcanzar un ideal.",
  "Credibilidad/Autoridad": "Transmitir experiencia, conocimientos sólidos y respaldo profesional.",
  "Curiosidad": "Despertar el interés, la intriga o el deseo de saber más.",
  "Empatía": "Mostrar comprensión, conexión emocional o identificación con la audiencia.",
  "Motivación": "Impulsar a la acción positiva, generar entusiasmo y energía.",
  "Reflexión": "Invitar a pensar, cuestionar o analizar un tema en profundidad.",
  "Seguridad/Confianza": "Generar tranquilidad, certeza y sensación de respaldo.",
  "Simplemente informar": "Comunicar hechos o datos de manera objetiva y directa."
};

const copyOptions = {
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

// Inicializa selects dinámicos

window.addEventListener('DOMContentLoaded', () => {
  const effectSelect = document.getElementById('desiredEffect');
  for (let key in effectOptions) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = key;
    effectSelect.appendChild(opt);
  }

  const copySelect = document.getElementById('copyType');
  for (let key in copyOptions) {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = key;
    copySelect.appendChild(opt);
  }
});

// Actualiza descripción dinámica

document.getElementById('desiredEffect').addEventListener('change', e => {
  document.getElementById('effectDesc').textContent = effectOptions[e.target.value] || "";
});

document.getElementById('copyType').addEventListener('change', e => {
  document.getElementById('copyDesc').textContent = copyOptions[e.target.value] || "";
});

// Acción de generación IA

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
