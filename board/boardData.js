// boardData.js

export const startPosition = {
    type: "start",
    x: 16.5,
    y: 74.8
};

export const boardData = [
    null,

    // 1 ~ 9 (왼쪽)
    {type: "normal", point: 3, x: 7.2, y: 74.4}, //1
    {type: "normal", point: 1, x: 7.2, y: 68.9}, //2
    {type: "normal", point: 1, x: 7.2, y: 63.1}, //3
    {type: "normal", point: 1, x: 7.2, y: 57.5}, //4
    {type: "normal", point: 2, x: 7.2, y: 51.8}, //5
    {type: "normal", point: 1, x: 7.2, y: 46.3}, //6
    {type: "normal", point: 1, x: 7.2, y: 40.9}, //7
    {type: "normal", point: 2, x: 7.2, y: 35.5}, //8
    {type: "normal", point: 1, x: 7.2, y: 29.8}, //9

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
        image: "island.webp",
        x: 7.2,
        y: 19.5
    },

    // 11 ~ 19 (윗줄)
    {type: "normal", point: 2, x: 19.2, y: 19.5}, //11
    {type: "normal", point: 3, x: 26.7, y: 19.5}, //12
    {type: "normal", point: 1, x: 34.4, y: 19.5}, //13
    {type: "normal", point: 1, x: 42.2, y: 19.5}, //14
    {type: "normal", point: 2, x: 50.0, y: 19.5}, //15
    {type: "normal", point: 1, x: 57.7, y: 19.5}, //16
    {type: "normal", point: 1, x: 64.8, y: 19.5}, //17
    {type: "normal", point: 2, x: 73.0, y: 19.5}, //18
    {type: "normal", point: 1, x: 81.0, y: 19.5}, //19

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
        image: "hotel.webp",
        x: 92.5,
        y: 19.5
    },

    // 21 ~ 29 (오른쪽)
    {type: "normal", point: 2, x: 92.5, y: 29.8}, //21
    {type: "normal", point: 2, x: 92.5, y: 35.5}, //22
    {type: "normal", point: 1, x: 92.5, y: 40.9}, //23
    {type: "normal", point: 2, x: 92.5, y: 46.3}, //24
    {type: "normal", point: 1, x: 92.5, y: 51.8}, //25
    {type: "normal", point: 2, x: 92.5, y: 57.5}, //26
    {type: "normal", point: 1, x: 92.5, y: 63.1}, //27
    {type: "normal", point: 3, x: 92.5, y: 68.9}, //28
    {type: "normal", point: 1, x: 92.5, y: 74.4}, //29

    // 30 복권
    {
        type: "lottery",
        title: "복권",
        message: [
            "축! 으랏차차 행운복권 당첨!"
        ],
        point: 0,
        image: "lottery.webp",
        x: 92.5,
        y: 84.0
    },

    // 31 ~ 39 (아래)
    {type: "normal", point: 3, x: 80.6, y: 84.0}, //31
    {type: "normal", point: 2, x: 73.0, y: 84.0}, //32
    {type: "normal", point: 2, x: 64.8, y: 84.0}, //33
    {type: "normal", point: 2, x: 57.7, y: 84.0}, //34
    {type: "normal", point: 3, x: 50.0, y: 84.0}, //35
    {type: "normal", point: 2, x: 42.2, y: 84.0}, //36
    {type: "normal", point: 3, x: 34.4, y: 84.0}, //37
    {type: "normal", point: 2, x: 26.7, y: 84.0}, //38
    {type: "normal", point: 3, x: 19.2, y: 84.0}, //39

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
        image: "bank.webp",
        x: 7.2,
        y: 84.0
    }
];