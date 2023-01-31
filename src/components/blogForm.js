import { useState } from 'react'

const BlogForm = ({ createBlog }) => {

  const [newBlog, setnewBlog] = useState('')
  const [newBlogAuth, setnewBlogAuth] = useState('')
  const [newBlogUrl, setnewBlogUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog,
      author: newBlogAuth,
      url: newBlogUrl
    })
    setnewBlog('')
    setnewBlogAuth('')
    setnewBlogUrl('')
  }
  const handleTitle = (event) => {
    setnewBlog(event.target.value)
  }

  const handleAuth = (event) => {
    setnewBlogAuth(event.target.value)
  }

  const handleUrl = (event) => {
    setnewBlogUrl(event.target.value)
  }

  return(
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addBlog}>
        <div>
          <input
            id="title"
            type="text"
            placeholder="Title"
            value={newBlog}
            onChange={handleTitle}
          />
        </div>
        <div>
          <input
            id="author"
            type="text"
            placeholder="Author"
            value={newBlogAuth}
            onChange={handleAuth}
          />
        </div>
        <div>
          <input
            id="url"
            type="text"
            placeholder="Url"
            value={newBlogUrl}
            onChange={handleUrl}
          />
        </div>
        <button id="save" type="submit">save</button>
      </form>
    </div>
  )
}

export default BlogForm
