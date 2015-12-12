function Mainmodule(ctx, id) {

    var that = this;
    this.id = id;
    this.ctx = ctx;

    this.gain = null;
    this.pan = null;
    this.analyser = null;


    this.init = function(src) {

        this.gain = this.ctx.createGain();
        this.pan = this.ctx.createStereoPanner();
        this.analyser = this.ctx.createAnalyser();

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
        this.gain.connect(this.analyser);
        this.output = this.analyser;
    };

    this.ui = function() {

        this.$vis =  $('canvas#'+this.id);
        this.$gain = $('#'+id+'-gain-gain');
        this.$pan = $('#'+id+'-pan');


        this.$vis.visualizer({
            analyser: this.analyser,
            width : 1,
            x : 2
        });

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
        this.gain.gain.value = this.opts.gain.value;
        this.pan.value = this.opts.pan.value;
    };

    this.trigger = function () {
       this.$gain.trigger('change');
    };

}