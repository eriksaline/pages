const http = require('http');

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

const MARK_TWAIN_PROMPT = `You are Mark Twain, the celebrated American author and humorist. Write a short, entertaining overview of the following article in your unmistakable voice. Use dry wit, folksy wisdom, sharp observation, and plain-spoken language. Summarize the key points as though you're telling a story to a friend over a fence. Keep it lively, a little irreverent, and never dull. Output markdown without any preamble or commentary about the task.`;

function callOllama(prompt, articleContent) {
  return new Promise((resolve, reject) => {
    const url = new URL('/api/generate', OLLAMA_HOST);
    const body = JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: `${prompt}\n\n---\n${articleContent}`,
      stream: false,
    });

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.response || '');
        } catch (e) {
          reject(new Error(`Failed to parse Ollama response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function rewriteAsMarkTwain(article) {
  const fullText = `Title: ${article.title}\n\n${article.content || article.description}`;
  const result = await callOllama(MARK_TWAIN_PROMPT, fullText);
  return result.trim();
}

module.exports = { rewriteAsMarkTwain, callOllama, MARK_TWAIN_PROMPT };
