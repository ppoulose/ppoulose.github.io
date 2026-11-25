
function changeMode() {
    const mode = document.getElementById("inputMode").value;

    document.getElementById("phGroup").style.display =
        mode === "ph" ? "block" : "none";

    document.getElementById("concentrationGroup").style.display =
        mode === "concentration" ? "block" : "none";
}


function calculateDilution() {

    const mode = document.getElementById("inputMode").value;

    let initialC;

    if (mode === "ph") {
        const initialPH =
            Number(document.getElementById("initialPH").value);

        if (!Number.isFinite(initialPH)) {
            showError("Please enter the initial pH.");
            return;
        }

        initialC = Math.pow(10, -initialPH);

    } else {
        initialC =
            Number(document.getElementById("initialC").value);

        if (!Number.isFinite(initialC) || initialC <= 0) {
            showError("Please enter a positive HCl concentration.");
            return;
        }
    }

    const targetPH =
        Number(document.getElementById("targetPH").value);

    const transfer =
        Number(document.getElementById("transferVolume").value);

    const finalVolume =
        Number(document.getElementById("finalVolume").value);

    if (!Number.isFinite(targetPH) ||
        !Number.isFinite(transfer) ||
        !Number.isFinite(finalVolume) ||
        targetPH < 0 || targetPH > 14 ||
        transfer <= 0 ||
        finalVolume <= transfer) {

        showError("Please check the target pH and dilution volumes.");
        return;
    }

    const targetC = Math.pow(10, -targetPH);

    if (initialC < targetC * (1 - 1e-12)) {
        showError("The initial solution is already more dilute than the target.");
        return;
    }

    if (Math.abs(initialC - targetC) / targetC < 1e-12) {
        showError("The initial solution is already at the target concentration. No dilution is needed.");
        return;
    }

    const dilutionFactor = finalVolume / transfer;

    const totalFactor = initialC / targetC;

    // Number of full dilution steps
    const fullSteps = Math.floor(
        Math.log(totalFactor) / Math.log(dilutionFactor) + 1e-12
    );

    let currentC = initialC;
    let rows = [];

    // Initial stock
    rows.push({
        step: "Stock",
        concentration: currentC,
        pH: -Math.log10(currentC),
        transfer: "—",
        final: "—"
    });

    // Full dilution steps
    for (let i = 1; i <= fullSteps; i++) {

        currentC = currentC / dilutionFactor;

        rows.push({
            step: i,
            concentration: currentC,
            pH: -Math.log10(currentC),
            transfer: transfer,
            final: finalVolume
        });
    }

    // Final partial dilution, if required
    if (currentC > targetC * (1 + 1e-12)) {

        const requiredTransfer =
            targetC * finalVolume / currentC;

        currentC = targetC;

        rows.push({
            step: "Final",
            concentration: currentC,
            pH: targetPH,
            transfer: requiredTransfer,
            final: finalVolume
        });
    }

    let html = `
        <h3>Serial Dilution Plan</h3>

        <p>Initial concentration:
        <strong>${initialC.toExponential(4)} M</strong></p>

        <p>Initial theoretical pH:
        <strong>${(-Math.log10(initialC)).toFixed(3)}</strong></p>

        <p>Target pH:
        <strong>${targetPH}</strong></p>

        <p>Number of dilution steps:
        <strong>${rows.length - 1}</strong></p>

        <div style="overflow-x:auto">
        <table class="dilution-table">
            <thead>
                <tr>
                    <th>Step</th>
                    <th>Transfer (mL)</th>
                    <th>Final volume (mL)</th>
                    <th>Concentration (M)</th>
                    <th>Expected pH</th>
                </tr>
            </thead>
            <tbody>
    `;

    rows.forEach(row => {

        html += `
            <tr>
                <td>${row.step}</td>
                <td>${row.transfer === "—" ? "—" :
                    Number(row.transfer).toFixed(4)}</td>
                <td>${row.final === "—" ? "—" :
                    Number(row.final).toFixed(2)}</td>
                <td>${row.concentration.toExponential(4)}</td>
                <td>${row.pH.toFixed(3)}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        </div>

        <p class="procedure">
            <strong>Procedure:</strong> Begin with the stock solution.
            At each step, transfer the indicated volume into a
            suitable volumetric flask and dilute with water to
            the specified final volume. Mix thoroughly before
            taking an aliquot for the next step.
        </p>

        <p>
            The final step may use a smaller transfer volume
            to reach the target concentration exactly.
        </p>
    `;

    const result = document.getElementById("result");
    result.innerHTML = html;
    result.style.display = "block";
}


function showError(message) {
    const result = document.getElementById("result");

    result.style.display = "block";
    result.innerHTML = `
        <h3>Check your inputs</h3>
        <p>${message}</p>
    `;
}
