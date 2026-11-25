
function calculate() {

    const pH = parseFloat(document.getElementById("ph").value);
    const volumeHCl = parseFloat(document.getElementById("volume").value);
    const molarityNaOH = parseFloat(document.getElementById("molarity").value);

    const result = document.getElementById("result");

    // Validate inputs
    if (
        !Number.isFinite(pH) ||
        !Number.isFinite(volumeHCl) ||
        !Number.isFinite(molarityNaOH) ||
        pH < 0 || pH > 14 ||
        volumeHCl <= 0 ||
        molarityNaOH <= 0
    ) {
        result.style.display = "block";
        result.innerHTML = "<h3>Invalid input</h3><p>Please enter a pH between 0 and 14, and positive values for both volume and molarity.</p>";
        return;
    }

    // HCl concentration (mol/L)
    const molarityHCl = Math.pow(10, -pH);

    // Convert HCl volume to litres
    const volumeHCl_L = volumeHCl / 1000;

    // Calculate moles of HCl
    const molesHCl = molarityHCl * volumeHCl_L;

    // 1:1 neutralization
    const molesNaOH = molesHCl;

    // Calculate volume of NaOH in litres
    const volumeNaOH_L = molesNaOH / molarityNaOH;

    // Convert to mL
    const volumeNaOH_mL = volumeNaOH_L * 1000;

    // Display result
    result.style.display = "block";

    result.innerHTML = `
        <h3>Calculation Result</h3>

        <p>HCl concentration:</p>
        <strong>${molarityHCl.toExponential(4)} mol/L</strong>

        <p>Moles of HCl:</p>
        <strong>${molesHCl.toExponential(4)} mol</strong>

        <p>Required NaOH volume:</p>
        <div class="result-value">
            ${volumeNaOH_mL.toFixed(4)} mL
        </div>

        <p>
            This is the theoretical stoichiometric
            neutralization volume.
        </p>
    `;
}
