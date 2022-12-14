
// Get the modal
var modal = document.getElementById("myModal");


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
function walkModalOpen() {
    modal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.getElementById('map_modal').style.display = 'none'
        document.getElementById('map_modal').style.display = 'none'
    }

}




function goBack() {
    const detail_r_sec = document.getElementById("detail_r_sec")
    const r_sec = document.getElementById("r_sec")
    detail_r_sec.style.display = "none"
    r_sec.style.display = "flex"
}
//오늘부터 이주일 날짜구하기
let today = new Date();
const m_dropdown_region_date = []
for (let i = 0; i < 14; i++) {
    m_dropdown_region_date.push(new Date(today.setDate(today.getDate() + 1)).toLocaleDateString());

}
//시간 구하기
const m_dropdown_time_list = []
for (let i = 0; i < 24; i++) {
    m_dropdown_time_list.push(`${i}:00~${i + 1}:00`);

}

//가로 슬라이더
const slidesContainer = document.getElementById("slides-container");
for (let i = 0; i < 14; i++) {
    let date = m_dropdown_region_date[i].split('2. ')[1].replace(/ /g, '')
    let search_date = '2022.' + date
    slidesContainer.innerHTML += `<li class="slide" onclick='searchStart(0,"${search_date}")'>${date}<span style='font-size:0.5rem'></span></li>`
}


const slide = document.querySelector(".slide");
const prevButton = document.getElementById("slide-arrow-prev");
const nextButton = document.getElementById("slide-arrow-next");


nextButton.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft += slideWidth;
});

prevButton.addEventListener("click", () => {
    const slideWidth = slide.clientWidth;
    slidesContainer.scrollLeft -= slideWidth;
});


//모달 dropdown구현
const m_dropdown_region_list = ['서울', '경기', '부산', '광주', '대전', '경상도', '전라도', '충청도', '강원도']

const m_dropdown_gender_list = ['남녀모두', '여자만', '남자만']
const m_dropdown_hc_list = ['2명 이하', '4명 이하', '6명 이하', '8명 이하', '9명 이상']
const m_dropdown_size_list = ['상관없음', '소형견', '중형견', '대형견']

const m_dropdown_region = document.getElementById("m_dropdown_region");
const m_dropdown_date = document.getElementById("m_dropdown_date");
const m_dropdown_time = document.getElementById("m_dropdown_time");
const m_dropdown_gender = document.getElementById("m_dropdown_gender");
const m_dropdown_hc = document.getElementById("m_dropdown_hc");
const m_dropdown_size = document.getElementById("m_dropdown_size");


m_dropdown_region_list.forEach(region => {
    m_dropdown_region.innerHTML += `<a href="#" onclick='postRegion("${region}")'>${region}</a>`
});
m_dropdown_region_date.forEach(date => {
    m_dropdown_date.innerHTML += `<a href="#" onclick='postDate("${date}")'>${date}</a>`
});
m_dropdown_time_list.forEach(time => {
    m_dropdown_time.innerHTML += `<a href="#" onclick='postTime("${time}")'>${time}</a>`
});
m_dropdown_gender_list.forEach(gender => {
    m_dropdown_gender.innerHTML += `<a href="#" onclick='postGender("${gender}")'>${gender}</a>`
});
m_dropdown_hc_list.forEach(hc => {
    m_dropdown_hc.innerHTML += `<a href="#" onclick='postNumber("${hc}")'>${hc}</a>`
});
m_dropdown_size_list.forEach(size => {
    m_dropdown_size.innerHTML += `<a href="#" onclick='postSize("${size}")'>${size}</a>`
});

function postRegion(region) {
    const m_dropbtn_r = document.getElementById('m_dropbtn_r')
    m_dropbtn_r.innerText = region
}
function postDate(date) {
    const m_dropbtn_d = document.getElementById('m_dropbtn_d')
    m_dropbtn_d.innerText = date
}
function postTime(time) {
    const m_dropbtn_t = document.getElementById('m_dropbtn_t')
    m_dropbtn_t.innerText = time
}
function postGender(gender) {
    const m_dropbtn_g = document.getElementById('m_dropbtn_g')
    m_dropbtn_g.innerText = gender
}
function postNumber(number) {
    const m_dropbtn_n = document.getElementById('m_dropbtn_n')
    m_dropbtn_n.innerText = number
}

function postSize(size) {
    const m_dropbtn_s = document.getElementById('m_dropbtn_s')
    m_dropbtn_s.innerText = size
}



//neighbor 페이지 드롭다운 구현
const dropdown_gender = document.getElementById("dropdown_gender")
const dropdown_size = document.getElementById("dropdown_size")
const dropdown_region = document.getElementById("dropdown_region")
const dropdown_number = document.getElementById("dropdown_number")

m_dropdown_gender_list.forEach(gender => {
    dropdown_gender.innerHTML += `<a href="#" onclick='searchStart(1,"${gender}")'>${gender}</a>`
})
m_dropdown_size_list.forEach(size => {
    dropdown_size.innerHTML += `<a href="#" onclick='searchStart(2,"${size}")'>${size}</a>`
})
m_dropdown_region_list.forEach(region => {
    dropdown_region.innerHTML += `<a href="#" onclick='searchStart(3,"${region}")'>${region}</a>`
})
m_dropdown_hc_list.forEach(number => {
    dropdown_number.innerHTML += `<a href="#" onclick='searchStart(4,"${number}")'>${number}</a>`
})



//////////////////////////////////////api
// 산책 페이지 전체 아티클 불러오기
async function getWalkArticle(page, gender, size, region, number) {
    let url = `${backend_base_url}walk/?`
    if (sessionStorage.getItem('start_date') != null) {
        let s_date = sessionStorage.getItem('start_date').replace('.', '-').replace('.', '-').replace('.', '')
        url = url + `start_date=${s_date}&`
    }
    if (gender != 'gender') {
        url = url + `gender=${gender}&`
    }
    if (size != 'size') {
        url = url + `size=${size}&`
    }
    if (region != 'region') {
        url = url + `region=${region}&`
    }
    if (number != 'number') {
        url = url + `people_num=${number}&`
    }
    if (page != null & page != 'page') {
        url = url + `p=${page}`
    }

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()
    sessionStorage.removeItem('start_date');
    return response_json
}

//모든 아티클 뿌려주기

async function loadWalkArticle(page, gender, size, region, number) {


    const response = await getWalkArticle(page, gender, size, region, number)
    const count = response.count
    const res = response.results


    customers = document.getElementById('customers')
    customers.innerHTML = ''
    res.forEach(post => {
        console.log(post.deadeline_status)
        if (post.deadline_status==true){
            customers.innerHTML +=
                `<tr id='post_row${post.id}' onclick='openWalkDetailArticle(${post.id})'>
                    <td>${post.start_date.substring(5, 10)}</td>
                    <td>${post.start_time.split(' ')[1].substring(0, 5)}~${post.end_time.split(' ')[1].substring(0, 5)}</td>
                    <td>${post.place}<br><span style='font-size:0.6rem'>&#127822; ${post.region} , ${post.gender}, ${post.size}</span></td>
                    <td>${post.people_num}</td>
                    <td id='gowalkbutton${post.id}'>산책가기</td>
                </tr>`
        } else if (post.deadline_status==false){
            customers.innerHTML +=
            `<tr id='post_row${post.id}' style='background-color:rgb(51, 51, 51);color:white;cursor:default' >
                <td>${post.start_date.substring(5, 10)}</td>
                <td>${post.start_time.split(' ')[1].substring(0, 5)}~${post.end_time.split(' ')[1].substring(0, 5)}</td>
                <td>${post.place}<br><span style='font-size:0.6rem'>&#127822; ${post.region} , ${post.gender}, ${post.size}</span></td>
                <td>${post.people_num}</td>
                <td id='gowalkbutton${post.id}'>마감</td>
            </tr>`
        }
    });

    const total_pages = parseInt(count / 12) + 1




    document.getElementById("pages").innerHTML = ''
    for (let i = 1; i < total_pages + 1; i++) {
        document.getElementById("pages").innerHTML += `<a class="page" id=page onclick="loadWalkArticle(${i},'gender', 'size', 'region', 'number')">${i}</a>`
    }
    // document.getElementById("right_page")



    if (page == 'page' | page == 1) {
        let page_num = 1

        document.getElementById('right_page').setAttribute('onclick', `loadWalkArticle(${page_num + 1}, "gender", "size", "region", "number")`)
    } else if (page == total_pages) {

        let page_num = page
        document.getElementById('left_page').setAttribute('onclick', `loadWalkArticle(${page_num - 1}, "gender", "size", "region", "number")`)
    } else {

        let page_num = page
        document.getElementById('right_page').setAttribute('onclick', `loadWalkArticle(${page_num + 1}, "gender", "size", "region", "number")`)
        document.getElementById('left_page').setAttribute('onclick', `loadWalkArticle(${page_num - 1}, "gender", "size", "region", "number")`)
    }


}
loadWalkArticle('page', 'gender', 'size', 'region', 'number')

function searchStart(filter_num, click_name) {

    let dropbtn_g = document.getElementById("dropbtn_g")
    let dropbtn_s = document.getElementById("dropbtn_s")
    let dropbtn_r = document.getElementById("dropbtn_r")
    let dropbtn_n = document.getElementById("dropbtn_n")

    if (filter_num == 0) {
        sessionStorage.setItem('start_date', click_name)
    }
    if (filter_num == 1) {
        dropbtn_g.innerText = click_name
    }
    if (filter_num == 2) {
        dropbtn_s.innerText = click_name
    }
    if (filter_num == 3) {
        dropbtn_r.innerText = click_name
    }
    if (filter_num == 4) {
        dropbtn_n.innerText = click_name
    }



    const gender = dropbtn_g.innerText
    const size = dropbtn_s.innerText
    const region = dropbtn_r.innerText
    const number = dropbtn_n.innerText

    customers.innerHTML = ""

    loadWalkArticle('page', gender, size, region, number)

}

async function goWalk(id, attending_user) {

    const updateWalkData = {
        attending_user: attending_user
    }
    const response = await fetch(`${backend_base_url}walk/attend/${id}/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        },
        body: JSON.stringify(updateWalkData)
    })
    response_json = await response.json()
    if (response.status == 200) {
        swal("산책에 참여해주셔서 감사합니다", "success")
        // attend_walk.style.backgroundColor = '#ADD8E6'
        // attend_walk.innerText = '모임에 참여 신청 하셨습니다'
        openWalkDetailArticle(id)
    } else {
        swal("잘못된 결과입니다", "error")
    }
}
async function goHome(id, attending_user) {
    const response = await fetch(`${backend_base_url}walk/attend/${id}/`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        },
        // body: JSON.stringify(updataWalkData)
    })
    response_json = await response.json()
    if (response.status == 200) {
        swal("산책을 취소하셨습니다", "success")
        attend_walk.style.backgroundColor = 'pink'
        attend_walk.innerText = '모임 참여를 취소하셨습니다'
        openWalkDetailArticle(id)
    } else {
        swal("잘못된 결과입니다", "error")

    }
}
async function submitWalkArticle() {

    s_date = document.getElementById('m_dropbtn_d').innerText
    s_list = s_date.replace(/ /g, '').split(".")
    const walkData = {
        place: document.getElementById('m_input_p').value,
        region: document.getElementById('m_dropbtn_r').innerText,
        start_date: s_list[0] + '-' + s_list[1] + '-' + s_list[2],
        time: document.getElementById('m_dropbtn_t').innerText,
        gender: document.getElementById('m_dropbtn_g').innerText,
        people_num: document.getElementById('m_dropbtn_n').innerText,
        size: document.getElementById('m_dropbtn_s').innerText,
        contents: theEditor.getData(),
    }

    if (document.getElementById('m_dropbtn_d').innerText == "날짜") {
        swal("날짜를 정해주세요", "warning")
    } else if (document.getElementById('m_dropbtn_r').innerText == "지역") {
        swal("지역을 정해주세요", "warning")
    } else if (document.getElementById('m_dropbtn_t').innerText == "시간") {
        swal("시간을 정해주세요", "warning")
    } else if (document.getElementById('m_dropbtn_g').innerText == "성별") {
        swal("성별을 정해주세요", "warning")
    } else if (document.getElementById('m_dropbtn_n').innerText == "인원수") {
        swal("인원수를 정해주세요", "warning")
    } else if (document.getElementById('m_dropbtn_s').innerText == "강아지크기") {
        swal("강아지 크기를 정해주세요", "warning")
    } else {
        const response = await fetch(`${backend_base_url}walk/`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem("user_access_token")
            },
            body: JSON.stringify(walkData)
        })
        response_json = await response.json()
        if (response.status == 200) {
            swal("게시글이 업로드 되었습니다", "success")
            window.location.reload()
        } else {
            swal("잘못된 게시글입니다", "error")
        }
    }

}

function diffDay() {
    //타이머
    the_date = sessionStorage.getItem('meeting_date')
    const timer = document.getElementById("timer")
    const masTime = new Date(the_date);
    const todayTime = new Date();
    const diff = masTime - todayTime;
    const diffDay = Math.floor(diff / (1000 * 60 * 60 * 24));
    const diffHour = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const diffMin = Math.floor((diff / (1000 * 60)) % 60);
    const diffSec = Math.floor(diff / 1000 % 60);
    timer.innerHTML = `<span style="font-size=0.5rem">모임까지 남은 시간</span><br>${diffDay}일 ${diffHour}시간 ${diffMin}분 ${diffSec}초`;
}


// var host_id = 0;
//디테일 페이지 들어가는 함수
async function openWalkDetailArticle(id) {
    document.getElementById('pagination').style.display = 'none'
    document.getElementById('right_page').style.display = 'none'
    document.getElementById('pagination').style.display = 'none'
    document.getElementById('right_page').style.display = 'none'

    const detail_r_sec = document.getElementById("detail_r_sec")
    const r_sec = document.getElementById("r_sec")
    detail_r_sec.style.display = "inline"
    r_sec.style.display = "none"


    const response = await fetch(`${backend_base_url}walk/${id}/`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization': "Bearer " + localStorage.getItem("user_access_token")
        }
    })
    response_json = await response.json()

    // sessionStorage.setItem('host_id', response_json.host)
    const host_name = document.getElementById("host_name")
    const detail_contents = document.getElementById("detail_contents")
    const detail_date = document.getElementById("detail_date")
    const detail_gender = document.getElementById("detail_gender")
    const detail_place = document.getElementById("detail_place")
    const detail_number = document.getElementById("detail_number")
    const detail_detail = document.getElementById("detail_detail")

    const left_seat = document.getElementById("left_seat")
    const attend_walk = document.getElementById('attend_walk')


    host_name.innerText = '모임장 ' + response_json.host_name + '님'

    detail_detail.innerHTML = response_json.contents

    detail_date.innerText = response_json.start_date
    detail_gender.innerText = response_json.gender
    detail_place.innerText = response_json.place
    detail_number.innerText = response_json.people_num
    left_seat.innerText = response_json.left_seat
    sessionStorage.setItem('meeting_date', response_json.start_date)
    const PayLoad = JSON.parse(localStorage.getItem("payload"))

    if (response_json.attending == true) {
        attend_walk.innerText = '모임에 참여 신청 하셨습니다'
        attend_walk.style.backgroundColor = '#ADD8E6'
        attend_walk.setAttribute('onclick', `goHome(${response_json.id}, ${response_json.attending_user})`)
        // openWalkDetailArticle(id)
    } else if (response_json.host == PayLoad.user_id) {
        attend_walk.innerText = '모임 주최자는 신청하실 수 없습니다'
        attend_walk.style.backgroundColor = 'rgb(17, 17, 17)'
        attend_walk.style.color = 'white'
        // openWalkDetailArticle(id)
    } else if (response_json.attending == false) {
        attend_walk.innerHTML = `산책가기 <br><span id='left_seat'>${response_json.left_seat}</span>자리 남았습니다.`
        attend_walk.setAttribute('onclick', `goWalk(${response_json.id}, ${response_json.attending_user})`)
        attend_walk.style.backgroundColor = 'pink'
        // openWalkDetailArticle(id)
    } else {

    }


    // document.getElementById('w_d_img_box').setAttribute('src',`${response_json.host_pic}`)
    document.getElementById('detail_profile').setAttribute('src', `${response_json.host_pic}`)
    //임베드 동영상 띄워주기
    document.querySelectorAll('oembed[url]').forEach(element => {
        iframely.load(element, element.attributes.url.value);
    });
    document.getElementById('showmap').setAttribute('onclick', `startMap2("${response_json.place}")`)
}

diffDay()
setInterval(diffDay, 1000)
