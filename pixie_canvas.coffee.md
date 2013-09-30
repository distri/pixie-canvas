Pixie Canvas
============

PixieCanvas provides a convenient wrapper for working with Context2d.

Methods try to be as flexible as possible as to what arguments they take.

Non-getter methods return `this` for method chaining.

    ( ($) ->

Polyfill some dependencies. TODO: Probably eliminate these if possible.

      @Point = (x, y) ->
        x: x
        y: y

      Number::clamp = (min, max) ->
        Math.min(Math.max(min, this), max)

      Math.TAU = 2 * Math.PI

      $.fn.pixieCanvas = (options={}) ->
        canvas = this.get(0)
        context = undefined

        $canvas = $.extend $(canvas),


`clear` clears the entire canvas (or a portion of it).

To clear the entire canvas use `canvas.clear()`

>     #! paint
>     # Set up: Fill canvas with blue
>     canvas.fill("blue")
>
>     # Clear a portion of the canvas
>     canvas.clear
>       x: 50
>       y: 50
>       width: 50
>       height: 50

          clear: ({x, y, width, height}={}) ->
            x ?= 0
            y ?= 0
            width = canvas.width unless width?
            height = canvas.height unless height?

            context.clearRect(x, y, width, height)

            return this

Fills the entire canvas (or a specified section of it) with
the given color.

>     #! paint
>     # Paint the town (entire canvas) red
>     canvas.fill "red"
>
>     # Fill a section of the canvas white (#FFF)
>     canvas.fill
>       x: 50
>       y: 50
>       width: 50
>       height: 50
>       color: "#FFF"

          fill: (color={}) ->
            unless (typeof color is "string") or color.channels
              {x, y, width, height, bounds, color} = color

            {x, y, width, height} = bounds if bounds

            x ||= 0
            y ||= 0
            width = canvas.width unless width?
            height = canvas.height unless height?

            @fillColor(color)
            context.fillRect(x, y, width, height)

            return this

A direct map to the Context2d draw image. `GameObject`s
that implement drawable will have this wrapped up nicely,
so there is a good chance that you will not have to deal with
it directly.

>     #! paint
>     $ "<img>",
>       src: "https://secure.gravatar.com/avatar/33117162fff8a9cf50544a604f60c045"
>       load: ->
>         canvas.drawImage(this, 25, 25)

          drawImage: (args...) ->
            context.drawImage(args...)

            return this

Draws a circle at the specified position with the specified
radius and color.

>     #! paint
>     # Draw a large orange circle
>     canvas.drawCircle
>       radius: 30
>       position: Point(100, 75)
>       color: "orange"
>
>     # You may also set a stroke
>     canvas.drawCircle
>       x: 25
>       y: 50
>       radius: 10
>       color: "blue"
>       stroke:
>         color: "red"
>         width: 1

You can pass in circle objects as well.

>     #! paint
>     # Create a circle object to set up the next examples
>     circle =
>       radius: 20
>       x: 50
>       y: 50
>
>     # Draw a given circle in yellow
>     canvas.drawCircle
>       circle: circle
>       color: "yellow"
>
>     # Draw the circle in green at a different position
>     canvas.drawCircle
>       circle: circle
>       position: Point(25, 75)
>       color: "green"

You may set a stroke, or even pass in only a stroke to draw an unfilled circle.

>     #! paint
>     # Draw an outline circle in purple.
>     canvas.drawCircle
>       x: 50
>       y: 75
>       radius: 10
>       stroke:
>         color: "purple"
>         width: 2
>

          drawCircle: ({x, y, radius, position, color, stroke, circle}) ->
            {x, y, radius} = circle if circle
            {x, y} = position if position

            radius = radius.clamp(0, Infinity)

            context.beginPath()
            context.arc(x, y, radius, 0, Math.TAU, true)
            context.closePath()

            if color
              @fillColor(color)
              context.fill()

            if stroke
              @strokeColor(stroke.color)
              @lineWidth(stroke.width)
              context.stroke()

            return this

Draws a rectangle at the specified position with given
width and height. Optionally takes a position, bounds
and color argument.

>     #! paint
>     # Draw a red rectangle using x, y, width and height
>     canvas.drawRect
>       x: 50
>       y: 50
>       width: 50
>       height: 50
>       color: "#F00"

----

You can mix and match position, witdth and height.

>     #! paint
>     canvas.drawRect
>       position: Point(0, 0)
>       width: 50
>       height: 50
>       color: "blue"
>       stroke:
>         color: "orange"
>         width: 3

----

A bounds can be reused to draw multiple rectangles.

>     #! paint
>     bounds =
>       x: 100
>       y: 0
>       width: 100
>       height: 100
>
>     # Draw a purple rectangle using bounds
>     canvas.drawRect
>       bounds: bounds
>       color: "green"
>
>     # Draw the outline of the same bounds, but at a different position
>     canvas.drawRect
>       bounds: bounds
>       position: Point(0, 50)
>       stroke:
>         color: "purple"
>         width: 2

          drawRect: ({x, y, width, height, position, bounds, color, stroke}) ->
            {x, y, width, height} = bounds if bounds
            {x, y} = position if position

            if color
              @fillColor(color)
              context.fillRect(x, y, width, height)

            if stroke
              @strokeColor(stroke.color)
              @lineWidth(stroke.width)
              context.strokeRect(x, y, width, height)

            return @

Draw a line from `start` to `end`.

>     #! paint
>     # Draw a sweet diagonal
>     canvas.drawLine
>       start: Point(0, 0)
>       end: Point(200, 200)
>       color: "purple"
>
>     # Draw another sweet diagonal
>     canvas.drawLine
>       start: Point(200, 0)
>       end: Point(0, 200)
>       color: "red"
>       width: 6
>
>     # Now draw a sweet horizontal with a direction and a length
>     canvas.drawLine
>       start: Point(0, 100)
>       length: 200
>       direction: Point(1, 0)
>       color: "orange"

          drawLine: ({start, end, width, color, direction, length}) ->
            width ||= 3

            if direction
              end = direction.norm(length).add(start)

            @lineWidth(width)
            @strokeColor(color)

            context.beginPath()
            context.moveTo(start.x, start.y)
            context.lineTo(end.x, end.y)
            context.closePath()
            context.stroke()

            return this

Draw a polygon.

>     #! paint
>     # Draw a sweet rhombus
>     canvas.drawPoly
>       points: [
>         Point(50, 25)
>         Point(75, 50)
>         Point(50, 75)
>         Point(25, 50)
>       ]
>       color: "purple"
>       stroke:
>         color: "red"
>         width: 2

          drawPoly: ({points, color, stroke}) ->
            context.beginPath()
            points.forEach (point, i) ->
              if i == 0
                context.moveTo(point.x, point.y)
              else
                context.lineTo(point.x, point.y)
            context.lineTo points[0].x, points[0].y

            if color
              @fillColor(color)
              context.fill()

            if stroke
              @strokeColor(stroke.color)
              @lineWidth(stroke.width)
              context.stroke()

            return @

Draw a rounded rectangle.

Adapted from http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html

>     #! paint
>     # Draw a purple rounded rectangle with a red outline
>     canvas.drawRoundRect
>       position: Point(25, 25)
>       radius: 10
>       width: 150
>       height: 100
>       color: "purple"
>       stroke:
>         color: "red"
>         width: 2

          drawRoundRect: ({x, y, width, height, radius, position, bounds, color, stroke}) ->
            radius = 5 unless radius?

            {x, y, width, height} = bounds if bounds
            {x, y} = position if position

            context.beginPath()
            context.moveTo(x + radius, y)
            context.lineTo(x + width - radius, y)
            context.quadraticCurveTo(x + width, y, x + width, y + radius)
            context.lineTo(x + width, y + height - radius)
            context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
            context.lineTo(x + radius, y + height)
            context.quadraticCurveTo(x, y + height, x, y + height - radius)
            context.lineTo(x, y + radius)
            context.quadraticCurveTo(x, y, x + radius, y)
            context.closePath()

            if color
              @fillColor(color)
              context.fill()

            if stroke
              @lineWidth(stroke.width)
              @strokeColor(stroke.color)
              context.stroke()

            return this

Draws text on the canvas at the given position, in the given color.
If no color is given then the previous fill color is used.

>     #! paint
>     # Fill canvas to indicate bounds
>     canvas.fill
>       color: '#eee'
>
>     # A line to indicate the baseline
>     canvas.drawLine
>       start: Point(25, 50)
>       end: Point(125, 50)
>       color: "#333"
>       width: 1
>
>     # Draw some text, note the position of the baseline
>     canvas.drawText
>       position: Point(25, 50)
>       color: "red"
>       text: "It's dangerous to go alone"


          drawText: ({x, y, text, position, color, font}) ->
            {x, y} = position if position

            @fillColor(color)
            @font(font) if font
            context.fillText(text, x, y)

            return this

Centers the given text on the canvas at the given y position. An x position
or point position can also be given in which case the text is centered at the
x, y or position value specified.

>     #! paint
>     # Fill canvas to indicate bounds
>     canvas.fill
>       color: "#eee"
>
>     # A line to indicate the baseline
>     canvas.drawLine
>       start: Point(25, 25)
>       end: Point(125, 25)
>       color: "#333"
>       width: 1
>
>     # Center text on the screen at y value 25
>     canvas.centerText
>       y: 25
>       color: "red"
>       text: "It's dangerous to go alone"
>
>     # Center text at point (75, 75)
>     canvas.centerText
>       position: Point(75, 75)
>       color: "green"
>       text: "take this"

          centerText: ({text, x, y, position, color, font}) ->
            {x, y} = position if position

            x = canvas.width / 2 unless x?

            textWidth = @measureText(text)

            @drawText {
              text
              color
              font
              x: x - (textWidth) / 2
              y
            }

Setting the fill color:

`canvas.fillColor("#FF0000")`

Passing no arguments returns the fillColor:

`canvas.fillColor() # => "#FF000000"`

You can also pass a Color object:

`canvas.fillColor(Color('sky blue'))`

          fillColor: (color) ->
            if color
              if color.channels
                context.fillStyle = color.toString()
              else
                context.fillStyle = color

              return @
            else
              return context.fillStyle

Setting the stroke color:

`canvas.strokeColor("#FF0000")`

Passing no arguments returns the strokeColor:

`canvas.strokeColor() # => "#FF0000"`

You can also pass a Color object:

`canvas.strokeColor(Color('sky blue'))`

          strokeColor: (color) ->
            if color
              if color.channels
                context.strokeStyle = color.toString()
              else
                context.strokeStyle = color

              return this
            else
              return context.strokeStyle

Determine how wide some text is.

`canvas.measureText('Hello World!') # => 55`

It may have accuracy issues depending on the font used.

          measureText: (text) ->
            context.measureText(text).width

Passes this canvas to the block with the given matrix transformation
applied. All drawing methods called within the block will draw
into the canvas with the transformation applied. The transformation
is removed at the end of the block, even if the block throws an error.

          withTransform: (matrix, block) ->
            context.save()

            context.transform(
              matrix.a,
              matrix.b,
              matrix.c,
              matrix.d,
              matrix.tx,
              matrix.ty
            )

            try
              block(this)
            finally
              context.restore()

            return this

Straight proxy to context `putImageData` method.

          putImageData: (args...) ->
            context.putImageData(args...)

            return this

Context getter.

          context: ->
            context

Getter for the actual html canvas element.

          element: ->
            canvas

Straight proxy to context pattern creation.

          createPattern: (image, repitition) ->
            context.createPattern(image, repitition)

Set a clip rectangle.

          clip: (x, y, width, height) ->
            context.beginPath()
            context.rect(x, y, width, height)
            context.clip()

            return this

Generate accessors that get properties from the context object.

        contextAttrAccessor = (attrs...) ->
          attrs.forEach (attr) ->
            $canvas[attr] = (newVal) ->
              if newVal?
                context[attr] = newVal
                return @
              else
                context[attr]

        contextAttrAccessor(
          "font",
          "globalAlpha",
          "globalCompositeOperation",
          "lineWidth",
          "textAlign",
        )

Generate accessors that get properties from the canvas object.

        canvasAttrAccessor = (attrs...) ->
          attrs.forEach (attr) ->
            $canvas[attr] = (newVal) ->
              if newVal?
                canvas[attr] = newVal
                return @
              else
                canvas[attr]

        canvasAttrAccessor(
          "height",
          "width",
        )

        if canvas?.getContext
          context = canvas.getContext('2d')

          if options.init
            options.init($canvas)

          return $canvas

Depend on either jQuery or Zepto for now (TODO: Don't depend on either)

    )(jQuery ? Zepto)


Interactive Examples
--------------------

>     #! setup
>     Interactive.register "paint", ({source, runtimeElement}) ->
>       canvasElement = $ "<canvas width=400 height=200>"
>       code = CoffeeScript.compile(source)
> 
>       runtimeElement.empty().append canvasElement
>       Function(canvas, code)(canvasElement.pixieCanvas())
