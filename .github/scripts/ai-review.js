const https = require('https');
const { execSync } = require('child_process');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const PR_NUMBER = process.env.PR_NUMBER;
const REPO_NAME = process.env.REPO_NAME;
const BASE_SHA = process.env.BASE_SHA;
const HEAD_SHA = process.env.HEAD_SHA;

// Git diff'i al
function getGitDiff() {
  try {
    const diff = execSync(`git diff ${BASE_SHA}..${HEAD_SHA}`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024, // 10MB
    });
    return diff;
  } catch (error) {
    console.error('Git diff alınamadı:', error);
    return null;
  }
}

// Claude API ile review yap
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
8. **Proje Uyumu**: Bu proje CLAUDE.md'ye göre bir perfume management uygulaması. Proje mimarisiyle uyumlu mu?

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

## 📝 Notlar
- [Diğer gözlemler]

Eğer hiç sorun yoksa, sadece "✅ Code review tamamlandı. Kritik sorun bulunamadı." yaz.`;

  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.content && response.content[0]) {
            resolve(response.content[0].text);
          } else {
            reject(new Error('Beklenmeyen API response'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// GitHub'a comment ekle
async function postComment(reviewText) {
  return new Promise((resolve, reject) => {
    const comment = `## 🤖 AI Code Review

${reviewText}

---
*Bu review [Claude Sonnet 4](https://www.anthropic.com/claude) tarafından otomatik olarak oluşturuldu.*`;

    const data = JSON.stringify({
      body: comment,
    });

    const options = {
      hostname: 'api.github.com',
      path: `/repos/${REPO_NAME}/issues/${PR_NUMBER}/comments`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${GITHUB_TOKEN}`,
        'User-Agent': 'AI-Code-Review-Action',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

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

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Ana fonksiyon
async function main() {
  try {
    console.log('🔍 Git diff alınıyor...');
    const diff = getGitDiff();

    if (!diff || diff.trim().length === 0) {
      console.log('ℹ️ Değişiklik bulunamadı');
      return;
    }

    // Diff çok büyükse kısalt
    const maxDiffLength = 100000; // ~100KB
    const truncatedDiff =
      diff.length > maxDiffLength
        ? diff.substring(0, maxDiffLength) +
          '\n\n... (diff çok uzun, kısaltıldı)'
        : diff;

    console.log('🤖 Claude ile kod inceleniyor...');
    const review = await reviewCode(truncatedDiff);

    console.log('💬 GitHub PR\'a comment ekleniyor...');
    await postComment(review);

    console.log('✅ İşlem tamamlandı!');
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}
 
main();