// loginFirebase.js

import {
    db,
    ref,
    get
} from "../firebase.js";

import {
    trim,
    getCurrentDate
} from "../utils.js";

// 공통 비밀번호 확인
export async function checkAccessPassword(password) {
    password = trim(password);

    return password === "8765";
}

// 벙 날짜 입장 가능 여부 확인
export async function checkPartyDateAvailable(
    nickname,
    joinDate
) {
    nickname = trim(nickname);
    joinDate = trim(joinDate);

    if (!nickname || !joinDate) {
        return {
            available: true,
            reason: ""
        };
    }

    const snapshot = await get(
        ref(
            db,
            `으차방/member/${nickname}`
        )
    );

    if (!snapshot.exists()) {
        return {
            available: true,
            reason: ""
        };
    }

    const data =
        snapshot.val();

    // lastRoll이 없는 경우
    if (
        data.lastRoll === undefined ||
        data.lastRoll === null ||
        data.lastRoll === ""
    ) {
        return {
            available: true,
            reason: ""
        };
    }

    const lastRoll =
        Number(data.lastRoll);

    if (!Number.isFinite(lastRoll)) {
        return {
            available: true,
            reason: ""
        };
    }

    // 한국 시간 기준 lastRoll 날짜
    const lastRollDate =
        new Intl.DateTimeFormat(
            "en-CA",
            {
                timeZone: "Asia/Seoul",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            }
        ).format(
            new Date(lastRoll)
        );

    const today =
        getCurrentDate();

    // 오늘 이미 벙게임에 참여한 경우
    if (lastRollDate === today) {
        return {
            available: false,
            reason: "alreadyToday"
        };
    }

    // 과거 날짜 입장 제한
    if (joinDate < lastRollDate) {
        return {
            available: false,
            reason: "pastDate"
        };
    }

    return {
        available: true,
        reason: ""
    };
}