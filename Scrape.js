
const fs = require('fs');
const puppeteer = require('puppeteer');


const outputFile = 'companies.csv';


const baseURL = 'https://www.linkedin.com/company/';

// Define the selectors for the elements to scrape
const selectors = {
  name: 'h1.org-top-card-summary__title',
  website: 'a.link-without-visited-state.org-top-card-summary__link',
  contact: 'a.link-without-visited-state.org-top-card-summary__link[aria-label="Contact info"]',
  personnel: 'div.org-people-profile-card__profile-title'
};

// Define a helper function to extract the text from an element
const extractText = async (element) => {
  if (element) {
    return await element.evaluate(el => el.textContent.trim());
  } else {
    return '';
  }
};

// Define a helper function 
const extractHref = async (element) => {
  if (element) {
    return await element.evaluate(el => el.href);
  } else {
    return '';
  }
};


const scrapeCompany = async (company, page) => {
  // Navigate to the company's LinkedIn page
  await page.goto(baseURL + company, {waitUntil: 'networkidle2'});

  // Find the elements to scrape
  const nameElement = await page.$(selectors.name);
  const websiteElement = await page.$(selectors.website);
  const contactElement = await page.$(selectors.contact);
  const personnelElements = await page.$$(selectors.personnel);

  // Extract the data from the elements
  const name = await extractText(nameElement);
  const website = await extractHref(websiteElement);
  const contact = await extractHref(contactElement);
  const personnel = await Promise.all(personnelElements.map(extractText));

  // Return the data as an object
  return {
    name,
    website,
    contact,
    personnel
  };
};

// Define a helper function to format the data as a CSV row
const formatCSV = (data) => {
  // Escape the double quotes in the data
  const escapeQuotes = (str) => str.replace(/"/g, '""');

  // Wrap the data 
  const wrapQuotes = (arr) => arr.map(str => `"${escapeQuotes(str)}"`).join(',');

  return wrapQuotes([
    data.name,
    data.website,
    data.contact,
    data.personnel.join(';')
  ]);
};

main function to scrape the list of companies
const main = async () => {
  // Define the list of companies as a string variable
  const companies = `ADPRO SOFTECH PVT LTD
ADRENALIN ESYSTEMS LIMITED
ADV DETAILING AND DESIGN APPLICATIONS INDIA PRIVATE LIMITED
ADVA OPTICAL NETWORKING INDIA PRIVATE LIMITED
ADVAITA INDIA CONSULTING PRIVATE LIMITED
ADVAIYA SOLUTIONS (P) LTD.
ADVANCED BUSINESS & HEALTHCARE SOLUTIONS INDIA PRIVATE LIMITED
ADVANCED INVESTMENT MECHANICS INDIA PRIVATE LIMITED
ADVANTEST INDIA PRIVATE LIMITED
ADVANTMED INDIA LLP
ADVANZ PHARMA SERVICES (INDIA) PRIVATE LIMITED
ADVARRA INDIA PRIVATE LIMITED
ADVISOR360 SOFTWARE PRIVATE LIMITED
AECO TECHNOSTRUCT PRIVATE LIMITED
AECOM INDIA GLOBAL SERVICES PRIVATE LIMITED
AECOR DIGITAL INTERNATIONAL PRIVATE LIMITED
AEGIS CUSTOMER SUPPORT SERVICES PVT LTD
AEL DATASERVICES LLP
AEON COMMUNICATION PRIVATE LIMITED
AEREN IP SERVICES PVT. LTD.
AEREN IT SOLUTIONS PVT. LTD.
AEREON INDIA PRIVATE LIMITED.
AEROSPIKE INDIA PRIVATE LIMITED
AEXONIC TECHNOLOGIES PRIVATE LIMITED
AFFINITY ANSWERS PRIVATE LIMITED
AFFINITY GLOBAL ADVERTISING PVT. LTD.
AFOUR TECHNOLOGIES PVT. LTD.
AGASTHA SOFTWARE PVT. LTD.
AGATHSYA TECHNOLOGIES PRIVATE LIMITED
AGCO TRADING (INDIA) PRIVATE LIMITED
AGGRANDIZE VENTURE PRIVATE LIMITED
AGILE ICO PVT LTD
AGILE LINK TECHNOLOGIES
AGILENT TECHNOLOGIES INTERNATIONAL PVT.LTD.
AGILIANCE INDIA PVT LTD
AGILITY E SERVICES PRIVATE LIMITED
AGILON HEALTH INDIA PRIVATE LIMITED
AGNEXT TECHNOLOGIES PRIVATE LTD
AGNISYS TECHNOLOGY (P) LTD.
AGNITIO SYSTEMS
AGNITY COMMUNICATIONS PVT. LTD.
AGNITY INDIA TECHNOLOGIES PVT LTD
AGNITY TECHNOLOGIES PRIVATE LIMITED
AGREETA SOLUTIONS PRIVATE LIMITED
AGS HEALTH PVT. LTD
AGT ELECTRONICS LTD
AGTECHPRO PRIVATE LIMITED
AHANA RAY TECHNOLOGIES INDIA PRIVATE LIMITED
AI COGITO INDIA PRIVATE LIMITED
AI SQUARE GLOBAL SOLUTIONS LLP
AIDASTECH INDIA PRIVATE LIMITED
AIE FIBER RESOURCE AND TRADING (INDIA) PRIVATE LIMITED
AIGENEDGE PRIVATE LIMITED
AIGILX HEALTH TECHNOLOGIES PVT LTD
AIMBEYOND INFOTECH PRIVATE LIMITED
AIML SQUARE PRIVATE LIMITED
AIMTRONICS SEMICONDUCTOR INDIA PVT LTD
AINS INDIA PVT LTD
AINSURTECH PVT LTD
AIOPSGROUP COMMERCE INDIA PRIVATE LIMITED
AIRAMATRIX PRIVATE LIMITED
AIRAVANA SYSTEMS PRIVATE LIMITED
AIRBUS GROUP INDIA PVT. LTD.
AIRCHECK INDIA PVT. LTD.
AIRDATA TECHNOLOGIES PRIVATE LIMITED
AIREI INDIA PRIVATE LTD
AIRMEET NETWORKS PRIVATE LIMITED
AIRO DIGITAL LABS INDIA PRIVATE LIMITED
AIRO GLOBAL SOFTWARE PRIVATE LIMITED
AIROHA TECHNOLOGY INDIA PRIVATE LIMITED
AIRTEL INTERNATIONAL LLP
AITHENT TECHNOLOGIES PVT. LTD.
AJIRA AI SOFTWARE INDIA PVT LTD
AJOSYS TECHNOLOGY SOLUTIONS PVT LTD
AJRITH TECH PRIVATE LIMITED
AJS SOFTWARE TECHNOLOGIES PRIVATE LIMITED
AJUBA COMMERCE PVT. LTD.
AK AEROTEK SOFTWARE CENTRE PVT. LTD.
AK SURYA POWER MAGIC PVT LTD
AKEO SOFTWARE SOLUTIONS PRIVATE LIMITED
AKIKO SHERMAN INFOTECH PRIVATE LIMITED
AKOTS INDIA PVT. LTD.
AKRIDATA INDIA PRIVATE LIMITED
AKSA LEGACIES PRIVATE LIMITED
AKSHAY RAJENDRA SHANBHAG
AKSHAY VANIJYA & FINANCE LTD
ALAMY IMAGES INDIA (P) LTD
ALAN SOLUTIONS
ALATION INDIA PRIVATE LIMITED
ALCAX SOLUTIONS
ALCODEX TECHNOLOGIES PVT. LTD.
ALE INDIA PVT LTD.
ALEKHA IT PRIVATE LIMITED
ALEPT CONSULTING PRIVATE LIMITED
ALERTOPS INDIA PRIVATE LIMITED
ALETHEA COMMUNICATIONS TECHNOLOGIES PVT LTD
ALFA KPO PVT. LTD.
ALFANAR ENGINEERING SERVICES INDIA PVT LTD
ALGONICS SYSTEMS PRIVATE LIMITED
ALGONOMY SOFTWARE PRIVATE LIMITED
ALGORHYTHM TECH PVT LTD`;

  // Split the string by newlines and trim the whitespace
  const companyArray = companies.split('\n').map(company => company.trim());

  // Launch the browser and create a new page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Create an array to store the output data
  const output = [];

  // Loop through the company array and scrape each one
  for (let company of companyArray) {
    // Skip empty lines
    if (company) {
      // Scrape the company and add the data to the output array
      const data = await scrapeCompany(company, page);
      output.push(data);

      console.log(`Scraped ${company}`);
    }
  }

 
  await browser.close();

  // Format the output data as CSV rows
  const csv = output.map(formatCSV).join('\n');

  // Write the output data to the output file
  fs.writeFileSync(outputFile, csv, 'utf8');

  // Log the completion
  console.log(`Done. Saved to ${outputFile}`);
};

// Run the main function
main();
