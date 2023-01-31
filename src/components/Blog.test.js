import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Jaska Jokinen',
    url: 'Keskivertosivusto.com',
    user: '12345678910',
    likes: 1
  }

  let updateBlog = jest.fn()
  let deleteBlog = jest.fn()
  const user = {
    username: 'user'
  }

  render(<Blog blog={blog} updateBlog={updateBlog} user={user} deleteBlog={deleteBlog} />)

  const element = screen.getByText('Component testing is done with react-testing-library ~ Jaska Jokinen')

  expect(element).toBeDefined()
})

test('clicking the button shows all information', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Jaska Jokinen',
    url: 'Keskivertosivusto.com',
    user: '12345678910',
    likes: 1
  }

  const useri = {
    username: 'user'
  }
  let updateBlog = jest.fn()
  let deleteBlog = jest.fn()

  const component = render(<Blog blog={blog} updateBlog={updateBlog} user={useri} deleteBlog={deleteBlog} />)
  const user = userEvent.setup()
  const button = screen.getByText( 'view' )
  await user.click(button)

  expect(component.container).toHaveTextContent(
    'Keskivertosivusto.com'
  )
  expect(component.container).toHaveTextContent(
    '1'
  )
})
test('clicking the like button twice sends two renders forward', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Jaska Jokinen',
    url: 'Keskivertosivusto.com',
    user: '12345678910',
    likes: 1
  }

  const useri = {
    username: 'user'
  }
  let updateBlog = jest.fn()
  let deleteBlog = jest.fn()

  render(<Blog blog={blog} updateBlog={updateBlog} user={useri} deleteBlog={deleteBlog} />)

  const user = userEvent.setup()
  const button1 = screen.getByText( 'view' )
  await user.click(button1)
  const button2 = screen.getByText('like')
  await user.click(button2)
  await user.click(button2)

  expect(updateBlog.mock.calls).toHaveLength(2)
})