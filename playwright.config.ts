import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'tests',testMatch:'**/*.spec.ts',workers:1,use:{headless:true,...(process.env.VIXO_CHROMIUM_PATH?{launchOptions:{executablePath:process.env.VIXO_CHROMIUM_PATH}}:{})}});
