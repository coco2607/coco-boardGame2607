// login.js

import {
    getCurrentDate,
    trim,
    pad,
    getVersion
} from "../utils.js";

import {
    checkAccessPassword,
    checkPartyDateAvailable
} from "./loginFirebase.js";

// 요소 가져오기
const nickname = document.getElementById("nickname");
const enterBtn = document.getElementById("enterBtn");
const memberModal = document.getElementById("memberModal");
const memberPassword = document.getElementById("memberPassword");
const loginMessage = document.getElementById("loginMessage");
const memberOkBtn = document.getElementById("memberOkBtn");
const memberCancelBtn = document.getElementById("memberCancelBtn");
const dateModal = document.getElementById("dateModal");
const todayBtn = document.getElementById("todayBtn");
const yesterdayBtn = document.getElementById("yesterdayBtn");
const warningModal = document.getElementById("warningModal");
const warningText = document.getElementById("warningText");
const warningOk = document.getElementById("warningOk");
const version = document.getElementById("version");

let processing = false;

// 초기 실행
setDateButton();
version.textContent =
    `Ver ${getVersion()}`;

// 이벤트
enterBtn.addEventListener(
    "click",
    openMemberModal
);

memberOkBtn.addEventListener(
    "click",
    checkPassword
);

memberCancelBtn.addEventListener(
    "click",
    closeMemberModal
);

todayBtn.addEventListener(
    "click",
    () => selectJoinDate(
        getCurrentDate()
    )
);

yesterdayBtn.addEventListener(
    "click",
    selectYesterday
);

warningOk.addEventListener(
    "click",
    closeWarning
);

// 로그인 모달
function openMemberModal() {
    const name =
        trim(nickname.value);

    if (!name) {
        showWarning(
            "닉네임을 입력하세요."
        );

        nickname.focus();

        return;
    }

    if (!/^[가-힣]{2}$/.test(name)) {
        showWarning(
            "닉네임 2자를 입력하세요."
        );

        nickname.focus();
        nickname.select();

        return;
    }

    memberPassword.value = "";
    loginMessage.textContent = "";

    memberModal.classList.remove(
        "hidden"
    );

    memberPassword.focus();
}

// 비밀번호 확인
async function checkPassword() {
    if (processing) {
        return;
    }

    const password =
        trim(memberPassword.value);

    if (!password) {
        loginMessage.textContent =
            "비밀번호를 입력하세요.";

        memberPassword.focus();

        return;
    }

    processing = true;

    try {
        const valid =
            await checkAccessPassword(
                password
            );

        if (!valid) {
            loginMessage.textContent =
                "비밀번호가 맞지 않습니다.";

            memberPassword.focus();

            return;
        }

        memberModal.classList.add(
            "hidden"
        );

        dateModal.classList.remove(
            "hidden"
        );

    } finally {
        processing = false;
    }
}

// 멤버 로그인 모달 닫기
function closeMemberModal() {
    memberModal.classList.add(
        "hidden"
    );

    memberPassword.value = "";
    loginMessage.textContent = "";
}

// 어제 날짜 선택
async function selectYesterday() {
    const today =
        getCurrentDate();

    const date =
        new Date(
            `${today}T12:00:00+09:00`
        );

    date.setDate(
        date.getDate() - 1
    );

    await selectJoinDate(
        formatDate(date)
    );
}

// 벙 날짜 선택
async function selectJoinDate(joinDate) {
    if (processing) {
        return;
    }

    const playerName =
        trim(nickname.value);

    if (!playerName || !joinDate) {
        showWarning(
            "입장 정보가 올바르지 않습니다."
        );

        return;
    }

    processing = true;

    try {
        const result =
            await checkPartyDateAvailable(
                playerName,
                joinDate
            );

        // 오늘 이미 참여한 경우
        if (
            !result.available &&
            result.reason === "alreadyToday"
        ) {
            showWarning(
                "벙 게임 참여는 하루에 1번만 가능합니다."
            );

            return;
        }

        // 과거 날짜 제한
        if (
            !result.available &&
            result.reason === "pastDate"
        ) {
            showWarning(
                "벙 날짜를 다시 확인하세요."
            );

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

        location.href =
            "../board/board.html";

    } finally {
        processing = false;
    }
}

// 날짜 버튼 표시
function setDateButton() {
    const today =
        getCurrentDate();

    const yesterday =
        new Date(
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

    todayBtn.textContent =
        formatButtonDate(
            new Date(
                `${today}T12:00:00+09:00`
            ),
            week
        );

    yesterdayBtn.textContent =
        formatButtonDate(
            yesterday,
            week
        );
}

// 버튼 날짜 형식
function formatButtonDate(
    date,
    week
) {
    return `${
        date.getMonth() + 1
    }월 ${
        date.getDate()
    }일 ${
        week[date.getDay()]
    }요일`;
}

// 날짜 형식
function formatDate(date) {
    return `${
        date.getFullYear()
    }-${
        pad(date.getMonth() + 1)
    }-${
        pad(date.getDate())
    }`;
}

// 경고 팝업
function showWarning(message) {
    warningText.textContent =
        message;

    warningModal.classList.remove(
        "hidden"
    );
}

function closeWarning() {
    warningModal.classList.add(
        "hidden"
    );
}