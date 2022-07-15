const BACK_END_URL = "http://127.0.0.1:8000/article/";
const USER_URL = "http://127.0.0.1:8000/user/";

const GetUserInfo = () => {
  fetch(USER_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("user_access_token"),
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.username == null) {
        alert("로그인이 필요합니다");
        window.location.href = "./login.html";
      } else {
        document.getElementById("user").innerHTML = res.username;
      }
    });
};

const GetImgList = () => {
  fetch(BACK_END_URL)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        // 기울기 0
        // let random = 0;
        // 기울기 -5 ~ 5
        let random = Math.floor(Math.random() * 10) - 5;
        let html = `<div onmouseover="article_box_hover(this)" onclick="modal_open(${item.id})" style="transform: rotate(${random}deg);" class="article_list_box">
          <img src="${item.images[0]}" alt="">
          <div id="article_list_like" class="article_list_like">
          <div><i style="color: red;" class="fa-solid fa-heart"></i><span> ${item.like_num}</span></div>
          <div><i style="color: #cecece;" class="fa-solid fa-comment"></i><span> ${item.comment.length}</span></div>
          </div>
          </div>`;
        document.getElementById("main_article_list").innerHTML += html;
      });
    });
};

function upload_modal_submit() {
  let upload_content = document.getElementById("upload_content").value;
  let upload_file = document.getElementById("upload_file").files;
  let upload_modal_content = document.getElementById("upload_model_content");
  if (upload_content == "") {
    upload_modal_content.style.display = "flex";
  } else {
    let upload_content = document
      .getElementById("upload_content")
      .value.replace(/\n/g, "<br>");
    let formData = new FormData();
    formData.append("content", upload_content);
    for (let i = 0; i < upload_file.length; i++) {
      formData.append("image_lists", upload_file[i]);
    }
    document.getElementById("now_loading").style.display = "flex";
    fetch(BACK_END_URL, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user_access_token"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        alert("업로드 완료");
        window.location.reload();
      });
  }
}

function modal_open(id) {
  const PayLoad = JSON.parse(localStorage.getItem("payload"));
  let user_name = PayLoad.username;
  let user_id = PayLoad.user_id;
  document.body.style.overflow = "hidden";
  document.body.style.touchAction = "none";
  document.getElementById("modal_box").style.display = "flex";
  fetch(`http://127.0.0.1:8000/article/${id}/`)
    .then((res) => res.json())
    .then((data) => {
      if (data.likes.indexOf(user_name) != -1) {
        document.getElementById("like_icon_off").style.display = "none";
        document.getElementById(
          "like_icon_on"
        ).innerHTML = `<i class="fa-solid fa-heart"></i><span> ${data.likes.length}</span>`;
        document.getElementById("like_icon_on").style.display = "flex";
      } else {
        document.getElementById("like_icon_on").style.display = "none";
        document.getElementById(
          "like_icon_off"
        ).innerHTML = `<i class="fa-regular fa-heart"></i><span>${data.likes.length}</span>`;
        document.getElementById("like_icon_off").style.display = "flex";
      }

      if (data.user == user_id) {
        document.getElementById("article_delete").style.display = "block";
        document.getElementById("article_edit").style.display = "block";
        document.getElementById("article_delete").onclick = () => {
          ArticleDelete(id);
        };
        document.getElementById("article_edit").onclick = () => {
          ArticleEdit(id);
        };
      } else {
        document.getElementById("article_delete").style.display = "none";
      }
      let images = data.images;
      let content = data.content;
      let comments = data.comment;
      document.getElementById("modal_box_img").src = images[0];
      document.getElementById("modal_box_img").ondblclick = () => {
        LikeOn(id);
      };
      document.getElementById("like_icon_off").onclick = () => {
        LikeOn(id);
      };
      document.getElementById("like_icon_on").onclick = () => {
        LikeOn(id);
      };
      document.getElementById("modal_content_text").innerHTML = content;
      document.getElementById("modal_comment_list").innerHTML = "";
      document.getElementById("modal_username").innerHTML = data.author;
      comments.forEach((item) => {
        if (item.user == user_id) {
          let html = `<div class="modal_comment_text">
                          <div class="balloon_03">
                              <div>
                                  ${item.comment}
                              </div>
                          </div>
                          <div class="modal_comment_user">
                          <div>${item.username}</div>
                          <div>${item.date}</div>
                          <div onclick="CommentDelete(${item.id},${data.id})" class="comment_delete">삭제</div>
                          <div onclick="CommentEdit(${item.id},${data.id})" class="comment_edit">수정</div>
                          </div>
                      </div>
                      `;
          document.getElementById("modal_comment_list").innerHTML += html;
        } else {
          let html = `<div class="modal_comment_text">
                      <div class="balloon_03">
                      <div>
                      ${item.comment}
                      </div>
                      </div>
                      <div class="modal_comment_user">
                      <div>${item.username}</div>
                      <div>${item.date}</div>
                      </div>
                      </div>`;
          document.getElementById("modal_comment_list").innerHTML += html;
        }
      });
      let comment_html = `<textarea id="modal_comment_text" name="" id="" placeholder="댓글....."></textarea>
        <div onclick="CommentUpload(${id})" id="modal_comment_submit" class="modal_comment_submit">전송</div>`;

      document.getElementById("modal_comment_input").innerHTML = comment_html;
    });
}

const CommentUpload = (id) => {
  let comment_content = document.getElementById("modal_comment_text").value;
  if (comment_content == "") {
    alert("댓글을 입력해주세요");
    return;
  }

  const data = {
    comment: comment_content,
  };
  fetch(`${BACK_END_URL}comment/${id}/`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("user_access_token"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      modal_open(id);
    });
};

const Logout = () => {
  localStorage.removeItem("user_access_token");
  localStorage.removeItem("user_refresh_token");
  localStorage.removeItem("payload");
  window.location.href = "./login.html";
};

const LikeOn = (id) => {
  fetch(`${BACK_END_URL}like/${id}/`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("user_access_token"),
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => {
      document.getElementById("heart_ani").style.display = "block";
      setTimeout(() => {
        document.getElementById("heart_ani").style.display = "none";
      }, 500);

      modal_open(id);
    });
};
const ArticleDelete = (id) => {
  let confirm_delete = confirm("삭제하시겠습니까?");
  if (confirm_delete) {
    fetch(BACK_END_URL + "myarticle/" + id + "/", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user_access_token"),
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        alert("삭제 완료");
        window.location.reload();
      });
  } else {
    return;
  }
};

const ArticleEdit = (id) => {
  document.getElementById("modal_edit_box").style.display = "flex";
  document.getElementById("modal_edit_text").value = document
    .getElementById("modal_content_text")
    .innerHTML.replace(/<br>/g, "\n");

  document.getElementById("modal_edit_button").onclick = () => {
    let content = document.getElementById("modal_edit_text").value;
    content = content.replace(/\n/g, "<br>");
    if (content == "") {
      alert("내용을 입력해주세요");
      return;
    }
    let confirm_edit = confirm("수정하시겠습니까?");
    if (confirm_edit) {
      const data = {
        content: content,
      };
      fetch(BACK_END_URL + `myarticle/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user_access_token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          alert("수정 완료");
          console.log(res);
          document.getElementById("modal_edit_box").style.display = "none";
          modal_open(id);
        });
    } else {
      return;
    }
  };
}

const CommentEdit = (id,article_id,text) => {
  document.getElementById("modal_edit_box").style.display = "flex";
  let node = event.target.parentNode
  let comment_value = node.parentNode.childNodes[1].childNodes[1].innerText
  document.getElementById("modal_edit_text").value = comment_value.replace(/<br>/g, "\n");

  document.getElementById("modal_edit_button").onclick = () => {
    let comment = document.getElementById("modal_edit_text").value;
    comment = comment.replace(/\n/g, "<br>");
    if (comment == "") {
      alert("내용을 입력해주세요");
      return;
    }
    let confirm_edit = confirm("수정하시겠습니까?");
    if (confirm_edit) {
      const data = {
        comment: comment,
      };
      fetch(BACK_END_URL + `comment/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user_access_token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((res) => {
          alert("수정 완료");
          console.log(res);
          document.getElementById("modal_edit_box").style.display = "none";
          modal_open(article_id);
        });
    } else {
      return;
    }
  }
}

  const CommentDelete = (id, article_id) => {
    let confirm_delete = confirm("삭제하시겠습니까?");
    if (confirm_delete) {
      fetch(BACK_END_URL + "comment/" + id + "/", {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user_access_token"),
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          alert("삭제 완료");
          modal_open(article_id);
        });
    } else {
      return;
    }
  };

GetUserInfo();
GetImgList();
