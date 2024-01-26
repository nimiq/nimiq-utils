class Tweenable {
    targetValue;
    startValue;
    tweenTime;
    startTime;
    easing;
    constructor(targetValue = 0, startValue = targetValue, tweenTime = 0, startTime = Date.now(), easing = Tweenable.Easing.EASE_IN_OUT_CUBIC) {
        this.targetValue = targetValue;
        this.startValue = startValue;
        this.tweenTime = tweenTime;
        this.startTime = startTime;
        this.easing = easing;
    }
    get currentValue() {
        const easedProgress = this.easing(this.progress);
        return this.startValue + (this.targetValue - this.startValue) * easedProgress;
    }
    get progress() {
        if (this.tweenTime === 0)
            return 1;
        return Math.min(1, (Date.now() - this.startTime) / this.tweenTime);
    }
    get finished() {
        return this.progress === 1;
    }
    tweenTo(targetValue, tweenTime = this.tweenTime) {
        if (targetValue === this.targetValue)
            return;
        this.startValue = this.currentValue;
        this.targetValue = targetValue;
        this.startTime = Date.now();
        this.tweenTime = tweenTime;
    }
}
(function (Tweenable) {
    // see https://gist.github.com/gre/1650294 for more easing functions
    Tweenable.Easing = {
        LINEAR: (t) => t,
        EASE_IN_OUT_CUBIC: (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),
        // At some point would be nice to add the default nimiq easing function here which is cubic-bezier(.25,0,0,1)
        // (https://cubic-bezier.com/#.25,0,0,1). This is a cubic Bezier curve with P0=(0,0), P1=(.25,0),
        // P2=(0,1), P3=(1,1) (https://developer.mozilla.org/en-US/docs/Web/CSS/timing-function).
        // However, the standard bezier curve equation that can be constructed from these points as described in
        // https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B%C3%A9zier_curves generates points (x,y) of the
        // easing function depending on a parameter t which describes the advancement on the curve. However, here our
        // t denotes the advancement along the x-axis (time) and we're interested in the eased value y. Therefore the
        // equation needs to be solved for y depending on x (see https://stackoverflow.com/q/8217346). This could also
        // be done computationally as described in https://stackoverflow.com/a/11697909.
        // See http://greweb.me/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/ for a
        // summary.
    };
})(Tweenable || (Tweenable = {}));
var Tweenable$1 = Tweenable;

export { Tweenable$1 as default };
//# sourceMappingURL=Tweenable.js.map
