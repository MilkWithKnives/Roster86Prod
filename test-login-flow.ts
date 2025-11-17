import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5173';

async function testLoginFlow() {
	console.log('🧪 Testing login flow...\n');

	try {
		// Test 1: Valid credentials
		console.log('1️⃣ Testing with valid credentials...');
		const validResponse = await fetch(`${BASE_URL}/auth/signin/credentials`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				email: 'testuser@example.com',
				password: 'password123'
			})
		});

		console.log('   Status:', validResponse.status);
		console.log('   Headers:', Object.fromEntries(validResponse.headers.entries()));
		
		if (validResponse.status === 303) {
			console.log('   ✅ Redirect response (expected for successful login)');
		} else {
			const text = await validResponse.text();
			console.log('   Response body:', text.substring(0, 500));
		}

		// Test 2: Invalid credentials
		console.log('\n2️⃣ Testing with invalid credentials...');
		const invalidResponse = await fetch(`${BASE_URL}/auth/signin/credentials`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				email: 'testuser@example.com',
				password: 'wrongpassword'
			})
		});

		console.log('   Status:', invalidResponse.status);
		if (invalidResponse.status !== 303) {
			const text = await invalidResponse.text();
			console.log('   Response contains error:', text.includes('error') ? '✅ Yes' : '❌ No');
		}

		// Test 3: Missing credentials
		console.log('\n3️⃣ Testing with missing credentials...');
		const missingResponse = await fetch(`${BASE_URL}/auth/signin/credentials`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				email: 'testuser@example.com'
				// password missing
			})
		});

		console.log('   Status:', missingResponse.status);
		if (missingResponse.status !== 303) {
			const text = await missingResponse.text();
			console.log('   Response contains error:', text.includes('required') ? '✅ Yes' : '❌ No');
		}

		console.log('\n✅ Login flow tests completed!');

	} catch (error) {
		console.error('💥 Error testing login flow:', error);
	}
}

testLoginFlow();
