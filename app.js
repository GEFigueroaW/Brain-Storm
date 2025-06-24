document.addEventListener("DOMContentLoaded", () => {
  const modeRadios = document.getElementsByName("mode");
  const form = document.getElementById("ideaForm");
  const generateButton = document.getElementById("generateBtn");
  const resultContainer = document.getElementById("resultContainer");
  const resultContent = document.getElementById("resultContent");

  // Actualiza el texto del botón según el modo seleccionado
  modeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      generateButton.textContent = radio.value === "multi" ? "Generar Ideas" : "Generar 3 Ideas";
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mode = document.querySelector('input[name="mode"]:checked').value;
    const keyword = document.getElementById("keyword").value.trim();
    const desiredEffect = document.getElementById("desiredEffect").value;
    const copyType = document.getElementById("copyType").value;
    const networkCheckboxes = document.querySelectorAll('input[name="networks"]:checked');
    const networks = Array.from(networkCheckboxes).map(cb => cb.value);

    if (!keyword || !desiredEffect || !copyType || networks.length === 0) {
      alert("Por favor completa todos los campos y selecciona al menos una red social.");
      return;
    }

    generateButton.disabled = true;
    generateButton.textContent = "Generando...";

    try {
      const response = await fetch("https://us-central1-brain-storm-8f0d8.cloudfunctions.net/api/generateIdeas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword,
          desiredEffect,
          copyType,
          networks,
          mode: mode === "multi" ? "multi" : "single"
        })
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.ideas && data.ideas.length > 0) {
        resultContent.innerHTML = "";

        data.ideas.forEach(idea => {
          const div = document.createElement("div");
          div.classList.add("ideaResult");
          div.innerHTML = `<h4>${idea.network}</h4><pre>${idea.result}</pre>`;
          resultContent.appendChild(div);
        });

        resultContainer.style.display = "block";
      } else {
        alert("No se recibieron ideas.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al generar las ideas.");
    } finally {
      generateButton.disabled = false;
      generateButton.textContent = "Generar Ideas";
    }
  });
});
