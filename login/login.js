// login.js

import {
    getCurrentDate,
    trim,
    pad,
    getVersion
} from "../utils.js";

import {
    checkAccessPassword,
    checkPartyDateAvailable,
    checkPartyAttend
} from "./loginFirebase.js";

// 요소 가져오기
const nickname = document.getElementById("nickname");
const enterBtn = document.getElementById("enterBtn");
const passwordModal = document.getElementById("passwordModal");
const passwordCancelBtn = document.getElementById("passwordCancelBtn");
const accessPassword = document.getElementById("accessPassword");
const passwordOkBtn = document.getElementById("passwordOkBtn");
const dateModal = document.getElementById("dateModal");
const dateCancelBtn = document.getElementById("dateCancelBtn");
const todayBtn = document.getElementById("todayBtn");
const yesterdayBtn = document.getElementById("yesterdayBtn");
const warningModal = document.getElementById("warningModal");
const warningText = document.getElementById("warningText");
const version = document.getElementById("version");

// 상태
let selectedJoinDate = "";
let processing = false;
let warningTimer = null;

// 초기 실행
setDateButton();
version.textContent = `Ver ${getVersion()}`;

// 이벤트
enterBtn.addEventListener("click", openPasswordModal);
passwordCancelBtn.addEventListener("click", closePasswordModal);
passwordOkBtn.addEventListener("click", handlePasswordLogin);
dateCancelBtn.addEventListener("click", closeDateModal);
todayBtn.addEventListener("click", selectToday);
yesterdayBtn.addEventListener("click", selectYesterday);

// 닉네임 확인 후 비밀번호 모달
function openPasswordModal() {
    const name = trim(nickname.value);

    if (name === "") {
        showWarning("닉네임을 입력하세요.");
        nickname.focus();
        return;
    }

    if (!/^[가-힣]{2}$/.test(name)) {
        showWarning("닉네임 2자를 입력하세요.");
        nickname.focus();
        nickname.select();
        return;
    }

    accessPassword.value = "";
    passwordModal.classList.remove("hidden");
    accessPassword.focus();
}

// 비밀번호 모달 닫기
function closePasswordModal() {
    passwordModal.classList.add("hidden");
    accessPassword.value = "";
}

// 비밀번호 로그인
async function handlePasswordLogin() {
    if (processing) {
        return;
    }

    const password = trim(accessPassword.value);
    const playerName = trim(nickname.value);

    if (password === "") {
        showWarning("비밀번호를 입력하세요.");
        accessPassword.focus();
        return;
    }

    if (!/^[가-힣]{2}$/.test(playerName)) {
        closePasswordModal();
        showWarning("닉네임 2자를 입력하세요.");
        nickname.focus();
        return;
    }

    processing = true;

    try {
        const valid = await checkAccessPassword(password);

        if (!valid) {
            showWarning("비밀번호가 맞지 않습니다.");
            accessPassword.focus();
            accessPassword.select();
            return;
        }

        passwordModal.classList.add("hidden");
        selectedJoinDate = "";
        dateModal.classList.remove("hidden");
    } catch (error) {
        showWarning(
            getErrorMessage(
                error,
                "로그인에 실패했습니다."
            )
        );
    } finally {
        processing = false;
    }
}

// 오늘 선택
async function selectToday() {
    await selectJoinDate(getToday());
}

// 어제 선택
async function selectYesterday() {
    const today = getToday();
    const date = new Date(`${today}T12:00:00+09:00`);

    date.setDate(date.getDate() - 1);

    await selectJoinDate(formatDate(date));
}

// 벙 날짜 선택
async function selectJoinDate(joinDate) {
    if (processing) {
        return;
    }

    const playerName = trim(nickname.value);

    if (!playerName || !joinDate) {
        showWarning("입장 정보가 올바르지 않습니다.");
        return;
    }

    processing = true;

    try {
        // 마지막 주사위 날짜보다 이전 벙인지 확인
        const available = await checkPartyDateAvailable(
            playerName,
            joinDate
        );

        if (!available) {
            showWarning(
                "오늘보다 이전의 벙에는 참여할 수 없습니다."
            );
            return;
        }

        // 해당 벙에 이미 참여했는지 확인
        const attended = await checkPartyAttend(
            playerName,
            joinDate
        );

        if (attended) {
            showWarning("벙 게임은 하루에 1번 참여가능합니다.");
            return;
        }

        selectedJoinDate = joinDate;
        await enterGame(joinDate);
    } catch (error) {
        showWarning(
            getErrorMessage(
                error,
                "벙 날짜를 확인하세요."
            )
        );
    } finally {
        processing = false;
    }
}

// 게임 입장
async function enterGame(joinDate) {
    const playerName = trim(nickname.value);

    if (!playerName || !joinDate) {
        showWarning("입장 정보가 올바르지 않습니다.");
        return;
    }

    sessionStorage.setItem(
        "nickname",
        playerName
    );

    sessionStorage.setItem(
        "joinDate",
        joinDate
    );

    // board.js 기존 진입 조건 유지
    sessionStorage.setItem(
        "entryCode",
        "공통"
    );

    sessionStorage.setItem(
        "point",
        "0"
    );

    sessionStorage.setItem(
        "position",
        "0"
    );

    dateModal.classList.add("hidden");

    location.href = "../board/board.html";
}

// 날짜 선택 모달 닫기
function closeDateModal() {
    dateModal.classList.add("hidden");
}

// 날짜 버튼 표시
function setDateButton() {
    const today = getToday();
    const yesterday = new Date(
        `${today}T12:00:00+09:00`
    );

    const week = [
        "일",
        "월",
        "화",
        "수",
        "목",
        "금",
        "토"
    ];

    yesterday.setDate(
        yesterday.getDate() - 1
    );

    todayBtn.textContent = formatButtonDate(
        new Date(
            `${today}T12:00:00+09:00`
        ),
        week
    );

    yesterdayBtn.textContent = formatButtonDate(
        yesterday,
        week
    );
}

// 버튼 날짜 형식
function formatButtonDate(date, week) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = week[date.getDay()];

    return `${month}월 ${day}일 ${weekday}요일`;
}

// 오늘 날짜
function getToday() {
    return getCurrentDate();
}

// 날짜 형식
function formatDate(date) {
    const year = date.getFullYear();
    const month = pad(
        date.getMonth() + 1
    );
    const day = pad(
        date.getDate()
    );

    return `${year}-${month}-${day}`;
}

// Firebase 오류 메시지
function getErrorMessage(
    error,
    fallback
) {
    if (!error) {
        return fallback;
    }

    const code = String(
        error.code || ""
    );

    if (
        code.includes("PERMISSION_DENIED")
    ) {
        return "Firebase 데이터베이스 권한이 거부되었습니다.";
    }

    if (
        code.includes("NETWORK")
    ) {
        return "네트워크 연결을 확인하세요.";
    }

    return error.message || fallback;
}

// 경고 팝업
function showWarning(message) {
    if (warningTimer) {
        clearTimeout(warningTimer);
    }

    warningText.innerHTML = message;
    warningModal.classList.remove("hidden");

    warningTimer = setTimeout(() => {
        warningModal.classList.add("hidden");
        warningTimer = null;
    }, 1800);
}