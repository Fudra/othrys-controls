
$(function() {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();

    var eq1 = new Equilizer(ctx, '#sound1', 'sound1');
    eq1.init();

    var eq2 = new Equilizer(ctx, '#sound2', 'sound2');
    eq2.init();

    var cf = new Crossfade(ctx,'main', -100, eq1.output, eq2.output);
    cf.init();

    var main = new Mainmodule(ctx, 'main');
    main.init(cf.output);

    main.output.connect(ctx.destination);

});

//var ctx = new AudioContext();
//
//var source = ctx.createBufferSource();
//var gain = ctx.createGain();
//var oscillator = ctx.createOscillator();
//
//
//source.connect(gain);
//gain.connect(ctx.destination);
//
//gain.gain.value = 1;
////
////oscillator.connect(ctx.destination);
//
//
//oscillator.type = 'square';
//oscillator.frequency.value = 3000; // value in hertz
//oscillator.start();
//
//function playSound(url) {
//    var request = new XMLHttpRequest();
//    request.open('GET', url, true);
//    request.responseType = 'arraybuffer';
//
//    request.onload = function() {
//        ctx.decodeAudioData(request.response, function(buffer) {
//            //soundBuffer = buffer;
//
//            console.log(buffer);
//            source.buffer = buffer; // ctx.createBuffer(2, buffer.length, 44100);
//
//
//            source.start();
//            console.log("play", source);
//            step();
//        });
//
//    };
//    request.send();
//}
//
//
//
//
//function step() {
//    console.log(source.context.currentTime);
//    window.requestAnimationFrame(step);
//
//}
//
//
//Dropzone.options.sound = {
//    init: function() {
//        //thisDropzone = this;
//        this.on("success", function (file, responseText) {
//            //var responseText = responseText.globalPath; // or however you would point to your assigned file ID here;
//            var url = responseText.file.globalPath;
//            console.log(url);
//            playSound(url);
//        })
//    }
//};
//
//$('#sound-1-gain-gain').knob();