// Not sure if we still need this one, I'll leave it for now
export default class PasteHandler {
    static listener: EventListener;

    static setDefaultTarget(target: HTMLElement) {
        if (PasteHandler.listener !== undefined) {
            window.removeEventListener('paste', PasteHandler.listener);
        }
        PasteHandler.listener = PasteHandler.createListener(target);
        window.addEventListener('paste', PasteHandler.listener);
    }

    static createListener(target: HTMLElement) {
        return (e: Event) => {
            const activeElement = document.activeElement && document.activeElement.className;
            const isInInput = activeElement === 'input' || activeElement === 'textarea';
            if (isInInput) return; // We are interested in the case were we're NOT in an input yet
            target.focus();
            e.stopPropagation();
        }
    }
}