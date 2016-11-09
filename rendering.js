/**
 * Created by Sam on 08/11/2016.
 */
var RenderingManager = (function () {
    var renderer, stage, my_graphics;
    var update_methods = [];
    var temporary_objects = [];
    var permanent_objects = [];
    var grid_spacing = 20;

    return {
        mouse_position: function () {
            return renderer.plugins.interaction.mouse.global;
        },
        get_snapped_mouse: function () {
            var mouse_x = this.mouse_position().x;
            var mouse_y = this.mouse_position().y;
            var fixed_x = Math.round(mouse_x / grid_spacing) * grid_spacing;
            var fixed_y = Math.round(mouse_y / grid_spacing) * grid_spacing;
            return {
                x: fixed_x,
                y: fixed_y
            }
        },


//cursor drawer
        calculate_cursor: function () {
            var cursor_location = RenderingManager.get_snapped_mouse();
            var circle = RenderingManager.create_circle(cursor_location.x, cursor_location.y, 20, 0x7d8e4d);
            RenderingManager.objects.add_temporary(circle);
        },

//grid drawer
        calculate_grid: function () {
            var width = $(document).width();
            var no_squares_horizontal = Math.ceil(width / grid_spacing);
            var height = $(document).height();
            var no_squares_vertical = Math.ceil(height / grid_spacing);
            var i, obj, offset;
            for (i = 0; i < no_squares_horizontal; ++i) {
                offset = i * grid_spacing;
                obj = this.create_line(offset, 0, offset, height, 0xd18659);
                this.objects.add_permanent(obj);
            }
            for (i = 0; i < no_squares_vertical; ++i) {
                offset = i * grid_spacing;
                obj = this.create_line(0, offset, width, offset, 0xd18659);
                this.objects.add_permanent(obj);
            }
        },

        create_basic_object: function (origin_x, origin_y, end_x, end_y, colour) {
            var draw = function () {
                //default to draw rect
                my_graphics.beginFill(this.colour);
                my_graphics.drawRect(origin_x, origin_y, end_x - origin_x, end_y - origin_y);
            };
            return {
                origin_x: origin_x,
                origin_y: origin_y,
                end_x: end_x,
                end_y: end_y,
                colour: colour,
                draw: draw
            };
        },

        create_circle: function (origin_x, origin_y, radius, colour) {
            var circle = this.create_basic_object(origin_x, origin_y, 0, 0, colour);
            circle.radius = radius;
            circle.draw = function () {
                my_graphics.beginFill(this.colour);
                my_graphics.drawCircle(this.origin_x, this.origin_y, this.radius);
            };
            return circle
        },

        create_line: function (origin_x, origin_y, end_x, end_y, colour) {
            var line = this.create_basic_object(origin_x, origin_y, end_x, end_y, colour);
            line.draw = function () {
                my_graphics.lineStyle(this.colour);
                my_graphics.moveTo(this.origin_x, this.origin_y);
                my_graphics.lineTo(this.end_x, this.end_y);
                stage.addChild(my_graphics);
            };
            return line;
        },

        start: function () {
            renderer = PIXI.autoDetectRenderer($(document).width(), $(document).height(), {antialias: true, transparent: false, resolution: 1});
            document.body.appendChild(renderer.view);

            stage = new PIXI.Container();
            my_graphics = new PIXI.Graphics();

            stage.interactive = true;
            // this.stage.on("mousedown", Draw.startRect);
            // this.stage.on("mouseup", Draw.endRect);
            renderer.autoResize = true;
            renderer.backgroundColor = 0xedd7bd;
            this.calculate_grid();
            update_methods.push(this.calculate_cursor);
            setInterval(function () {
                RenderingManager.update()
            }, 16);
        },

        update: function () {
            stage.removeChild(my_graphics);
            my_graphics.clear();
            var i;
            for (i = 0; i < update_methods.length; ++i) {
                update_methods[i]();
            }
            for (i = 0; i < permanent_objects.length; ++i) {
                permanent_objects[i].draw();
            }
            for (i = 0; i < temporary_objects.length; ++i) {
                temporary_objects[i].draw();
            }
            temporary_objects = [];
            stage.addChild(my_graphics);
            renderer.render(stage);
        },

        objects: (function () {
            return {
                add_temporary: function (obj) {
                    temporary_objects.push(obj);
                },
                add_permanent: function (obj) {
                    permanent_objects.push(obj);
                }
            };
        }())
    };
}());

$(document).ready(function () {
    RenderingManager.start();
});