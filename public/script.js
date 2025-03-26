const regions = {
    US: ["GDP", "M-PMI", "S-PMI", "RetailSales", "CorePCE", "Inflation", "CoreInflation", "PPI", "NFP", "ADP", "JOLTS", "Unemployment", "InterestRate"],
    EU: ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "CoreInflation", "PPI", "Unemployment", "InterestRate"],
    JP: ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "CoreInflation", "PPI", "Unemployment", "InterestRate"],
    UK: ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "CoreInflation", "PPI", "Unemployment", "InterestRate"],
    CA: ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "CoreInflation", "Unemployment", "InterestRate"],
    NZ: ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "Unemployment", "InterestRate"],
    AU: ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "Unemployment", "InterestRate"],
};

function generateRegionTables() {
    const tableWrapper = document.createElement("div");
    tableWrapper.id = "tableWrapper";
    document.body.appendChild(tableWrapper);

    Object.keys(regions).forEach(region => {
        const tableId = `${region}-table`;
        const resultId = `${region}-change-result`;

        const section = document.createElement("div");
        section.classList.add("table-container");
        section.innerHTML = `
            <h2>${region} Comparison</h2>
            <table id="${tableId}">
                <thead>
                    <tr><th>Indicator</th><th>Actual</th><th>Forecast</th><th>Change</th><th>Previous</th></tr>
                </thead>
                <tbody></tbody>
            </table>
            <div id="${resultId}" class="score">Total Score: 0</div>
        `;

        tableWrapper.appendChild(section);
        fetchAndDisplayData(region, tableId, resultId);
    });
}

async function fetchAndDisplayData(region, tableId, resultId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (!tableBody) {
        console.error(`Table with ID '${tableId}' not found.`);
        return;
    }

    tableBody.innerHTML = ''; // Clear previous content
    let redCount = 0, blueCount = 0;
    const indicators = regions[region];

    // Fetch all indicators in parallel
    const fetchPromises = indicators.map(indicator => 
        fetch(`/data/${region}/${indicator}.json`)
            .then(response => response.ok ? response.json() : null)
            .then(data => ({ indicator, data }))
            .catch(() => ({ indicator, data: null }))
    );

    const results = await Promise.all(fetchPromises);
    const fragment = document.createDocumentFragment(); // Batch DOM updates

    results.forEach(({ indicator, data }) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            console.error(`No valid data for ${region} - ${indicator}`, data);
            return;
        }

        const latest = data[0];
        const actual = latest?.actual ?? 'N/A';
        const forecast = latest?.consensus ?? 'N/A';
        const previous = latest?.previous ?? 'N/A';
        const change = (actual - forecast).toFixed(1);
        const previousChange = (actual - previous).toFixed(1);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${indicator}</td>
            <td>${actual}</td>
            <td>${forecast}</td>
            <td style="color: ${getChangeColor(indicator, change)}">${change}</td>
            <td style="color: ${previousChange < 0 ? 'red' : previousChange > 0 ? 'blue' : 'black'}">${previous}</td>
        `;

        fragment.appendChild(row);

        // Update scoring
        if (getChangeColor(indicator, change) === "red") redCount++;
        if (getChangeColor(indicator, change) === "blue") blueCount++;
    });

    tableBody.appendChild(fragment); // Batch update for better performance

    // Update net change after all data is loaded
    const netChange = blueCount - redCount;
    const resultElement = document.getElementById(resultId);
    resultElement.textContent = `Net Change: ${netChange}`;
    resultElement.style.color = netChange > 0 ? "blue" : netChange < 0 ? "red" : "black";
}

// Determines change cell color based on indicator type
function getChangeColor(indicator, change) {
    if (indicator === "Unemployment") {
        return change > 0 ? 'red' : change < 0 ? 'blue' : 'black';
    } else {
        return change < 0 ? 'red' : change > 0 ? 'blue' : 'black';
    }
}

// Generate tables dynamically
generateRegionTables();
