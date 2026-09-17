// boardFirebase.js

import {
    db,
    ref,
    get,
    push,
    set,
    update,
    serverTimestamp
} from "../firebase.js";

// 유저 정보 가져오기
export async function getUser(nickname) {
    const snapshot = await get(
        ref(
            db,
            `으차방/member/${nickname}`
        )
    );

    if (!snapshot.exists()) {
        return {
            position: 0,
            point: 0,
            lastRoll: null
        };
    }

    const data =
        snapshot.val();

    return {
        position:
            Number(data.lastPosition) || 0,

        point:
            Number(data.point) || 0,

        lastRoll:
            data.lastRoll ?? null
    };
}

// 현재 유저 상태 저장
export async function saveUserState(
    position,
    point
) {
    const nickname =
        sessionStorage.getItem("nickname");

    if (!nickname) {
        throw new Error(
            "닉네임 정보가 없습니다."
        );
    }

    const userRef =
        ref(
            db,
            `으차방/member/${nickname}`
        );

    const finalPosition =
        Number(position) || 0;

    const finalPoint =
        Number(point) || 0;

    await update(
        userRef,
        {
            lastPosition: finalPosition,
            lastRoll: serverTimestamp(),
            lastUpdate: serverTimestamp(),
            point: finalPoint
        }
    );

    sessionStorage.setItem(
        "position",
        String(finalPosition)
    );

    sessionStorage.setItem(
        "point",
        String(finalPoint)
    );
}

// 히스토리 저장
export async function saveBoardHistory(data) {
    const nickname =
        sessionStorage.getItem("nickname");

    const joinDate =
        sessionStorage.getItem("joinDate");

    if (!nickname || !joinDate || !data) {
        throw new Error(
            "히스토리 저장 정보가 없습니다."
        );
    }

    const historyRef =
        push(
            ref(
                db,
                `으차방/history/${nickname}`
            )
        );

    await set(
        historyRef,
        {
            dice:
                Number(data.dice) || 0,

            diceE:
                Number(data.end) || 0,

            diceS:
                Number(data.start) || 0,

            getP:
                data.getP ?? 0,

            joinDate:
                joinDate,

            type:
                data.type || "",

            useP:
                data.useP ?? ""
        }
    );

    return historyRef.key;
}

// 게임 결과 저장
export async function saveGameResult(data) {
    if (!data) {
        throw new Error(
            "게임 결과가 없습니다."
        );
    }

    // 40번 통과 은행 기록
    if (
        Number(data.bankPoint) !== 0
    ) {
        await saveBoardHistory({
            start: data.start,
            dice: data.dice,
            end: 40,
            type: "벙게임참여-은행",
            getP: data.bankPoint,
            useP: ""
        });
    }

    // 도착 칸 기록
    const historyType = {
        normal: "벙게임참여-일반",
        island: "벙게임참여-무인도",
        hotel: "벙게임참여-호캉스",
        lottery: "벙게임참여-복권",
        bank: "벙게임참여-은행"
    }[data.type] || "벙게임참여";

    await saveBoardHistory({
        start: data.start,
        dice: data.dice,
        end: data.end,
        type: historyType,
        getP: data.point ?? 0,
        useP: ""
    });

    // 회원 정보 저장
    // 이 시점에 lastRoll이 현재 Firebase 서버 시간으로 저장됨
    await saveUserState(
        data.end,
        data.totalPoint
    );

    return true;
}