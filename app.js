document.addEventListener("DOMContentLoaded", () => {
  const generateButton = document.querySelector(".button");

  generateButton.addEventListener("click", async () => {
    const keyword = document.getElementById("keyword").value.trim();
    const mode = document.querySelector('input[name="mode"]:checked')?.value;
    const selectedNetworks = Array.from(document.querySelectorAll('input[name="network"]:checked')).map(el => el.value);
    const desiredEffect = document.getElementById("desiredEffect").value;
    const copyType = document.getElementById("copyType").value;

    if (!keyword || !desiredEffect || !copyType || selectedNetworks.length === 0 || !mode) {
      alert("Por favor completa todos los campos y selecciona al menos una red social.");
      return;
    }

    generateButton.disabled = true;
    generateButton.textContent = "Generando...";

    try {
      const response = await fetch("https://us-central1-brain-storm-8f0d8.cloudfunctions.net/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, desiredEffect, copyType, networks: selectedNetworks, mode })
      });

      if (!response.ok) throw new Error("Error en el servidor");

      const data = await response.json();

      console.log("Ideas generadas:", data);

      // Guardar los resultados en localStorage
      localStorage.setItem("feedflowResults", JSON.stringify(data.ideas));

      // Redirigir al results.html
      window.location.href = "results.html";

    } catch (error) {
      console.error("Error al generar ideas:", error);
      alert("Ocurrió un error al generar las ideas.");
    }

    generateButton.disabled = false;
    generateButton.textContent = "Generar Ideas";
  });
});