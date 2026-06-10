import { test, expect } from '@playwright/test';

test.describe('首页', () => {
  test('应正确加载并显示标题', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('探索我的数字宇宙');
  });

  test('应能切换主题', async ({ page }) => {
    await page.goto('/');
    const themeButton = page.locator('button[aria-label*="主题"]').first();
    await themeButton.click();
    // 验证主题切换后 html class 变化
    await expect(page.locator('html')).toHaveClass(/light|dark/);
  });

  test('应显示精选项目区域', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=精选项目')).toBeVisible();
  });

  test('应显示最新日记区域', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=最新日记')).toBeVisible();
  });
});
