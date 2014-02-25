Canvas = require "../pixie_canvas"

describe "pixie canvas", ->
  it "Should create a canvas", ->
    canvas = Canvas
      width: 400
      height: 150

    assert canvas

    assert canvas.width() is 400
