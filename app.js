document.getElementById("generate").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value;
  const effect = document.getElementById("effect").value;
  const copy = document.getElementById("copy").value;
  const mode = document.getElementById("mode").value;
  const networks = Array.from(document.querySelectorAll('.network:checked')).map(cb => cb.value);
  
  if (!keyword || !effect || !copy || networks.length === 0) {
    alert("Por favor completa todos los campos y selecciona al menos una red.");
    return;
  }

  document.getElementById("results").classList.remove("hidden");
  document.getElementById("results").innerText = "Generando ideas, espera un momento...";

  try {
    const response = await fetch('https://us-central1-brain-storm-8f0d8.cloudfunctions.net/api/generateIdeas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        keyword: keyword,
        desiredEffect: effect,
        copyType: copy,
        networks: networks,
        mode: mode
      })
    });

    if (!response.ok) throw new Error("Error HTTP " + response.status);
    const data = await response.json();

    let resultHTML = "";
    data.ideas.forEach(item => {
      resultHTML += `<h3>${item.network}</h3><pre>${item.result}</pre><hr>`;
    });

    document.getElementById("results").innerHTML = resultHTML;
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("results").innerText = "Error al generar las ideas: " + error.message;
  }
});
