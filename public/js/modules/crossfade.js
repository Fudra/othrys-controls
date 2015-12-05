
/**
 *  A crossfade moduke
 *
 * @param ctx the AudioContext
 * @param id the id of the main control
 * @param initGain the gain of the crossfade [-1, 1 ]
 *              -1 represents that src1 is fully present
 *               1 represents that src2 is fully present
 * @param src1 the source of the sound
 * @param src2 the source of the sound
 */

function crossfade(ctx, id, initGain, src1, src2) {
        // create gain for src1 and scr2
    this.gain1 = ctx.createGain();
    this.gain2 = ctx.createGain();

    this.src1 = src1;
    this.src2 = src2;

    this.id = id;
    this.initGain = initGain;

    this.init = function() {

        this.connect();
        this.ui();
        this.update();

    };

    this.connect = function() {

    };

    this.update = function() {

    };

    this.ui = function() {

    };


}
