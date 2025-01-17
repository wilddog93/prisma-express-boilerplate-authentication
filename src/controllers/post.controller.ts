import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { postService } from '../services';
import { User } from '@prisma/client';

const createPost = catchAsync(async (req, res) => {
  const { id } = req.user as User;
  const post = await postService.createPost(req.body, id);
  res.status(httpStatus.CREATED).send(post);
});

const getPosts = catchAsync(async (req, res) => {
  const query = req.query;
  const filter = pick(query, ['title', 'content', 'authorId', 'author', 'viewCount', 'published']);
  const options = pick(query, ['sortBy', 'limit', 'page', 'sortType']);
  const result = await postService.queryPosts(filter, options);
  res.send(result);
});

const getPost = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  res.send(post);
});

export default {
  createPost,
  getPosts,
  getPost
};
