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
1. **Güvenlik**: SQL injection, XSS, authentication/authorization sorunları, secret'ların kodda olup olmadığı
2. **Performans**: N+1 query, gereksiz döngüler, memory leak riski
3. **Kod Kalitesi**: Clean code prensipleri, DRY, SOLID, okunabilirlik
4. **Best Practices**: React hooks kullanımı, async/await pattern, error handling
5. **TypeScript**: Type safety, interface kullanımı
6. **Database**: Migration'lar, index kullanımı, query optimizasyonu
7. **Test**: Test edilebilirlik, edge case'ler

Git Diff:
\`\`\`diff
${diff}
\`\`\`

Lütfen bulguları şu formatta sun:

## 🔴 Kritik Sorunlar
- [Varsa kritik güvenlik/bug sorunları]

## 🟡 Öneriler
- [İyileştirme önerileri]

## 🟢 İyi Yapılanlar
- [Övgüye değer kodlar]

Eğer hiç sorun yoksa, sadece "✅ Code review tamamlandı. Kritik sorun bulunamadı." yaz.`;

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        console.log('=== API Response Debug ===');
        console.log('Status Code:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers, null, 2));
        console.log('Body (first 1000 chars):', body.substring(0, 1000));
        console.log('Body length:', body.length);
        console.log('========================');

        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          return;
        }

        try {
          const response = JSON.parse(body);
          
          if (response.error) {
            reject(new Error(`API Error: ${JSON.stringify(response.error)}`));
            return;
          }

          if (response.content?.[0]?.text) {
            resolve(response.content[0].text);
          } else {
            console.error('Unexpected structure:', JSON.stringify(response, null, 2));
            reject(new Error('Response missing content[0].text'));
          }
        } catch (err) {
          console.error('Parse error:', err);
          reject(new Error(`JSON parse failed: ${err.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function postComment(reviewText) {
  return new Promise((resolve, reject) => {
    const comment = `## 🤖 AI Code Review

${reviewText}

---
*Bu review [Claude Sonnet 4](https://www.anthropic.com/claude) tarafından otomatik olarak oluşturuldu.*`;

    const data = JSON.stringify({ body: comment });

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO_NAME}/issues/${PR_NUMBER}/comments`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'AI-Code-Review-Action',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('✅ Comment başarıyla eklendi');
          resolve();
        } else {
          console.error('GitHub API Error:', body);
          reject(new Error(`GitHub API error: ${res.statusCode}`));
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
    console.log('=== Environment Check ===');
    console.log('API Key exists:', !!ANTHROPIC_API_KEY);
    console.log('API Key prefix:', ANTHROPIC_API_KEY?.substring(0, 7));
    console.log('API Key length:', ANTHROPIC_API_KEY?.length);
    console.log('PR Number:', PR_NUMBER);
    console.log('Repo:', REPO_NAME);
    console.log('========================');

    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY bulunamadı!');
    }

    if (!ANTHROPIC_API_KEY.startsWith('sk-ant-')) {
      throw new Error(`API key formatı yanlış. Başlangıç: ${ANTHROPIC_API_KEY.substring(0, 10)}`);
    }

    console.log('🔍 Git diff alınıyor...');
    const diff = getGitDiff();

    if (!diff || diff.trim().length === 0) {
      console.log('ℹ️ Değişiklik bulunamadı');
      return;
    }

    console.log(`📊 Diff boyutu: ${diff.length} karakter`);

    const maxDiffLength = 80000;
    const truncatedDiff = diff.length > maxDiffLength 
      ? diff.substring(0, maxDiffLength) + '\n\n... (diff kısaltıldı)'
      : diff;

    console.log('🤖 Claude ile kod inceleniyor...');
    const review = await reviewCode(truncatedDiff);

    console.log('✅ Review alındı, uzunluk:', review.length);
    console.log('💬 GitHub PR\'a comment ekleniyor...');
    await postComment(review);

    console.log('✅ İşlem tamamlandı!');
  } catch (error) {
    console.error('❌ FATAL ERROR ❌');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

main();
