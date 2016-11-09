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
        get_graphics: function () {
            return my_graphics;
        },
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
            var circle = Entities.create_circle(cursor_location.x, cursor_location.y, 20, 0x7d8e4d);
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
                obj = Entities.create_line(offset, 0, offset, height, 0xd18659);
                this.objects.add_permanent(obj);
            }
            for (i = 0; i < no_squares_vertical; ++i) {
                offset = i * grid_spacing;
                obj = Entities.create_line(0, offset, width, offset, 0xd18659);
                this.objects.add_permanent(obj);
            }
        },

        start: function () {
            renderer = PIXI.autoDetectRenderer($(document).width(), $(document).height(), {antialias: true, transparent: false, resolution: 1});
            renderer.autoResize = true;
            renderer.backgroundColor = 0xedd7bd;
            document.body.appendChild(renderer.view);
            stage = new PIXI.Container();
            stage.interactive = true;
            stage.on("mousedown", this.draw_square.start_draw);
            stage.on("mouseup", this.draw_square.end_draw);
            my_graphics = new PIXI.Graphics();
            stage.addChild(my_graphics);

            Entities.load();

            this.calculate_grid();
            update_methods.push(this.calculate_cursor);
            update_methods.push(this.draw_square.update_draw);
            setInterval(function () {
                RenderingManager.update()
            }, 16);
        },

        draw_square: (function () {
            var drawing = false;
            var origin_x, origin_y, end_x, end_y;
            var rect;

            return {
                update_draw: function () {
                    if (drawing) {
                        var mouse = RenderingManager.get_snapped_mouse();
                        end_x = mouse.x;
                        end_y = mouse.y;
                        rect = Entities.create_rectangle(origin_x, origin_y, end_x, end_y, 0xd18659);
                        RenderingManager.objects.add_temporary(rect);
                    }
                },
                end_draw: function () {
                    drawing = false;
                    rect = Entities.create_rectangle(origin_x, origin_y, end_x, end_y, 0xd18659);
                    RenderingManager.objects.add_permanent(rect);
                },
                start_draw: function () {
                    drawing = true;
                    var mouse = RenderingManager.get_snapped_mouse();
                    origin_x = mouse.x;
                    origin_y = mouse.y;
                }
            };
        }()),

        update: function () {
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
            renderer.render(stage);
            temporary_objects = [];
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