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
    return execSync(`git diff ${BASE_SHA}..${HEAD_SHA}`, { encoding: 'utf-8', maxBuffer: 10485760 });
  } catch (error) {
    console.error('Git diff error:', error);
    return null;
  }
}

async function reviewCode(diff) {
  const prompt = `Sen bir kod reviewer'sın. Bu git diff'i Türkçe incele ve kısa bir review yap:\n\n${diff}`;
  
  const body = JSON.stringify({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }]
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', data.substring(0, 300));
        
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        
        try {
          const json = JSON.parse(data);
          if (json.error) return reject(new Error(json.error.message));
          if (!json.content?.[0]?.text) return reject(new Error('No text in response'));
          resolve(json.content[0].text);
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function postComment(text) {
  const body = JSON.stringify({ body: `## 🤖 AI Review\n\n${text}` });
  
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.github.com',
      path: `/repos/${REPO_NAME}/issues/${PR_NUMBER}/comments`,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `token ${GITHUB_TOKEN}`,
        'user-agent': 'AI-Review'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => res.statusCode < 300 ? resolve() : reject(new Error(data)));
    });
    
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  try {
    console.log('Key:', ANTHROPIC_API_KEY?.substring(0, 10), 'Length:', ANTHROPIC_API_KEY?.length);
    
    if (!ANTHROPIC_API_KEY?.startsWith('sk-ant-')) throw new Error('Invalid API key format');
    
    const diff = getGitDiff();
    if (!diff?.trim()) return console.log('No changes');
    
    console.log('Diff size:', diff.length);
    const review = await reviewCode(diff.substring(0, 50000));
    console.log('Review received:', review.length, 'chars');
    await postComment(review);
    console.log('Done!');
  } catch (e) {
    console.error('ERROR:', e.message);
    process.exit(1);
  }
})();
