export default class CaretPosition {
  static setCaretPosition($el, caretPos) {
    if ($el.createTextRange) {
      const range = $el.createTextRange();
      range.move('character', caretPos);
      range.select();
    }
    else {
      if ($el.selectionStart) {
        $el.focus();
        $el.setSelectionRange(caretPos, caretPos);
      }
      else
        $el.focus();
    }
  }
}