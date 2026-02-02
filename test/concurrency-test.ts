import axios from 'axios';

const url = 'http://localhost:3000/payment';

const payload = {
  user_id: '547e1262-429b-466d-9653-53e77861937a',
  merchant_id: 'b8d3a1f1-7c92-4e5b-bc61-92523297a7e3',
  payment_id: 'uuid-pago-1',
  amount: 100,
  currency: 'PEN',
};

async function testConcurrency() {
  const [res1, res2] = await Promise.all([
    axios.post(url, payload).catch(e => e.response.data),
    axios.post(url, payload).catch(e => e.response.data),
  ]);

  console.log('Resultado request 1:', res1.data ?? res1);
  console.log('Resultado request 2:', res2.data ?? res2);
}

testConcurrency();