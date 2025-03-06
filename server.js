const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = 3000;

const dataSources = {
    US: {
        "Inflation": "https://calendar-api.fxsstatic.com/en/api/v1/events/6f846eaa-9a12-43ab-930d-f059069c6646/historical?take=1",
        "CoreInflation": "https://calendar-api.fxsstatic.com/en/api/v1/events/9ae5cf07-55da-4f0f-b21d-f6f0835731d9/historical?take=1",
        "RetailSales": "https://calendar-api.fxsstatic.com/en/api/v1/events/31b216da-2502-4428-af5b-d3c54b68ebe4/historical?take=1",
        "PPI": "https://calendar-api.fxsstatic.com/en/api/v1/events/0bedb3be-170a-4cd6-a88e-18ba59647bd2/historical?take=1",
        "NFP": "https://calendar-api.fxsstatic.com/en/api/v1/events/9cdf56fd-99e4-4026-aa99-2b6c0ca92811/historical?take=1",
        "ADP": "https://calendar-api.fxsstatic.com/en/api/v1/events/4f50e4f8-cd33-428b-b721-5fb620b7f097/historical?take=1",
        "JOLTS": "https://calendar-api.fxsstatic.com/en/api/v1/events/9ba65d91-c2d2-4e4b-b6f3-dfe3677dc980/historical?take=1",
        "M-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/2e1d69f3-8273-4096-b01b-8d2034d4fade/historical?take=1",
        "S-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/6c5853c1-a409-4722-bdea-17ad5d8a193f/historical?take=1",
        "GDP": "https://calendar-api.fxsstatic.com/en/api/v1/events/5f64264e-5097-4359-b60f-fb9b01229068/historical?take=1",
        "CorePCE": "https://calendar-api.fxsstatic.com/en/api/v1/events/fd5a3b53-db1c-4ec4-8393-ff91ca73a272/historical?take=1",
        "Unemployment": "https://calendar-api.fxsstatic.com/en/api/v1/events/932c21fa-f664-40e1-a921-dbeb452f0081/historical?take=1",
    },
    EU: {
        "Inflation": "https://calendar-api.fxsstatic.com/en/api/v1/events/54334a3a-4347-40bc-8755-78f6f4ae4b9a/historical?take=1",
        "CoreInflation": "https://calendar-api.fxsstatic.com/en/api/v1/events/9225eef1-de8e-4276-a1f7-43be5f314b1f/historical?take=1",
        "RetailSales": "https://calendar-api.fxsstatic.com/en/api/v1/events/35a891d7-3ef1-435a-abd4-6efcfb654efe/historical?take=1",
        "PPI": "https://calendar-api.fxsstatic.com/en/api/v1/events/f8319d36-b2f1-4995-81c8-675220d8ffbc/historical?take=1",
        "M-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/b03fa53b-f5c1-4ff9-8fc6-49cd848f3d1c/historical?take=1",
        "S-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/d693560c-1a96-4409-a9d8-5979a23eaca4/historical?take=1",
        "GDP": "https://calendar-api.fxsstatic.com/en/api/v1/events/857e7a75-eb94-4ff3-a8d3-7037d3074bb5/historical?take=1",
        "Unemployment": "https://calendar-api.fxsstatic.com/en/api/v1/events/40c78644-5d06-4d87-ba5c-f2e2691cc577/historical?take=1",
    },
    JP: {
        "Inflation": "https://calendar-api.fxsstatic.com/en/api/v1/events/7f15ca74-c327-4eb6-b76f-d0783f9b14e5/historical?take=1",
        "CoreInflation": "https://calendar-api.fxsstatic.com/en/api/v1/events/15d376d3-becc-444e-9752-c53ce44b7bc5/historical?take=1",
        "PPI": "https://calendar-api.fxsstatic.com/en/api/v1/events/860a04a9-5837-4015-84af-aaae87e4fc0a/historical?take=1",
        "RetailSales": "https://calendar-api.fxsstatic.com/en/api/v1/events/fe4ccb8d-9b5f-4e5f-9ba2-431284ba8078/historical?take=1",
        "M-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/59861198-636b-4006-88be-addbaed5fb9b/historical?take=1",
        "S-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/cb7aed00-7237-40fd-8149-a0f84b67a3c4/historical?take=1",
        "GDP": "https://calendar-api.fxsstatic.com/en/api/v1/events/523c3261-8d74-4252-a3fc-cb03c3e3b0b3/historical?take=1",
        "Unemployment": "https://calendar-api.fxsstatic.com/en/api/v1/events/b892c6ef-e1d0-4944-9ee1-e28f10a0a335/historical?take=1",

    },
    UK:{
        "Inflation": "https://calendar-api.fxsstatic.com/en/api/v1/events/3ac4e096-06c8-4981-b973-622269563b1f/historical?take=1",
        "CoreInflation": "https://calendar-api.fxsstatic.com/en/api/v1/events/0205d838-1106-4d7d-abdd-692f33fb5686/historical?take=1",
        "PPI": "https://calendar-api.fxsstatic.com/en/api/v1/events/a72e2673-d17e-48c5-bf75-eed288108849/historical?take=1",
        "RetailSales": "https://calendar-api.fxsstatic.com/en/api/v1/events/9f9b4613-21ff-4cb7-8170-d3f59d2b2fe2/historical?take=1",
        "M-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/f21a55ef-8d4b-4970-8f7e-0100bae77407/historical?take=1",
        "S-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/0fbc81b5-a029-4c0e-a5c7-9baf1fc47cd2/historical?take=1",
        "GDP": "https://calendar-api.fxsstatic.com/en/api/v1/events/61b1d6bb-698e-41f7-8100-dc668c635c8b/historical?take=1",
        "Unemployment": "https://calendar-api.fxsstatic.com/en/api/v1/events/98bb2374-b9f9-46ae-93e3-9f7e8a4391c1/historical?take=1",
    }
};

async function fetchData() {
    for (const [region, indicators] of Object.entries(dataSources)) {
        const regionPath = path.join(__dirname, 'data', region);

        // Ensure region directory exists
        if (!fs.existsSync(regionPath)) {
            fs.mkdirSync(regionPath, { recursive: true });
        }

        for (const [key, url] of Object.entries(indicators)) {
            try {
                const response = await axios.get(url, {
                    headers: { "Referer": "https://www.fxstreet.com/" }
                });

                // Ensure response is valid JSON
                if (typeof response.data !== "object") {
                    console.error(`Invalid JSON response for ${region} - ${key}`);
                    continue;
                }

                // Check if data needs to be updated
                const filePath = path.join(regionPath, `${key}.json`);

                // If file doesn't exist, create and write new data
                if (!fs.existsSync(filePath)) {
                    fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2));
                    console.log(`${region} - ${key} data saved to ${filePath}`);
                } else {
                    const existingData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                    // Compare dateUTC to determine if we need to update
                    const newDateUTC = response.data[0]?.dateUTC;
                    const existingDateUTC = existingData[0]?.dateUTC;

                    if (newDateUTC && existingDateUTC && new Date(newDateUTC) > new Date(existingDateUTC)) {
                        // Update file if the fetched data is more recent
                        fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2));
                        console.log(`${region} - ${key} data updated to ${filePath}`);
                    } else {
                        console.log(`${region} - ${key} data is up-to-date.`);
                    }
                }
            } catch (error) {
                console.error(`Error fetching ${region} - ${key}:`, error.message);
            }
        }
    }
}

// Fetch data initially, then repeat every hour
fetchData();
setInterval(fetchData, 60 * 60 * 1000);

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Dynamic route to serve JSON files based on region and indicator
app.get('/data/:region/:filename', (req, res) => {
    const { region, filename } = req.params;
    const filePath = path.join(__dirname, 'data', region, filename);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: `File not found for region ${region}` });
    }
});

app.get('/compare', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'compare.html'));
});



app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
