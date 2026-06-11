const fs = require('fs');
const path = require('path');

const resolvedPath = path.join(__dirname, 'resolved_brands.json');

const manualUrls = {
  '공차': 'https://myfranchise.kr/brand/gongcha',
  '역전할머니맥주': 'https://myfranchise.kr/brand/1000572',
  '한신포차': 'https://myfranchise.kr/brand/1000632',
  '투다리': 'https://myfranchise.kr/brand/1001353',
  '아마스빈': 'https://myfranchise.kr/brands/1138',
  '팔공티': 'https://myfranchise.kr/brands/1169',
  '쥬씨': 'https://myfranchise.kr/brands/1066',
  '놀부부대찌개': 'https://myfranchise.kr/brands/1609',
  '반올림피자샵': 'https://myfranchise.kr/brands/11583'
};

try {
  const resolvedBrands = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
  
  resolvedBrands.forEach(brand => {
    if (manualUrls[brand.brand_name]) {
      brand.resolved_url = manualUrls[brand.brand_name];
      if (brand.notes) delete brand.notes;
      console.log(`Updated URL for [${brand.brand_name}] to: ${brand.resolved_url}`);
    }
  });
  
  fs.writeFileSync(resolvedPath, JSON.stringify(resolvedBrands, null, 2), 'utf8');
  console.log('Successfully saved updated URLs to resolved_brands.json.');
} catch (err) {
  console.error('Error:', err);
}
