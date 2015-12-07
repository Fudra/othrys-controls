function Mainmodule(ctx, id) {

    var that = this;
    that.id = id;
    this.ctx = ctx;

    this.gain = this.ctx.createGain();
    this.pan = this.ctx.createStereoPanner();


    this.init = function(src) {

        this.src = src;
        this.config();
        this.connect();
        this.ui();
        this.update();
    };

    this.config = function() {

        this.opts = {

            gain : {
                value :.50
            },
            pan : {
                value : 0
            }
        }
    };

    this.connect = function() {
        this.src.connect(this.pan);
        this.pan.connect(this.gain);
        this.output = this.gain;
    };

    this.ui = function() {
        this.$gain = $('#'+id+'-gain-gain');
        this.$pan = $('#'+id+'-pan');


        this.$gain.knob({
            min : 0,
            max : 100,
            step: 1,

            change: gain_gain,
            release: gain_gain
        });

        this.$pan.knob({
            min : -100,
            max : 100,
            step: 1,

            change: pan,
            release: pan
        });

        function gain_gain(value) {
            that.opts.gain.value = value / 100;
            that.update();
        }

        function pan(value) {
            that.opts.pan.value = value / 100;
            that.update();
        }
    };

    this.update = function() {
        this.gain.value = this.opts.gain.value;
        this.pan.value = this.opts.pan.value;
    };
}