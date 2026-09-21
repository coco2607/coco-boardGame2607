// board.js
import "./dice.js";
import {updateMarker} from "./move.js";
import {getUser} from "./boardFirebase.js";

const nickname = document.getElementById("nickname");
const joinDate = document.getElementById("joinDate");
const totalPoint = document.getElementById("totalPoint");
const position = document.getElementById("position");
const diceBtn = document.getElementById("diceBtn");

init();

async function init(){
    try{
        await loadPlayer();
    }catch(err){
        alert(err.message || "플레이어 정보를 불러오지 못했습니다.");
        location.replace("../login/login.html");
    }
}

async function loadPlayer(){
    const playerName = sessionStorage.getItem("nickname");
    const playerJoinDate = sessionStorage.getItem("joinDate");

    if(!playerName){
        throw new Error("닉네임 정보가 없습니다.");
    }

    nickname.textContent = `${playerName}님`;

    if(playerJoinDate){
        const date = new Date(`${playerJoinDate}T12:00:00+09:00`);
        joinDate.textContent = `${date.getMonth()+1}월 ${date.getDate()}일`;
    }else{
        joinDate.textContent = "";
    }

    const user = await getUser(playerName);
    const playerPosition = Number(user?.position) || 0;
    const point = Number(user?.point) || 0;

    sessionStorage.setItem("position",String(playerPosition));
    sessionStorage.setItem("point",String(point));

    position.textContent = `${playerPosition}번`;
    totalPoint.textContent = point;

    updateMarker(playerPosition);
    updateDiceButton(user?.lastRoll);
}

window.updateTotalPoint = function(point){
    const finalPoint = Number(point) || 0;
    sessionStorage.setItem("point",String(finalPoint));
    totalPoint.textContent = finalPoint;
};

window.refreshTotalPoint = async function(){
    const playerName = sessionStorage.getItem("nickname");

    if(!playerName){
        return;
    }

    try{
        const user = await getUser(playerName);
        const point = Number(user?.point) || 0;

        sessionStorage.setItem("point",String(point));
        totalPoint.textContent = point;
    }catch(err){}
};

window.refreshDiceAvailability = async function(){
    const playerName = sessionStorage.getItem("nickname");

    if(!playerName){
        return;
    }

    try{
        const user = await getUser(playerName);
        updateDiceButton(user?.lastRoll);
    }catch(err){}
};

function updateDiceButton(lastRoll){
    if(!diceBtn){
        return;
    }

    const used = isUsedJoinDate(lastRoll);
    diceBtn.disabled = used;

    if(used){
        diceBtn.classList.add("cooldown");
    }else{
        diceBtn.classList.remove("cooldown");
    }
}

function isUsedJoinDate(timestamp){
    const rollTime = Number(timestamp);

    if(!Number.isFinite(rollTime)){
        return false;
    }

    const playerJoinDate = sessionStorage.getItem("joinDate");

    if(!playerJoinDate){
        return false;
    }

    const rollDate = new Intl.DateTimeFormat("en-CA",{
        timeZone:"Asia/Seoul",
        year:"numeric",
        month:"2-digit",
        day:"2-digit"
    }).format(new Date(rollTime));

    return playerJoinDate === rollDate;
}

window.testMove = function(positionValue){
    const pos = Number(positionValue);

    if(pos < 1 || pos > 40){
        return;
    }

    sessionStorage.setItem("position",String(pos));
    position.textContent = `${pos}번`;
    updateMarker(pos);
};