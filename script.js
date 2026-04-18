let chart;

function calcular() {
  const sueldo = parseFloat(document.getElementById("sueldo").value);
  const hijos = parseInt(document.getElementById("hijos").value);
  const tipo = document.getElementById("tipo").value;

  if (!sueldo) return;

  // 🧮 IRPF simple por tramos
  let irpf = 0;

  if (sueldo > 30000) irpf += (Math.min(sueldo, 50000) - 30000) * 0.1;
  if (sueldo > 50000) irpf += (Math.min(sueldo, 80000) - 50000) * 0.15;
  if (sueldo > 80000) irpf += (sueldo - 80000) * 0.2;

  let bps = sueldo * 0.15;
  let fonasa = sueldo * (hijos ? 0.03 : 0.045);

  let total = bps + fonasa + irpf;
  let liquido = sueldo - total;

  if (tipo === "renuncia") liquido += sueldo * 0.25;
  if (tipo === "despido") liquido += sueldo * 0.5;

  document.getElementById("resultado").innerHTML = `
    <h3>Líquido: $${liquido.toFixed(2)}</h3>
    <p>BPS: ${bps.toFixed(2)}</p>
    <p>FONASA: ${fonasa.toFixed(2)}</p>
    <p>IRPF: ${irpf.toFixed(2)}</p>
  `;

  renderChart(bps, fonasa, irpf);
}

// 📊 gráfico
function renderChart(bps, fonasa, irpf) {
  const ctx = document.getElementById("grafico");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["BPS", "FONASA", "IRPF"],
      datasets: [{
        data: [bps, fonasa, irpf],
        backgroundColor: ["#4f46e5", "#22c55e", "#ef4444"]
      }]
    }
  });
}

// 🌙 modo oscuro
function toggleDark() {
  document.body.classList.toggle("dark");
}

// 📄 PDF export
function descargarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("UY Calc Pro - Resultado", 10, 10);
  doc.text(document.getElementById("resultado").innerText, 10, 20);

  doc.save("liquidacion.pdf");
}
