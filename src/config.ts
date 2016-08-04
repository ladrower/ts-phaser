interface IRemoteConfig {
    locale: string;
    localePath: string;
};

let basic = {
    API_BASE: "http://artemplatonov.com/phasering/",
    BOOTSTRAP_STATE: "Boot",
    CONFIG_PATH: "config.json",
    GAME: {
        ATLAS_SPRITE: "atlas",
        BET_RANGE: [1, 5],
        CARDS_FRAMES_MAP: {
            J: 0,
            K: 1,
            Q: 2,
            T: 3,
        },
        CARDS_NUMBER: 4,
        CARDS_SPRITE: "letters",
        INITIAL_BALANCE: 1000,
    },
    STAGE: {
        COLOR: 0x182d3b,
        CONTAINER: "game-canvas",
        HEIGHT: 1536,
        WIDTH: 2048,
    },
};

export {basic, IRemoteConfig};
