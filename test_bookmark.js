const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3000/api';

// Test kullanıcısı için token (gerçek token ile değiştirin)
const TEST_TOKEN = 'your-test-token-here';
const TEST_BLOG_ID = 1; // Test blog ID'si

async function testBookmarkSystem() {
  console.log('🔖 Bookmark Sistemi Test Ediliyor...\n');

  try {
    // 1. Bookmark durumunu kontrol et
    console.log('1. Bookmark durumu kontrol ediliyor...');
    const statusResponse = await fetch(`${API_BASE_URL}/bookmarks/blogs/${TEST_BLOG_ID}/bookmarks/status`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ Bookmark durumu:', statusData.data?.isBookmarked ? 'Bookmark edilmiş' : 'Bookmark edilmemiş');
    } else {
      console.log('❌ Bookmark durumu kontrol edilemedi:', statusResponse.status);
    }

    // 2. Bookmark'a ekle
    console.log('\n2. Bookmark\'a ekleniyor...');
    const addResponse = await fetch(`${API_BASE_URL}/bookmarks/blogs/${TEST_BLOG_ID}/bookmarks/toggle`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    if (addResponse.ok) {
      const addData = await addResponse.json();
      console.log('✅ Bookmark eklendi:', addData.message);
      console.log('   Action:', addData.data?.action);
      console.log('   Bookmarked:', addData.data?.bookmarked);
    } else {
      console.log('❌ Bookmark eklenemedi:', addResponse.status);
    }

    // 3. Tekrar bookmark durumunu kontrol et
    console.log('\n3. Bookmark durumu tekrar kontrol ediliyor...');
    const statusResponse2 = await fetch(`${API_BASE_URL}/bookmarks/blogs/${TEST_BLOG_ID}/bookmarks/status`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    if (statusResponse2.ok) {
      const statusData2 = await statusResponse2.json();
      console.log('✅ Bookmark durumu:', statusData2.data?.isBookmarked ? 'Bookmark edilmiş' : 'Bookmark edilmemiş');
    }

    // 4. Kullanıcının bookmark'larını getir
    console.log('\n4. Kullanıcının bookmark\'ları getiriliyor...');
    const bookmarksResponse = await fetch(`${API_BASE_URL}/bookmarks/users/bookmarks`, {
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    if (bookmarksResponse.ok) {
      const bookmarksData = await bookmarksResponse.json();
      console.log('✅ Bookmark\'lar:', bookmarksData.data?.length || 0, 'adet');
      if (bookmarksData.data && bookmarksData.data.length > 0) {
        console.log('   İlk bookmark:', bookmarksData.data[0].blog_title || 'Başlık yok');
      }
    } else {
      console.log('❌ Bookmark\'lar getirilemedi:', bookmarksResponse.status);
    }

    // 5. Bookmark'tan kaldır
    console.log('\n5. Bookmark\'tan kaldırılıyor...');
    const removeResponse = await fetch(`${API_BASE_URL}/bookmarks/blogs/${TEST_BLOG_ID}/bookmarks/toggle`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${TEST_TOKEN}`
      }
    });
    
    if (removeResponse.ok) {
      const removeData = await removeResponse.json();
      console.log('✅ Bookmark kaldırıldı:', removeData.message);
      console.log('   Action:', removeData.data?.action);
      console.log('   Bookmarked:', removeData.data?.bookmarked);
    } else {
      console.log('❌ Bookmark kaldırılamadı:', removeResponse.status);
    }

    console.log('\n🎉 Bookmark sistemi testi tamamlandı!');

  } catch (error) {
    console.error('❌ Test sırasında hata:', error.message);
  }
}

// Test'i çalıştır
testBookmarkSystem();

