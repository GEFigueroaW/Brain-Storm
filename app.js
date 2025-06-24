document.getElementById("generateBtn").addEventListener("click", async () => {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  const selectedNetworks = Array.from(document.querySelectorAll('input[name="networks"]:checked')).map(el => el.value);
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        keyword,
        desiredEffect,
        copyType,
        networks: selectedNetworks,
        mode
      })
    });

    if (!response.ok) {
      throw new Error("Error en el servidor");
    }

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
