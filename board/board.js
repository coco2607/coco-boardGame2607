// board.js

import "./dice.js";
import {updateMarker} from "./move.js";
import {getUser} from "./boardFirebase.js";

// 요소 가져오기
const nickname = document.getElementById("nickname");
const joinDate = document.getElementById("joinDate");
const totalPoint = document.getElementById("totalPoint");
const diceBtn = document.getElementById("diceBtn");

// 초기 실행
init();

async function init() {
    try {
        await loadPlayer();
    } catch (err) {

        alert(
            err.message ||
            "플레이어 정보를 불러오지 못했습니다."
        );

        location.href = "../login/login.html";
    }
}

// 플레이어 정보 불러오기
async function loadPlayer() {
    const playerName =
        sessionStorage.getItem("nickname");

    const playerJoinDate =
        sessionStorage.getItem("joinDate");

    if (!playerName) {
        throw new Error(
            "닉네임 정보가 없습니다."
        );
    }

    // 닉네임
    nickname.textContent =
        `${playerName}님`;

    // 참여 날짜
    if (playerJoinDate) {
        const date =
            new Date(`${playerJoinDate}T12:00:00`);

        joinDate.textContent =
            `${date.getMonth() + 1}월 ${date.getDate()}일`;
    } else {
        joinDate.textContent = "";
    }

    // Firebase에서 회원 정보 가져오기
    const user =
        await getUser(playerName);

    // 현재 위치
    const playerPosition =
        Number(user?.position) || 0;

    sessionStorage.setItem(
        "position",
        String(playerPosition)
    );

    // 말 위치 표시
    updateMarker(
        playerPosition
    );

    // 누적 포인트
    const point =
        Number(user?.point) || 0;

    sessionStorage.setItem(
        "point",
        String(point)
    );

    totalPoint.textContent =
        `${point}P`;

    // 오늘 주사위 사용 여부 확인
    updateDiceButton(
        user?.lastRoll
    );
}

// 누적 포인트 즉시 갱신
window.updateTotalPoint = function(point) {
    const finalPoint =
        Number(point) || 0;

    sessionStorage.setItem(
        "point",
        String(finalPoint)
    );

    totalPoint.textContent =
        `${finalPoint}P`;
};

// Firebase에서 누적 포인트 다시 가져오기
window.refreshTotalPoint = async function() {
    const playerName =
        sessionStorage.getItem("nickname");

    if (!playerName) {
        return;
    }

    try {
        const user =
            await getUser(playerName);

        const point =
            Number(user?.point) || 0;

        sessionStorage.setItem(
            "point",
            String(point)
        );

        totalPoint.textContent =
            `${point}P`;
    } catch (err) {}
};

// 주사위 사용 가능 여부 새로 확인
window.refreshDiceAvailability = async function() {
    const playerName =
        sessionStorage.getItem("nickname");

    if (!playerName) {
        return;
    }

    try {
        const user =
            await getUser(playerName);

        updateDiceButton(
            user?.lastRoll
        );

    } catch (err) {}
};

// 주사위 버튼 상태 변경
function updateDiceButton(lastRoll) {
    if (!diceBtn) {
        return;
    }

    const usedToday =
        isToday(lastRoll);

    if (usedToday) {
        diceBtn.disabled = true;
        diceBtn.classList.add("cooldown");
    } else {
        diceBtn.disabled = false;
        diceBtn.classList.remove("cooldown");
    }
}

// 한국 시간 기준 오늘인지 확인
function isToday(timestamp) {
    if (
        timestamp === null ||
        timestamp === undefined ||
        timestamp === ""
    ) {
        return false;
    }

    const rollTime =
        Number(timestamp);

    if (!Number.isFinite(rollTime)) {
        return false;
    }

    const formatter =
        new Intl.DateTimeFormat(
            "ko-KR",
            {
                timeZone: "Asia/Seoul",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        );

    const today =
        formatter.format(new Date());

    const rollDate =
        formatter.format(
            new Date(rollTime)
        );

    return today === rollDate;
}


// 테스트용 강제 이동
window.testMove = function(positionValue) {
    const pos =
        Number(positionValue);

    if (pos < 1 || pos > 40) {
        return;
    }

    sessionStorage.setItem(
        "position",
        String(pos)
    );

    position.textContent =
        `${pos}번`;

    updateMarker(pos);
};
