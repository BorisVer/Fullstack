import { useState } from "react";

const Blog = ({ blog, addLike, removeBlog, user }) => {
  console.log('Blog component received user prop:', user)
  console.log('Blog user:', blog.user)
  // ...
  const [visible, setVisible] = useState(false);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const showRemoveButton = user && blog.user && (
    user.username === blog.user.username ||
    user.id === blog.user ||
    user.username === blog.user
  )

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={() => addLike(blog.id)}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {showRemoveButton && (
            <button onClick={() => removeBlog(blog.id)}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
