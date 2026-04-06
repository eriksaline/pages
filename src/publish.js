const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DIST_DIR = path.join(__dirname, '../dist');
const GH_PAGES_BRANCH = 'gh-pages';

/**
 * Publish site to GitHub Pages
 */
function publishToGitHub() {
  console.log('📤 Publishing to GitHub Pages...\n');

  // Check if dist directory exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  // Check if git is initialized
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  } catch {
    console.error('❌ Not a git repository. Initialize git first with `git init`');
    process.exit(1);
  }

  try {
    // Create/checkout gh-pages branch
    console.log(`🌿 Checking out ${GH_PAGES_BRANCH} branch...\n`);

    try {
      execSync(`git checkout ${GH_PAGES_BRANCH}`, { stdio: 'inherit' });
    } catch {
      // Branch might not exist yet
      console.log(`Creating new ${GH_PAGES_BRANCH} branch...\n`);
      execSync(`git checkout --orphan ${GH_PAGES_BRANCH}`, { stdio: 'inherit' });
      execSync('git rm -rf .', { stdio: 'inherit' });
    }

    // Remove all files except .git
    const files = fs.readdirSync('.');
    for (const file of files) {
      if (file !== '.git' && file !== '.gitignore') {
        const fullPath = path.join('.', file);
        if (fs.lstatSync(fullPath).isDirectory()) {
          execSync(`rm -rf "${fullPath}"`, { stdio: 'inherit' });
        } else {
          fs.unlinkSync(fullPath);
        }
      }
    }

    // Copy dist contents to root
    console.log('\n📋 Copying build files...\n');
    copyDirRecursive(DIST_DIR, '.');

    // Commit and push
    console.log('\n📝 Committing changes...\n');
    execSync('git add .', { stdio: 'inherit' });
    const message = `Build: ${new Date().toISOString()}`;
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });

    console.log('\n🚀 Pushing to GitHub...\n');
    execSync(`git push origin ${GH_PAGES_BRANCH}`, { stdio: 'inherit' });

    console.log('\n✅ Published to GitHub Pages!');
    console.log('📖 Your site will be available at: https://<username>.github.io/<repo-name>/\n');

  } catch (error) {
    console.error('❌ Publish failed:', error.message);
    process.exit(1);
  }
}

/**
 * Recursively copy directory
 */
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Run publish
if (require.main === module) {
  publishToGitHub();
}

module.exports = { publishToGitHub };

