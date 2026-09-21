// dice.js
import {movePlayer} from "./move.js";
import {handleMoveResult} from "./popup.js";
import {saveGameResult} from "./boardFirebase.js";

const dice = document.getElementById("dice");
const diceBtn = document.getElementById("diceBtn");
const diceModal = document.getElementById("diceModal");
const diceResult = document.getElementById("diceResult");

let rolling = false;

diceBtn.addEventListener("click",rollDice);

async function rollDice(){
    if(rolling || diceBtn.disabled){
        return;
    }

    rolling = true;
    diceBtn.disabled = true;

    try{
        diceModal.classList.remove("hidden");
        diceResult.textContent = "주사위를 굴리는 중...";

        const number =2 //Math.floor(Math.random() * 6) + 1;

        await animateDice(number);

        sessionStorage.setItem("dice",String(number));
        diceResult.textContent = `${number}이(가) 나왔습니다!`;

        await wait(450);
        diceModal.classList.add("hidden");

        const moveResult = await movePlayer(number);

        if(!moveResult){
            throw new Error("말 이동 결과가 없습니다.");
        }

        const gameResult = await handleMoveResult(moveResult);

        if(!gameResult){
            throw new Error("게임 결과가 없습니다.");
        }

        await saveGameResult(gameResult);

        if(typeof window.updateTotalPoint === "function"){
            window.updateTotalPoint(gameResult.totalPoint);
        }

        diceBtn.classList.add("cooldown");
        diceBtn.disabled = true;
    }catch(error){
        console.error("주사위 처리 실패:",error);
        diceModal.classList.add("hidden");
        diceBtn.classList.remove("cooldown");
        diceBtn.disabled = false;
    }finally{
        rolling = false;
    }
}

async function animateDice(number){
    const faceRotation = {
        1:{x:0,y:0},
        2:{x:90,y:0},
        3:{x:0,y:-90},
        4:{x:0,y:90},
        5:{x:-90,y:0},
        6:{x:0,y:180}
    };

    const rotation = faceRotation[number];
    const spinX = 2160 + rotation.x;
    const spinY = 2160 + rotation.y;

    dice.style.transition = "none";
    dice.style.transform = "rotateX(0deg) rotateY(0deg)";

    await wait(50);

    dice.style.transition = "transform 1.8s cubic-bezier(.15,.75,.2,1)";
    dice.style.transform = `rotateX(${spinX}deg) rotateY(${spinY}deg)`;

    await wait(1800);
}

function wait(ms){
    return new Promise(resolve => setTimeout(resolve,ms));
}