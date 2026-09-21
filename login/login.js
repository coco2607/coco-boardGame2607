// login.js
import {
    koDate,
    appVersion,
    adminName
} from "../utils.js";

import {
    checkAccessPassword,
    checkPartyDateAvailable
} from "./loginFirebase.js";

const enterBtn = document.getElementById("enterBtn");
const loginModal = document.getElementById("loginModal");
const nickname = document.getElementById("nickname");
const memberPassword = document.getElementById("memberPassword");
const loginMessage = document.getElementById("loginMessage");
const nicknameOkBtn = document.getElementById("nicknameOkBtn");
const nicknameCancelBtn = document.getElementById("nicknameCancelBtn");
const dateModal = document.getElementById("dateModal");
const dateCancelBtn = document.getElementById("dateCancelBtn");
const todayBtn = document.getElementById("todayBtn");
const yesterdayBtn = document.getElementById("yesterdayBtn");
const warningModal = document.getElementById("warningModal");
const warningText = document.getElementById("warningText");
const warningOk = document.getElementById("warningOk");

setDateButton();

enterBtn.addEventListener("click",openLogin);
nicknameOkBtn.addEventListener("click",login);
nicknameCancelBtn.addEventListener("click",closeLogin);
dateCancelBtn.addEventListener("click",closeDate);
todayBtn.addEventListener("click",() => selectDate(getToday()));
yesterdayBtn.addEventListener("click",() => selectDate(getYesterday()));
warningOk.addEventListener("click",closeWarning);
document.getElementById("version").textContent = `Ver ${appVersion}`;
document.getElementById("admin").textContent = `관리자 ${adminName}`;

function openLogin(){
    nickname.value = "";
    memberPassword.value = "";
    loginMessage.textContent = "";
    loginModal.classList.remove("hidden");
    nickname.focus();
}

async function login(){
    const name = nickname.value.trim();
    const password = memberPassword.value.trim();

    if(!name){
        showWarning("닉네임을 입력하세요.");
        return;
    }

    if(!password){
        showWarning("비밀번호를 입력하세요.");
        return;
    }

    const valid = await checkAccessPassword(password);

    if(!valid){
        showWarning("비밀번호가 맞지 않습니다.");
        memberPassword.focus();
        return;
    }

    loginModal.classList.add("hidden");
    dateModal.classList.remove("hidden");
}

function closeLogin(){
    loginModal.classList.add("hidden");
}

function closeDate(){
    dateModal.classList.add("hidden");
}

async function selectDate(joinDate){
    const name = nickname.value.trim();

    if(!name || !joinDate){
        showWarning("입장 정보가 올바르지 않습니다.");
        return;
    }

    const result = await checkPartyDateAvailable(name,joinDate);

    if(!result.available && result.reason === "alreadyToday"){
        showWarning("하루에 1번 참여가능합니다.");
        return;
    }
    if(!result.available && result.reason === "pastDate"){
        showWarning("벙 날짜를 다시 확인하세요.");
        return;
    }

    const date = new Date(`${joinDate}T12:00:00+09:00`);

    sessionStorage.setItem("nickname",name);
    sessionStorage.setItem("joinDate",joinDate);
    sessionStorage.setItem("joinDateText",formatDate(date));

    location.replace("../board/board.html");
}

function getToday(){
    return koDate();
}

function getYesterday(){
    const date = new Date(
        `${koDate()}T12:00:00+09:00`
    );

    date.setDate(date.getDate() - 1);

    return `${
        date.getFullYear()
    }-${
        String(date.getMonth() + 1).padStart(2,"0")
    }-${
        String(date.getDate()).padStart(2,"0")
    }`;
}

function setDateButton(){
    const today = new Date(`${getToday()}T12:00:00+09:00`);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    todayBtn.textContent = formatDate(today);
    yesterdayBtn.textContent = formatDate(yesterday);
}

function formatDate(date){
    const week = ["일","월","화","수","목","금","토"];
    return `${date.getMonth()+1}월 ${date.getDate()}일 ${week[date.getDay()]}요일`;
}

let warningTimer;

function showWarning(message){
    clearTimeout(warningTimer);

    warningText.textContent = message;
    warningModal.classList.remove("hidden");

    warningTimer = setTimeout(
        closeWarning,
        2000
    );
}

function closeWarning(){
    warningModal.classList.add("hidden");
}