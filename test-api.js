const http = require('http');

const PORT = process.env.PORT || 5000;
const options = {
  hostname: '127.0.0.1',
  port: PORT,
  path: '/api/products',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log(`Starting API diagnostic test targeting: http://127.0.0.1:${PORT}/api/products...`);

const req = http.request(options, (res) => {
  let body = '';
  
  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    console.log(`\nResponse Status: ${res.statusCode} ${res.statusMessage}`);
    console.log('Response Headers:', res.headers['content-type']);
    
    try {
      const json = JSON.parse(body);
      console.log('\nResponse Data parsed successfully!');
      console.log(`Total Products Returned in Catalog: ${json.count || 0}`);
      
      if (res.statusCode === 200 && json.success) {
        console.log('\n✅ TEST SUCCESSFUL: API endpoint /api/products is fully functional!');
      } else {
        console.log('\n❌ TEST FAILED: Response reports success as false or returned abnormal states.');
      }
    } catch (e) {
      console.log('\n❌ TEST FAILED: Response body is not a valid JSON structure.');
      console.log('Raw body received:', body);
    }
  });
});

req.on('error', (error) => {
  console.error(`\n❌ TEST ERROR: Cannot connect to the server at http://127.0.0.1:${PORT}`);
  console.error(`Error Details: ${error.message}`);
  console.error('\nEnsure the Express server is running locally first using "npm run dev" or "node server.js".');
});

req.end();
