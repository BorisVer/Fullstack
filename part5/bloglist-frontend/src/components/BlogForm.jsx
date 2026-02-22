import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });

    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          value={newTitle}
          onChange={({ target }) => setNewTitle(target.value)}
          placeholder="title"
        />
      </div>
      <div>
        author:
        <input
          value={newAuthor}
          onChange={({ target }) => setNewAuthor(target.value)}
          placeholder="author"
        />
      </div>
      <div>
        url:
        <input
          value={newUrl}
          onChange={({ target }) => setNewUrl(target.value)}
          placeholder="url"
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
};

export default BlogForm;
