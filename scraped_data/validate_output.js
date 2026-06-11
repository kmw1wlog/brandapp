const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'collected_categories_data.json');

try {
  if (!fs.existsSync(outputPath)) {
    console.error('Error: output file does not exist!');
    process.exit(1);
  }
  
  const data = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  console.log(`Total records in output file: ${data.length}`);
  
  const errors = data.filter(d => d.error);
  console.log(`Records with errors: ${errors.length}`);
  if (errors.length > 0) {
    errors.forEach(e => console.log(`  - ${e.brand_name}: ${e.error}`));
  }
  
  const successCount = data.length - errors.length;
  console.log(`Successful scrapes: ${successCount}`);
  
  // Print first few categories and brands to verify structure
  console.log('\nSample Scraped Data Summary:');
  const sample = data.slice(0, 3);
  sample.forEach(s => {
    console.log(`- Brand: [${s.brand_name}] (Category: ${s.category_name})`);
    console.log(`  URL: ${s.source_url}`);
    console.log(`  Monthly Sales: ${s.overview ? s.overview.monthly_average_sales_str : 'N/A'}`);
    console.log(`  Active Stores: ${s.franchise_disclosure ? s.franchise_disclosure.active_stores : 'N/A'}`);
  });
  
  process.exit(0);
} catch (err) {
  console.error('Validation Error:', err);
  process.exit(1);
}
