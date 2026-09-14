// popup.js

import {boardData} from "./boardData.js";
import {showLotteryPopup} from "./lottery.js";

// 일반 팝업
export function showPopup(
    message,
    image = "",
    reward = ""
) {
    return new Promise(resolve => {
        const modal = document.getElementById("popupModal");
        const messageElement = document.getElementById("popupMessage");
        const imageElement = document.getElementById("popupImage");
        const rewardElement = document.getElementById("popupReward");
        const button = document.getElementById("popupCloseBtn");
        const lotteryModal = document.getElementById("lotteryModal");

        if (
            !modal ||
            !messageElement ||
            !imageElement ||
            !rewardElement ||
            !button
        ) {
            resolve(0);
            return;
        }

        modal.classList.add("hidden");

        messageElement.innerHTML = "";
        rewardElement.innerHTML = "";
        imageElement.removeAttribute("src");
        imageElement.style.display = "none";

        if (image) {
            imageElement.src =
                `../images/board/${image}`;

            imageElement.style.display = "block";
        }

        messageElement.innerHTML =
            message || "";

        messageElement.style.display =
            message ? "block" : "none";

        rewardElement.innerHTML =
            reward || "";

        rewardElement.style.display =
            reward ? "block" : "none";

        button.textContent = "확인";

        button.onclick = () => {
            modal.classList.add("hidden");

            if (lotteryModal) {
                lotteryModal.classList.add("hidden");
            }

            resolve(0);
        };

        modal.classList.remove("hidden");
    });
}

// 이동 결과 처리
export async function handleMoveResult(moveResult) {
    if (!moveResult) {
        return null;
    }

    const start =
        Number(moveResult.start) || 0;

    const dice =
        Number(moveResult.dice) || 0;

    const end =
        Number(moveResult.end) || 0;

    let totalPoint =
        Number(
            sessionStorage.getItem("point")
        ) || 0;

    let bankPoint = 0;
    let point = 0;
    let getP = 0;
    let type = "";
    let message = "";
    let image = "";

    // 40번 통과 시 은행 보상
    if (
        moveResult.crossed40 === true &&
        start !== 40
    ) {
        const bankTile = boardData[40];

        if (bankTile) {
            bankPoint =
                Number(bankTile.point) || 0;

            const bankMessage =
                Array.isArray(bankTile.message)
                    ? bankTile.message[
                        Math.floor(
                            Math.random() *
                            bankTile.message.length
                        )
                    ]
                    : bankTile.message || "";

            totalPoint += bankPoint;
            getP += bankPoint;

            await showPopup(
                bankMessage,
                bankTile.image || "",
                `+${bankPoint.toLocaleString()}P`
            );
        }
    }

    // 도착 칸
    const tile = boardData[end];

    if (!tile) {
        return {
            start: start,
            dice: dice,
            end: end,
            type: "",
            point: 0,
            getP: getP,
            totalPoint: totalPoint,
            bankPoint: bankPoint,
            message: "",
            image: ""
        };
    }

    type = tile.type || "";

    // 복권
    if (type === "lottery") {
        point =
            Number(
                await showLotteryPopup()
            ) || 0;

        totalPoint += point;
        getP += point;

        // 복권 팝업 위에 일반 결과 팝업 표시
        await showPopup(
            `${point.toLocaleString()}점을 획득하셨습니다.`
        );

        return {
            start: start,
            dice: dice,
            end: end,
            type: type,
            point: point,
            getP: getP,
            totalPoint: totalPoint,
            bankPoint: bankPoint,
            message: "",
            image: ""
        };
    }

    // 도착 칸 포인트
    point =
        Number(tile.point) || 0;

    totalPoint += point;
    getP += point;

    // 메시지
    if (Array.isArray(tile.message)) {
        message =
            tile.message[
                Math.floor(
                    Math.random() *
                    tile.message.length
                )
            ];
    } else {
        message =
            tile.message || "";
    }

    image = tile.image || "";

    // 팝업 보상
    let reward = "";

    if (point > 0) {
        reward =
            `+${point.toLocaleString()}P`;
    } else if (point < 0) {
        reward =
            `${point.toLocaleString()}P`;
    }

    if (message || image) {
        await showPopup(
            message,
            image,
            reward
        );
    } else if (point > 0) {
        await showPopup(
            "포인트를 획득했습니다!",
            "",
            reward
        );
    } else if (point < 0) {
        await showPopup(
            "포인트가 차감되었습니다.",
            "",
            reward
        );
    }

    return {
        start: start,
        dice: dice,
        end: end,
        type: type,
        point: point,
        getP: getP,
        totalPoint: totalPoint,
        bankPoint: bankPoint,
        message: message,
        image: image
    };
}