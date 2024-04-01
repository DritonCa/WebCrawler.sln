const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// POST endpoint to receive URL and return the response
app.post('/crawl', async (req, res) => {
    try {
        const url = req.body.url;

        // Initiate the browser 
        const browser = await puppeteer.launch();

        // Create a new page with the default browser context 
        const page = await browser.newPage();

        // Go to the target website 
        await page.goto(url);

        // Inject jQuery into the page
        await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.6.0.min.js' });

        // Extract data using jQuery
        const filteredData = await page.evaluate(() => {
            // Extract data from elements with specified classes
            const englishData = $('.englishcontainer').text().trim();
            const arabicData = $('.arabic_hadith_full').text().trim();
            const englishGrade = $('.english_grade').text().trim();
            const arabicGrade = $('.arabic_grade').text().trim();
            const reference = $('.hadith_reference').text().trim();


            const splitEnglishData = englishData.split(':');

            const narrattor = splitEnglishData[0].trim();
            const narration = splitEnglishData[1].trim();

            const trimmedArabicGrade = arabicGrade.replace(/\u062d\u0643\u0645\s*:/, '').trim();

            const match = englishGrade.match(/Grade:\s*([^()]+)\s*\(([^)]+)\)/);

            let grade;
            let commentator;

            if (match) {
                grade = match[1].trim();
                commentator = match[2].trim()
            } else {
                // If no match found, use the original string as the grade
                grade = englishGrade;
            }

            const matchArabic = trimmedArabicGrade.match(/^([^()]+)\s*\(([^)]+)\)$/);

            let gradeArabic;
            let commentatorArabic;

            if (matchArabic) {
                gradeArabic = matchArabic[1].trim();
                commentatorArabic = matchArabic[2].trim();
            } else {
                // If no match found, assume the whole string is the grade
                gradeArabic = trimmedArabicGrade.trim();
                commentator = "";
            }


            // Split the text into an array based on "In-book reference" and "English translation"
            const parts = reference.split(/In-book reference\s*:\s*|English translation\s*:/);

            // Trim each part to remove leading and trailing whitespace
            const references = parts[0].trim().replace(/^Reference\s*:\s*/, ''); // Remove "Reference :" prefix
            const inBookReference = parts[1].trim();
            const englishTranslation = parts[2].trim();

            // Construct and return an object with filtered data
            return {
                narrattor,
                narration,
                arabicData,
                grade,
                commentator,
                gradeArabic,
                commentatorArabic,
                references,
                inBookReference
            };
        });

        // Close the browser
        await browser.close();

        // Send the filtered data back in the response
        res.json(filteredData);
    } catch (error) {
        res.status(500).send(error.message);
        console.log(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});