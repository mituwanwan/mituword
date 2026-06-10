import { test, expect } from '@playwright/test';

test.describe('导航流程', () => {
  test('首页 → 项目列表 → 项目详情', async ({ page }) => {
    await page.goto('/');
    await page.click('text=查看全部 >> nth=0');
    await expect(page).toHaveURL(/\/projects/);
    await expect(page.locator('h1')).toContainText('项目展示');
  });

  test('首页 → 日记列表', async ({ page }) => {
    await page.goto('/');
    await page.click('text=查看全部 >> nth=1');
    await expect(page).toHaveURL(/\/diary/);
    await expect(page.locator('h1')).toContainText('日记');
  });

  test('响应式菜单应在移动端显示', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const menuButton = page.locator('button').filter({ hasText: /^$/ }).first();
    // 移动端应有汉堡菜单按钮
    await expect(menuButton).toBeVisible();
  });
});
