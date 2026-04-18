function calculateIRPF(income) {
  let tax = 0;

  if (income <= 40750) {
    tax = 0;
  } else if (income <= 58250) {
    tax = (income - 40750) * 0.10;
  } else if (income <= 87500) {
    tax = 17500 * 0.10 + (income - 58250) * 0.15;
  } else if (income <= 175000) {
    tax = 17500 * 0.10 + 29250 * 0.15 + (income - 87500) * 0.24;
  } else {
    tax =
      17500 * 0.10 +
      29250 * 0.15 +
      87500 * 0.24 +
      (income - 175000) * 0.25;
  }

  return tax;
}

function calculateFONASA(income) {
  return income * 0.06;
}

function calculateNetSalary(income) {
  const irpf = calculateIRPF(income);
  const fonasa = calculateFONASA(income);
  const aguinaldo = income / 12;
  const renuncia = income * 0.2;

  const total = irpf + fonasa;

  return {
    irpf,
    fonasa,
    aguinaldo,
    renuncia,
    neto: income - total
  };
}

function calculate() {
  const salary = Number(document.getElementById("salary").value);

  if (!salary) {
    document.getElementById("result").innerHTML = "Ingresá un sueldo válido";
    return;
  }

  const result = calculateNetSalary(salary);

  document.getElementById("result").innerHTML = `
    💰 IRPF: $${result.irpf.toFixed(2)}<br>
    🏥 FONASA: $${result.fonasa.toFixed(2)}<br>
    🎁 Aguinaldo: $${result.aguinaldo.toFixed(2)}<br>
    🚪 Renuncia: $${result.renuncia.toFixed(2)}<br>
    <hr>
    🧾 Neto: $${result.neto.toFixed(2)}
  `;

  // cargar PDF data
  document.getElementById("p-bruto").innerText = salary;
  document.getElementById("p-irpf").innerText = result.irpf.toFixed(2);
  document.getElementById("p-fonasa").innerText = result.fonasa.toFixed(2);
  document.getElementById("p-aguinaldo").innerText = result.aguinaldo.toFixed(2);
  document.getElementById("p-renuncia").innerText = result.renuncia.toFixed(2);
  document.getElementById("p-neto").innerText = result.neto.toFixed(2);
}

async function downloadPDF() {
  const element = document.getElementById("pdf");

  const canvas = await html2canvas(element, {
    scale: 2
  });

  const imgData = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const imgWidth = 190;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

  pdf.save("sueldo-uruguay-pro.pdf");
}
