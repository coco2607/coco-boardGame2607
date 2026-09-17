// dice.js

import {movePlayer} from "./move.js";
import {handleMoveResult} from "./popup.js";
import {saveGameResult} from "./boardFirebase.js";

// DOM
const dice = document.getElementById("dice");
const diceBtn = document.getElementById("diceBtn");
const diceModal = document.getElementById("diceModal");
const diceResult = document.getElementById("diceResult");

let rolling = false;

// 이벤트
diceBtn.addEventListener("click", rollDice);

// 주사위 굴리기
async function rollDice() {
    if (rolling || diceBtn.disabled) {
        return;
    }

    rolling = true;
    diceBtn.disabled = true;

    diceModal.classList.remove("hidden");
    diceResult.textContent = "주사위를 굴리는 중...";

    // 주사위 결과
    const number = 1; //Math.floor(Math.random() * 6) + 1;

    const faceRotation = {
        1: {x: 0, y: 0},
        2: {x: 90, y: 0},
        3: {x: 0, y: -90},
        4: {x: 0, y: 90},
        5: {x: -90, y: 0},
        6: {x: 0, y: 180}
    };

    const spinX =
        2160 + faceRotation[number].x;

    const spinY =
        2160 + faceRotation[number].y;

    dice.style.transition = "none";
    dice.style.transform =
        "rotateX(0deg) rotateY(0deg)";

    setTimeout(() => {
        dice.style.transition =
            "transform 1.8s cubic-bezier(.15,.75,.2,1)";

        dice.style.transform =
            `rotateX(${spinX}deg) rotateY(${spinY}deg)`;
    }, 50);

    sessionStorage.setItem(
        "dice",
        String(number)
    );

    setTimeout(() => {
        diceResult.textContent =
            `${number}이(가) 나왔습니다!`;
    }, 1850);

    setTimeout(async () => {
        try {
            diceModal.classList.add("hidden");

            // 말 이동
            const moveResult =
                await movePlayer(number);

            if (!moveResult) {
                return;
            }

            // 이동 결과 처리 및 팝업
            const gameResult =
                await handleMoveResult(
                    moveResult
                );

            if (!gameResult) {
                return;
            }

            // Firebase 저장
            await saveGameResult(
                gameResult
            );

            // 상단 포인트 즉시 반영
            if (
                typeof window.updateTotalPoint ===
                "function"
            ) {
                window.updateTotalPoint(
                    gameResult.totalPoint
                );
            }

            // Firebase의 lastRoll을 다시 확인
            // 오늘이면 주사위 버튼 비활성화
            if (
                typeof window.refreshDiceAvailability ===
                "function"
            ) {
                await window.refreshDiceAvailability();
            }

        } catch (error) {

            // 저장 실패 시 다시 누를 수 있도록 복구
            diceBtn.disabled = false;
            diceBtn.classList.remove("cooldown");

        } finally {
            rolling = false;

            // 정상 저장된 경우
            // refreshDiceAvailability()가 최종 상태를 결정함
            if (!diceBtn.classList.contains("cooldown")) {
                diceBtn.disabled = false;
            }
        }
    }, 2300);
}