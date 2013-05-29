(function(){

    "use strict";

    var Shadowlord = {
        _color          : "",
        __values        : null,
        items           : null,
        _input          : document.getElementById('input'),
        randomButton    : document.querySelector('.randomness'),
        updateBtn       : document.querySelector('.update-btn'),
        colorPreview    : document.querySelector('.current-color-preview'),
        elementsHolder  : document.querySelector('#main .content'),
        options         : document.querySelectorAll('.options [type="radio"]'),
        complementary   : document.querySelector('[role="complementary"]'),
        HEXRegExp       : /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/,
        RGBRegExp       : /^\s*rgba?\s*\((\d+)\,\s*(\d+)\,\s*(\d+)(,\s*(\d+(\.\d+)?))?\)\s*$/,

        init: function () {
            var hash = window.location.hash;
            ZeroClipboard.setDefaults({ moviePath: "javascripts/ZeroClipboard.swf" });
            this.bindEvents();

            if ( this.isValidColorModel(hash) ) {
                this.printTints(hash);
                return false;
            }
            this.generateRandomColor();
        },

        bindEvents: function () {
            var that = this;
            this.addEvent(that.updateBtn, "click", function (e) {
                var input = that._input.value;
                if (that.isValidColorModel(input)) {
                    that.printTints(input);
                    that._input.className = "";
                    return false;
                }
                that._input.className = "error";
            });

            this.addEvent(that.randomButton, "click", function () {
                that.generateRandomColor();
                that._input.className = "";
            });

            for (var i = 0; i < that.options.length; i += 1) {
                this.addEvent(that.options[i], "change", function(e) {
                    for (var i = 0; i < that.items.length; i += 1) {
                        that.items[i].setAttribute("data-clipboard-text", that.items[i].getAttribute('data-'+e.target.value) );
                    }
                });
            }

            this.addEvent(window, "resize", that.reCalcSize);
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
                color   = new Values( colour ).setRange(1),
                current = color.getColor(),
                frag    = document.createDocumentFragment(),
                clips   = [];

            that.__values = color.getTintsAndShades();
            that.items = [];

            this.clearContainer();
            window.location.hash = current.hex.toUpperCase();
            that._input.value = current.hex;
            that.colorPreview.style.backgroundColor = current.hex;
            that.colorPreview.title = current.hex;

            for (var i = 0; i < that.__values.length; i += 1) {
                var e       = document.createElement('div'),
                    inner   = document.createElement('div'),
                    hex     = that.__values[i].hex,
                    rgb     = that.__values[i].rgb.text,
                    hsl     = that.__values[i].hsl.text;

                e.className     = "item";

                if ( that.__values[i].hex === color.getColor().hex )
                    e.className += ' original';

                clips.push(new ZeroClipboard( e ));
                e.setAttribute("data-clipboard-text", hex);

                e.setAttribute("data-hex", hex);
                e.setAttribute("data-rgb", rgb);
                e.setAttribute("data-hsl", hsl);

                inner.style.backgroundColor = hsl;
                inner.className = "item-inner";

                e.appendChild(inner);
                that.items.push( e );
                frag.appendChild(e);
            }

            that.elementsHolder.appendChild(frag);
            that.reCalcSize();
            // var by = document.querySelector('.by');
            // by.getElementsByTagName('a')[0].style.color = color.getColor().hex;
        },

        reCalcSize: function() {
            var padding = 0,
                W       = document.body.clientWidth,
                H       = document.body.clientHeight,
                paddingTB = 60,
                paddingLR = 0,
                columns = 10,
                rows = 10;

            var items = Shadowlord.elementsHolder.childNodes;
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
            this.elementsHolder.innerHTML = "";
        },

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
        }
    };

    Shadowlord.init();

}());
