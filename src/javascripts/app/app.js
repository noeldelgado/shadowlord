Class(Sl, 'App').includes(CustomEventSupport, NodeSupport)({
    prototype : {
        _body : null,
        _values : null,
        _hash : null,
        _ui : null,
        init : function init() {
            this._body = document.body;
            this._hash = window.location.hash;
            this._ui = {
                colorPicker : document.querySelector('[type="color"]'),
                preview : document.querySelector('.preview__color'),
                optionsWrapper : document.querySelector('.options-wrapper'),
                input : document.querySelector('[name="input"]'),
                randomColorBtn : document.querySelector('.random-color-btn'),
                creditsBtn : document.querySelector('.credits-btn'),
            }
        },

        /**
         * Boot the little app.
         * @property run <public> [Function]
         * @return Sl.App [Object]
         */
        run : function run() {
            var color;

            if (this._isValidColorModel(this._hash)) {
                color = this._hash;
            } else {
                color = this._getRandomHexColor();
            }

            this._values = new Values();

            this.appendChild(new Sl.UI.Checkbox({
                name : 'checkboxHex',
                id : 'hex'
            }));

            this.appendChild(new Sl.UI.Checkbox({
                name : 'checkboxRgb',
                id : 'rgb'
            }));

            this.appendChild(new Sl.UI.Checkbox({
                name : 'checkboxHsl',
                id : 'hsl'
            }));

            this.appendChild(new Sl.UI.ColorsCollection({
                name : 'colorsContainer'
            }));

            this.appendChild(new Sl.UI.CreditsModal({
                name : 'creditsModal'
            }));

            this.checkboxHex.render(this._ui.optionsWrapper);
            this.checkboxRgb.render(this._ui.optionsWrapper);
            this.checkboxHsl.render(this._ui.optionsWrapper);
            this.colorsContainer.renderColors().render(this._body, this._body.querySelector('footer'));
            this.creditsModal.render(this._body);
            this.updateUI(color);
            this._bindEvents();

            this.checkboxHex.toggle();
            this.checkboxRgb.toggle();

            return this;
        },

        _bindEvents : function _bindEvents() {
            window.addEventListener('hashchange', this._hashChangeHandler.bind(this), false);
            this._ui.preview.addEventListener("click", this._previewClickHandler.bind(this));
            this._ui.colorPicker.addEventListener("change", this._colorPickerChangeHandler.bind(this));
            this._ui.input.addEventListener("keypress", this._inputKeypressHandler.bind(this), false);
            this._ui.input.addEventListener("click", function(event) {
                event.target.select();
            }.bind(this));
            this._ui.randomColorBtn.addEventListener('click', this._randomColorClickHandler.bind(this));
            this._ui.creditsBtn.addEventListener("click", this._creditsClickHandler.bind(this));

            Sl.UI.Checkbox.bind('change', function(data) {
                this._checkboxChangeHandler.call(this, data.checkbox);
            }.bind(this));

            this.creditsModal.bind('render', function() {
                var app = this;

                setTimeout(function() {
                    app.creditsModal.activate();
                }, 0);
            }.bind(this));

            return this;
        },

        /**
         * Compare the current color vs the hexadecimal color code represented
         * by the hash. If they are different then the ui is updated with the
         * color holded on the hash.
         * @property _hashChangeHandler <private> [Function]
         * @return Sl.App [Object]
         */
        _hashChangeHandler : function _hashChangeHandler() {
            var newColor = window.location.hash;

            if (this._hash !== newColor) {
                if (this._isValidColorModel(newColor)) {
                    this.updateUI(newColor);
                }
            }

            newColor = null;

            return this;
        },

        /**
         * For browser that support the color input type, a native color picker
         * will be displayed so we can select a color.
         * @property _previewClickHandler <private> [Function]
         * @return Sl.App [Object]
         */
        _previewClickHandler : function _previewClickHandler() {
            this._ui.colorPicker.click();

            return this;
        },

        /**
         * Get the current color holded as value on the color-picker an update
         * the ui using that color as new value.
         * @property _colorPickerChangeHandler <private> [Function]
         * @return Sl.App [Object]
         */
        _colorPickerChangeHandler : function _colorPickerChangeHandler() {
            this.updateUI(this._ui.colorPicker.value);

            return this;
        },

        /*
         * Checks if the text typed on the input is a valid hex or rgb color.
         * If so the ui is updated with that color, otherwhise an 'error'
         * css-class is added to the input to show feedback.
         * @property _inputKeypressHandler <private> [Function]
         * @return Sl.App [Object]
         */
        _inputKeypressHandler : function _inputKeypressHandler(e) {
            var charCode, newColor;

           charCode = (typeof e.which === "number") ? e.which : e.keyCode;

            if (charCode === 13) {
                newColor = this._ui.input.value;

                if (this._isValidColorModel(newColor)) {
                    this.updateUI(newColor);
                    this._ui.input.classList.remove('error');
                } else {
                    this._ui.input.classList.add('error');
                }
            }

            charCode = newColor = null;

            return this;
        },

        /**
         * Render the creditsModal.
         * @property _creditsClickHandler <private> [Function]
         * @return Sl.App [Object]
         */
        _creditsClickHandler : function _creditsClickHandler(ev) {
            ev.preventDefault();
            this.creditsModal.activate();

            return this;
        },

        /**
         * Update the ui with a new random color.
         * @property _randomColorClickHandler <private> [Function]
         * @return Sl.App [Object]
         */
        _randomColorClickHandler : function _randomColorClickHandler(event) {
            return this.updateUI(this._getRandomHexColor());
        },

        /**
         * Handle the change event dispached by the checkbox widgets.
         * @property _checkboxChangeHandler <private> [Function]
         * @argument element <required> [DOMElement]
         * @return undefined
         */
        _checkboxChangeHandler : function _checkboxChangeHandler(element) {
            var className, isChecked, action;

            className = 'show--' + element.id;
            isChecked = element.checked;
            action = isChecked ? 'add' : 'remove';

            this.colorsContainer.getElement().classList[action](className);

            className = isChecked = action = null;
        },

        /**
         * Checks if the String is a valid hex or rgb color model using
         * the helper methods provided by Values.js
         * @property _isValidColorModel <private> [Function]
         * @argument color <required> [String]
         * @return true|false [Boolean]
         */
        _isValidColorModel : function _isValidColorModel(color) {
            if (Values.Utils.isHEX(color)) return true;
            if (Values.Utils.isRGB(color)) return true;
            if (Values.Utils.isHSL(color)) return true;

            return false;
        },

        /**
         * Updates the hash with the passed argument.
         * @property _updateHash <private> [Function]
         * @argument hash <required> [String]
         * @return Sl.App [Object]
         */
        _updateHash : function _updateHash(hash) {
            this._hash = window.location.hash = hash;

            return this;
        },

        /**
         * Return a valid random hexadecimal color code.
         * @property _getRandomHexColor <public> [Function]
         * @return #000000 [String]
         */
        _getRandomHexColor : function _getRandomHexColor() {
            return "#" +  Math.random().toString(16).slice(2, 8);
        },

        /**
         * Update the whole UI with a the passed color as param.
         * @property updateUI <public> [Function]
         * @argument color <required> [String] A valid hexadecimal color code.
         * @return Sl.App [Object]
         */
        updateUI : function updateUI(color) {
            var baseColor;

            this._values.setColor(color);
            this._updateHash(this._values.hex.toUpperCase());
            this._ui.preview.style.backgroundColor = this._values.hex;
            this._ui.colorPicker.value = this._values.hex;
            this._ui.input.value = this._values.hex;

            this.colorsContainer.children.forEach(function(child, index) {
                var value, textColor, element;

                value = this._values.all[index];
                textColor = (value.brightness > 50) ? '#000' : '#fff';
                element = child.getElement();

                element.classList.remove("original");

                if (value.hex === this._values.hex) {
                    element.classList.add("original");
                    baseColor = element;
                }

                child.setBackgroundColor(value.hex).setColor(textColor);
                child.hexLabel.setText(value.hex);
                child.rgbLabel.setText(value.rgb);
                child.hslLabel.setText(value.hsl);

                value = textColor = element = null;
            }, this);

            this._body.scrollTop = 0;

            if (baseColor !== undefined) {
                this._body.scrollTop = (baseColor.getBoundingClientRect().top - 80);
            }

            baseColor = null;

            return this;
        },

        destroy : function destroy() {
            this._body = null;
            this._values = null;
            this._hash = null;
            this._ui = null;

            Widget.prototype.destroy.call(this);
        }
    }
});
