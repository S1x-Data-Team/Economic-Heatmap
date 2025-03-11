const regions = {
    US: ["GDP", "M-PMI", "S-PMI", "RetailSales", "CorePCE", "Inflation", "CoreInflation", "PPI", "NFP", "ADP", "JOLTS", "Unemployment",],
    EU: ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "CoreInflation", "PPI", "Unemployment",],
    JP: ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "CoreInflation", "PPI", "Unemployment",],
    UK: ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "CoreInflation", "PPI", "Unemployment",]
};

function fetchAndDisplayData(region, tableId, resultId) {
    const tableBody = document.querySelector(`#${tableId} tbody`);
    if (!tableBody) {
        console.error(`Table with ID '${tableId}' not found.`);
        return;
    }

    tableBody.innerHTML = ''; // Clear previous content
    let redCount = 0;
    let blueCount = 0;

    let fetchPromises = regions[region].map(indicator => {
        let filePath = `/data/${region}/${indicator}.json`;

        return fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    console.error(`No valid data for ${region} - ${indicator}`, data);
                    return;
                }

                const latest = data[0];
                const actual = latest?.actual ?? 'N/A';
                const forecast = latest?.consensus ?? 'N/A';
                const previous = latest?.previous.toFixed(1) ?? 'N/A';
                const change = (actual - forecast).toFixed(1);
                const previousChange = (actual - previous).toFixed(1);

                const row = tableBody.insertRow();
                row.insertCell().textContent = indicator;
                row.insertCell().textContent = actual;
                row.insertCell().textContent = forecast;

                const changeCell = row.insertCell();
                changeCell.textContent = change;
                const previousCell = row.insertCell();
                previousCell.textContent = previous;

                if (indicator == "Unemployment") {
                    if (change > 0) {
                        changeCell.style.color = 'red';  // Lower than forecast
                        redCount++;
                    } else if (change < 0) {
                        changeCell.style.color = 'blue'; // Higher than forecast
                        blueCount++;
                    } else {
                        changeCell.style.color = 'black'; // No change
                    }
                }
                else {
                    if (change < 0) {
                        changeCell.style.color = 'red';  // Lower than forecast
                        redCount++;
                    } else if (change > 0) {
                        changeCell.style.color = 'blue'; // Higher than forecast
                        blueCount++;
                    } else {
                        changeCell.style.color = 'black'; // No change
                    }
                }

                if (indicator == "Unemployment") {
                    if (previousChange > 0) {
                        previousCell.style.color = 'red';  // Lower than forecast
                    } else if (previousChange < 0) {
                        previousCell.style.color = 'blue'; // Higher than forecast
                    } else {
                        previousCell.style.color = 'black'; // No change
                    }
                }
                else {
                    if (previousChange < 0) {
                        previousCell.style.color = 'red';  // Lower than forecast
                    } else if (previousChange > 0) {
                        previousCell.style.color = 'blue'; // Higher than forecast
                    } else {
                        previousCell.style.color = 'black'; // No change
                    }
                }
            })
            .catch(error => console.error(`Error fetching ${region} - ${indicator}:`, error));
    });

    // Update net change after all data is loaded
    Promise.all(fetchPromises).then(() => {
        const netChange = blueCount - redCount;
        const resultElement = document.getElementById(resultId);

        resultElement.textContent = `Net Change: ${netChange}`;
        resultElement.style.color = netChange > 0 ? "blue" : netChange < 0 ? "red" : "black";
    });
}

// Fetch data and display for each region
fetchAndDisplayData("US", "US-table", "US-change-result");
fetchAndDisplayData("EU", "EU-table", "EU-change-result");
fetchAndDisplayData("JP", "JP-table", "JP-change-result");
fetchAndDisplayData("UK", "UK-table", "UK-change-result");