// popup.js


// ========================================
// 복권 당첨금
// ========================================
function getLotteryPrize() {

    const rand = Math.random();

    if (rand < 0.40) return 3;
    if (rand < 0.75) return 4;
    if (rand < 0.85) return 5;
    if (rand < 0.93) return 6;
    if (rand < 0.98) return 7;

    return 8;
}


// ========================================
// 일반 팝업
// ========================================
export function showPopup(
    message,
    image,
    type = ""
) {

    return new Promise(resolve => {

        const modal = document.getElementById("specialModal");
        const messageElement = document.getElementById("specialMessage");
        const imageElement = document.getElementById("specialImage");
        const button = document.getElementById("specialCloseBtn");

        messageElement.innerHTML = message;

        if (image) {
            imageElement.src = `../images/special/${image}`;
            imageElement.style.display = "block";
        } else {
            imageElement.style.display = "none";
        }

        // 버튼
        if (type === "lottery") {
            button.textContent = "복권 긁기";
        } else {
            button.textContent = "확인";
        }

        button.onclick = async function () {

            modal.classList.add("hidden");

            // 복권
            if (type === "lottery") {
                const prize = await showLotteryPopup();
                resolve(prize);
                return;
            }

            // 일반 팝업
            resolve(0);
        };

        // 팝업 표시
        modal.classList.remove("hidden");
    });
}



// 복권 긁기
export function showLotteryPopup() {

    return new Promise(resolve => {

        const modal = document.getElementById("lotteryModal");
        const number = document.getElementById("lotteryNumber");
        const message = document.getElementById("lotteryMessage");
        const button = document.getElementById("lotteryBtn");


        // 복권 팝업 표시
        modal.classList.remove("hidden");
        button.style.display = "none";
        number.textContent = "?";
        message.textContent = "복권을 긁는 중...";

        // 당첨금 결정
        const prize = getLotteryPrize();

        const speeds = [
            40, 70, 100, 130, 160,
            190, 220, 250, 280, 310,
            340, 370, 400, 430, 460,
            490, 520, 550, 580, 610,
            640, 670, 700, 730, 760,
            790, 820, 850, 880, 910,
            940, 970, 1000, 1100, 1200,
            1300, 1400, 1500, 1600, 1750,
            1900, 2100, 2300, 2500, 2800,
            3200, 3600, 4000
        ];

        let lastNumber = 0;

        speeds.forEach((time, index) => {
                setTimeout(() => {

                    // 마지막 숫자
                    if (index ===speeds.length - 1)
                    {
                        number.textContent = prize;
                        message.innerHTML = "";
                        button.style.display = "inline-block";
                        button.textContent = "확인";

                        // 확인 버튼
                        button.onclick =
                            async function () {
                                modal.classList.add("hidden");
                                resolve(prize);

                            };
                    } else {

                        let random;
                        do {
                            random =
                                Math.floor(
                                    Math.random() * 6
                                ) + 3;
                        } while (
                            random ===
                            lastNumber
                        );
                        lastNumber =random;
                        number.textContent =random;
                    }
                }, time);
            }
        );
    });
}