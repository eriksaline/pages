const rssFetcher = require('./rss-fetcher');
const ollama = require('./ollama');
const postManager = require('./post-manager');

async function importNewArticles({ publish = false, limit = 5 } = {}) {
  console.log('Fetching RSS feed...');
  const { newItems, allGuids } = await rssFetcher.getNewEntries();

  if (newItems.length === 0) {
    console.log('No new articles found.');
    return [];
  }

  console.log(`Found ${newItems.length} new articles. Processing up to ${limit}...`);

  const created = [];
  for (const item of newItems.slice(0, limit)) {
    console.log(`  Processing: ${item.title}`);

    let articleContent;
    try {
      articleContent = await rssFetcher.fetchArticleContent(item.link);
    } catch (err) {
      console.error(`  Failed to fetch article content for "${item.title}": ${err.message}`);
      continue;
    }

    const fullPrompt = `System: ${ollama.MARK_TWAIN_PROMPT}\n\nArticle:\nTitle: ${item.title}\n\n${articleContent}`;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`ARTICLE: ${item.title}`);
    console.log(`URL: ${item.link}`);
    console.log(`CONTENT (${articleContent.length} chars):`);
    console.log(articleContent);
    console.log(`\nPROMPT SENT TO OLLAMA:`);
    console.log(fullPrompt);
    console.log(`${'='.repeat(60)}\n`);

    let overview;
    try {
      overview = await ollama.rewriteAsMarkTwain({ title: item.title, content: articleContent });
    } catch (err) {
      console.error(`  Failed to get Ollama rewrite for "${item.title}": ${err.message}`);
      continue;
    }

    const content = `# ${item.title}\n\n${overview}\n\n---\n\n*Originally from [${item.title}](${item.link})*`;

    try {
      const post = postManager.createPost({
        title: item.title,
        content,
        author: 'TLDR via Twain',
        tags: ['tldr', 'tech'],
      });

      if (publish) {
        postManager.publishPost(post.slug);
      }

      created.push(post);
      console.log(`  Created post: ${post.slug}`);
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log(`  Post already exists, skipping: ${item.title}`);
      } else {
        console.error(`  Failed to create post "${item.title}": ${err.message}`);
      }
    }
  }

  rssFetcher.markImported(allGuids);
  console.log(`Done. Created ${created.length} new post(s).`);
  return created;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const publish = args.includes('--publish');
  const limitIdx = args.indexOf('--limit');
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) || 5 : 5;

  importNewArticles({ publish, limit })
    .then((posts) => {
      console.log(`\nImported ${posts.length} articles.`);
      process.exit(0);
    })
    .catch((err) => {
      console.error('Import failed:', err.message);
      process.exit(1);
    });
}

module.exports = { importNewArticles };
