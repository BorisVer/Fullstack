import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch {
      setNotification({ message: "wrong username or password", type: "error" });
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    const returnedBlog = await blogService.create(blogObject);
    const allBlogs = await blogService.getAll();
    setBlogs(allBlogs);
    blogFormRef.current.toggleVisibility();
    setNotification({
      message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
      type: "success",
    });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in</p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            addLike={addLike}
            removeBlog={removeBlog}
            user={user}
          />
        ))}
      <p>
        <button onClick={handleLogout}>logout</button>
      </p>
    </div>
  );

  const addLike = async (id) => {
    const blog = blogs.find((b) => b.id === id);
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };

    const returnedBlog = await blogService.update(id, updatedBlog);
    setBlogs(blogs.map((b) => (b.id !== id ? b : returnedBlog)));
  };

  const removeBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id);

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(id);
      setBlogs(blogs.filter((b) => b.id !== id));
    }
  };

  console.log('Current user in App:', user)
  console.log('User username:', user?.username)

  return (
    <div>
      {notification && (
        <div
          style={{
            color: notification.type === "error" ? "red" : "green",
            background: "lightgrey",
            fontSize: 20,
            borderStyle: "solid",
            borderRadius: 5,
            padding: 10,
            marginBottom: 10,
          }}
        >
          {notification.message}
        </div>
      )}
      {user === null ? loginForm() : blogList()}
    </div>
  );
};

export default App;
