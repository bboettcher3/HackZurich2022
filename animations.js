const characters = [
    {
        "name" : "bunny",
        "source" : "images/bunny.png",
        "height" : 128,
        "width" : 128,
        "current" : { // updated at runtime
            "animation" : "spin",
            "stepCount" : 0,
            "frameCount" : 0,
            "spriteIndex" : 0,
            "x" : 0,
            "y" : 0,
        },
        "animations" : {
            "spin" : {
                "row" : 0,
                "steps" : [5, 5, 5, 5, 5, 5]
            }
        },
    }
];