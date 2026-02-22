const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
    await page.evaluate(() => window.localStorage.clear())
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('väärä')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByPlaceholder('title').fill('Test Title')
      await page.getByPlaceholder('author').fill('Test Author')
      await page.getByPlaceholder('url').fill('http://test.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Test Title Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByPlaceholder('title').fill('Test Like')
      await page.getByPlaceholder('author').fill('Like Author')
      await page.getByPlaceholder('url').fill('http://like.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Test Like Like Author')).toBeVisible()

      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByText('likes 0')).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('user who added blog can delete', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('Test Delete')
      await page.getByPlaceholder('author').fill('Delete Author')
      await page.getByPlaceholder('url').fill('http://delete.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Test Delete Delete Author')).toBeVisible()

      await page.getByRole('button', { name: 'view' }).click()

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Test Delete Delete Author')).not.toBeVisible()
    })

    test('blogs are oredered by likes', async ({ page }) => {
      // Create three blogs
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('First blog')
      await page.getByPlaceholder('author').fill('Author 1')
      await page.getByPlaceholder('url').fill('http://test1.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('First blog Author 1')).toBeVisible()

      await page.getByPlaceholder('title').fill('Second blog')
      await page.getByPlaceholder('author').fill('Author 2')
      await page.getByPlaceholder('url').fill('http://test2.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Second blog Author 2')).toBeVisible()

      await page.getByPlaceholder('title').fill('Third blog')
      await page.getByPlaceholder('author').fill('Author 3')
      await page.getByPlaceholder('url').fill('http://test3.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Third blog Author 3')).toBeVisible()

      await page.getByRole('button', { name: 'view' }).nth(0).click()
      for (let i = 0; i < 5; i++) {
        await page.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(200)
      }

      await expect(page.getByText('likes 5')).toBeVisible()
      await page.getByRole('button', { name: 'hide' }).click()

      await page.getByRole('button', { name: 'view' }).nth(1).click()
      for (let i = 0; i < 10; i++) {
        await page.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(200)
      }

      await expect(page.getByText('likes 10')).toBeVisible()
      await page.getByRole('button', { name: 'hide' }).click()

      await page.getByRole('button', { name: 'view' }).nth(2).click()
      for (let i = 0; i < 3; i++) {
        await page.getByRole('button', { name: 'like' }).click()
        await page.waitForTimeout(200)
      }

      await expect(page.getByText('likes 3')).toBeVisible()
      await page.getByRole('button', { name: 'hide' }).click()

      const blogDivs = await page.locator('div[style*="border"]').filter({ hasText: /blog Author/ }).all()

      const firstBlogText = await blogDivs[0].textContent()
      const secondBlogText = await blogDivs[1].textContent()
      const thirdBlogText = await blogDivs[2].textContent()

      expect(firstBlogText).toContain('Second blog')
      expect(secondBlogText).toContain('First blog')
      expect(thirdBlogText).toContain('Third blog')
    })
  })
  describe('Two users exist', () => {
    beforeEach(async ({ request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Another User',
          username: 'fakematti',
          password: 'password'
        }
      })
    })

    test('only the creator can see the delete button', async ({ page }) => {
      await page.getByRole('textbox').first().fill('mluukkai')
      await page.getByRole('textbox').last().fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByPlaceholder('title').fill('Test Matti')
      await page.getByPlaceholder('author').fill('Author')
      await page.getByPlaceholder('url').fill('http://matti.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Test Matti Author')).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      await page.getByRole('textbox').first().fill('fakematti')
      await page.getByRole('textbox').last().fill('password')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'view' }).click()

      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })
  })
})
