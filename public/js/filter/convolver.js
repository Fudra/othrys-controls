function Convolver (ctx) {

    this.ctx = ctx;
    var that = this;

    this.convolver = this.ctx.createConvolver();
    this.noiseBuffer = this.ctx.createBuffer(2, 0.5 * this.ctx.sampleRate, this.ctx.sampleRate);
    this.left = this.noiseBuffer.getChannelData(0);
    this.right = this.noiseBuffer.getChannelData(1);

    for (var i = 0; i < this.noiseBuffer.length; i++) {
        this.left[i] = Math.random() * 2 - 1;
        this.right[i] = Math.random() * 2 - 1;
    }

    this.convolver.buffer = this.noiseBuffer;
    return this.convolver;
}


//var effect = (function() {
//    var convolver = audioContext.createConvolver(),
//        noiseBuffer = audioContext.createBuffer(2, 0.5 * audioContext.sampleRate, audioContext.sampleRate),
//        left = noiseBuffer.getChannelData(0),
//        right = noiseBuffer.getChannelData(1);
//    for (var i = 0; i < noiseBuffer.length; i++) {
//        left[i] = Math.random() * 2 - 1;
//        right[i] = Math.random() * 2 - 1;
//    }
//    convolver.buffer = noiseBuffer;
//    return convolver;
//})();