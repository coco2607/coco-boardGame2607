// popup.js

// 팝업 열기
export function showPopup(message, image, type = "") {

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

    if (type === "lottery") {
        button.textContent = "복권 긁기";
    } else {
        button.textContent = "확인";
    }

    button.onclick = async function () {
        modal.classList.add("hidden");
        if (window.refreshTotalPoint) {
            await window.refreshTotalPoint();
        }
    };

    modal.classList.remove("hidden");

}


// 복권 확률
export function showLotteryPopup() {

    return new Promise(resolve => {

        const modal = document.getElementById("lotteryModal");
        const number = document.getElementById("lotteryNumber");
        const message = document.getElementById("lotteryMessage");
        const button = document.getElementById("lotteryBtn");

        modal.classList.remove("hidden");

        button.style.display = "none";

        number.textContent = "?";
        message.textContent = "복권을 긁는 중...";

        const prize = getLotteryPrize();

        const speeds = [
            40, 70, 100, 130, 160,
            190, 220, 255, 295, 340,
            390, 450, 520, 600, 690,
            790, 900, 1020, 1150, 1290,
            1440, 1600, 1770, 1950,
            2140, 2340, 2550, 2770, 3000
        ];

        let lastNumber = 0;

        speeds.forEach((time, index) => {

            setTimeout(() => {

                if (index === speeds.length - 1) {

                    number.textContent = prize;
                    message.innerHTML = "";

                    button.style.display = "inline-block";
                    button.textContent = "확인";

                    button.onclick = async function () {

                        modal.classList.add("hidden");

                        resolve(prize);

                    };

                } else {

                    let random;

                    do {
                        random = Math.floor(Math.random() * 6) + 3;
                    } while (random === lastNumber);

                    lastNumber = random;
                    number.textContent = random;
                }

            }, time);

        });

    });

}