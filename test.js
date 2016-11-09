/**
 * Created by Sam on 06/11/2016.
 */
var Rendering = (function () {
    var renderer;
    var stage;
    var updateFuncs = [];
    var graphics = new PIXI.Graphics();
    var rects = [];

    var drawRects = function() {
        for(var i = 0; i < rects.length; ++i){
            graphics.beginFill(rects[i].color);
            graphics.drawRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
        }
    };

    return {
        start: function () {
            renderer = PIXI.autoDetectRenderer($(document).width(), $(document).height(), {antialias: true, transparent: false, resolution: 1});
            document.body.appendChild(renderer.view);
            stage = new PIXI.Container();
            stage.interactive = true;
            stage.on("mousedown", Draw.startRect);
            stage.on("mouseup", Draw.endRect);
            renderer.autoResize = true;
            renderer.backgroundColor = 0xedd7bd;
            renderer.render(stage);
        },
        update: function () {
            graphics.clear();
            for (var i = 0; i < updateFuncs.length; ++i) {
                updateFuncs[i]();
            }
            drawRects();
            Draw.drawing(graphics);
            renderer.render(stage);
        },
        addFuncToUpdate: function (f) {
            updateFuncs.push(f);
        },
        add_to_stage: function (obj) {
            stage.addChild(obj);
        },
        mousePosition: function () {
            return renderer.plugins.interaction.mouse.global;
        },
        my_graphics: function () {
            return graphics;
        },
        addRectToDraw: function(x, y, width, height) {
            var c = randomColor().toString().replace("#", "0x");
            rects.push({
                x: x,
                y: y,
                width: width,
                height: height,
                color: c
            })
        }
    }
}());

var Draw = (function () {
    var originx, originy, endx, endy;
    var drawing = false;

    return {
        startRect: function () {
            var mousePos = GridLines.snapToLines();
            originx = mousePos.x;
            originy = mousePos.y;
            drawing = true;
        },
        endRect: function () {
            var mousePos = GridLines.snapToLines();
            endx = mousePos.x;
            endy = mousePos.y;
            Rendering.addRectToDraw(originx, originy, endx - originx, endy - originy);
            drawing = false;
        },
        drawing: function(graphics) {
            if(drawing) {
                var mousePos = GridLines.snapToLines();
                var tempendx = mousePos.x;
                var tempendy = mousePos.y;
                graphics.beginFill(0xd18659);
                graphics.drawRect(originx, originy, tempendx - originx, tempendy - originy);
            }
        }
    };
}());

var GridLines = (function () {
    var distance = 40;
    var width;
    var height;

    return {
        calculateGridlines: function () {
            width = $(document).width();
            var widthSquares = Math.ceil(width / distance);
            height = $(document).height();
            var heightSquares = Math.ceil(height / distance);
            var i;

            for (i = 0; i < widthSquares; ++i) {
                drawGridLine(i * distance, 0, i * distance, height);
            }
            for (i = 0; i < heightSquares; ++i) {
                drawGridLine(0, i * distance, width, i * distance);
            }
        },
        snapToLines: function () {
            var mousex = Rendering.mousePosition().x;
            var mousey = Rendering.mousePosition().y;
            var fixedx = Math.round(mousex / distance) * distance;
            var fixedy = Math.round(mousey / distance) * distance;
            return {
                x: fixedx,
                y: fixedy
            };
        }
    };
}());

function startRenderer() {
    Rendering.start();
    Rendering.addFuncToUpdate(drawCircle);
    Rendering.addFuncToUpdate(GridLines.calculateGridlines);
}

function drawCircle() {
    var circle = Rendering.my_graphics();
    circle.beginFill(0x7d8e4d);
    var radius = 20;
    var mouse = GridLines.snapToLines();
    circle.drawCircle(mouse.x, mouse.y, radius);
    Rendering.add_to_stage(circle);
}

function drawGridLine(originx, originy, targetx, targety) {
    var line = Rendering.my_graphics();
    line.lineStyle(1, 0xd18659);
    line.moveTo(originx, originy);
    line.lineTo(targetx, targety);
    Rendering.add_to_stage(line);
}

// $(document).ready(function () {
//     startRenderer();
//     setInterval(Rendering.update, 16);
// });