/**
 *
 */
(function($){

    var visual = {};

    visual.Visualizer = function() {
        //var that = this;
        this.bufferLength  = null;
        this.dataArray = null;
        this.canvas = this;
        this.fbc_array = null;
        this.ctx = null;
        this.bar_x = null;
        this.opts = null;

        this.extend = function() {
            this.opts = $.extend(
                {},
                $.fn.visualizer.defaults,
                this.opts);
        };

        this.init = function() {
            this.extend();
            this.bufferLength = this.opts.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            this.opts.analyser.getByteTimeDomainData(this.dataArray);
            this.canvas = this.$.get(0);
            this.ctx = this.canvas.getContext('2d');
        };

        this.run = function () {
            window.requestAnimationFrame(this.run.bind(this));
            this.fbc_array = new Uint8Array(this.opts.analyser.frequencyBinCount);
            this.opts.analyser.getByteFrequencyData(this.fbc_array);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.opts.style;

            for (var i = 0; i < this.opts.count; i++)
            {
                this.bar_x = i * this.opts.x;
                this.opts.height = -(this.fbc_array[i] / this.opts.divider);
                //console.log(this.opts.height);
                //  fillRect( x, y, width, height ) // Explanation of the parameters below
                this.ctx.fillRect(this.bar_x, this.canvas.height, this.opts.width, this.opts.height);
            }
        };
    };

    $.fn.visualizer = function (opts) {
        return this.each(
            function() {
                var v = new visual.Visualizer();
                    v.opts = opts;
                    v.$ = $(this);
                    v.init();
                    v.run();
            }
        )
    };

    $.fn.visualizer.defaults = {
        count: 200,
        style : '#00CCFF',
        width : 2,
        height : 0,
        x : 3,
        divider: 2,
        analyser: null
    };


}(jQuery));
