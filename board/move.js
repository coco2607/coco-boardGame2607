// move.js

import {
    boardData,
    startPosition
} from "./boardData.js";

const playerPin =
    document.getElementById("playerPin");

const positionText =
    document.getElementById("position");

let moving = false;

// 말 이동
export async function movePlayer(step) {
    if (moving) {
        return null;
    }

    moving = true;

    try {
        let position =
            Number(
                sessionStorage.getItem("position")
            ) || 0;

        const dice =
            Number(step);

        const start =
            position;

        let crossed40 = false;

        if (
            !Number.isFinite(dice) ||
            dice < 1
        ) {
            return null;
        }

        // 말 이동
        for (let i = 0; i < dice; i++) {
            position++;

            if (position > 40) {
                position = 1;

                // 40번에서 출발한 경우
                // 은행 통과로 처리하지 않음
                if (start !== 40) {
                    crossed40 = true;
                }
            }

            sessionStorage.setItem(
                "position",
                String(position)
            );

            updateMarker(position);

            await wait(300);
        }

        const tile =
            boardData[position];

        return {
            start: start,
            dice: dice,
            end: position,
            type: tile?.type || "",
            crossed40: crossed40
        };

    } finally {
        moving = false;
    }
}

// 말 위치
export function updateMarker(position) {
    const tile =
        Number(position) === 0
            ? startPosition
            : boardData[position];

    if (!tile) {
        return;
    }

    playerPin.style.left =
        tile.x + "%";

    playerPin.style.top =
        tile.y + "%";

    positionText.textContent =
        `${Number(position) || 0}번`;
}

// 대기
function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}