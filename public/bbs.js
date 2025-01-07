"use strict";

let number = 0;
const bbs = document.querySelector('#bbs');

// 投稿の送信
document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const message = document.querySelector('#message').value;

    const params = {
        method: "POST",
        body: 'name=' + encodeURIComponent(name) + '&message=' + encodeURIComponent(message),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/post";
    fetch(url, params)
    .then(response => response.json())
    .then(response => {
        console.log(response);
        document.querySelector('#message').value = "";
    });
});

// 投稿の確認と表示
document.querySelector('#check').addEventListener('click', () => {
    const params = {
        method: "POST",
        body: '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/check";
    fetch(url, params)
    .then(response => response.json())
    .then(response => {
        let value = response.number;
        if (number !== value) {
            const params = {
                method: "POST",
                body: 'start=' + number,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };
            const url = "/read";
            fetch(url, params)
            .then(response => response.json())
            .then(response => {
                number += response.messages.length;
                for (let mes of response.messages) {
                    const cover = document.createElement('div');
                    cover.className = 'cover';
                    cover.dataset.id = mes.id; // 投稿IDを設定

                    const name_area = document.createElement('span');
                    name_area.className = 'name';
                    name_area.innerText = mes.name;

                    const mes_area = document.createElement('span');
                    mes_area.className = 'mes';
                    mes_area.innerText = mes.message;

                    // 「いいね」ボタン
                    const likeButton = document.createElement('button');
                    likeButton.className = 'like-button';
                    likeButton.innerHTML = '♡';
                    const likeCount = document.createElement('span');
                    likeCount.className = 'like-count';
                    likeCount.innerText = mes.likes || 0;

                    likeButton.addEventListener('click', () => {
                        fetch('/like', {
                            method: "POST",
                            body: 'id=' + encodeURIComponent(mes.id),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).then(response => response.json())
                          .then(data => {
                              if (data.success) {
                                  likeCount.innerText = data.likes;
                              } else {
                                  console.error(data.message);
                              }
                          });
                    });

                    // 削除ボタン
                    const deleteButton = document.createElement('button');
                    deleteButton.innerText = '削除';
                    deleteButton.addEventListener('click', () => {
                        fetch('/delete', {
                            method: "POST",
                            body: 'id=' + encodeURIComponent(mes.id),
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        }).then(response => response.json())
                          .then(data => {
                              if (data.success) {
                                  cover.remove();
                              } else {
                                  console.error(data.message);
                              }
                          });
                    });

                    // 返信リスト
                    const replyList = document.createElement('ul');
                    replyList.className = 'reply-list';
                    if (mes.replies) {
                        mes.replies.forEach(reply => {
                            const replyItem = document.createElement('li');
                            replyItem.innerText = reply;
                            replyList.appendChild(replyItem);
                        });
                    }

                    // 返信ボタン
                    const replyButton = document.createElement('button');
                    replyButton.className = 'reply-button';
                    replyButton.innerText = '返信';
                    replyButton.addEventListener('click', () => {
                        const reply = prompt("返信を入力してください:");
                        if (reply) {
                            fetch('/reply', {
                                method: "POST",
                                body: 'id=' + encodeURIComponent(mes.id) + '&reply=' + encodeURIComponent(reply),
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                }
                            }).then(response => response.json())
                              .then(data => {
                                  if (data.success) {
                                      const replyItem = document.createElement('li');
                                      replyItem.innerText = reply;
                                      replyList.appendChild(replyItem);
                                  } else {
                                      console.error(data.message);
                                  }
                              });
                        }
                    });

                    cover.appendChild(name_area);
                    cover.appendChild(mes_area);
                    cover.appendChild(likeButton);
                    cover.appendChild(likeCount);
                    cover.appendChild(deleteButton);
                    cover.appendChild(replyButton);
                    cover.appendChild(replyList);

                    bbs.appendChild(cover);
                }
            });
        }
    });
});
