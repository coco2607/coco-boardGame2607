// loginFirebase.js

import {
    db,
    ref,
    get
} from "../firebase.js";

import {trim} from "../utils.js";

// 보드게임 접근 비밀번호 확인
export async function checkAccessPassword(password) {
    password = trim(password);

    if (!password) {
        return false;
    }

    const snapshot = await get(
        ref(db, "access/password")
    );

    if (!snapshot.exists()) {
        return false;
    }

    return String(snapshot.val()) === password;
}

// 마지막 주사위 날짜보다 이전 벙인지 확인
export async function checkPartyDateAvailable(
    nickname,
    joinDate
) {
    nickname = trim(nickname);
    joinDate = trim(joinDate);

    if (!nickname || !joinDate) {
        return true;
    }

    const snapshot = await get(
        ref(db, `member/으차방/${nickname}`)
    );

    if (!snapshot.exists()) {
        return true;
    }

    const data = snapshot.val();

    if (
        data.lastRoll === undefined ||
        data.lastRoll === null ||
        data.lastRoll === ""
    ) {
        return true;
    }

    const lastRoll = Number(
        data.lastRoll
    );

    if (!Number.isFinite(lastRoll)) {
        return true;
    }

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

    return joinDate >= lastRollDate;
}

// 해당 벙 참여 여부 확인
export async function checkPartyAttend(
    nickname,
    joinDate
) {
    nickname = trim(nickname);
    joinDate = trim(joinDate);

    if (!nickname || !joinDate) {
        return false;
    }

    const snapshot = await get(
        ref(
            db,
            `party/${joinDate}/attend/${nickname}`
        )
    );

    return snapshot.exists();
}