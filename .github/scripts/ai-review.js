const https = require('https');
const { execSync } = require('child_process');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PR_NUMBER = process.env.PR_NUMBER;
const REPO_NAME = process.env.REPO_NAME;
const BASE_SHA = process.env.BASE_SHA;
const HEAD_SHA = process.env.HEAD_SHA;

function getGitDiff() {
  try {
    const diff = execSync(`git diff ${BASE_SHA}..${HEAD_SHA}`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });
    return diff;
  } catch (error) {
    console.error('Git diff alınamadı:', error);
    return null;
  }
}

async function reviewCode(diff) {
  const prompt = `Sen deneyimli bir kod reviewer'sın. Aşağıdaki git diff'i inceleyip Türkçe olarak detaylı bir code review yap.

İnceleme kriterleri:
1. **Güvenlik**: SQL injection, XSS, authentication/authorization sorunları
2. **Performans**: N+1 query, gereksiz döngüler, memory leak riski
3. **Kod Kalitesi**: Clean code prensipleri, DRY, SOLID, okunabilirlik
4. **Best Practices**: React hooks, async/await, error handling

Git Diff:
\`\`\`diff
${diff}
\`\`\`

Kısa ve öz bir review yap.`;

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'claude-3-5-sonnet-20241022', // Eski stabil model
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
    };

    console.log('📡 API Request gönderiliyor...');
    console.log('Model:', 'claude-3-5-sonnet-20241022');
    console.log('API Version:', '2023-06-01');

    const req = https.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        console.log('\n=== API RESPONSE ===');
        console.log('Status:', res.statusCode);
        console.log('Content-Type:', res.headers['content-type']);
        console.log('Body length:', body.length);
        console.log('Body preview:', body.substring(0, 500));
        console.log('===================\n');

        if (res.statusCode !== 200) {
          console.error('❌ HTTP Error:', res.statusCode);
          console.error('Full response:', body);
          reject(new Error(`HTTP ${res.statusCode}: ${body.substring(0, 200)}`));
          return;
        }

        try {
          const response = JSON.parse(body);
          
          console.log('✅ JSON parsed successfully');
          console.log('Response keys:', Object.keys(response));
          
          if (response.error) {
            console.error('❌ API returned error:', response.error);
            reject(new Error(`API Error: ${response.error.type} - ${response.error.message}`));
            return;
          }

          if (!response.content) {
            console.error('❌ No content field in response');
            console.error('Response structure:', JSON.stringify(response, null, 2));
            reject(new Error('Response missing content field'));
            return;
          }

          if (!response.content[0]) {
            console.error('❌ content[0] is empty');
            reject(new Error('content[0] is undefined'));
            return;
          }

          if (!response.content[0].text) {
            console.error('❌ content[0].text is empty');
            console.error('content[0]:', JSON.stringify(response.content[0], null, 2));
            reject(new Error('content[0].text is undefined'));
            return;
          }

          console.log('✅ Review text extracted successfully');
          resolve(response.content[0].text);
          
        } catch (err) {
          console.error('❌ JSON Parse Error:', err.message);
          console.error('Raw body:', body);
          reject(new Error(`Parse failed: ${err.message}`));
        }
      });
    });

    req.on('error', (err) => {
      console.error('❌ Request Error:', err);
      reject(err);
    });

    req.write(data);
    req.end();
  });
}

async function postComment(reviewText) {
  return new Promise((resolve, reject) => {
    const comment = `## 🤖 AI Code Review

${reviewText}

---
*Bu review Claude AI tarafından otomatik oluşturuldu.*`;

    const data = JSON.stringify({ body: comment });

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO_NAME}/issues/${PR_NUMBER}/comments`,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `token ${GITHUB_TOKEN}`,
        'user-agent': 'AI-Code-Review-Action',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Comment eklendi');
          resolve();
        } else {
          console.error('GitHub API Error:', res.statusCode, body);
          reject(new Error(`GitHub API: ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  try {
    console.log('\n=== BAŞLANGIÇ KONTROLLERI ===');
    console.log('✓ ANTHROPIC_API_KEY:', ANTHROPIC_API_KEY ? 'Mevcut' : '❌ YOK');
    console.log('✓ Key prefix:', ANTHROPIC_API_KEY?.substring(0, 10));
    console.log('✓ Key length:', ANTHROPIC_API_KEY?.length);
    console.log('✓ GitHub Token:', GITHUB_TOKEN ? 'Mevcut' : '❌ YOK');
    console.log('✓ PR Number:', PR_NUMBER);
    console.log('✓ Repo:', REPO_NAME);
    console.log('============================\n');

    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable bulunamadı!');
    }

    if (!ANTHROPIC_API_KEY.startsWith('sk-ant-')) {
      throw new Error(`API key "sk-ant-" ile başlamalı! Mevcut: ${ANTHROPIC_API_KEY.substring(0, 15)}`);
    }

    console.log('🔍 Git diff alınıyor...');
    const diff = getGitDiff();

    if (!diff || diff.trim().length === 0) {
      console.log('ℹ️ Değişiklik yok, çıkılıyor.');
      return;
    }

    console.log(`📊 Diff boyutu: ${diff.length} karakter`);

    const maxDiffLength = 50000; // Daha küçük limit
    const truncatedDiff = diff.length > maxDiffLength 
      ? diff.substring(0, maxDiffLength) + '\n\n... (diff çok uzun, kısaltıldı)'
      : diff;

    console.log('🤖 Claude API çağrılıyor...\n');
    const review = await reviewCode(truncatedDiff);

    console.log(`\n✅ Review alındı (${review.length} karakter)`);
    console.log('💬 GitHub\'a comment ekleniyor...');
    
    await postComment(review);

    console.log('\n🎉 İşlem başarıyla tamamlandı!\n');
    
  } catch (error) {
    console.error('\n❌❌❌ HATA ❌❌❌');
    console.error('Tip:', error.constructor.name);
    console.error('Mesaj:', error.message);
    console.error('Stack:', error.stack);
    console.error('❌❌❌❌❌❌❌❌❌\n');
    process.exit(1);
  }
}

main();