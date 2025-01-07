"use strict";
const express = require("express");
const app = express();

let bbs = []; // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える
let currentId = 0; // 投稿ごとに一意のIDを付与するためのカウンター

app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

// 投稿の送信
app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  const newPost = {
    id: currentId++, // 一意のIDを付与
    name: name,
    message: message,
    likes: 0, // 初期の「いいね」の数
    replies: [] // 初期の返信リスト
  };
  bbs.push(newPost);
  console.log(`Post added:`, newPost);
  res.json({ success: true, number: bbs.length });
});

// 投稿データの確認
app.post("/check", (req, res) => {
  res.json({ number: bbs.length });
});

// 投稿データの読み取り
app.post("/read", (req, res) => {
  const start = Number(req.body.start);
  if (start === 0) {
    res.json({ messages: bbs });
  } else {
    res.json({ messages: bbs.slice(start) });
  }
});

// 返信の追加
app.post("/reply", (req, res) => {
  const postId = Number(req.body.id);
  const reply = req.body.reply;
  const targetPost = bbs.find(post => post.id === postId);

  if (targetPost) {
    targetPost.replies.push(reply);
    console.log(`Reply added to post ${postId}:`, reply);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: "Post not found" });
  }
});

// いいねの追加
app.post("/like", (req, res) => {
  const postId = Number(req.body.id);
  const targetPost = bbs.find(post => post.id === postId);

  if (targetPost) {
    targetPost.likes++;
    console.log(`Post ${postId} liked. Total likes: ${targetPost.likes}`);
    res.json({ success: true, likes: targetPost.likes });

  } else {
    res.status(404).json({ success: false, error: "Post not found" });
  }
});

// 投稿の削除
app.post("/delete", (req, res) => {
  const postId = Number(req.body.id);
  const index = bbs.findIndex(post => post.id === postId);

  if (index !== -1) {
    bbs.splice(index, 1);
    console.log(`Post ${postId} deleted.`);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, error: "Post not found" });
  }
});

// サーバー起動
app.listen(8080, () => console.log("Example app listening on port 8080!"));

