
Kakao.init("b1ae05cf3f44682ccf7ffba8606235b3")
function kakaoLogin(){
    window.Kakao.Auth.login({
        scope:'profile_nickname, account_email, gender',
        success: function(authoObj){
            window.Kakao.API.request({
                url:'/v2/user/me',
                success: res => {
                    const kakao_account = res.kakao_account;
                    const signupData = {
                        email: kakao_account.email,
                        username: kakao_account.profile.nickname
                    }
                    handleKakaoSignup(authoObj,signupData)
                }
            });
        },
        fail:function(error){
            console.log(error);
        }
    });
}

function handleKakaoSignup(authoObj,signupData){
    const kakaoSignupData = Object.assign({}, authoObj, signupData);
    const response = fetch('http://127.0.0.1:8000/user/kakao/',{
        headers:{
            Accept:'application/json',
            'Content-type':'application/json'
        },
        method:'POST',
        body:JSON.stringify(kakaoSignupData)
    })
    .then((res)=>res.json())
    .then((res)=>{
        console.log(res)
        if (res.msg=="로그인 성공"){
            console.log(res.refresh)
            localStorage.setItem("user_access_token", res.access);
            localStorage.setItem("user_refresh_token", res.refesh);
            // window.location.replace("http://127.0.0.1:5500/index.html");
        }else if(res.msg=="회원가입에 성공 했습니다."){
            alert("회원가입에 성공하셨습니다. 로그인을 해주세요.");
            window.location.replace("http://127.0.0.1:5500/login.html");
        }
    })
}