const indicators = ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "Unemployment", "InterestRate"];
const comparisons = [
    { region1: "EU", region2: "US", pair: "EUR/USD" },
    { region1: "EU", region2: "JP", pair: "EUR/JPY" },
    { region1: "EU", region2: "CA", pair: "EUR/CAD" },
    { region1: "EU", region2: "UK", pair: "EUR/GBP" },
    { region1: "US", region2: "CA", pair: "USD/CAD" },
    { region1: "US", region2: "JP", pair: "USD/JPY" },
    { region1: "UK", region2: "US", pair: "GBP/USD" },
    { region1: "UK", region2: "CA", pair: "GBP/CAD" },
    { region1: "UK", region2: "JP", pair: "GBP/JPY" },
    { region1: "CA", region2: "JP", pair: "CAD/JPY" },
]
async function fetchIndicator(region, indicator) {
    try {
        const response = await fetch(`/data/${region}/${indicator}.json`);
        if (!response.ok) throw new Error(`No data for ${region} - ${indicator}`);
        const data = await response.json();
        return {
            actual: data[0]?.actual ?? null,
            forecast: data[0]?.consensus ?? null
        };
    } catch (error) {
        console.error(error);
        return { actual: null, forecast: null };
    }
}

async function compareRegions(region1, region2, tableId, scoreId) {
    let totalScore = 0;
    let forecastScore1 = 0;
    let forecastScore2 = 0;
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = "";

    for (let indicator of indicators) {
        const data1 = await fetchIndicator(region1, indicator);
        const data2 = await fetchIndicator(region2, indicator);

        if (data1.actual === null || data2.actual === null) continue;

        if (indicator === "Unemployment") {
            forecastScore1 = data1.actual < data1.forecast ? 1 : data1.actual > data1.forecast ? -1 : 0;
            forecastScore2 = data2.actual < data2.forecast ? 1 : data2.actual > data2.forecast ? -1 : 0;
            let adjustedScore = forecastScore1 - forecastScore2;
            totalScore += adjustedScore;
            tbody.innerHTML += `<tr><td>${indicator}</td><td>${adjustedScore}</td></tr>`;
        } else {
            forecastScore1 = data1.actual > data1.forecast ? 1 : data1.actual < data1.forecast ? -1 : 0;
            forecastScore2 = data2.actual > data2.forecast ? 1 : data2.actual < data2.forecast ? -1 : 0;
            let adjustedScore = forecastScore1 - forecastScore2;
            totalScore += adjustedScore;
            tbody.innerHTML += `<tr><td>${indicator}</td><td>${adjustedScore}</td></tr>`;
        }
    }

    let color = totalScore > 0 ? "blue" : totalScore < 0 ? "red" : "black";
    document.getElementById(scoreId).textContent = `Total Score: ${totalScore}`;
    document.getElementById(scoreId).style.color = color;
}

function createComparisonTables() {
    const wrapper = document.createElement("div");
    wrapper.id = "tableWrapper";
    document.body.appendChild(wrapper);

    comparisons.forEach(({ region1, region2, pair }) => {
        const tableId = `${region1.toLowerCase()}-${region2.toLowerCase()}-table`;
        const scoreId = `${region1.toLowerCase()}-${region2.toLowerCase()}-score`;

        // Create table container
        const section = document.createElement("div");
        section.innerHTML = `
            <h2>${pair} Comparison</h2>
            <table id="${tableId}">
                <thead>
                    <tr><th>Indicator</th><th>Score</th></tr>
                </thead>
                <tbody></tbody>
            </table>
            <div id="${scoreId}" class="score">Total Score: 0</div>
        `;

        wrapper.appendChild(section);

        // Fetch data and populate table
        compareRegions(region1, region2, tableId, scoreId);
    });
}


// Generate tables and fetch data
createComparisonTables();
