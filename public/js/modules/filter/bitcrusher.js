function Bitcrusher(ctx) {

    this.ctx = ctx;

    var that = this;

    this.output  = null;

    this.config = function () {

        this.opts =  {
            buffSize: 4096,
            bits: 4, // between 1 and 16
            normfreq : 0.1, // between 0.0 and 1.0
            phaser: 0,
            last : 0,
            step : 0,
            input: 0,
            output: 0

        }
    };

    this.init = function() {
        this.node = this.ctx.createScriptProcessor(this.opts.bufferSize, 1, 1);
        this.node.bits = this.opts.bits;
        this.node.normfreq = this.opts.normfreq;

        this.opts.step = Math.pow(1/2, this.opts.bits);

        this.config()

    };

    this.process = function() {

        this.node.onaudioprocess = function(e) {
            that.opts.input = e.inputBuffer.getChannelData(0);
            that.opts.output = e.outputBuffer.getChannelData(0);

            for(var i = 0; i< that.opts.buffSize; i++) {
                that.opts.phaser += that.node.normfreq;
                if(that.opts.phaser >= 1.0) {
                    that.opts.phaser -= 1.0;
                    that.opts.last = that.opts.step * Math.floor( that.opts.input[i] / that.opts.step + .5);
                }
                that.opts.output[i] = that.opts.last;
            }
        };

        return this.node;
    };
}
