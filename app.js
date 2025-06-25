const API_URL = "https://us-central1-brain-storm-8f0d8.cloudfunctions.net/api";

const effectOptions = {
  "Curiosidad": "Despertar el interés, la intriga o el deseo de saber más.",
  "Urgencia o escasez": "Generar sensación de oportunidad limitada o riesgo de pérdida.",
  "Autoridad o credibilidad": "Transmitir experiencia, validación o respaldo profesional.",
  "Confianza / Seguridad": "Inspirar tranquilidad, certeza y soporte.",
  "Emoción / Motivación": "Apelar a emociones positivas, inspiración o acción."
};

const copyOptions = {
  "Educativo": "Contenido que enseña, explica o informa.",
  "Persuasivo": "Orientado a convencer o influir para tomar acción.",
  "Entretenido": "Divertido, ameno, llamativo y viral.",
  "Testimonio": "Validación social a través de opiniones o casos de éxito.",
  "CTA directo": "Llamada clara a comprar, reservar o contratar."
};

document.addEventListener("DOMContentLoaded", () => {
  const effectSelect = document.getElementById("effect");
  const copySelect = document.getElementById("copy");
  const effectDesc = document.getElementById("effect-description");
  const copyDesc = document.getElementById("copy-description");

  // Llenar selects
  for (const key in effectOptions) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    effectSelect.appendChild(option);
  }
  for (const key in copyOptions) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = key;
    copySelect.appendChild(option);
  }

  effectSelect.addEventListener("change", () => {
    effectDesc.textContent = effectOptions[effectSelect.value] || "";
  });

  copySelect.addEventListener("change", () => {
    copyDesc.textContent = copyOptions[copySelect.value] || "";
  });

  document.getElementById("generateBtn").addEventListener("click", async () => {
    const keyword = document.getElementById("keyword").value.trim();
    const desiredEffect = effectSelect.value;
    const copyType = copySelect.value;
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const networks = Array.from(document.querySelectorAll('input[name="network"]:checked')).map(cb => cb.value);

    if (!keyword || !desiredEffect || !copyType || networks.length === 0) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, desiredEffect, copyType, networks, mode })
      });

      if (!response.ok) throw new Error("Error al generar.");

      const data = await response.json();
      document.getElementById("result").innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    } catch (err) {
      console.error(err);
      alert("Error al generar las ideas.");
    }
  });
});
