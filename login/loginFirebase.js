// loginFirebase.js
import {
    db,
    ref,
    get
} from "../firebase.js";

export async function checkAccessPassword(password){
    const snapshot = await get(
        ref(db,"으차방/access/password")
    );

    if(!snapshot.exists()){
        return false;
    }

    return password.trim() === String(snapshot.val()).trim();
}

export async function checkPartyDateAvailable(nickname,joinDate){
    nickname = nickname.trim();
    joinDate = joinDate.trim();

    if(!nickname || !joinDate){
        return {
            available:true,
            reason:""
        };
    }

    const snapshot = await get(
        ref(db,`으차방/member/${nickname}`)
    );

    if(!snapshot.exists()){
        return {
            available:true,
            reason:""
        };
    }

    const data = snapshot.val();
    const lastRoll = Number(data.lastRoll);

    if(!Number.isFinite(lastRoll)){
        return {
            available:true,
            reason:""
        };
    }

    const lastDate = new Intl.DateTimeFormat(
        "en-CA",
        {
            timeZone:"Asia/Seoul",
            year:"numeric",
            month:"2-digit",
            day:"2-digit"
        }
    ).format(new Date(lastRoll));

    if(joinDate === lastDate){
        return {
            available:false,
            reason:"alreadyToday"
        };
    }

    if(joinDate < lastDate){
        return {
            available:false,
            reason:"pastDate"
        };
    }

    return {
        available:true,
        reason:""
    };
}