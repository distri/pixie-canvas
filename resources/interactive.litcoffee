Interactive Documentation
=========================

Docco is great for documentation, but what is even greater is being able to interact with the systems in context. So let's do that.

In order to do that we need to be able to create an editor. The code is the initial contents of the editor and the destination is what element we should append it to.

    createEditor = (code, destination) ->
      exampleSection = $ "<li>",
        class: "example"

      annotationElement = $ "<div>",
        class: "annotation"

      editorElement = $ "<textarea>",
        class: "annotation"
        text: code

      contentElement = $ "<div>",
        class: "content"

      runtimeElement = $ "<canvas width=400 height=200>"

      contentElement.append(runtimeElement)

      annotationElement.append(editorElement)
      exampleSection.append(annotationElement)
      exampleSection.append(contentElement)

      destination.after(exampleSection)

      bindUpdates(editorElement, runtimeElement)

Listen to keyup events from an editor and reflect the changes in the example instantly.

    bindUpdates = (editorElement, canvasElement) ->
      canvas = canvasElement.pixieCanvas()

      editorElement.on "keyup", ->
        report = ErrorReporter(editorElement)
        source = editorElement.val()

        try
          code = CoffeeScript.compile(source)

          try
            canvas.clear()
            eval(code)
            report.clear()
          catch e
            report(e)
        catch e
          report(e)

Present any error encountered to the user.

    ErrorReporter = (editor) ->
      reporter = (error) ->

Right now we're logging, but we should really display it right next to the editor area.

        if editor.next().is("p.error")
          editor.next().text(error)
        else
          errorParagraph = $ "<p>",
            class: "error"
            text: error.toString()

          editor.after(errorParagraph)

      reporter.clear = ->
        if editor.next().is("p.error")
          editor.next().remove()

      return reporter

The editor includes an interactive runtime so that changes in the code will be reflected in the runtime.

We're counting on any blockquoted code to be an interactive example.

    $("blockquote > pre > code").each ->

Let's move them example source into an interactive editor.

      codeElement = $(this)

      blockQuoteElement = codeElement.parent().parent()
      code = codeElement.text()

      sectionElement = blockQuoteElement.parent().parent()

      blockQuoteElement.remove()

      createEditor code, sectionElement

And have a live updating visual display component.

Auto adjust the hegiht of the example textareas.

    $('#container').on('keyup', 'textarea', ->
        $(this).height 0
        $(this).height @scrollHeight
    ).find('textarea').keyup()
