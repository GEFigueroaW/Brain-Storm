// app.js completo

document.addEventListener('DOMContentLoaded', () => {

  const effects = {
    "Motivación": "Generar entusiasmo, energía positiva y deseo de actuar.",
    "Credibilidad/Autoridad": "Transmitir experiencia, conocimientos sólidos y respaldo profesional.",
    "Curiosidad": "Despertar el interés, la intriga o el deseo de saber más.",
    "Urgencia o escasez": "Motivar a actuar rápido por tiempo limitado o recursos escasos."
  };

  const copyTypes = {
    "Llamada a la acción (CTA)": "Invita directamente a realizar una acción inmediata.",
    "Testimonio o prueba social": "Muestra validación social con opiniones o casos de éxito.",
    "Informativo o educativo": "Aporta conocimiento útil, consejos o formación.",
    "Técnico o profesional": "Contenido especializado, para públicos expertos."
  };

  document.getElementById('effect').addEventListener('change', e => {
    document.getElementById('effect-desc').innerText = effects[e.target.value] || '';
  });

  document.getElementById('copyType').addEventListener('change', e => {
    document.getElementById('copy-desc').innerText = copyTypes[e.target.value] || '';
  });

  document.getElementById('generateBtn').addEventListener('click', async () => {
    const keyword = document.getElementById('keyword').value.trim();
    const effect = document.getElementById('effect').value;
    const copyType = document.getElementById('copyType').value;
    const networks = Array.from(document.querySelectorAll("input[name='network']:checked")).map(el => el.value);
    const mode = document.querySelector("input[name='mode']:checked").value;

    if (!keyword || !effect || !copyType || networks.length === 0) {
      alert("Por favor completa todos los campos.");
      return;
    }

    document.getElementById('generateBtn').innerText = "Generando...";
    document.getElementById('generateBtn').disabled = true;

    try {
      const response = await fetch("https://us-central1-brain-storm-8f0d8.cloudfunctions.net/api/generateIdeas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, desiredEffect: effect, copyType, networks, mode })
      });

      if (!response.ok) throw new Error("Error en el servidor");

      const data = await response.json();
      mostrarResultados(data.ideas);

    } catch (error) {
      alert("Ocurrió un error al generar las ideas.");
      console.error(error);
    } finally {
      document.getElementById('generateBtn').innerText = "Generar Ideas";
      document.getElementById('generateBtn').disabled = false;
    }
  });

  function mostrarResultados(ideas) {
    document.getElementById('results').style.display = 'block';
    const output = document.getElementById('output');
    output.innerHTML = "";
    ideas.forEach(item => {
      const div = document.createElement('div');
      div.innerHTML = `<h3>${item.network}</h3><pre>${item.result}</pre>`;
      output.appendChild(div);
    });
  }

});
