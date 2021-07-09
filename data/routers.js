const express = require('express');

const Posts = require('./db.js');

const router = express();

router.get(`/`, async (req, res) => {
  const posts = await Posts.find();
  try {
    res.status(200).json(posts);
  }
  catch {
    res.status(500).json({ message: 'The posts information could not be retrieved' })
  }
})

router.get(`/:id`, async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Posts.findById(id);
    if (!post) {
      res.status(404).json({ message: 'The post with the specified ID does not exist' })
    } else {
      res.status(200).json(post)
    }
  }
  catch {
    res.status(500).json({ message: 'The post information could not be retrieved' })
  }
})

router.get(`/:id/comments`, async (req, res) => {
  const { id } = req.params;
  try {
    const postComment = await Posts.findPostComments(id);
    if (!postComment) {
      res.status(404).json({ message: 'The post with the specified ID does not exists' })
    } else {
      res.status(200).json(postComment)
    }
  }
  catch {
    res.status(500).json({ message: 'The comments information could not be retrieved' })
  }
})

router.post(`/`, async (req, res) => {
  const post = req.body;
  try {
    const inserted = await Posts.insert(post)
    if (!post.title || !post.contents) {
      res.status(400).json({ message: 'Please provide title and contents for the post' })
    } else {
      res.status(201).json(inserted);
    }
  }
  catch {
    res.status(500).json({ message: 'There was an error while saving the post to the database' })
  }
})

router.post(`/:id/comments`, async (req, res) => {
  const { id } = req.params;
  const post = await Posts.findById(id);
  const comment = req.body;
  try {
    if (!post) {
      res.status(404).json({ message: 'The post with the specified ID does not exists' })
    } else if (!comment.text) {
      res.status(400).json({ message: 'Please provide text for the comment' })
    } else {
      const inserted = await Posts.insertComment({ post_id: id, ...comment });
      res.status(201).json(inserted)
    }
  }
  catch {
    res.status(500).json({ message: 'There was an error while saving the comment to the database' })
  }
})
//we can get rid of req.body and logic 86-88
router.delete(`/:id`, async (req, res) => {
  const { id } = req.params;
  const post = req.body;
  try {
    const removed = await Posts.remove(id);
    if (!post) {
      res.status(404).json({ message: 'The post with the specified ID is not found' })
    } else {
      res.status(200).json(removed)
    }
  }
  catch{
    res.status(500).json({ message: 'The post could not be removed' })
  }
})

router.put(`/:id`, async (req, res) => {
  const { id } = req.params;
  const post = req.body;
  try {
    const updated = await Posts.update(id, post);
    if (!post) {
      res.status(404).json({ message: 'The post with the specified ID is not found' })
    } else if (!post.title || !post.contents) {
      res.status(400).json({ message: 'Please provide the title and contents for the post' })
    } else {
      res.status(200).json(updated)
    }
  }
  catch {
    res.status(500).json({ message: 'The post information could not be modified' })
  }
})

module.exports = router;