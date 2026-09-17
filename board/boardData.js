// boardData.js

export const startPosition = {
    type: "start",
    x: 16.2,
    y: 79.8
};

export const boardData = [
    null,

    // 1 ~ 9 (왼쪽)
    {type: "normal", point: 3, x: 7.2, y: 75.0}, //1
    {type: "normal", point: 1, x: 7.2, y: 69.2}, //2
    {type: "normal", point: 1, x: 7.2, y: 63.5}, //3
    {type: "normal", point: 1, x: 7.2, y: 58.0}, //4
    {type: "normal", point: 2, x: 7.2, y: 52.0}, //5
    {type: "normal", point: 1, x: 7.2, y: 46.5}, //6
    {type: "normal", point: 1, x: 7.2, y: 41.0}, //7
    {type: "normal", point: 2, x: 7.2, y: 35.0}, //8
    {type: "normal", point: 1, x: 7.2, y: 29.0}, //9

    // 10 무인도
    {
        type: "island",
        title: "무인도",
        message: [
            "니가 가라 무인도",
            "오늘부터 친구는 코코넛뿐!",
            "으차헬기 올 때까지 대기!",
            "축! 자연인 체험권 당첨!",
            "무인도 입국 심사 완료!"
        ],
        point: -1,
        image: "island.jpg",
        x: 7.2,
        y: 18.5
    },

    // 11 ~ 19 (윗줄)
    {type: "normal", point: 2, x: 19.2, y: 18.5}, //11
    {type: "normal", point: 3, x: 26.7, y: 18.5}, //12
    {type: "normal", point: 1, x: 34.2, y: 18.5}, //13
    {type: "normal", point: 1, x: 41.6, y: 18.5}, //14
    {type: "normal", point: 2, x: 49.2, y: 18.5}, //15
    {type: "normal", point: 1, x: 56.7, y: 18.5}, //16
    {type: "normal", point: 1, x: 64.5, y: 18.5}, //17
    {type: "normal", point: 2, x: 72.2, y: 18.5}, //18
    {type: "normal", point: 1, x: 79.7, y: 18.5}, //19

    // 20 호캉스
    {
        type: "hotel",
        title: "호캉스",
        message: [
            "모히또에서 몰디브 한 잔!",
            "으랏차차 호텔은 모든게 셀프",
            "호캉스고 뭐고 귀찮긴한데",
            "싸장님. 팁 띱 딥 띠입"
        ],
        point: 5,
        image: "hotel.jpg",
        x: 92.5,
        y: 18.5
    },

    // 21 ~ 29 (오른쪽)
    {type: "normal", point: 2, x: 92.5, y: 29.0}, //21
    {type: "normal", point: 2, x: 92.5, y: 35.0}, //22
    {type: "normal", point: 1, x: 92.5, y: 41.0}, //23
    {type: "normal", point: 2, x: 92.5, y: 46.5}, //24
    {type: "normal", point: 1, x: 92.5, y: 52.0}, //25
    {type: "normal", point: 2, x: 92.5, y: 58.0}, //26
    {type: "normal", point: 1, x: 92.5, y: 63.5}, //27
    {type: "normal", point: 3, x: 92.5, y: 69.2}, //28
    {type: "normal", point: 1, x: 92.5, y: 75.0}, //29

    // 30 복권
    {
        type: "lottery",
        title: "복권",
        message: [
            "축! 으랏차차 행운복권 당첨!"
        ],
        point: 0,
        image: "lottery.jpg",
        x: 92.5,
        y: 85.5
    },

    // 31 ~ 39 (아래)
    {type: "normal", point: 3, x: 79.8, y: 85.5}, //31
    {type: "normal", point: 2, x: 72.2, y: 85.5}, //32
    {type: "normal", point: 2, x: 64.5, y: 85.5}, //33
    {type: "normal", point: 2, x: 56.9, y: 85.5}, //34
    {type: "normal", point: 3, x: 49.4, y: 85.5}, //35
    {type: "normal", point: 2, x: 41.9, y: 85.5}, //36
    {type: "normal", point: 3, x: 34.4, y: 85.5}, //37
    {type: "normal", point: 2, x: 26.8, y: 85.5}, //38
    {type: "normal", point: 3, x: 19.4, y: 85.5}, //39

    // 40 은행
    {
        type: "bank",
        title: "은행",
        message: [
            "여기까지 온다고 고생함",
            "고생했으니 포인트 받아랏!",
            "으차방 벙신으로 임명함",
            "1바퀴 완주? 큰 숫자만 나왔나베"
        ],
        point: 2,
        image: "bank.jpg",
        x: 7.2,
        y: 85.5
    }
];