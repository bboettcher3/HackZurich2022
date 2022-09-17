const characters = [
    {
        "name" : "bunny",
        "source" : "images/bunny.png",
        "height" : 128, // source
        "width" : 128,
        "current" : { // updated at runtime
            "animation" : "spin",
            "stepCount" : 0,
            "frameCount" : 0,
            "spriteIndex" : 0,
            "width" : 64, // display size
            "height" : 64,
            "x" : 0,
            "y" : 0,
            "targetX" : 0,
            "targetY" : 0,
            "rateX" : 0,
            "rateY" : 0,
            "bumped" : false
        },
        "animations" : {
            "spin" : {
                "row" : 0,
                "steps" : [5, 5, 5, 5, 5, 5],
                "face" : 0
            }
        },
    },
    {
        "name" : "frog",
        "source" : "images/frog.png",
        "height" : 128,
        "width" : 128,
        "current" : { // updated at runtime
            "animation" : "walk_right",
            "stepCount" : 0,
            "frameCount" : 0,
            "spriteIndex" : 1,
            "width" : 64, // display size
            "height" : 64,
            "x" : 0,
            "y" : 300,
            "targetX" : 100,
            "targetY" : 300,
            "bumped" : false,
            "idleX": 0,
            "idleY": 300,
            "task": "walk_left" // Animation to perform once target is hit
        },
        "animations" : {
            "walk_left" : {
                "row" : 0,
                "steps" : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                "flip" : "walk_right",
                "face" : -1,
                "rate" : 2
            },
            "walk_right" : {
                "row" : 1,
                "steps" : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                "flip" : "walk_left",
                "face" : 1,
                "rate" : 2
            },
            "click_left" : {
                "row" : 2,
                "steps" : [1, 1, 1, 10, 1, 1],
                "flip" : "click_right",
                "face" : -1
            },
            "click_right" : {
                "row" : 3,
                "steps" : [1, 1, 1, 10, 1, 1],
                "flip" : "click_left",
                "face" : 1
            },
            "bump_left" : {
                "row" : 4,
                "steps" : [1, 1, 30, 1, 1],
                "flip" : "bump_right",
                "face" : -1
            },
            "bump_right" : {
                "row" : 5,
                "steps" : [1, 1, 30, 1, 1],
                "flip" : "bump_left",
                "face" : 1
            },
            "sleep_left" : {
                "row" : 6,
                "steps" : [1, 1, 1, 1, 1, 1, 1, 1, 1, 100, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                "flip" : "sleep_right",
                "face" : -1
            },
            "sleep_right" : {
                "row" : 7,
                "steps" : [5, 1, 1, 1, 1, 1, 1, 1, 1, 100, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                "flip" : "sleep_left",
                "face" : 1
            }
        },
    }
];