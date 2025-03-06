let redCount = 0;
let blueCount = 0;

function fetchAndDisplayData(indicators, tableId) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error(`Table with ID '${tableId}' not found.`);
        return;
    }

    table.innerHTML = ''; // Clear previous content

    // Create header row
    const headerRow = table.insertRow();
    headerRow.insertCell().textContent = 'Indicator';
    headerRow.insertCell().textContent = 'Actual';
    headerRow.insertCell().textContent = 'Forecast';
    headerRow.insertCell().textContent = 'Change';

    // Start fetching data for all indicators
    let fetchPromises = indicators.map(indicator => {
        return fetch(`/data/${indicator}.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`Fetched ${indicator} data:`, data); // Debugging log

                if (!Array.isArray(data) || data.length === 0) {
                    console.error(`No valid data for ${indicator}`, data);
                    return;
                }

                // Extract the most recent entry
                const latest = data[0];
                const actual = latest?.actual ?? 'N/A';
                const forecast = latest?.consensus ?? 'N/A';
                const change = (actual - forecast).toFixed(1);

                // Create row
                const tableRow = table.insertRow();
                tableRow.insertCell().textContent = indicator;
                tableRow.insertCell().textContent = actual;
                tableRow.insertCell().textContent = forecast;

                // Ensure change is correctly color-coded
                const changeCell = tableRow.insertCell();
                changeCell.textContent = change;

                // Apply color logic and update counters
                if(indicator == "Inflation" || indicator == "CoreInflation"){
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
                else{
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

            })
            .catch(error => console.error(`Error fetching ${indicator}:`, error));
    });

    // Once all fetches are complete, update the net change display
    Promise.all(fetchPromises).then(() => {
        updateNetChange();
    });
}

// Function to update the net change after all data is processed
function updateNetChange() {
    const netChange = blueCount - redCount;
    const resultElement = document.getElementById("change-result");

    resultElement.textContent = `Net Change: ${netChange}`;
    resultElement.style.color = netChange > 0 ? "blue" : netChange < 0 ? "red" : "black";
}

// Define indicators to fetch
const indicators = ["GDP", "M-PMI", "S-PMI", "RetailSales","CorePCE", "Inflation", "CoreInflation", "PPI", "NFP", "ADP", "JOLTS"]; // Add more as needed

// Fetch data for all indicators into one table
fetchAndDisplayData(indicators, "economic-data-table");
