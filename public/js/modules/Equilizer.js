/**
 * Created by philippwahle on 30.10.15.
 */

function Equilizer(ctx, id, name) {

    var that = this;
    this.name = name;
    this.ctx = ctx;
    this.id = id;

    this.analyser = null;
    this.oscillator = null;

    this.output = null;
    this.source = null;

    this.spliiter = null;
    this.merger = null;

    this.highpass = null;
    this.lowpass = null;
    this.bandpass = null;


    /**
     * Init
     */
    this.init = function() {
        // Oscillator
        this.oscillator = this.ctx.createOscillator();

        // Gain
        this.gain = this.ctx.createGain();

        // Analyser
        this.analyser = this.ctx.createAnalyser();

        //bufferSource
        this.source = this.ctx.createBufferSource();

        //biquadfilter - highpasscreateBiquadFilter
        this.highpass = this.ctx.createBiquadFilter();

        //biquadfilter - lowpass
        this.lowpass = this.ctx.createBiquadFilter();

        //biquadfilter - bandpass
        this.bandpass = this.ctx.createBiquadFilter();

        // slitter and merger
        this.spliiter = this.ctx.createChannelSplitter(3);
        this.merger = this.ctx.createChannelMerger(3);


        // AudioNode
        //this.output = this.ctx.createAudioNode();

        this.config();
        this.connect();
        this.ui();
        this.dropzone();
        this.update();
    };

    /**
     * Config
     * @param opt
     */
    this.config = function (opt) {

        // todo
        this.opts =  {
            ctx: {
                initTime: 0,
                currentTime: 0,
                prevTime: 0,
                nextTime: 0
            },
            oscillator : {
                frequency : {
                    type:  'sine' ,
                    current:  200,
                    min : 0,
                    max : 5000,
                    step:  25
                }
            },
            analyser : {
                fftSize : 2048
            },
            source : {

                /**
                 * the buffer source
                 */
                buffer : null,

                /**
                 * playback rate
                 * range [0 - 2]
                 */
                playrate: 1,

                /**
                 * indicates if the sond is playing
                 * 0 - sound is on pause
                 * 1 - play the sound on normal speed
                 * > should be the speed of @playrate
                 */
                playing : 1,

                /**
                 * the duration auf the bufer
                 * a time  in seconds
                 */
                duration: null,

                /**
                 * the current time
                 */
                current: 0,

                /**
                 * progress of the buffer
                 */
                progress: 0,

                state: null,

                pause : {
                    start : 0,
                    end : 0
                }

            },
            progress : {
                finish: 100
            },
            gain : {
                value: .5
            },
            states : {

                play : 'play',
                pause: 'pause',
                finish: 'finish'
            },
            filter: {
                highpass: {
                    frequency: 1000,
                    detune: 100,
                    q: 100,
                    gain: 1,
                    TYPE: 'highpass'
                },
                bandpass: {
                    frequency: 1000,
                    detune: 100,
                    q: 100,
                    gain: 1,
                    TYPE: 'bandpass'
                },
                lowpass: {
                    frequency: 1000,
                    detune: 100,
                    Q: 100,
                    gain: 1,
                    TYPE: 'lowpass'
                }
            }

        };

        //defaults (opt, this.opts);
    };

    /**
     * Update config
     */
    this.update = function() {
        // oscillator
        this.oscillator.type = this.opts.oscillator.frequency.type;
        this.oscillator.frequency.value = this.opts.oscillator.frequency.current;

        // analyser
        this.analyser.fftSize = this.opts.analyser.fftSize;

        // gain
        this.gain.gain.value = this.opts.gain.value;

        // playrate
        this.source.playbackRate.value = this.opts.source.playrate;


        // apply filter
        updateFilter('highpass');
        updateFilter('lowpass');
        updateFilter('bandpass');


    };

    function updateFilter(f) {
        //console.log(f, that.opts.filter[f]);

        //console.log('opts:', that.opts.filter[f]);
        //console.log('freq', that.filter.highpass ,that.opts.filter[f].frequency);

        that[f].type = that.opts.filter[f].TYPE;
        //that[f].Q.value = that.opts.filter[f].Q ;
        that[f].detune.value = that.opts.filter[f].detune;
        that[f].frequency.value = that.opts.filter[f].frequency;
        that[f].gain.value = that.opts.filter[f].gain;
        //console.log(f,that.filter[f]);

    }

    /**
     * Connect Nodes
     */
    this.connect = function() {
        //this.oscillator.connect(this.gain);

        // split channels from source
        this.source.connect(this.spliiter);

        // connect each channel to filter
        this.spliiter.connect(this.highpass, 0);
        this.spliiter.connect(this.bandpass, 1);
        this.spliiter.connect(this.lowpass, 2);

        // merge channels together
        this.highpass.connect(this.merger, 0, 0);
        this.bandpass.connect(this.merger, 0, 1);
        this.lowpass.connect(this.merger, 0, 2);


        // connect to gain
        this.merger.connect(this.gain);

        // connect to analyser
        this.gain.connect(this.analyser);

        // output
        this.output = this.analyser;

    };

    /**
     *
     */
    this.ui = function () {

        // get jQuery Obj
        this.$vis =  $(this.id + ' canvas');
        this.$gn = $(this.id + "-gain-gain");
        this.$of =  $(this.id + "-oscillator-frequency");
        this.$ot =  $(this.id + "-oscillator-type");

        // player
        this.$play = $(this.id + ' #player-play');
        this.$pause = $(this.id + ' #player-pause');
        this.$progress = $(this.id + ' .progress .determinate');

        this.$current =  $(this.id + ' .current');
        this.$duraton =  $(this.id + ' .duration');

        this.$playrate = $(this.id + '-playrate');

        // set ui Eleemntes
        this.$vis.visualizer({
            analyser: this.analyser,
            width : 1,
            x : 2
        });


        this.filter = {};
        this.filter.highpass = {};
        this.filter.highpass = initUiFilter(this.filter.highpass, 'highpass');
        this.filter.lowpass = {};
        this.filter.lowpass = initUiFilter(this.filter.lowpass, 'lowpass');
        this.filter.bandpass = {};
        this.filter.bandpass = initUiFilter(this.filter.bandpass, 'bandpass');
        //console.log(this.filter.highpass);


        this.$gn.knob({
            min : 0,
            max : 100,
            step: 1,

            change: gain,
            release: gain
        });


        this.$of.knob({
            min : 0,
            max : 5000,
            step: 25,

            change: oscillator_frequency,
            release: oscillator_frequency
        });

        this.$playrate.knob({
            min : 0,
            max : 2,
            step: .1,

            change: playrate,
            release: playrate
        });


        this.$ot.on('change', function() {
            that.opts.oscillator.frequency.type = that.$ot.find("input[type='radio']:checked").val();
            that.update();
        });

        // player events

        this.$play.on('click', function() {

            that.opts.source.state = that.opts.states.play;
            that.opts.source.pause.end = that.ctx.currentTime;
            //source.start();
            //that.ctx.resume();
            calcPauseTime();
            setPlaybackRate(that.opts.source.playrate);
            //// hide button
            //this.$play.fadeOut();
            //this.$pause.fadeIn();
        });

        this.$pause.on('click', function() {
            that.opts.source.state = that.opts.states.pause;
            that.opts.source.pause.start = that.ctx.currentTime;
            //source.stop(0);
            //that.ctx.suspend();

            setPlaybackRate(0);

            //this.$play.fadeIn();
            //this.$pause.fadeOut();
        });


        // higpass
        this.filter.highpass.$gain.knob({
            min : 0,
            max : 100,
            step: 1,

            change: highpass_gain,
            release: highpass_gain
        });

        this.filter.highpass.$Q.knob({
            min : 0,
            max : 1000,
            step: 1,

            change: highpass_q,
            release: highpass_q
        });

        this.filter.highpass.$detune.knob({
            min : 0,
            max : 1000,
            step: 1,

            change: highpass_detune,
            release: highpass_detune
        });

        this.filter.highpass.$frequency.knob({
            min : 0,
            max : 10000,
            step: 25,

            change: highpass_frequency,
            release: highpass_frequency
        });

        // lowpass
        this.filter.lowpass.$gain.knob({
            min : 0,
            max : 100,
            step: 1,

            change: lowpass_gain,
            release: lowpass_gain
        });

        this.filter.lowpass.$Q.knob({
            min : 0,
            max : 1000,
            step: 1,

            change: lowpass_q,
            release: lowpass_q
        });

        this.filter.lowpass.$detune.knob({
            min : 0,
            max : 1000,
            step: 1,

            change: lowpass_detune,
            release: lowpass_detune
        });

        this.filter.lowpass.$frequency.knob({
            min : 0,
            max : 10000,
            step: 25,

            change: lowpass_frequency,
            release: lowpass_frequency
        });


        // bandpass
        this.filter.bandpass.$gain.knob({
            min : 0,
            max : 100,
            step: 1,

            change: bandpass_gain,
            release: bandpass_gain
        });

        this.filter.bandpass.$Q.knob({
            min : 0,
            max : 1000,
            step: 1,

            change: bandpass_q,
            release: bandpass_q
        });

        this.filter.bandpass.$detune.knob({
            min : 0,
            max : 1000,
            step: 1,

            change: bandpass_detune,
            release: bandpass_detune
        });

        this.filter.bandpass.$frequency.knob({
            min : 0,
            max : 10000,
            step: 25,

            change: bandpass_frequency,
            release: bandpass_frequency
        });



        // run event code

        function gain(value) {
            that.opts.gain.value = value / 100;
            //console.log(that.opts.gain.value);
            that.update();
        }

        function oscillator_frequency(value) {
            that.opts.oscillator.frequency.current = value;
            that.update();
        }

        function playrate(value) {
            that.opts.source.playrate = value;
            that.update();
        }

        // highpass
        function highpass_gain(value) {
            that.opts.filter.highpass.gain = value / 100;
            that.update();
        }

        function highpass_frequency(value) {
            that.opts.filter.highpass.frequency = value;
            that.update();
        }

        function highpass_detune(value) {
            that.opts.filter.highpass.detune = value ;
            that.update();
        }

        function highpass_q(value) {
            that.opts.filter.highpass.q = value;
            that.update();
        }

        // lowpass
        function lowpass_gain(value) {
            that.opts.filter.lowpass.gain = value / 100;
            that.update();
        }

        function lowpass_frequency(value) {
            that.opts.filter.lowpass.frequency = value;
            that.update();
        }

        function lowpass_detune(value) {
            that.opts.filter.lowpass.detune = value ;
            that.update();
        }

        function lowpass_q(value) {
            that.opts.filter.lowpass.q = value;
            that.update();
        }

        // bandpass
        function bandpass_gain(value) {
            that.opts.filter.bandpass.gain = value / 100;
            that.update();
        }

        function bandpass_frequency(value) {
            that.opts.filter.bandpass.frequency = value;
            that.update();
        }

        function bandpass_detune(value) {
            that.opts.filter.bandpass.detune = value ;
            that.update();
        }

        function bandpass_q(value) {
            that.opts.filter.bandpass.q = value;
            that.update();
        }
    };

    function initUiFilter(filter, type) {
        filter.$gain  = $(that.id +'-'+ type+ '-gain');
        filter.$Q  = $(that.id +'-'+ type+ '-q');
        filter.$frequency = $(that.id +'-'+ type+ '-frequency');
        filter.$detune = $(that.id +'-'+ type+ '-detune');
        return filter;
    }


    /**
     * run app.
     *
     */
    this.run = function() {
        //console.log('run' , that.source);
        this.source.start();
    };

    /**
     * load sound
     * @param url
     */
    this.loadSound = function(url) {
        console.log('load sound:', url);
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';

        request.onload = function() {
            that.ctx.decodeAudioData(request.response, function(buffer) {

                that.source.buffer = buffer; // ctx.createBuffer(2, buffer.length, 44100);
                that.opts.source.duration = buffer.duration;

                that.opts.ctx.initTime = Math.floor(that.source.context.currentTime);
                that.opts.source.state = that.opts.states.play;

                that.run();
                that.step();
            });

        };

        request.send();
    };

    function calcPauseTime() {

        var pauseTime  =  Math.floor(that.opts.source.pause.end -  that.opts.source.pause.start);

        that.opts.ctx.initTime += pauseTime;
    }
    /**
     * update progress
     */
    this.step = function() {

        // check if finish
        if(that.opts.source.progress == that.opts.progress.finish )
        {
            that.opts.source.state = that.opts.states.finish;
            return;
        }

        if(that.opts.source.state == that.opts.states.play )
        {
            that.opts.source.current = Math.floor((that.ctx.currentTime * that.opts.source.playrate) - that.opts.ctx.initTime);
            that.opts.source.progress = Math.floor(that.opts.source.current/that.opts.source.duration * 100);
        }


        that.$current.html(convertTime(that.opts.source.current));
        that.$duraton.html(convertTime(that.opts.source.duration));

        that.$progress.css('width', that.opts.source.progress + '%');

        window.requestAnimationFrame(that.step);

    };

    function updateTime(){
        that.opts.ctx.currentTime = that.source.context.currentTime;
        that.opts.ctx.nextTime = Math.ceil(that.source.context.currentTime);
        that.opts.ctx.prevTime = Math.floor(that.source.context.currentTime);
    }

    this.updateTitle = function(name) {
        $( that.id + ' .title span').html(name);
    };

    /**
     * Dropzone field
     */
    this.dropzone = function() {
        Dropzone.options[that.name] = {
            init: function() {
                //thisDropzone = this;
                this.on("success", function (file, responseText) {
                    //var responseText = responseText.globalPath; // or however you would point to your assigned file ID here;
                    var url = responseText.file.globalPath;
                    var title = responseText.file.filename;
                    console.log(responseText.file);
                    that.updateTitle(title);
                    toggleDropzoneAndPlayer();
                    that.loadSound(url);
                })
            }
        };
    };

    /**
     * Convert seconds to minutes and seconds
     * todo: move to helper method
     *
     * @param time
     * @returns {string}
     */
    function convertTime(time) {
        var minutes = "0" + Math.floor(time / 60);
        var seconds = "0" + (time - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);
    }

    function setPlaybackRate(rate) {
        that.source.playbackRate.value = rate;
        //console.log(that.source); // .playbackRate.value
    }

    function toggleDropzoneAndPlayer() {
        $(that.id + ' .player').slideToggle();
        $(that.id + ' .dropzone-container').slideToggle();
    }

}