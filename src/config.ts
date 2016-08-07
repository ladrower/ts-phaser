interface IRemoteConfig {
    locale: string;
    localePath: string;
};

let AUDIO_KEY = {
    BIG_WIN: "bigwin",
    REEL: "reel",
    REG_WIN: "regwin",
};

let basic = {
    API_BASE: "http://artemplatonov.com/phasering/",
    BOOTSTRAP_STATE: "Boot",
    CONFIG_PATH: "config.json",
    GAME: {
        ATLAS_SPRITE: {
            key: "atlas",
            url: {
                atlas: "./assets/sprites/atlas.json",
                texture: "./assets/sprites/atlas.png",
            },
        },
        AUDIO: [
            {key: AUDIO_KEY.REEL, urls: ["./assets/audio/reel.mp3"]},
            {key: AUDIO_KEY.BIG_WIN, urls: ["./assets/audio/bigwin.mp3"]},
            {key: AUDIO_KEY.REG_WIN, urls: ["./assets/audio/regwin.mp3"]},
        ],
        AUDIO_KEY,
        BET_RANGE: [1, 5],
        CARDS_FRAMES_MAP: {
            J: 0,
            K: 1,
            Q: 2,
            T: 3,
        },
        CARDS_NUMBER: 4,
        CARDS_SPRITE: {
            key: "letters",
            url: {
                atlas: "./assets/sprites/letters.json",
                texture: "./assets/sprites/letters.png",
            },
        },
        INITIAL_BALANCE: 1000,
        WIN_TYPE: {
            BIG: "bigWin",
            NONE: "none",
            REGULAR: "regular",
        },
    },
    STAGE: {
        COLOR: 0x182d3b,
        CONTAINER: "game-canvas",
        HEIGHT: 1536,
        WIDTH: 2048,
    },
};

export {basic, IRemoteConfig};
