const PORT = 3000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();

async function cryptopriceScraper() {
    const url = "https://coinmarketcap.com/";
    const coinArray = [];
    await axios(url).then((response) => {
        const html_data = response.data;
        const $ = cheerio.load(html_data);
        const selectedElem = "#__next > div > div.main-content > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(4) > table > tbody > tr";

        const keys = [
            "No.",
            "coin",
            "Price",
            "24h",
            "1h%",
            "24h%",
            "7d%",
            "Marketcap",
            "CirculatingSupply",
        ];


        $(selectedElem).each((parentIndex, parentElem) => {

            let keyIndex = 0;
            const coinDetails = {};
            if (parentIndex <= 9) {
                $(parentElem)
                    .children()
                    .each((childId, childElem) => {
                        const value = $(childElem).text();
                        if (value) {
                            coinDetails[keys[keyIndex]] = value;
                            keyIndex++;
                        }
                    });
                coinArray.push(coinDetails);
            }
        });
    });

    return coinArray;
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/' + 'index.html')
})

app.get("/api/crypto", async (req, res) => {
    try {
        const crypto = await cryptopriceScraper();
        return res.status(200).json({
            result: crypto,
        });
    } catch (err) {
        return res.status(500).json({
            err: err.toString(),
        });
    }
});

app.listen(PORT, () =>
    console.log(`The server is active and running on port ${PORT}`)
);