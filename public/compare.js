const indicators = ["GDP", "M-PMI", "S-PMI", "RetailSales", "Inflation", "Unemployment","InterestRate"];

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

async function compareRegions(region1, region2, tableId, scoreId, pairName) {
    let totalScore = 0;
    let forecastScore1 = 0;
    let forecastScore2 = 0;
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = "";

    for (let indicator of indicators) {
        if (indicator == "InterestRate") {
            const data1 = await fetchIndicator(region1, indicator);
            const data2 = await fetchIndicator(region2, indicator);

            if (data1.actual === null || data2.actual === null) continue;

            let strengthScore = 0;
            if (data1.actual > data2.actual) strengthScore = 1;
            else if (data1.actual < data2.actual) strengthScore = -1;
            else if (data1.actual == data2.actual) strengthScore = 0;

            // Adjust strength score based on forecast beats/misses
            const adjustedScore = strengthScore;
            totalScore += adjustedScore;

            // Add row with adjusted score
            tbody.innerHTML += `<tr>
                <td>${indicator}</td>
                <td style="text-align: center;">${adjustedScore}</td>
            </tr>`; 
        }
        else if (indicator == "Unemployment") {
            const data1 = await fetchIndicator(region1, indicator);
            const data2 = await fetchIndicator(region2, indicator);

            if (data1.actual === null || data2.actual === null) continue;

            if (data1.actual < data1.forecast) forecastScore1 = 1;
            else if (data1.actual > data1.forecast) forecastScore1 = -1;
            else if (data1.actual == data1.forecast) forecastScore1 = 0;

            if (data2.actual < data2.forecast) forecastScore2 = 1;
            else if (data2.actual > data2.forecast) forecastScore2 = -1;
            else if (data2.actual == data2.forecast) forecastScore2 = 0;

            // Adjust strength score based on forecast beats/misses
            const adjustedScore = forecastScore1 - forecastScore2;
            totalScore += adjustedScore;

            // Add row with adjusted score
            tbody.innerHTML += `<tr>
            <td>${indicator}</td>
            <td style="text-align: center;">${adjustedScore}</td>
        </tr>`;
        }
        else {
            const data1 = await fetchIndicator(region1, indicator);
            const data2 = await fetchIndicator(region2, indicator);

            if (data1.actual === null || data2.actual === null) continue;

            if (data1.actual > data1.forecast) forecastScore1 = 1;
            else if (data1.actual < data1.forecast) forecastScore1 = -1;
            else if (data1.actual == data1.forecast) forecastScore1 = 0;

            if (data2.actual > data2.forecast) forecastScore2 = 1;
            else if (data2.actual < data2.forecast) forecastScore2 = -1;
            else if (data2.actual == data2.forecast) forecastScore2 = 0;

            // Adjust strength score based on forecast beats/misses
            const adjustedScore = forecastScore1 - forecastScore2;
            totalScore += adjustedScore;

            // Add row with adjusted score
            tbody.innerHTML += `<tr>
                <td>${indicator}</td>
                <td style="text-align: center;">${adjustedScore}</td>
            </tr>`;
        }
    }

    // Set final score with color
    let color = totalScore > 0 ? "blue" : totalScore < 0 ? "red" : "black";
    document.getElementById(scoreId).textContent = `Total Score: ${totalScore}`;
    document.getElementById(scoreId).style.color = color;
}


// Compare major currency pairs
compareRegions("EU", "US", "eur-usd-table", "eur-usd-score", "EUR/USD");
compareRegions("US", "JP", "usd-jpy-table", "usd-jpy-score", "USD/JPY");
compareRegions("EU", "JP", "eur-jpy-table", "eur-jpy-score", "EUR/JPY");
compareRegions("UK", "US", "gbp-usd-table", "gbp-usd-score", "GBP/USD");
compareRegions("UK", "JP", "gbp-jpy-table", "gbp-jpy-score", "GBP/JPY");
