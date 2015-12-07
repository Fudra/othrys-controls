
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

function Crossfade(ctx, id, initGain, src1, src2) {


    var that = this;

    this.ctx = ctx;
    this.gain1 = this.ctx.createGain();
    this.gain2 = this.ctx.createGain();

    this.merger = this.ctx.createChannelMerger(2);

    this.src1 = src1;
    this.src2 = src2;

    this.id = id;
    this.initGain = initGain;


    this.output = null;

    this.init = function() {

        this.fade(this.initGain);
        this.config();
        this.connect();
        this.ui();
        this.update();

    };

    this.config = function() {

        this.opts = {
            fade:  {
                gain1 : 0,
                gain2 : 0
            }
        }
    };

    this.connect = function() {
        this.src1.connect(this.gain1);
        this.src2.connect(this.gain2);
        this.gain1.connect(this.merger, 0, 0);
        this.gain2.connect(this.merger, 0, 1);

        this.output = this.merger;
    };

    this.update = function() {
        this.gain1.gain.value = this.opts.fade.gain1;
        this.gain2.gain.value = this.opts.fade.gain2;
    };

    this.ui = function() {

        this.$gain = $('#' + this.id + '-crossfade');

        this.$gain.knob({
            min : -100,
            max : 100,
            step: 1,

            change: gain_crossfade,
            release: gain_crossfade
        });

        function gain_crossfade(value) {
            that.fade(value);
            that.update();
        }
    };

    this.fade = function(value) {
            // value  between -100 und 100

        var v = (value + 100) / 2;

        var x = v / 100;

        //  Use an equal-power crossfading curve:
        var gain1 = Math.cos(x * 0.5 * Math.PI);
        var gain2 = Math.cos((1.0 - x) * 0.5 * Math.PI);

        this.opts.fade.gain1 = gain1;
        this.opts.fade.gain2 = gain2;

    };


}
