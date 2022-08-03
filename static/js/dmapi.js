async function getUserInfo() {
    const response = await fetch(`${backend_base_url}user/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    console.log(response_json.gender, response.status)
    // response_json = await response.json()
    if (response.status == 401) {
        alert("로그인을 해주세요")
        window.location.replace(`${frontend_base_url}login.html`);
    } else {
        if (response_json.gender == "입력해주세요") {
            alert("프로필을 등록해주세요")
            window.location.replace(`${frontend_base_url}mypage.html`);
        }
    }
    return response_json
}


// 메세지 리스트 불러오기
async function getMessage(id) {
    const response = await fetch(`${backend_base_url}dm/${id}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    return response_json
}


// 내 채팅방 불러오기 
async function getHeader() {
    const response = await fetch(`${backend_base_url}dm/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    return response_json
}


// 채팅방 생성
async function createHeader(id) {
    const response = await fetch(`${backend_base_url}dm/${id}/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    return response_json
}


