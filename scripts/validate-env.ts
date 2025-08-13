#!/usr/bin/env tsx

import { config } from 'dotenv';
import { join } from 'path';
import { validateEnvironment, getSheetUrls } from '../src/lib/env';

// Load environment variables from .env.local first, then .env
config({ path: join(process.cwd(), '.env.local') });
config();

async function validateSheetUrls() {
  const urls = getSheetUrls();
  const results: { [key: string]: boolean } = {};
  
  console.log('🔍 Validating Google Sheets URLs...\n');
  
  for (const [name, url] of Object.entries(urls)) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      results[name] = response.ok;
      
      if (response.ok) {
        console.log(`✅ ${name}: Accessible`);
      } else {
        console.log(`❌ ${name}: HTTP ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      results[name] = false;
      console.log(`❌ ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  return results;
}

async function main() {
  console.log('🚀 Environment Validation Script\n');
  
  // Validate environment schema
  const envValidation = validateEnvironment();
  
  if (envValidation.isValid) {
    console.log('✅ Environment variables schema validation passed');
    if (envValidation.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      envValidation.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    console.log('');
  } else {
    console.log('❌ Environment variables schema validation failed:');
    envValidation.errors.forEach(error => console.log(`   - ${error}`));
    if (envValidation.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      envValidation.warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    console.log('');
  }
  
  // Validate sheet URLs accessibility
  const urlResults = await validateSheetUrls();
  
  // Summary
  console.log('\n📊 Validation Summary:');
  console.log(`Environment Schema: ${envValidation.isValid ? '✅ Valid' : '❌ Invalid'}`);
  
  const accessibleUrls = Object.values(urlResults).filter(Boolean).length;
  const totalUrls = Object.keys(urlResults).length;
  console.log(`Sheet URLs: ${accessibleUrls}/${totalUrls} accessible`);
  
  // Exit with appropriate code
  const allValid = envValidation.isValid && accessibleUrls === totalUrls;
  console.log(`\n${allValid ? '🎉 All validations passed!' : '⚠️  Some validations failed'}`);
  
  process.exit(allValid ? 0 : 1);
}

main().catch(error => {
  console.error('❌ Validation script failed:', error);
  process.exit(1);
});