const http = require('http');

const API_BASE_URL = 'http://localhost:3000';

// Test için kullanıcı bilgileri
const testUsers = [
  { username: 'testuser1', password: 'password123' },
  { username: 'testuser2', password: 'password123' }
];

let authTokens = {};

// HTTP request helper
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

// Login function
async function login(username, password) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/users/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const postData = JSON.stringify({ username, password });
  const response = await makeRequest(options, postData);
  
  if (response.status === 200 && response.data.success) {
    return response.data.data.token;
  }
  return null;
}

// Get blog view count
async function getBlogViewCount(blogId, token = null) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/blogs/${blogId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await makeRequest(options);
  return response.data.data?.view_count || 0;
}

// Increment view count
async function incrementViewCount(blogId, token = null) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/blogs/${blogId}/view`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await makeRequest(options);
  return response.data.data?.viewCount || 0;
}

// Test function
async function runTests() {
  console.log('🧪 View Count Tracking Test Başlıyor...\n');

  try {
    // Test blog ID'si (mevcut bir blog)
    const testBlogId = 1;

    // 1. Login işlemleri
    console.log('1️⃣ Kullanıcılar giriş yapıyor...');
    for (const user of testUsers) {
      const token = await login(user.username, user.password);
      if (token) {
        authTokens[user.username] = token;
        console.log(`✅ ${user.username} giriş yaptı`);
      } else {
        console.log(`❌ ${user.username} giriş yapamadı`);
      }
    }

    // 2. İlk view count'u al
    console.log('\n2️⃣ İlk view count kontrolü...');
    const initialViewCount = await getBlogViewCount(testBlogId);
    console.log(`📊 İlk view count: ${initialViewCount}`);

    // 3. Anonim kullanıcı testi
    console.log('\n3️⃣ Anonim kullanıcı testi...');
    const anonymousViewCount1 = await incrementViewCount(testBlogId);
    console.log(`👤 Anonim kullanıcı 1. tıklama: ${anonymousViewCount1}`);
    
    const anonymousViewCount2 = await incrementViewCount(testBlogId);
    console.log(`👤 Anonim kullanıcı 2. tıklama: ${anonymousViewCount2}`);
    
    if (anonymousViewCount1 === anonymousViewCount2) {
      console.log('✅ Anonim kullanıcı için tekrar tıklama engellendi');
    } else {
      console.log('❌ Anonim kullanıcı için tekrar tıklama engellenmedi');
    }

    // 4. Giriş yapmış kullanıcı testi
    if (authTokens.testuser1) {
      console.log('\n4️⃣ Giriş yapmış kullanıcı testi...');
      const loggedInViewCount1 = await incrementViewCount(testBlogId, authTokens.testuser1);
      console.log(`🔐 testuser1 1. tıklama: ${loggedInViewCount1}`);
      
      const loggedInViewCount2 = await incrementViewCount(testBlogId, authTokens.testuser1);
      console.log(`🔐 testuser1 2. tıklama: ${loggedInViewCount2}`);
      
      if (loggedInViewCount1 === loggedInViewCount2) {
        console.log('✅ Giriş yapmış kullanıcı için tekrar tıklama engellendi');
      } else {
        console.log('❌ Giriş yapmış kullanıcı için tekrar tıklama engellenmedi');
      }
    }

    // 5. Farklı kullanıcı testi
    if (authTokens.testuser2) {
      console.log('\n5️⃣ Farklı kullanıcı testi...');
      const differentUserViewCount = await incrementViewCount(testBlogId, authTokens.testuser2);
      console.log(`👥 testuser2 tıklama: ${differentUserViewCount}`);
      
      if (differentUserViewCount > anonymousViewCount1) {
        console.log('✅ Farklı kullanıcı için view count arttı');
      } else {
        console.log('❌ Farklı kullanıcı için view count artmadı');
      }
    }

    // 6. Final view count
    console.log('\n6️⃣ Final view count kontrolü...');
    const finalViewCount = await getBlogViewCount(testBlogId);
    console.log(`📊 Final view count: ${finalViewCount}`);

    console.log('\n🎉 Test tamamlandı!');

  } catch (error) {
    console.error('❌ Test hatası:', error.message);
  }
}

// Test'i çalıştır
runTests();



