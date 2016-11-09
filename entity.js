/**
 * Created by Sam on 09/11/2016.
 */
var Entities = (function () {
    var graphics;

    function create_base_entity(origin_x, origin_y, end_x, end_y, colour, draw_func) {
        return {
            origin_x: origin_x,
            origin_y: origin_y,
            end_x: end_x,
            end_y: end_y,
            colour: colour,
            draw: draw_func
        };
    }

    return {
        create_circle: function (origin_x, origin_y, radius, colour) {
            var circle = create_base_entity(origin_x, origin_y, 0, 0, colour, function () {
                graphics.beginFill(this.colour);
                graphics.drawCircle(this.origin_x, this.origin_y, this.radius);
                graphics.endFill();
            });
            circle.radius = radius;
            return circle;
        },
        create_rectangle: function (origin_x, origin_y, end_x, end_y, colour) {
            return create_base_entity(origin_x, origin_y, end_x, end_y, colour, function () {
                graphics.beginFill(this.colour);
                graphics.drawRect(origin_x, origin_y, end_x - origin_x, end_y - origin_y);
                graphics.endFill();
            });
        },
        create_line: function (origin_x, origin_y, end_x, end_y, colour) {
            return create_base_entity(origin_x, origin_y, end_x, end_y, colour, function () {
                graphics.lineStyle(1, this.colour);
                graphics.moveTo(this.origin_x, this.origin_y);
                graphics.lineTo(this.end_x, this.end_y);
                graphics.endFill();
            });
        },
        load: function () {
            graphics = RenderingManager.get_graphics();
        }
    }
}());
