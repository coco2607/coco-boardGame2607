// boardData.js

export const startPosition = {
    type: "start",
    x: 16.2,
    y: 79.8
};

export const boardData = [
    null,

    // 1 ~ 9 (왼쪽)
    { type: "normal", point: 3, x: 7.2, y: 79.8 }, //1
    { type: "normal", point: 1, x: 7.2, y: 73.0 }, //2
    { type: "normal", point: 1, x: 7.2, y: 66.0 }, //3
    { type: "normal", point: 1, x: 7.2, y: 59.0 }, //4
    { type: "normal", point: 2, x: 7.2, y: 51.8 }, //5
    { type: "normal", point: 1, x: 7.2, y: 45.0 }, //6
    { type: "normal", point: 1, x: 7.2, y: 38.0 }, //7
    { type: "normal", point: 2, x: 7.2, y: 31.0 }, //8
    { type: "normal", point: 1, x: 7.2, y: 23.8 }, //9

    // 10
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
        y: 10.8
    },

    // 11 ~ 19 (윗줄)
    { type: "normal", point: 2, x: 19.2, y: 7.4 }, //11
    { type: "normal", point: 3, x: 26.7, y: 7.4 }, //12
    { type: "normal", point: 1, x: 34.2, y: 7.4 }, //13
    { type: "normal", point: 1, x: 41.6, y: 7.4 }, //14
    { type: "normal", point: 2, x: 49.2, y: 7.4 }, //15
    { type: "normal", point: 1, x: 56.7, y: 7.4 }, //16
    { type: "normal", point: 1, x: 64.5, y: 7.4 }, //17
    { type: "normal", point: 2, x: 72.2, y: 7.4 }, //18
    { type: "normal", point: 1, x: 79.7, y: 7.4 }, //19

    // 20
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
        y: 10.8
    },

    // 21 ~ 29 (오른쪽)
    { type: "normal", point: 2, x: 92.5, y: 23.6 }, //21
    { type: "normal", point: 2, x: 92.5, y: 31.0 }, //22
    { type: "normal", point: 1, x: 92.5, y: 38.0 }, //23
    { type: "normal", point: 2, x: 92.5, y: 45.0 }, //24
    { type: "normal", point: 1, x: 92.5, y: 51.8 }, //25
    { type: "normal", point: 2, x: 92.5, y: 59.0 }, //26
    { type: "normal", point: 1, x: 92.5, y: 66.0 }, //27
    { type: "normal", point: 3, x: 92.5, y: 73.0 }, //28
    { type: "normal", point: 1, x: 92.5, y: 79.8 }, //29

    // 30
    {
        type: "lottery",
        title: "복권",
        message: [
            "축! 으랏차차 행운복권 당첨!"
        ],
        point: 0,
        image: "lottery.jpg",
        x: 92.5,
        y: 92.5
    },

    // 31 ~ 39 (아래)
    { type: "normal", point: 3, x: 79.8, y: 90.0 }, //31
    { type: "normal", point: 2, x: 72.2, y: 90.0 }, //32
    { type: "normal", point: 2, x: 64.5, y: 90.0 }, //33
    { type: "normal", point: 2, x: 56.9, y: 90.0 }, //34
    { type: "normal", point: 3, x: 49.4, y: 90.0 }, //35
    { type: "normal", point: 2, x: 41.9, y: 90.0 }, //36
    { type: "normal", point: 3, x: 34.4, y: 90.0 }, //37
    { type: "normal", point: 2, x: 26.8, y: 90.0 }, //38
    { type: "normal", point: 3, x: 19.4, y: 90.0 }, //39

    // 40
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
        y: 92.5
    }
];