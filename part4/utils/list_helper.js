const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
      return null
    }

  return blogs.reduce((prev, current) =>
    (prev.likes > current.likes ? prev : current)
  );
};

const mostBlogs = (blogs) => {
  const counts = {}
  blogs.forEach(blog => {
    if (counts[blog.author]) {
      counts[blog.author] += 1;
    } else {
      counts[blog.author] = 1;
    }
  });

  let mostAuthor = ""
  let authorAmount = 0

  for (const author in counts) {
    if (counts[author] > authorAmount) {
      mostAuthor = author;
      authorAmount = counts[author];
    }
  }

  return { author: mostAuthor, blogs: authorAmount };
};

const mostLikes = (blogs) => {
  const counts = {}
  blogs.forEach(blog => {
    if (counts[blog.author]) {
      counts[blog.author] += blog.likes;
    } else {
      counts[blog.author] = blog.likes;
    }
  });

  let mostAuthor = ""
  let authorAmount = 0

  for (const author in counts) {
    if (counts[author] > authorAmount) {
      mostAuthor = author;
      authorAmount = counts[author];
    }
  }

  return { author: mostAuthor, likes: authorAmount };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
