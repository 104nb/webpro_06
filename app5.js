const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  // ユーザの予想を取得 (req.query.omikuji)
  let userGuess = req.query.omikuji;
  
  // ランダムに1から6の数字を生成して運勢を決定
  const num = Math.floor(Math.random() * 6 + 1);
  let luck = '';
  
  switch(num) {
    case 1: luck = '大吉'; break;
    case 2: luck = '中吉'; break;
    case 3: luck = '小吉'; break;
    case 4: luck = '吉'; break;
    case 5: luck = '末吉'; break;
    case 6: luck = '凶'; break;
  }

  // 勝敗判定
  let judgement = '';
  if (userGuess === luck) {
    judgement = '当たり！';
  } else {
    judgement = '残念、ハズレ。';
  }

  // 結果をテンプレートに渡して表示
  res.render('luck', { number: num, luck: luck, judgement: judgement });
});

app.get("/coin", (req, res) => {
  // ユーザの予想を取得 (req.query.coin)
  let userGuess = req.query.coin;

  // 回数をクエリパラメータから取得、なければ0で初期化
  let total = Number(req.query.total) || 0;
  let win = Number(req.query.win) || 0;

  // コインの結果をランダムに生成 (0: 表, 1: 裏)
  const coinFlip = Math.floor(Math.random() * 2); // 0か1を生成
  let result = coinFlip === 0 ? '表' : '裏';

  // 勝敗判定
  let judgement = '';
  if (userGuess === result) {
    judgement = '当たり！';
    win += 1; // 当たりの場合はカウント
  } else {
    judgement = '残念、ハズレ。';
  }

  total += 1; // トスの回数をカウント

  // 結果をテンプレートに渡して表示
  res.render('coin', { result: result, judgement: judgement, win: win, total: total });
});


app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number(req.query.win);
  let total = Number(req.query.total);
  console.log({ hand, win, total });

  const num = Math.floor(Math.random() * 3 + 1);
  let cpu = '';
  if (num == 1) cpu = 'グー';
  else if (num == 2) cpu = 'チョキ';
  else cpu = 'パー';

  // 勝敗の判定
  let judgement = '';
  if (hand == 'グー' && cpu == 'チョキ' ||
      hand == 'チョキ' && cpu == 'パー' ||
      hand == 'パー' && cpu == 'グー') {
    judgement = '勝ち';
    win += 1; // 勝った場合のみカウント
  } else if (hand == cpu) {
    judgement = '引き分け';
  } else {
    judgement = '負け';
  }

  total += 1; // ゲームの総数は常にカウント

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  
  res.render('janken', display);
});

app.get("/get_test", (req, res) => {
  res.json({
    answer: 0
  })
});


app.listen(8080, () => console.log("Example app listening on port 8080!"));
