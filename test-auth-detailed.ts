import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5173';

async function testAuthDetailed() {
	console.log('🔍 Detailed authentication testing...\n');

	try {
		// First, get the CSRF token from the signin page
		console.log('1️⃣ Getting CSRF token...');
		const signinPageResponse = await fetch(`${BASE_URL}/auth/signin/credentials`);
		const signinPageHtml = await signinPageResponse.text();
		
		// Extract CSRF token from the HTML
		const csrfMatch = signinPageHtml.match(/name="csrfToken" value="([^"]+)"/);
		const csrfToken = csrfMatch ? csrfMatch[1] : null;
		
		console.log('   CSRF Token:', csrfToken ? '✅ Found' : '❌ Not found');
		
		if (!csrfToken) {
			console.log('❌ Cannot proceed without CSRF token');
			return;
		}

		// Test with valid credentials
		console.log('\n2️⃣ Testing authentication with valid credentials...');
		const authResponse = await fetch(`${BASE_URL}/auth/callback/credentials`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Cookie': signinPageResponse.headers.get('set-cookie') || ''
			},
			body: new URLSearchParams({
				csrfToken,
				email: 'testuser@example.com',
				password: 'password123',
				redirect: 'false'
			}),
			redirect: 'manual'
		});

		console.log('   Status:', authResponse.status);
		console.log('   Headers:', Object.fromEntries(authResponse.headers.entries()));
		
		if (authResponse.status === 302) {
			console.log('   ✅ Redirect response (likely successful)');
			console.log('   Location:', authResponse.headers.get('location'));
		} else {
			const responseText = await authResponse.text();
			console.log('   Response preview:', responseText.substring(0, 200));
		}

		// Test with invalid credentials
		console.log('\n3️⃣ Testing with invalid credentials...');
		const invalidAuthResponse = await fetch(`${BASE_URL}/auth/callback/credentials`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Cookie': signinPageResponse.headers.get('set-cookie') || ''
			},
			body: new URLSearchParams({
				csrfToken,
				email: 'testuser@example.com',
				password: 'wrongpassword',
				redirect: 'false'
			}),
			redirect: 'manual'
		});

		console.log('   Status:', invalidAuthResponse.status);
		if (invalidAuthResponse.status === 302) {
			console.log('   Location:', invalidAuthResponse.headers.get('location'));
			const location = invalidAuthResponse.headers.get('location');
			if (location?.includes('error')) {
				console.log('   ✅ Redirected to error page (expected)');
			}
		}

	} catch (error) {
		console.error('💥 Error in detailed auth test:', error);
	}
}

testAuthDetailed();
