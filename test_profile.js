const fetch = require('node-fetch');

async function testProfileAPI() {
    try {
        // First, let's login to get a token
        const loginResponse = await fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'test@example.com',
                password: 'password123'
            })
        });

        if (!loginResponse.ok) {
            console.log('Login failed:', await loginResponse.text());
            return;
        }

        const loginData = await loginResponse.json();
        console.log('Login successful, token received');

        // Now test the profile endpoint
        const profileResponse = await fetch('http://localhost:3000/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${loginData.token}`
            }
        });

        if (!profileResponse.ok) {
            console.log('Profile fetch failed:', await profileResponse.text());
            return;
        }

        const profileData = await profileResponse.json();
        console.log('Profile data received:', JSON.stringify(profileData, null, 2));

        // Check if the expected fields are present
        if (profileData.success && profileData.data) {
            const data = profileData.data;
            console.log('\nField check:');
            console.log('first_name:', data.first_name);
            console.log('last_name:', data.last_name);
            console.log('email:', data.email);
            console.log('username:', data.username);
            console.log('created_at:', data.created_at);
        }

    } catch (error) {
        console.error('Test failed:', error);
    }
}

testProfileAPI();

