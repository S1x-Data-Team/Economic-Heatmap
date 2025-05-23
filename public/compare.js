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

const currencyRegions = {
    "EUR": "EU",
    "GBP": "UK",
    "AUD": "AU",
    "NZD": "NZ",
    "USD": "US",
    "CAD": "CA",
    "JPY": "JP"
};

function generateCurrencyPairs() {
    const currencies = Object.keys(currencyRegions);
    return currencies.flatMap((curr, i) => 
        currencies.slice(i + 1).map(pair => ({
            region1: currencyRegions[curr],
            region2: currencyRegions[pair],
            pair: `${curr}/${pair}`
        }))
    );
}

const comparisons = generateCurrencyPairs();

function createComparisonTables() {
    const wrapper = document.createElement("div");
    wrapper.id = "tableWrapper";
    document.body.appendChild(wrapper);

    comparisons.forEach(({ region1, region2, pair }) => {
        const tableId = `${region1.toLowerCase()}-${region2.toLowerCase()}-table`;
        const scoreId = `${region1.toLowerCase()}-${region2.toLowerCase()}-score`;

        const section = document.createElement("div");
        section.classList.add("table-container");
        section.dataset.score = "0"; // Store the score for sorting later
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
        compareRegions(region1, region2, tableId, scoreId);
    });
}

async function compareRegions(region1, region2, tableId, scoreId) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = "";

    let totalScore = 0;
    const indicators = ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "Unemployment", "InterestRate"];

    // Fetch all data in parallel
    const fetchPromises = indicators.map(indicator => 
        Promise.all([fetchIndicator(region1, indicator), fetchIndicator(region2, indicator)])
    );
    const results = await Promise.all(fetchPromises);

    // Create table rows in batch
    const fragment = document.createDocumentFragment();

    results.forEach(([data1, data2], index) => {
        const indicator = indicators[index];
        if (data1.actual === null || data2.actual === null) return;

        let score1 = 0, score2 = 0;

        if (indicator === "Unemployment") {
            // Unemployment: Lower is better
            score1 = data1.actual < data1.forecast ? 1 : data1.actual > data1.forecast ? -1 : 0;
            score2 = data2.actual < data2.forecast ? 1 : data2.actual > data2.forecast ? -1 : 0;
        } else {
            // Other indicators: Higher is better
            score1 = data1.actual > data1.forecast ? 1 : data1.actual < data1.forecast ? -1 : 0;
            score2 = data2.actual > data2.forecast ? 1 : data2.actual < data2.forecast ? -1 : 0;
        }

        const adjustedScore = score1 - score2;
        totalScore += adjustedScore;

        // Create table row
        const row = document.createElement("tr");
        row.innerHTML = `<td>${indicator}</td><td style="text-align: center;">${adjustedScore}</td>`;
        fragment.appendChild(row);
    });

    tbody.appendChild(fragment); // Batch update for better performance

    // Update the total score
    const scoreElement = document.getElementById(scoreId);
    scoreElement.textContent = `Total Score: ${totalScore}`;
    scoreElement.className = `score ${totalScore > 0 ? "blue" : totalScore < 0 ? "red" : "black"}`;

    // Store score for sorting
    const tableContainer = scoreElement.closest(".table-container");
    tableContainer.dataset.score = totalScore;

    // Re-sort tables
    sortTables();
}

function sortTables() {
    const wrapper = document.getElementById("tableWrapper");
    const tables = Array.from(wrapper.children);

    tables.sort((a, b) => Number(b.dataset.score) - Number(a.dataset.score));

    tables.forEach(table => wrapper.appendChild(table)); // Reorder in DOM
}

// Generate and display tables
createComparisonTables();
