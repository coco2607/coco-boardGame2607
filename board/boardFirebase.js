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

export async function getUser(nickname){
    const snapshot = await get(ref(db,`으차방/member/${nickname}`));

    if(!snapshot.exists()){
        return {
            position:0,
            point:0,
            lastRoll:null
        };
    }

    const data = snapshot.val();

    return {
        position:Number(data.lastPosition) || 0,
        point:Number(data.point) || 0,
        lastRoll:data.lastRoll ?? null
    };
}

function getLastRoll(joinDate){
    if(!joinDate){
        throw new Error("참여 날짜가 없습니다.");
    }

    const lastRoll = new Date(`${joinDate}T09:00:00+09:00`).getTime();

    if(!Number.isFinite(lastRoll)){
        throw new Error("lastRoll 생성에 실패했습니다.");
    }

    return lastRoll;
}

export async function saveUserState(position,point){
    const nickname = sessionStorage.getItem("nickname");
    const joinDate = sessionStorage.getItem("joinDate");

    if(!nickname){
        throw new Error("닉네임 정보가 없습니다.");
    }

    if(!joinDate){
        throw new Error("참여 날짜 정보가 없습니다.");
    }

    const finalPosition = Number(position) || 0;
    const finalPoint = Number(point) || 0;
    const lastRoll = getLastRoll(joinDate);

    await update(ref(db,`으차방/member/${nickname}`),{
        lastPosition:finalPosition,
        lastRoll:lastRoll,
        lastUpdate:serverTimestamp(),
        point:finalPoint
    });

    sessionStorage.setItem("position",String(finalPosition));
    sessionStorage.setItem("point",String(finalPoint));
}

export async function saveBoardHistory(data){
    const nickname = sessionStorage.getItem("nickname");
    const joinDate = sessionStorage.getItem("joinDate");

    if(!nickname || !joinDate || !data){
        throw new Error("히스토리 저장 정보가 없습니다.");
    }

    const historyRef = push(ref(db,`으차방/history/${nickname}`));

    await set(historyRef,{
        dice:Number(data.dice) || 0,
        diceE:Number(data.end) || 0,
        diceS:Number(data.start) || 0,
        getP:Number(data.getP) || 0,
        joinDate:joinDate,
        type:data.type || "",
        useP:data.useP ?? ""
    });

    return historyRef.key;
}

export async function saveGameResult(data){
    if(!data){
        throw new Error("게임 결과가 없습니다.");
    }

    const bankPoint = Number(data.bankPoint) || 0;

    if(bankPoint !== 0){
        await saveBoardHistory({
            start:data.start,
            dice:data.dice,
            end:data.end,
            type:"벙게임참여-은행",
            getP:bankPoint,
            useP:""
        });
    }

    const historyType = {
        normal:"벙게임참여-일반",
        island:"벙게임참여-무인도",
        hotel:"벙게임참여-호캉스",
        lottery:"벙게임참여-복권",
        bank:"벙게임참여-은행"
    }[data.type] || "벙게임참여";

    await saveBoardHistory({
        start:data.start,
        dice:data.dice,
        end:data.end,
        type:historyType,
        getP:Number(data.point) || 0,
        useP:""
    });

    await saveUserState(data.end,data.totalPoint);

    return true;
}