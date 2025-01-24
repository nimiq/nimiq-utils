/* eslint-disable max-len */

/**
 * Adapted `exp_by_squaring_iterative` from
 * https://en.wikipedia.org/w/index.php?title=Exponentiation_by_squaring&amp%3Boldid=1229001691&useskin=vector#With_constant_auxiliary_memory
 *
 * The Rust implementation is also using this algorithm to guarantee the same result on different platforms.
 */
export function powi(x: number, n: number): number {
    if (n < 0) {
        x = 1 / x;
        n *= -1;
    }
    if (!n) return 1;
    let y = 1;
    while (n > 1) {
        if (n % 2) {
            y *= x;
            n -= 1;
        }
        x *= x;
        n /= 2;
    }
    return x * y;
}
