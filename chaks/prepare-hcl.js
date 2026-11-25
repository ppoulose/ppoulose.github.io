
function prepareHCl() {

    const stock = Number(document.getElementById("stock").value);
    const finalVolume = Number(document.getElementById("finalVolume").value);

    const result = document.getElementById("result");

    if (!Number.isFinite(stock) || !Number.isFinite(finalVolume) ||
        stock <= 0 || finalVolume <= 0) {

        result.style.display = "block";
        result.innerHTML =
            "<h3>Invalid input</h3><p>Enter positive values for both inputs.</p>";
        return;
    }

    // Target concentration for pH 4
    const targetConcentration = Math.pow(10, -4);

    if (stock < targetConcentration) {
        result.style.display = "block";
        result.innerHTML =
            "<h3>Stock solution too dilute</h3>" +
            "<p>The stock concentration must be at least 0.0001 M.</p>";
        return;
    }

    // C1 V1 = C2 V2
    const stockVolume =
        (targetConcentration * finalVolume) / stock;

    const waterVolume = finalVolume - stockVolume;

    result.style.display = "block";

    result.innerHTML = `
        <h3>Preparation calculation</h3>

        <p>Target pH: <strong>4</strong></p>

        <p>Target HCl concentration:</p>
        <strong>1.0 × 10⁻⁴ mol/L</strong>

        <p>Volume of stock HCl required:</p>

        <div class="result-value">
            ${stockVolume.toFixed(4)} mL
        </div>

        <p>Final solution volume:</p>
        <strong>${finalVolume.toFixed(2)} mL</strong>

        <p>Approximate water volume:</p>
        <strong>${waterVolume.toFixed(4)} mL</strong>

        <p>
            Measure the calculated stock acid volume,
            add it slowly to some water, and then dilute
            with water to the specified final volume.
        </p>
    `;
}
