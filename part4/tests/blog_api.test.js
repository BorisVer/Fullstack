const { test, after, beforeEach, describe } = require("@jest/globals");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let token = null;

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("password", 3);
  const user = new User({ username: "user", passwordHash });
  await user.save();

  const token = {
    username: user.username,
    id: user._id,
  };
  secret_token = jwt.sign(token, process.env.SECRET);

  const blogs = helper.initialBlogs.map((blog) => ({ ...blog, user: user._id }));
  await Blog.insertMany(blogs);
});


describe("when there are initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test("blogs have id field instead of _id", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].id).toBeDefined();
    expect(response.body[0]._id).toBeUndefined();
  });

  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "async/await simplifies making async calls",
      author: "Test Author",
      url: "http://example.com",
      likes: 3,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${secret_token}`)
      .send(newBlog)
      .expect(201);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  });

  test("blog without likes defaults to 0", async () => {
    const newBlog = {
      title: "blog without likes",
      author: "Test Author",
      url: "http://example.com",
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${secret_token}`)
      .send(newBlog)
      .expect(201);

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = blogsAtEnd.find((b) => b.title === "blog without likes");
    expect(addedBlog.likes).toBe(0);
  });

  test("a blog can be deleted", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${secret_token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);
  });

  test("blog without title is not added", async () => {
    const newBlog = {
      author: "Test Author",
      url: "http://example.com",
      likes: 1,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${secret_token}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("blog without url is not added", async () => {
    const newBlog = {
      title: "Test Blog",
      author: "Test Author",
      likes: 1,
    };

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${secret_token}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });

  test("a blogs likes can be updated", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const updatedData = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 5,
    };

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${secret_token}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.likes).toBe(blogToUpdate.likes + 5);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
