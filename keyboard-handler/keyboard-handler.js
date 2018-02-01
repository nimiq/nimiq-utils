export default class KeyboardHandler {
    // Set individual listener. Only one can be active at a time.
    static setGlobalListener(listener) {
        if (KeyboardHandler.listener !== undefined) KeyboardHandler.removeGlobalListener();
        KeyboardHandler.listener = listener;
        window.addEventListener('keypress', KeyboardHandler.listener);
    }

    static removeGlobalListener() {
        window.removeEventListener('keypress', KeyboardHandler.listener);
    }

    static setDefaultTarget(target) {
        KeyboardHandler.setGlobalListener(KeyboardHandler._listen.bind(target));
    }

    // For use with setDefaultTarget
    static _listen(e) {
        const input = e.key;
        if (e.keyCode === 13) return; // enter key
        const activeElement = document.activeElement && document.activeElement.className;
        const isInInput = activeElement === 'input' || activeElement === 'textarea';
        if (isInInput) return;  // We are interested in the case were we're NOT in an input yet
        e.stopPropagation();
        this.focus();
    }
}