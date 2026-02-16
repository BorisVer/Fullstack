const { test, after, beforeEach, describe } = require("@jest/globals");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const helper = require("./test_helper");

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
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

    await api.post("/api/blogs").send(newBlog).expect(201);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);
  });

  test("blog without likes defaults to 0", async () => {
    const newBlog = {
      title: "blog without likes",
      author: "Test Author",
      url: "http://example.com",
    };

    await api.post("/api/blogs").send(newBlog).expect(201);

    const blogsAtEnd = await helper.blogsInDb();
    const addedBlog = blogsAtEnd.find((b) => b.title === "blog without likes");
    expect(addedBlog.likes).toBe(0);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
