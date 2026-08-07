const http = require('http');

const registerData = JSON.stringify({
  name: 'Test User',
  email: 'test' + Date.now() + '@example.com',
  password: 'password123',
  phone: '9999999999'
});

const registerOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(registerData)
  }
};

const req = http.request(registerOptions, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Register status:', res.statusCode);
    const result = JSON.parse(body);
    const token = result.data.token;

    const data = JSON.stringify({
      salonId: 'salon-1',
      offeringName: 'Hair Cut',
      serviceId: 'hair-cut',
      staffName: 'Ananya Rao',
      staffRole: 'Senior Stylist',
      bookingDate: '2026-08-01',
      bookingTime: '9:00 AM',
      price: 299,
      paymentMethod: 'cod'
    });

    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/appointments',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'Authorization': `Bearer ${token}`
      }
    };

    const req2 = http.request(options, (res2) => {
      let body2 = '';
      res2.on('data', (chunk) => body2 += chunk);
      res2.on('end', () => {
        console.log(`Booking Status: ${res2.statusCode}`);
        console.log(`Booking Body: ${body2}`);
      });
    });
    req2.write(data);
    req2.end();
  });
});

req.write(registerData);
req.end();
