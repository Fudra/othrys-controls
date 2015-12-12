



$(function() {





    $(window).load(function(){
        $('#preloader').fadeOut('slow',function(){$(this).remove();});
    });

    var ctx = new (window.AudioContext || window.webkitAudioContext)();



    var eq1 = new Equilizer(ctx, '#sound1', 'sound1');
    eq1.init();

    var eq2 = new Equilizer(ctx, '#sound2', 'sound2');
    eq2.init();

    var cf = new Crossfade(ctx,'main', -100, eq1.output, eq2.output);
    cf.init();

    var filter = new Bitcrusher(ctx);
    cf.output.connect(filter);


    var main = new Mainmodule(ctx, 'main');
    //main.init(cf.output);
    main.init(filter);

    main.output.connect(ctx.destination);
   // bitcrusher.connect(ctx.destination);

    //var oscillator = audioContext.createOscillator();
    //oscillator.connect(effect);
    //effect.connect(audioContext.destination);


    function midiFailure() {
        console.log('Geht nicht!');
    }

    function midiSuccess(midi)      {
        var inputs  =  midi.inputs;

        for (var input of inputs.values())
        {
            /*input.addEventListener(
             'midimessage',  midiMessage
             );      */ input.onmidimessage = midiMessage;
        }
    }

    if      (navigator.requestMIDIAccess)   {
        console.log('Test');
        navigator.requestMIDIAccess().then(
            midiSuccess,
            midiFailure
        );
    }
    else    {
        midiFailure();
    }

    function midiMessage(event)     {
        console.log(
            event.target.name,
            event.data,
            event.receivedTime);
        if(event.data[1]==48)
        {
            main.opts.gain.value = event.data[2]/127; // zwischen 0 und 1
            main.$gain.val(event.data[2]/127 * 100).trigger('change');
            //main.$gain.knob.trigger('change');
            main.update();
        }
        if(event.data[1]==49)
        {
            main.opts.pan.value = event.data[2]/63.5 - 1; // zwischen -1 und 1
            main.$pan.val((event.data[2]/63.5 - 1 )* 100).trigger('change');
            main.update();
        }
        if(event.data[1]==50)
        {
            eq1.opts.gain.value = event.data[2]/127; // zwischen 0 und 1
            eq1.$gn.val(event.data[2]/127 * 100).trigger('change');
            //main.$gain.knob.trigger('change');
            eq1.update();
        }
        if(event.data[1]==51)
        {
            eq2.opts.gain.value = event.data[2]/127; // zwischen 0 und 1
            eq2.$gn.val(event.data[2]/127 * 100).trigger('change');
            //main.$gain.knob.trigger('change');
            eq2.update();
        }
        if(event.data[1]==64)
        {
            cf.fade(event.data[2]/63.5 - 1); // zwischen -1 und 1
            cf.$gain.val((event.data[2]/63.5 - 1 )* 100).trigger('change');
            cf.update();
        }
        if(event.data[1]==14)
        {
            eq1.opts.filter.highpass.frequency = event.data[2]*78.74; // zwischen 1 und 10000;
            eq1.filter.highpass.$frequency.val(event.data[2]*78.74).trigger('change');
            eq1.update();
        }
        if(event.data[1]==15)
        {
            eq1.opts.filter.lowpass.frequency = event.data[2]*78.74; // zwischen 1 und 10000;
            eq1.filter.lowpass.$frequency.val(event.data[2]*78.74).trigger('change');
            eq1.update();
        }
        if(event.data[1]==16)
        {
            eq1.opts.filter.bandpass.frequency = event.data[2]*78.74; // zwischen 1 und 10000;
            eq1.filter.bandpass.$frequency.val(event.data[2]*78.74).trigger('change');
            eq1.update();
        }
        if(event.data[1]==17)
        {
            eq1.opts.source.playrate = event.data[2]/63.5; // zwischen 0 und 2;
            eq1.$playrate.val(event.data[2]/63.5).trigger('change');
            eq1.update();
        }
        if(event.data[1]==18)
        {
            eq2.opts.filter.highpass.frequency = event.data[2]*78.74; // zwischen 1 und 10000;
            eq2.filter.highpass.$frequency.val(event.data[2]*78.74).trigger('change');
            eq2.update();
        }
        if(event.data[1]==19)
        {
            eq2.opts.filter.lowpass.frequency = event.data[2]*78.74; // zwischen 1 und 10000;
            eq2.filter.lowpass.$frequency.val(event.data[2]*78.74).trigger('change');
            eq2.update();
        }
        if(event.data[1]==20)
        {
            eq2.opts.filter.bandpass.frequency = event.data[2]*78.74; // zwischen 1 und 10000;
            eq2.filter.bandpass.$frequency.val(event.data[2]*78.74).trigger('change');
            eq2.update();
        }
        if(event.data[1]==21)
        {
            eq2.opts.source.playrate = event.data[2]/63.5; // zwischen 0 und 2;
            eq2.$playrate.val(event.data[2]/63.5).trigger('change');
            eq2.update();
        }

    }

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