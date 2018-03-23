export default class Clipboard {
    static copy(text) {
        // A <span> contains the text to copy
        var span = document.createElement('span')
        span.textContent = text
        span.style.whiteSpace = 'pre' // Preserve consecutive spaces and newlines

        // Paint the span outside the viewport
        span.style.position = 'absolute';
        span.style.left = '-9999px';
        span.style.top = '-9999px';

        var win = window
        var selection = win.getSelection()
        win.document.body.appendChild(span)

        var range = win.document.createRange()
        selection.removeAllRanges()
        range.selectNode(span)
        selection.addRange(range)

        var success = false
        try {
            success = win.document.execCommand('copy')
        } catch (err) {}

        selection.removeAllRanges()
        span.remove()

        return success
    }
}
