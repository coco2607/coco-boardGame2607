// lottery.js
function getLotteryPrize(){
    const prizes = [
        {point:3,probability:30},
        {point:4,probability:30},
        {point:5,probability:24},
        {point:6,probability:10},
        {point:7,probability:5},
        {point:8,probability:1}
    ];

    const random = Math.random() * 100;
    let cumulative = 0;

    for(const prize of prizes){
        cumulative += prize.probability;

        if(random < cumulative){
            return prize.point;
        }
    }

    return prizes[prizes.length - 1].point;
}

function animateLotteryNumber(numberElement,finalNumber){
    return new Promise(resolve => {
        const numbers = [3,4,5,6,7,8];
        const sequence = [
            45,45,50,50,55,60,65,75,85,
            95,110,125,145,165,190,220,255,295
        ];

        let index = 0;
        let count = 0;

        function run(){
            numberElement.textContent = numbers[index];
            index = (index + 1) % numbers.length;
            count++;

            if(count >= sequence.length){
                numberElement.textContent = finalNumber;
                resolve();
                return;
            }

            setTimeout(run,sequence[count]);
        }

        run();
    });
}

export function showLotteryPopup(){
    return new Promise(resolve => {
        const modal = document.getElementById("lotteryModal");
        const numberElement = document.getElementById("lotteryNumber");
        const messageElement = document.getElementById("lotteryMessage");
        const button = document.getElementById("lotteryBtn");

        if(!modal || !numberElement || !messageElement || !button){
            resolve(0);
            return;
        }

        numberElement.textContent = "?";
        messageElement.textContent = "복권을 긁어보세요!";
        button.textContent = "복권 긁기";
        button.disabled = false;
        button.style.display = "block";

        button.onclick = async () => {
            button.disabled = true;
            button.style.display = "none";

            const reward = getLotteryPrize();

            messageElement.textContent = "";

            await animateLotteryNumber(numberElement,reward);

            setTimeout(() => {
                modal.classList.add("hidden");
                modal.style.display = "none";
                resolve(reward);
            },1400);
        };

        modal.classList.remove("hidden");
    });
}