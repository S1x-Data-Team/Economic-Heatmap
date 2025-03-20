const regions = {
    US: ["GDP", "M-PMI", "S-PMI", "RetailSales", "CorePCE", "Inflation", "CoreInflation", "PPI", "NFP", "ADP", "JOLTS", "Unemployment","InterestRate"],
    EU: ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "CoreInflation", "PPI", "Unemployment","InterestRate"],
    JP: ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "CoreInflation", "PPI", "Unemployment","InterestRate"],
    UK: ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "CoreInflation", "PPI", "Unemployment","InterestRate"],
    CA: ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "CoreInflation", "Unemployment","InterestRate"],
};

function generateRegionTables() {
    const tableWrapper = document.getElementById("tableWrapper");

    Object.keys(regions).forEach(region => {
        const tableId = `${region}-table`;
        const resultId = `${region}-change-result`;

        const section = document.createElement("div");
        section.classList.add("tableWrapper");
        section.innerHTML = `
            <h2>${region} Economic Indicators</h2>
            <table id="${tableId}">
                <thead>
                    <tr><th>Indicator</th><th>Actual</th><th>Forecast</th><th>Change</th><th>Previous</th></tr>
                </thead>
                <tbody></tbody>
            </table>
            <div id="${resultId}" class="score">Net Change: 0</div>
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
    let redCount = 0;
    let blueCount = 0;

    for (const indicator of regions[region]) {
        let filePath = `/data/${region}/${indicator}.json`;

        try {
            const response = await fetch(filePath);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) {
                console.error(`No valid data for ${region} - ${indicator}`, data);
                continue;
            }

            const latest = data[0];
            const actual = latest?.actual ?? 'N/A';
            const forecast = latest?.consensus ?? 'N/A';
            const previous = latest?.previous ?? 'N/A';
            const change = (actual - forecast).toFixed(1);
            const previousChange = (actual - previous).toFixed(1);

            const row = tableBody.insertRow();
            row.insertCell().textContent = indicator;
            row.insertCell().textContent = actual;
            row.insertCell().textContent = forecast;

            // Change cell
            const changeCell = row.insertCell();
            changeCell.textContent = change;

            // Previous cell
            const previousCell = row.insertCell();
            previousCell.textContent = previous;

            // Color logic for scoring
            if (indicator === "Unemployment") {
                if (change > 0) {
                    changeCell.style.color = 'red';  
                    redCount++;
                } else if (change < 0) {
                    changeCell.style.color = 'blue'; 
                    blueCount++;
                }
            } else {
                if (change < 0) {
                    changeCell.style.color = 'red';  
                    redCount++;
                } else if (change > 0) {
                    changeCell.style.color = 'blue'; 
                    blueCount++;
                }
            }

            // Color logic for previous change
            previousCell.style.color = previousChange < 0 ? 'red' : previousChange > 0 ? 'blue' : 'black';

        } catch (error) {
            console.error(`Error fetching ${region} - ${indicator}:`, error);
        }
    }

    // Update net change after all data is loaded
    const netChange = blueCount - redCount;
    const resultElement = document.getElementById(resultId);
    resultElement.textContent = `Net Change: ${netChange}`;
    resultElement.style.color = netChange > 0 ? "blue" : netChange < 0 ? "red" : "black";
}

// Generate tables dynamically
generateRegionTables();
