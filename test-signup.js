#!/usr/bin/env node

/**
 * Test script to verify user registration functionality
 * This will test the signup process and check if verification emails are working
 */

import fetch from 'node-fetch';

const BASE_URL = 'https://roster86.com';

async function testSignup() {
    console.log('🧪 Testing user registration flow...\n');

    // Test data
    const testUser = {
        organizationName: 'Test Restaurant ' + Date.now(),
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'testpassword123',
        confirmPassword: 'testpassword123'
    };

    console.log('📝 Test user data:');
    console.log(`  Organization: ${testUser.organizationName}`);
    console.log(`  Name: ${testUser.name}`);
    console.log(`  Email: ${testUser.email}\n`);

    try {
        // First, get the signup page to check if it loads
        console.log('1️⃣ Testing signup page access...');
        const signupPageResponse = await fetch(`${BASE_URL}/auth/signup`);
        
        if (signupPageResponse.ok) {
            console.log('✅ Signup page loads successfully');
        } else {
            console.log(`❌ Signup page failed: ${signupPageResponse.status}`);
            return;
        }

        // Test the signup form submission
        console.log('\n2️⃣ Testing signup form submission...');
        
        const formData = new FormData();
        formData.append('organizationName', testUser.organizationName);
        formData.append('name', testUser.name);
        formData.append('email', testUser.email);
        formData.append('password', testUser.password);
        formData.append('confirmPassword', testUser.confirmPassword);

        const signupResponse = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            body: formData,
            redirect: 'manual' // Don't follow redirects automatically
        });

        console.log(`Response status: ${signupResponse.status}`);
        console.log(`Response headers:`, Object.fromEntries(signupResponse.headers.entries()));

        if (signupResponse.status === 303) {
            const location = signupResponse.headers.get('location');
            console.log(`✅ Signup successful - redirected to: ${location}`);
            
            if (location && location.includes('/auth/check-email')) {
                console.log('✅ Correctly redirected to check-email page');
                console.log('📧 Verification email should have been sent');
                
                // Extract email from redirect URL
                const url = new URL(location, BASE_URL);
                const emailParam = url.searchParams.get('email');
                console.log(`📧 Email parameter: ${emailParam}`);
                
                if (emailParam === testUser.email) {
                    console.log('✅ Email parameter matches test email');
                } else {
                    console.log('❌ Email parameter mismatch');
                }
            } else {
                console.log('❌ Unexpected redirect location');
            }
        } else {
            console.log('❌ Signup failed');
            const responseText = await signupResponse.text();
            console.log('Response body:', responseText.substring(0, 500));
        }

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

// Run the test
testSignup().then(() => {
    console.log('\n🏁 Test completed');
}).catch(error => {
    console.error('💥 Test crashed:', error);
});
