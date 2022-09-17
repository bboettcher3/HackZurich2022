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
        },
        "animations" : {
            "spin" : {
                "row" : 0,
                "steps" : [5, 5, 5, 5, 5, 5]
            }
        },
    },
    {
        "name" : "frog",
        "source" : "images/frog.png",
        "height" : 128,
        "width" : 128,
        "current" : { // updated at runtime
            "animation" : "right",
            "stepCount" : 0,
            "frameCount" : 0,
            "spriteIndex" : 1,
            "width" : 64, // display size
            "height" : 64,
            "x" : 0,
            "y" : 300,
            "targetX" : 100,
            "targetY" : 0,
            "rateX" : 2,
            "rateY" : 0,
        },
        "animations" : {
            "left" : {
                "row" : 0,
                "steps" : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                "flip" : "right"
            },
            "right" : {
                "row" : 1,
                "steps" : [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                "flip" : "left"
            },
            "click_left" : {
                "row" : 2,
                "steps" : [1, 1, 1, 10, 1, 1],
                "flip" : "click_right"
            },
            "click_right" : {
                "row" : 3,
                "steps" : [1, 1, 1, 10, 1, 1],
                "flip" : "click_left"
            },
            "bump_left" : {
                "row" : 4,
                "steps" : [1, 1, 10, 1, 1],
                "flip" : "bump_right"
            },
            "bump_right" : {
                "row" : 5,
                "steps" : [1, 1, 10, 1, 1],
                "flip" : "bump_left"
            }
        },
    }
];