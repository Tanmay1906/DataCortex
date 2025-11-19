// Test script to check if login is working in frontend
const axios = require('axios');

const baseURL = 'http://localhost:5000';

async function testLogin() {
  try {
    console.log('Testing frontend login flow...');
    
    // Test login endpoint
    const loginResponse = await axios.post(`${baseURL}/api/auth/login`, {
      email: 'admin@trm.com',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login successful!');
    console.log('Response:', loginResponse.data);
    
    const token = loginResponse.data.access_token;
    console.log('Token:', token);
    
    // Test profile endpoint with token
    const profileResponse = await axios.get(`${baseURL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Profile data retrieved successfully!');
    console.log('Profile:', profileResponse.data);
    
    return { success: true, token, profile: profileResponse.data };
    
  } catch (error) {
    console.error('Error during login test:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

testLogin().then(result => {
  if (result.success) {
    console.log('\n✅ Frontend login flow is working correctly!');
    console.log('Users should be able to log in and access the ProfileForm.');
  } else {
    console.log('\n❌ Frontend login flow has issues.');
    console.log('This might explain why the ProfileForm is not working.');
  }
});
