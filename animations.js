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
            "targetX" : 200,
            "targetY" : 0,
            "rateX" : 5,
            "rateY" : 0,
        },
        "animations" : {
            "spin" : {
                "row" : 0,
                "steps" : [5, 5, 5, 5, 5, 5]
            }
        },
    }
];