import React , { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = (props) => {


  const blog = props.blog
  const [blogObject, setBlogObject] = useState(blog)
  const [show, setShow] = useState(false)
  const showing = { display: show ? '' : 'none' }

  const toggleShowing = () => setShow(!show)


  const textforbutton = show ? 'hide' : 'view'

  const like = () => {
    const updatedBlog = ({
      ...blogObject,
      likes: blogObject.likes + 1
    })
    props.updateBlog(updatedBlog, blog.id)
    setBlogObject(updatedBlog)
  }

  const remove = () => props.deleteBlog(blogObject)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <div style={blogStyle} className='blog'>
      <span>
        <p>
          {blog.title} ~ {blog.author} <button id="view-button" onClick={toggleShowing}> {textforbutton} </button>
        </p>
      </span>
      <div style={showing}>
        <span>
          <p> {blog.url} </p>
          <p> {blogObject.likes} <button id="like-button" onClick={like} type='like'>like</button></p>
          <p> {blog.user.name} </p>
          {blog.user.username === props.user.username ?
            <p> <button onClick={remove} type='delete'>delete</button></p>
            :
            <p>  </p>}
        </span>
      </div>
    </div>

  )}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog
