import { execSync } from 'child_process';

async function checkAndInstall(packageName) {
  try {
    // Try to import the package dynamically
    await import(packageName);
    console.log(`${packageName} is already installed.`);
  } catch (e) {
    console.log(`${packageName} is not installed. Installing...`);
    execSync(`npm install ${packageName}`, { stdio: 'inherit' });
  }
}

// Check and install Vue Router and Pinia if not installed
checkAndInstall('vue-router');
checkAndInstall('pinia');
