(function(){

    "use strict";

    var UI = {
        _input          : document.getElementById('input'),
        randomButton    : document.querySelector('.randomness'),
        updateBtn       : document.querySelector('.update-btn'),
        colorPreview    : document.querySelector('.current-color-preview'),
        elementsHolder  : document.querySelector('#main .content'),
        colorPicker     : document.getElementById('colorpicker'),
        options         : document.querySelectorAll('.options [type="radio"]'),
        overlay         : document.querySelector('.overlay-background'),
        overlays        : {}
    };

    var Shadowlord = {
        _color          : "",
        __values        : null,
        items           : null,
        HEXRegExp       : /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/,
        RGBRegExp       : /^\s*rgba?\s*\((\d+)\,\s*(\d+)\,\s*(\d+)(,\s*(\d+(\.\d+)?))?\)\s*$/,

        init: function () {
            var hash = window.location.hash;

            ZeroClipboard.setDefaults({
                moviePath: "javascripts/ZeroClipboard.swf"
            });

            UI.overlays.copied = {
                el  : document.querySelector('.overlay-color-copied'),
                text: document.querySelector('.overlay-color-copied').querySelector('.dynamic-text')
            };

            this.bindEvents();

            if ( this.isValidColorModel(hash) ) {
                this.printTints(hash);
                return false;
            }
            this.generateRandomColor();
        },

        bindEvents: function () {
            var that = this;
            helpers.addEvent(UI._input, "focus", function(e) {
                helpers.triggerEvent( UI.colorPicker, 'click');
            });

            helpers.addEvent(UI.colorPicker, "change", function(event) {
                UI._input.value = event.target.value;
                helpers.triggerEvent( UI.updateBtn, 'click');
            });

            helpers.addEvent(UI.updateBtn, "click", function (e) {
                var input = UI._input.value;
                if (that.isValidColorModel(input)) {
                    that.printTints(input);
                    UI._input.className = "";
                    return false;
                }
                UI._input.className = "error";
            });

            helpers.addEvent(UI.randomButton, "click", function () {
                that.generateRandomColor();
                UI._input.className = "";
            });

            // update data-clipboard when an option format is changed
            for (var i = 0; i < UI.options.length; i += 1) {
                helpers.addEvent(UI.options[i], "change", function(e) {
                    for (var i = 0; i < that.items.length; i += 1) {
                        that.items[i].setAttribute("data-clipboard-text", that.items[i].getAttribute('data-'+e.target.value) );
                    }
                    document.body.focus();
                });
            }

            helpers.addEvent(window, "resize", that.reCalcSize);
        },

        isValidColorModel: function (hash) {
            if (Shadowlord.HEXRegExp.test(hash)) return true;
            if (Shadowlord.RGBRegExp.test(hash)) return true;
            return false;
        },

        generateRandomColor: function () {
            var colour = "#",
                b16 = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
            for (var i = 0; i < 6; i += 1) {
                colour += b16[Math.round(Math.random(0, b16.length) * (b16.length - 1))];
            }
            this.printTints(colour);
        },

        printTints: function (colour) {
            var that    = this,
                color   = new Values( colour ).setStep(1),
                current = color.getColor(),
                frag    = document.createDocumentFragment(),
                clips   = [];

            that.__values = color.getTintsAndShades();
            that.items = [];

            this.clearContainer();
            window.location.hash = current.hex.toUpperCase();
            UI._input.value = current.hex;
            UI.colorPreview.style.backgroundColor = current.hex;
            UI.colorPreview.title = current.hex;

            for (var i = 0; i < that.__values.length; i += 1) {
                var e       = document.createElement('div'),
                    inner   = document.createElement('div'),
                    hex     = that.__values[i].hex,
                    rgb     = that.__values[i].rgb.text,
                    hsl     = that.__values[i].hsl.text;

                e.className     = "item";

                if ( that.__values[i].hex === color.getColor().hex )
                    e.className += ' original';

                var clip = new ZeroClipboard(e);
                clips.push(clip);
                e.setAttribute("data-clipboard-text", hex);
                e.setAttribute("data-hex", hex);
                e.setAttribute("data-rgb", rgb);
                e.setAttribute("data-hsl", hsl);
                clip.on('complete', function(client, args) {
                    that.showOverlay( UI.overlays.copied, args.text );
                    this.classList.add('copied');
                });

                inner.style.backgroundColor = hsl;
                inner.className = "item-inner";

                e.appendChild(inner);
                that.items.push( e );
                frag.appendChild(e);
            }

            UI.elementsHolder.appendChild(frag);
            that.reCalcSize();
            // var by = document.querySelector('.by');
            // by.getElementsByTagName('a')[0].style.color = color.getColor().hex;
        },

        showOverlay: function( overlay, message ) {
            var that = this;
            UI.overlay.style.display = "block";
            overlay.el.classList.add('show');
            overlay.text.innerHTML = message;
            var t = setTimeout(function() {
                UI.overlay.style.display = "none";
                overlay.el.classList.remove('show');
                document.body.focus();
                clearTimeout(t);
            }, 1000);
        },

        reCalcSize: function() {
            var padding = 0,
                W       = document.body.clientWidth,
                H       = document.body.clientHeight,
                paddingTB = 60,
                paddingLR = 0,
                columns = 10,
                rows = 10;

            var items = UI.elementsHolder.childNodes;
            for (var i = 0; i < items.length; i++) {
                if (items[i].nodeName.toLowerCase() === 'div') {
                    items[i].style.width    = (W - paddingLR) / columns + "px";
                    items[i].style.height   = (H - paddingTB) / rows + "px";
                 }
            }
        },

        setColor: function (colour) {
            var c = colour.replace("#", ""),
                l = c.length;
            if (l === 3) {
                this._color = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
                return false;
            }
            this._color = c;
        },

        clearContainer: function () {
            UI.elementsHolder.innerHTML = "";
        }
    };

    var helpers = {
        addEvent: function (obj, type, fn) {
            if (obj.addEventListener) {
                obj.addEventListener(type, fn, false);
            } else if (obj.attachEvent) {
                obj['e' + type + fn] = fn;
                obj[type + fn] = function() {
                    obj['e' + type + fn](window.event);
                };
                obj.attachEvent("on" + type, obj[type + fn]);
            }
        },
        triggerEvent: function (el, type) {
            if ((el[type] || false) && typeof el[type] == 'function') {
                el[type](el);
            }
        }
    };

    Shadowlord.init();

}());
