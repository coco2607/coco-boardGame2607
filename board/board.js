// board.js

import "./dice.js";
import {updateMarker} from "./move.js";
import {getUser} from "./boardFirebase.js";
import {getVersion} from "../utils.js";

// 요소 가져오기
const nickname = document.getElementById("nickname");
const joinDate = document.getElementById("joinDate");
const entryCode = document.getElementById("entryCode");
const totalPoint = document.getElementById("totalPoint");
const position = document.getElementById("position");
const version = document.getElementById("version");

// 초기 실행
init();

async function init() {
    const playerName = sessionStorage.getItem("nickname");
    const playerJoinDate = sessionStorage.getItem("joinDate");
    const playerEntryCode = sessionStorage.getItem("entryCode");

    version.textContent = `Ver ${getVersion()}`;

    if (!playerName || !playerJoinDate || !playerEntryCode) {
        location.href = "../login/login.html";
        return;
    }

    nickname.textContent = `${playerName}님`;
    joinDate.textContent = `(${playerJoinDate})`;
    entryCode.textContent = `입장코드(${playerEntryCode})`;

    try {
        await loadPlayer();
    } catch (error) {
        location.href = "../login/login.html";
    }
}

// 플레이어 정보 불러오기
async function loadPlayer() {
    const playerName = sessionStorage.getItem("nickname");

    if (!playerName) {
        throw new Error("플레이어 정보가 없습니다.");
    }

    const user = await getUser(playerName);

    if (!user) {
        throw new Error("플레이어 정보를 찾을 수 없습니다.");
    }

    const playerPosition = Number(user.position) || 0;
    const playerPoint = Number(user.point) || 0;

    sessionStorage.setItem(
        "position",
        String(playerPosition)
    );

    sessionStorage.setItem(
        "point",
        String(playerPoint)
    );

    position.textContent =
        `${playerPosition}번`;

    totalPoint.textContent =
        `${playerPoint.toLocaleString()}P`;

    updateMarker(playerPosition);
}

// Firebase 최신 정보로 화면 갱신
window.refreshTotalPoint = async function() {
    try {
        await loadPlayer();
    } catch (error) {}
};

// 테스트용 강제 이동
window.testMove = function(positionValue) {
    const pos = Number(positionValue);

    if (pos < 1 || pos > 40) {
        return;
    }

    sessionStorage.setItem(
        "position",
        String(pos)
    );

    position.textContent = `${pos}번`;
    updateMarker(pos);
};