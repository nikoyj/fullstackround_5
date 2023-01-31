import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/loginForm'
import BlogForm from './components/blogForm'

const Notification = ({ message, error }) => {
  if (message === null) return null

  const style = {
    color: error ? 'red' : 'green',
    background: 'lightgrey',
    font_size: 30,
    border_style: 'solid',
    border_radius: 5,
    padding: 10,
    margin_bottom: 10
  }

  return (
    <div style={style}>
      {message}
    </div>
  )}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }  }, [])

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      await blogService
        .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setMessage(`New blog ${blogObject.title} by ${blogObject.author}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    } catch(exception) {
      setMessage(`New blog ${blogObject.title} cannot be added!`)
      setError(true)
      setTimeout(() => {
        setMessage(null)
        setError(false)
      }, 5000)

    }
  }
  const updateBlog = async (blogObject) => {
    try {
      await blogService
        .update(blogObject.id, blogObject)
        .then(updatedblog => {
          setMessage(`${updatedblog.title} was succesfully updated!`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setBlogs(blogs.map(blog => blog.id !== updatedblog.id ? blog : updatedblog))
        })
    } catch {
      setMessage(`${blogObject.title} couldn't be updated!`)
      setError(true)
      setTimeout(() => {
        setMessage(null)
        setError(false)
      },5000)
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      if (window.confirm(`Are you sure you want to delete ${blogObject.title} by ${blogObject.author} ?`)){
        await blogService
          .remove(blogObject.id)
          .then(deletedBlog => {
            console.log(`delete ${blogObject.id}`)
            setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
            setMessage(`${deletedBlog.title} was succesfully deleted`)
          })
      }
    } catch {
      setMessage(`${blogObject.title} couldn't be deleted`)
      setError(true)
      setTimeout(() => {
        setMessage(null)
        setError(false)
      },5000)
    }
  }
  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
      console.log(`user ${user.username}`)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong username or password!')
      setError(true)
      setTimeout(() => {
        setMessage(null)
        setError(false)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      setUser(null)
      window.localStorage.clear()
      console.log('logged out')
    } catch {
      setMessage('Couldnt log out')
      setError(true)
      setTimeout(() => {
        setMessage(null)
        setError(false)
      }, 5000)
    }
  }
  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={message} error={error} />

      { user === null ?
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
        :
        <div>
          <p>{user.name} logged in<button onClick={handleLogout} type="submit">logout</button></p>
          <Togglable  buttonLabel="new blog" ref={blogFormRef} >
            <BlogForm
              createBlog={addBlog}
            />
          </Togglable>
          <ul>
            {blogs.sort((blog, blog2) => blog2.likes - blog.likes).map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                updateBlog={updateBlog}
                deleteBlog={deleteBlog}
                user={user}
              />
            )}
          </ul>
        </div>
      }
    </div>
  )
}



export default App
