import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './blogForm'

test('blogform works correctly', async () => {


  const createBlog = jest.fn()
  const user = userEvent.setup()
  render(<BlogForm createBlog={createBlog} />)

  const input1 = screen.getByPlaceholderText('Title')
  const input2 = screen.getByPlaceholderText('Author')
  const input3 = screen.getByPlaceholderText('Url')

  const sendButton = screen.getByText('save')

  await user.type(input1, 'testing the form...')
  await user.type(input2, 'tester' )
  await user.type(input3, 'www.test.com' )

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing the form...' )
  expect(createBlog.mock.calls[0][0].author).toBe('tester' )
  expect(createBlog.mock.calls[0][0].url).toBe('www.test.com' )
})