// Simulate the exact browser flow: login -> get token -> call dashboard API
const BASE = 'http://127.0.0.1:5000';

async function main() {
  // 1. Login as test user
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@email.com', password: '1234' })
  });
  const loginData = await loginRes.json();
  console.log('LOGIN STATUS:', loginRes.status);
  const token = loginData.token;
  console.log('TOKEN PRESENT:', !!token);

  // 2. Call dashboard exactly like DashboardService.getSummary does
  const dashRes = await fetch(`${BASE}/api/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
  console.log('DASHBOARD STATUS:', dashRes.status);
  const body = await dashRes.json();
  console.log('DASHBOARD BODY:', JSON.stringify(body));
}

main().catch(e => { console.error('ERROR:', e); process.exit(1); });