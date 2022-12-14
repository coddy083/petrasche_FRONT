// const backend_base_url = "http://127.0.0.1:8000/"
// const frontend_base_url = "http://127.0.0.1:5500/"
const frontend_base_url = "https://www.petrasche.com/"
const backend_base_url = "https://www.petrasche.site/"
const ws_base_url = "wss://www.petrasche.site/"


// async function loadUserinfo() {
//     const response_json = await UserInfo()
//     sessionStorage.setItem('id', response_json.id)
//     sessionStorage.setItem('username', response_json.username)
// }
// loadUserinfo()

function replace_text(text) {
    let text_replaced = text.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/gi, "");
    return text_replaced;
}

async function profile(user_id) {
    sessionStorage.setItem('profile_page_id', user_id)
    payload = localStorage.getItem("payload")
    if (user_id == JSON.parse(payload).user_id) {
        UserPage()
    } else {
        window.location.href = "/personal.html"
    }
}

const DM = () => {
    window.location.href = "/dm.html";
}
const home = () => {
    window.location.href = "/index.html";
}
const UserPage = () => {
    window.location.href = "/mypage.html";
}
const Logout = () => {
    localStorage.removeItem("user_access_token");
    localStorage.removeItem("user_refresh_token");
    localStorage.removeItem("payload");
    window.location.href = "./login.html";
};

function petevent() {
    window.location.href = "/tournament.html";
}

function walk() {
    window.location.href = "/walk.html"
}

function alarm(id) {
    id.childNodes[3].innerHTML = "";
    fetch(`${backend_base_url}user/history/`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("user_access_token"),
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.length == 0) {
                id.childNodes[3].innerHTML = "알림이 없습니다.";
            } else {
                res.forEach((history) => {
                    if (history.type == "like") {
                        id.childNodes[3].innerHTML += `<div>${history.user}님이 게시물을 <span style="color: red">좋아요</span> 했습니다. ${history.time}</div>`;
                    }
                    if (history.type == "follow") {
                        id.childNodes[3].innerHTML += `<div>${history.user}님이 <span style="color: blue">팔로우</span> 했습니다. ${history.time}</div>`;
                    }
                    if (history.type == "comment") {
                        id.childNodes[3].innerHTML += `<div>${history.user}님이 게시물에 <span style="color: green">댓글</span>을 남겼습니다. ${history.time}</div>`;
                    }
                });
            }
        });

    id.childNodes[3].style.display = "block";
    let alarm = true;
    id.onclick = () => {
        if (alarm) {
            id.childNodes[3].style.display = "none";
            alarm = false;
        } else {
            id.childNodes[3].style.display = "block";
            alarm = true;
        }
    };
}

