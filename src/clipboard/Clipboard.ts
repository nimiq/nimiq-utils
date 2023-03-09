export class Clipboard {
    public static copy(text: string) {
        // Simplified and typed version of https://github.com/sindresorhus/copy-text-to-clipboard
        // Additionally added a fix for correctly restoring selections in input fields.
        const element = document.createElement('textarea');

        element.value = text;

        // Prevent keyboard from showing on mobile
        element.setAttribute('readonly', '');

        // @ts-ignore: css property contain not known to current ts version
        element.style.contain = 'strict';
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.fontSize = '12pt'; // Prevent zooming on iOS

        // store selection to be restored later
        const selection = document.getSelection()!;
        const originalRange = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

        const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

        document.body.append(element);
        element.select();

        // Explicit selection workaround for iOS
        element.selectionStart = 0;
        element.selectionEnd = text.length;

        let isSuccess = false;
        try {
            isSuccess = document.execCommand('copy');
        } catch (e) {
            // Ignore
        }

        element.remove();

        if (activeElement) {
            activeElement.focus();
        }
        if (originalRange
            && !(activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
            // We don't have to do this for inputs and textareas as they retain their selection on blur. Refocusing them
            // was enough to recover the original selection.
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }

        return isSuccess;
    }
}
