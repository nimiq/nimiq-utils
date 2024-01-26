declare class Tweenable {
    targetValue: number;
    startValue: number;
    tweenTime: number;
    startTime: number;
    easing: (progress: number) => number;
    constructor(targetValue?: number, startValue?: number, tweenTime?: number, startTime?: number, easing?: (progress: number) => number);
    get currentValue(): number;
    get progress(): number;
    get finished(): boolean;
    tweenTo(targetValue: number, tweenTime?: number): void;
}
declare namespace Tweenable {
    const Easing: {
        LINEAR: (t: number) => number;
        EASE_IN_OUT_CUBIC: (t: number) => number;
    };
}
export default Tweenable;
