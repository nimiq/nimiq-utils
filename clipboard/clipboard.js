export default class Clipboard {
    static copy(text) {
        // A <span> contains the text to copy
        var span = document.createElement('span')
        span.textContent = text
        span.style.whiteSpace = 'pre' // Preserve consecutive spaces and newlines

        // An <iframe> isolates the <span> from the page's styles
        var iframe = document.createElement('iframe')
        iframe.sandbox = 'allow-same-origin'
        document.body.appendChild(iframe)

        var win = iframe.contentWindow
        win.document.body.appendChild(span)

        var selection = win.getSelection()

        // Firefox fails to get a selection from <iframe> window, so fallback
        if (!selection) {
            win = window
            selection = win.getSelection()
            document.body.appendChild(span)
        }

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
        iframe.remove()

        return success
    }

    // from: https://dzone.com/articles/cross-browser-javascript-copy-and-paste 
    // static paste($el) {
    //     this._initPaste();
    //     this._waitForPaste($el);
    // }

    // static _waitForPaste($el) {
    //     this._textArea.select();
    //     if (!this._systemPasteReady) {
    //         setTimeout(e => this._waitForPaste($el), 250);
    //         return;
    //     }
    //     $el.value = this._systemPasteContent;
    //     this._systemPasteReady = false;
    // }

    // static _initPaste() {
    //     // FireFox requires at least one editable
    //     // element on the screen for the paste event to fire
    //     const textArea = document.createElement('textarea');
    //     textArea.setAttribute('style', 'width:1px;border:0;opacity:0;position:absolute;');
    //     document.body.appendChild(textArea);
    //     this._textArea = textArea;
    //     this._initialized = true;
    //     window.addEventListener('paste', e => this._onSystemPaste(e));
    // }

    // static _onSystemPaste(e) {
    //     this._systemPasteContent = e.clipboardData.getData('text/plain');
    //     this._systemPasteReady = true;
    //     e.preventDefault();
    // }
}

// Todo: Add paste api