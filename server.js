const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = 3420;

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
        "InterestRate": "https://calendar-api.fxsstatic.com/en/api/v1/events/fcfae951-09a7-449e-b6fe-525e1335aaba/historical?take=1",
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
        "InterestRate": "https://calendar-api.fxsstatic.com/en/api/v1/events/8beb52bf-2294-407c-b979-8e383584a233/historical?take=1",
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
        "InterestRate": "https://calendar-api.fxsstatic.com/en/api/v1/events/8b3a0864-3ad8-4510-88a5-acaf0dc44ce0/historical?take=1",

    },
    UK: {
        "Inflation": "https://calendar-api.fxsstatic.com/en/api/v1/events/3ac4e096-06c8-4981-b973-622269563b1f/historical?take=1",
        "CoreInflation": "https://calendar-api.fxsstatic.com/en/api/v1/events/0205d838-1106-4d7d-abdd-692f33fb5686/historical?take=1",
        "PPI": "https://calendar-api.fxsstatic.com/en/api/v1/events/a72e2673-d17e-48c5-bf75-eed288108849/historical?take=1",
        "RetailSales": "https://calendar-api.fxsstatic.com/en/api/v1/events/9f9b4613-21ff-4cb7-8170-d3f59d2b2fe2/historical?take=1",
        "M-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/f21a55ef-8d4b-4970-8f7e-0100bae77407/historical?take=1",
        "S-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/0fbc81b5-a029-4c0e-a5c7-9baf1fc47cd2/historical?take=1",
        "GDP": "https://calendar-api.fxsstatic.com/en/api/v1/events/61b1d6bb-698e-41f7-8100-dc668c635c8b/historical?take=1",
        "Unemployment": "https://calendar-api.fxsstatic.com/en/api/v1/events/98bb2374-b9f9-46ae-93e3-9f7e8a4391c1/historical?take=1",
        "InterestRate": "https://calendar-api.fxsstatic.com/en/api/v1/events/9959649d-be62-47f5-bafa-ff2f474b9e13/historical?take=1",
    },
    CA: {
        "Inflation": "https://calendar-api.fxsstatic.com/en/api/v1/events/8c8f1865-334c-4976-8754-76c1e3e3b99d/historical?take=1",
        "CoreInflation": "https://calendar-api.fxsstatic.com/en/api/v1/events/5ed90e34-d662-4c22-b5b1-3424d1bc5a30/historical?take=1",
        "RetailSales": "https://calendar-api.fxsstatic.com/en/api/v1/events/fea0737b-54f5-439d-b6f0-b3e0452fa603/historical?take=1",
        "M-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/c9530a3b-8308-49d2-a5e6-b7d26cc8b075/historical?take=1",
        "S-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/a5bfc576-5bc8-4b9b-b9e4-1faaa0a60c90/historical?take=1",
        "GDP": "https://calendar-api.fxsstatic.com/en/api/v1/events/6102c587-1e49-4960-8daa-dbc61505ea69/historical?take=1",
        "Unemployment": "https://calendar-api.fxsstatic.com/en/api/v1/events/490c5492-6ace-4321-a078-64b949244b2e/historical?take=1",
        "InterestRate": "https://calendar-api.fxsstatic.com/en/api/v1/events/7035bb7e-d65f-4e72-a0ba-f77baede0207/historical?take=1",
    },
    NZ: {
        "Inflation": "https://calendar-api.fxsstatic.com/en/api/v1/events/ea25453a-3b4e-4df7-9825-48c6ccdc283b/historical?take=1",
        "RetailSales": "https://calendar-api.fxsstatic.com/en/api/v1/events/bf114b19-7364-4b25-9452-d1ccf5663590/historical?take=1",
        "M-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/4e7deb73-b88c-4976-901a-2a6fecf4022b/historical?take=1",
        "S-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/6d003fa6-82b9-4304-9ea9-1590f7db1983/historical?take=1",
        "GDP": "https://calendar-api.fxsstatic.com/en/api/v1/events/6102c587-1e49-4960-8daa-dbc61505ea69/historical?take=1",
        "Unemployment": "https://calendar-api.fxsstatic.com/en/api/v1/events/7bdda5c5-3034-429e-b8c0-bf331d513b8b/historical?take=1",
        "InterestRate": "https://calendar-api.fxsstatic.com/en/api/v1/events/af0112f8-5b85-4b01-84cc-bd4b13f1e9d0/historical?take=1",
    },
    AU: {
        "Inflation": "https://calendar-api.fxsstatic.com/en/api/v1/events/e39cdc9f-802d-40ea-ac1f-60a1862e8ee9/historical?take=1",
        "RetailSales": "https://calendar-api.fxsstatic.com/en/api/v1/events/13eea5f9-b2a0-4ebd-90a0-da41ca3bc468/historical?take=1",
        "M-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/3766e161-8431-4a94-8a37-1257784bba6c/historical?take=1",
        "S-PMI": "https://calendar-api.fxsstatic.com/en/api/v1/events/9b505ff1-dc46-4f81-b5a3-06a908aeb19d/historical?take=1",
        "GDP": "https://calendar-api.fxsstatic.com/en/api/v1/events/ea62704e-57a4-4d22-856f-ad642047bdc7/historical?take=1",
        "Unemployment": "https://calendar-api.fxsstatic.com/en/api/v1/events/7bf5a806-92d7-4d18-95a4-e10c42b1eeba/historical?take=1",
        "InterestRate": "https://calendar-api.fxsstatic.com/en/api/v1/events/97e8d83b-a333-4be6-8cf9-1f4fa9f9789d/historical?take=1",
    },
    CH: {

    },
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
                    const newDateUTC = response.data[0].dateUtc;
                    const existingDateUTC = existingData[0].dateUtc;

                    if (newDateUTC != existingDateUTC) {
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

app.get('/refetch', async (req, res) => {
    try {
        await fetchData();  // Manually trigger data fetching
        res.json({ success: true, message: 'Data refetched successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error refetching data', error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
});