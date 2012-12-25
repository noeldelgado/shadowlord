(function(){

    "use strict";

    var Shadowlord = {
        _color          : "",
        _input          : document.getElementById('input'),
        randomButton    : document.querySelector('.randomness'),
        updateBtn       : document.querySelector('.update-btn'),
        colorPreview    : document.querySelector('.current-color-preview'),
        elementsHolder  : document.querySelector('[role="main"]'),
        complementary   : document.querySelector('[role="complementary"]'),
        HEXRegExp       : /^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/,
        RGBRegExp       : /^\s*rgba?\s*\((\d+)\,\s*(\d+)\,\s*(\d+)(,\s*(\d+(\.\d+)?))?\)\s*$/,

        init: function () {
            var hash = window.location.hash;
            this.bindEvents();
            if (this.isValidColorModel(hash)) {
                this.printTints(hash);
                return false;
            }
            this.generateRandomColor();
        },

        bindEvents: function () {
            this.addEvent(Shadowlord.updateBtn, "click", function (e) {
                var input = Shadowlord._input.value;
                if (Shadowlord.isValidColorModel(input)) {
                    Shadowlord.printTints(input);
                    Shadowlord._input.className = "";
                    return false;
                }
                Shadowlord._input.className = "error";
            });
            this.addEvent(Shadowlord.randomButton, "click", function () {
                Shadowlord.generateRandomColor();
                Shadowlord._input.className = "";
            });
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
            window.location.hash = colour;
            this.printTints(colour);
        },

        HEXtoRGB: function (color) {
            color = color.replace('#', '');
            var r, g, b;

            if (color.length === 6) {
                r = parseInt(color.slice(0,2), 16),
                g = parseInt(color.slice(2,4), 16),
                b = parseInt(color.slice(4,6), 16);
            } else {
                r = parseInt(color.slice(0,1), 16),
                g = parseInt(color.slice(1,2), 16),
                b = parseInt(color.slice(2,3), 16);
            }

            return {
                r : r,
                g : g,
                b : b
            };
        },

        RGBtoHEX: function (color) {
            var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color),
                r = parseInt(digits[2]).toString(16),
                g = parseInt(digits[3]).toString(16),
                b = parseInt(digits[4]).toString(16);
            r = r.length === 1 ? "0" + r : r;
            g = g.length === 1 ? "0" + g : g;
            b = b.length === 1 ? "0" + b : b;
            return '#' + r + '' + g + '' + b;
        },

        RGBtoHSL: function (r, g, b) {
            // http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
            r /= 255, g /= 255, b /= 255;
            var max = Math.max(r, g, b),
                min = Math.min(r, g, b),
                h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0; // achromatic
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return [h, s, l];
        },

        HSLtoRGB: function (h, s, l){
            var r, g, b;

            if(s == 0){
                r = g = b = l; // achromatic
            }else{
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = Shadowlord.HUEtoRGB(p, q, h + 1/3);
                g = Shadowlord.HUEtoRGB(p, q, h);
                b = Shadowlord.HUEtoRGB(p, q, h - 1/3);
            }

            return [r * 255, g * 255, b * 255];
        },

        HUEtoRGB: function (p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        },

        printTints: function (colour) {
            this.setColor(colour);
            var rgb = this.HEXtoRGB(this._color),
                hsl = Shadowlord.RGBtoHSL(rgb.r, rgb.g, rgb.b),
                h = hsl[0] * 360,
                s = hsl[1] * 100,
                l = hsl[2] * 100,
                i = 100,
                frag = document.createDocumentFragment();

            this.clearContainer();
            Shadowlord._input.value = "#" + this._color;
            Shadowlord.colorPreview.style.backgroundColor = "#" + this._color;
            Shadowlord.colorPreview.title = "#" + this._color;

            while (i > parseInt(l)) {
                frag.appendChild(this.createColorElement(h, s, i));
                i -= 1;
            };

            var o = this.createColorElement(h, s, l, Shadowlord._color);
            o.className = "original";
            frag.appendChild(o);

            i = parseInt(l);
            while (i >= 0) {
                frag.appendChild(this.createColorElement(h, s, i));
                i -= 1;
            };
            Shadowlord.elementsHolder.appendChild(frag);
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

        createColorElement: function (hue, saturation, lightness, all) {
            var el      = document.createElement('div'),
                hslText = document.createElement('p'),
                rgbText = document.createElement('p'),
                hexText = document.createElement('p'),
                white   = document.createElement('span'),
                black   = document.createElement('span'),
                frag    = document.createDocumentFragment(),
                rgb     = "";

            el.style.backgroundColor = all || 'hsl(' + hue + ',' + saturation + '%'+', ' + lightness + '%)';
            rgb = el.style.backgroundColor;

            hexText.innerHTML   = Shadowlord.RGBtoHEX(rgb);
            rgbText.innerHTML   = rgb;
            //hslText.innerHTML   = 'hsl(' + hue + ', ' + saturation + '%'+', ' + lightness + '%)';

            hexText.className   = "hextext upper";
            rgbText.className   = "rgbtext";
            white.className     = "white-preview";
            black.className     = "black-preview";

            frag.appendChild(hexText);
            frag.appendChild(rgbText);
            //frag.appendChild(hslText);
            frag.appendChild(white);
            frag.appendChild(black);
            el.appendChild(frag);

            return el;
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
