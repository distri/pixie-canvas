(function() {
  var TAU,
    __slice = [].slice;

  TAU = 2 * Math.PI;

  module.exports = function(options) {
    var canvas, canvasAttrAccessor, context, contextAttrAccessor, self;
    if (options == null) {
      options = {};
    }
    defaults(options, {
      width: 400,
      height: 400,
      init: function() {}
    });
    canvas = document.createElement("canvas");
    canvas.width = options.width;
    canvas.height = options.height;
    context = void 0;
    self = {
      clear: function(_arg) {
        var height, width, x, y, _ref;
        _ref = _arg != null ? _arg : {}, x = _ref.x, y = _ref.y, width = _ref.width, height = _ref.height;
        if (x == null) {
          x = 0;
        }
        if (y == null) {
          y = 0;
        }
        if (width == null) {
          width = canvas.width;
        }
        if (height == null) {
          height = canvas.height;
        }
        context.clearRect(x, y, width, height);
        return this;
      },
      fill: function(color) {
        var bounds, height, width, x, y, _ref;
        if (color == null) {
          color = {};
        }
        if (!((typeof color === "string") || color.channels)) {
          _ref = color, x = _ref.x, y = _ref.y, width = _ref.width, height = _ref.height, bounds = _ref.bounds, color = _ref.color;
        }
        if (bounds) {
          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;
        }
        x || (x = 0);
        y || (y = 0);
        if (width == null) {
          width = canvas.width;
        }
        if (height == null) {
          height = canvas.height;
        }
        this.fillColor(color);
        context.fillRect(x, y, width, height);
        return this;
      },
      drawImage: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        context.drawImage.apply(context, args);
        return this;
      },
      drawCircle: function(_arg) {
        var circle, color, position, radius, stroke, x, y;
        x = _arg.x, y = _arg.y, radius = _arg.radius, position = _arg.position, color = _arg.color, stroke = _arg.stroke, circle = _arg.circle;
        if (circle) {
          x = circle.x, y = circle.y, radius = circle.radius;
        }
        if (position) {
          x = position.x, y = position.y;
        }
        if (radius < 0) {
          radius = 0;
        }
        context.beginPath();
        context.arc(x, y, radius, 0, TAU, true);
        context.closePath();
        if (color) {
          this.fillColor(color);
          context.fill();
        }
        if (stroke) {
          this.strokeColor(stroke.color);
          this.lineWidth(stroke.width);
          context.stroke();
        }
        return this;
      },
      drawRect: function(_arg) {
        var bounds, color, height, position, stroke, width, x, y;
        x = _arg.x, y = _arg.y, width = _arg.width, height = _arg.height, position = _arg.position, bounds = _arg.bounds, color = _arg.color, stroke = _arg.stroke;
        if (bounds) {
          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;
        }
        if (position) {
          x = position.x, y = position.y;
        }
        if (color) {
          this.fillColor(color);
          context.fillRect(x, y, width, height);
        }
        if (stroke) {
          this.strokeColor(stroke.color);
          this.lineWidth(stroke.width);
          context.strokeRect(x, y, width, height);
        }
        return this;
      },
      drawLine: function(_arg) {
        var color, direction, end, length, start, width;
        start = _arg.start, end = _arg.end, width = _arg.width, color = _arg.color, direction = _arg.direction, length = _arg.length;
        width || (width = 3);
        if (direction) {
          end = direction.norm(length).add(start);
        }
        this.lineWidth(width);
        this.strokeColor(color);
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.closePath();
        context.stroke();
        return this;
      },
      drawPoly: function(_arg) {
        var color, points, stroke;
        points = _arg.points, color = _arg.color, stroke = _arg.stroke;
        context.beginPath();
        points.forEach(function(point, i) {
          if (i === 0) {
            return context.moveTo(point.x, point.y);
          } else {
            return context.lineTo(point.x, point.y);
          }
        });
        context.lineTo(points[0].x, points[0].y);
        if (color) {
          this.fillColor(color);
          context.fill();
        }
        if (stroke) {
          this.strokeColor(stroke.color);
          this.lineWidth(stroke.width);
          context.stroke();
        }
        return this;
      },
      drawRoundRect: function(_arg) {
        var bounds, color, height, position, radius, stroke, width, x, y;
        x = _arg.x, y = _arg.y, width = _arg.width, height = _arg.height, radius = _arg.radius, position = _arg.position, bounds = _arg.bounds, color = _arg.color, stroke = _arg.stroke;
        if (radius == null) {
          radius = 5;
        }
        if (bounds) {
          x = bounds.x, y = bounds.y, width = bounds.width, height = bounds.height;
        }
        if (position) {
          x = position.x, y = position.y;
        }
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
        if (color) {
          this.fillColor(color);
          context.fill();
        }
        if (stroke) {
          this.lineWidth(stroke.width);
          this.strokeColor(stroke.color);
          context.stroke();
        }
        return this;
      },
      drawText: function(_arg) {
        var color, font, position, text, x, y;
        x = _arg.x, y = _arg.y, text = _arg.text, position = _arg.position, color = _arg.color, font = _arg.font;
        if (position) {
          x = position.x, y = position.y;
        }
        this.fillColor(color);
        if (font) {
          this.font(font);
        }
        context.fillText(text, x, y);
        return this;
      },
      centerText: function(_arg) {
        var color, font, position, text, textWidth, x, y;
        text = _arg.text, x = _arg.x, y = _arg.y, position = _arg.position, color = _arg.color, font = _arg.font;
        if (position) {
          x = position.x, y = position.y;
        }
        if (x == null) {
          x = canvas.width / 2;
        }
        textWidth = this.measureText(text);
        return this.drawText({
          text: text,
          color: color,
          font: font,
          x: x - textWidth / 2,
          y: y
        });
      },
      fillColor: function(color) {
        if (color) {
          if (color.channels) {
            context.fillStyle = color.toString();
          } else {
            context.fillStyle = color;
          }
          return this;
        } else {
          return context.fillStyle;
        }
      },
      strokeColor: function(color) {
        if (color) {
          if (color.channels) {
            context.strokeStyle = color.toString();
          } else {
            context.strokeStyle = color;
          }
          return this;
        } else {
          return context.strokeStyle;
        }
      },
      measureText: function(text) {
        return context.measureText(text).width;
      },
      withTransform: function(matrix, block) {
        context.save();
        context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        try {
          block(this);
        } finally {
          context.restore();
        }
        return this;
      },
      putImageData: function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        context.putImageData.apply(context, args);
        return this;
      },
      context: function() {
        return context;
      },
      element: function() {
        return canvas;
      },
      createPattern: function(image, repitition) {
        return context.createPattern(image, repitition);
      },
      clip: function(x, y, width, height) {
        context.beginPath();
        context.rect(x, y, width, height);
        context.clip();
        return this;
      }
    };
    contextAttrAccessor = function() {
      var attrs;
      attrs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return attrs.forEach(function(attr) {
        return self[attr] = function(newVal) {
          if (newVal != null) {
            context[attr] = newVal;
            return this;
          } else {
            return context[attr];
          }
        };
      });
    };
    contextAttrAccessor("font", "globalAlpha", "globalCompositeOperation", "lineWidth", "textAlign");
    canvasAttrAccessor = function() {
      var attrs;
      attrs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return attrs.forEach(function(attr) {
        return self[attr] = function(newVal) {
          if (newVal != null) {
            canvas[attr] = newVal;
            return this;
          } else {
            return canvas[attr];
          }
        };
      });
    };
    canvasAttrAccessor("height", "width");
    context = canvas.getContext('2d');
    options.init(self);
    return self;
  };

}).call(this);
