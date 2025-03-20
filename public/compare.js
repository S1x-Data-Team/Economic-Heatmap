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
    "NZD": "NZ",
    "USD": "US",
    "CAD": "CA",
    "JPY": "JP"
};

function generateCurrencyPairs() {
    const currencies = Object.keys(currencyRegions);
    const pairs = [];

    for (let i = 0; i < currencies.length; i++) {
        for (let j = i + 1; j < currencies.length; j++) {
            pairs.push({
                region1: currencyRegions[currencies[i]],
                region2: currencyRegions[currencies[j]],
                pair: `${currencies[i]}/${currencies[j]}`
            });
        }
    }
    return pairs;
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

    for (let indicator of ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "Unemployment", "InterestRate"]) {
        const data1 = await fetchIndicator(region1, indicator);
        const data2 = await fetchIndicator(region2, indicator);

        if (data1.actual === null || data2.actual === null) continue;

        let score1 = 0, score2 = 0;

        if (indicator === "Unemployment") {
            // Unemployment: Lower is better
            if (data1.actual < data1.forecast) score1 = 1;
            else if (data1.actual > data1.forecast) score1 = -1;

            if (data2.actual < data2.forecast) score2 = 1;
            else if (data2.actual > data2.forecast) score2 = -1;
        } else {
            // Other indicators: Higher is better
            if (data1.actual > data1.forecast) score1 = 1;
            else if (data1.actual < data1.forecast) score1 = -1;

            if (data2.actual > data2.forecast) score2 = 1;
            else if (data2.actual < data2.forecast) score2 = -1;
        }

        const adjustedScore = score1 - score2;
        totalScore += adjustedScore;

        tbody.innerHTML += `<tr><td>${indicator}</td><td style="text-align: center;">${adjustedScore}</td></tr>`;
    }

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

