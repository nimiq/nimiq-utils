export default class KeyboardHandler {
    static setDefaultTarget(target, sanitize) {
        if (KeyboardHandler.listener !== undefined)
            window.removeEventListener('keypress', KeyboardHandler.listener);

        KeyboardHandler.listener = KeyboardHandler._listen.bind(target);
        KeyboardHandler.sanitize = sanitize;
        window.addEventListener('keypress', KeyboardHandler.listener)
    }

    static _listen(e) {
        const input = e.key;
        const activeElement = document.activeElement && document.activeElement.className;
        const isInInput = activeElement === 'input' || activeElement === 'textarea';
        if (isInInput) return;  // We are interested in the case were we're NOT in an input yet
        e.preventDefault();
        e.stopPropagation();
        this.value = KeyboardHandler.sanitize(this.value + input);
        this.focus();
    }
}