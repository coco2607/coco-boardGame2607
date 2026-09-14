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
        ref(db, `member/으차방/${nickname}`)
    );

    if (!snapshot.exists()) {
        return {
            position: 0,
            point: 0
        };
    }

    const data = snapshot.val();

    return {
        position: data.lastPosition !== undefined
            ? Number(data.lastPosition)
            : 0,
        point: data.point !== undefined && data.point !== ""
            ? Number(data.point)
            : 0
    };
}

// 오늘 주사위 사용 여부 확인
export async function checkSecondRollAvailable() {
    const nickname = sessionStorage.getItem("nickname");
    const joinDate = sessionStorage.getItem("joinDate");

    if (!nickname || !joinDate) {
        return false;
    }

    const snapshot = await get(
        ref(db, `party/${joinDate}/attend/${nickname}`)
    );

    return !snapshot.exists();
}

// 현재 유저 상태 저장
export async function saveUserState(position, point) {
    const nickname = sessionStorage.getItem("nickname");

    if (!nickname) {
        return null;
    }

    const userRef = ref(
        db,
        `member/으차방/${nickname}`
    );

    const finalPosition = Number(position) || 0;
    const finalPoint = Number(point) || 0;

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

    return {
        position: finalPosition,
        point: finalPoint
    };
}

// 히스토리 저장
export async function saveBoardHistory(data) {
    const nickname = sessionStorage.getItem("nickname");
    const joinDate = sessionStorage.getItem("joinDate");

    if (!nickname || !joinDate || !data) {
        return null;
    }

    const historyRef = push(
        ref(db, `history/으차방/${nickname}`)
    );

    await set(
        historyRef,
        {
            dice: Number(data.dice) || 0,
            diceE: Number(data.end) || 0,
            diceS: Number(data.start) || 0,
            getP: data.getP ?? 0,
            joinDate: joinDate,
            type: data.type || "",
            useP: data.useP ?? ""
        }
    );

    return historyRef.key;
}

// 오늘 주사위 사용 기록
export async function saveAttend() {
    const nickname = sessionStorage.getItem("nickname");
    const joinDate = sessionStorage.getItem("joinDate");

    if (!nickname || !joinDate) {
        return null;
    }

    await set(
        ref(db, `party/${joinDate}/attend/${nickname}`),
        ""
    );

    return true;
}

// 게임 결과 저장
export async function saveGameResult(data) {
    if (!data) {
        return null;
    }

    const historyType = {
        normal: "벙게임참여-일반",
        island: "벙게임참여-무인도",
        hotel: "벙게임참여-호캉스",
        lottery: "벙게임참여-복권",
        bank: "벙게임참여-은행"
    }[data.type] || "벙게임참여";

    // 40번 통과 은행 기록
    if (Number(data.bankPoint) !== 0) {
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
    await saveBoardHistory({
        start: data.start,
        dice: data.dice,
        end: data.end,
        type: historyType,
        getP: data.point ?? 0,
        useP: ""
    });

    // 멤버 상태 저장
    await saveUserState(
        data.end,
        data.totalPoint
    );

    // 오늘 주사위 사용 기록
    await saveAttend();

    // 저장 완료 후 화면 갱신
    if (window.refreshTotalPoint) {
        await window.refreshTotalPoint();
    }

    return true;
}