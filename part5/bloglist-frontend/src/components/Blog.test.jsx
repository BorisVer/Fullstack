import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('form calls event with details when a new blog is made', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('title')
  const authorInput = screen.getByPlaceholderText('author')
  const urlInput = screen.getByPlaceholderText('url')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Testing forms')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://example.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing forms')
  expect(createBlog.mock.calls[0][0].author).toBe('Test Author')
  expect(createBlog.mock.calls[0][0].url).toBe('http://example.com')
  })

test('renders title and author but not url or likes', () => {
  const blog = {
    title: 'Testing React components',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Testing React components Test Author')
  expect(element).toBeDefined()

  const url = screen.queryByText('http://example.com')
  expect(url).toBeNull()

  const likes = screen.queryByText('likes 5')
  expect(likes).toBeNull()
})



test('url likes and user are shown when view button is clicked', async () => {
  const blog = {
    title: 'Testing React components',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const mockHandler = vi.fn()
  const user = userEvent.setup()

  render(<Blog blog={blog} addLike={mockHandler} />)

  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText('http://example.com')).toBeDefined()
  expect(screen.getByText('likes 5')).toBeDefined()
  expect(screen.getByText('Test User')).toBeDefined()
})

test('when like button clicked twice event handler is called twice', async () => {
  const blog = {
    title: 'Testing React components',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  const mockLikeHandler = vi.fn()
  const user = userEvent.setup()

  render(<Blog blog={blog} addLike={mockLikeHandler} />)

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockLikeHandler.mock.calls).toHaveLength(2)
})
