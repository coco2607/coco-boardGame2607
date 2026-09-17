// loginFirebase.js

import {
    db,
    ref,
    get
} from "../firebase.js";

import {trim, getCurrentDate} from "../utils.js";

// 공통 비밀번호 확인
export async function checkAccessPassword(password) {
    password = trim(password);

    if (!password) {
        return false;
    }

    const snapshot = await get(
        ref(db, "으차방/access/password")
    );

    if (!snapshot.exists()) {
        return false;
    }

    return password === String(snapshot.val());
}

// 벙 날짜 입장 가능 여부 확인
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
        ref(db, `으차방/member/${nickname}`)
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

    const lastRoll = Number(data.lastRoll);

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
        ).format(new Date(lastRoll));

    const today = getCurrentDate();

    if (lastRollDate === today) {
        return false;
    }

    if (joinDate < lastRollDate) {
        return false;
    }

    return true;
}