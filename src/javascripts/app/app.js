Class(UI, 'App').includes(CustomEventSupport, NodeSupport)({
    prototype : {
        body : null,
        values : null,
        current_color : null,
        step : null,
        hash : null,
        ui : null,
        init : function init() {
            this.body = $(document.body);
            this.step = 1;
            this.hash = window.location.hash;
            this.ui = {
                colorPicker     : $(document.querySelector('[type="color"]')),
                preview         : $(document.querySelector('.preview__color')),
                checkboxes      : $(document.querySelectorAll('[type="checkbox"]')),
                input           : $(document.querySelector('[name="input"]')),
                randomColorBtn  : $(document.querySelector('.random-color-btn')),
                creditsBtn      : $(document.querySelector('.credits-btn')),
            }
        },

        /**
         * @property run <public> [Function]
         * @return UI.App
         */
        run : function run() {
            var color;

            this.appendChild(new UI.ColorsCollection({
                name : 'colors',
                element : $(document.querySelector('.main-container'))
            }));

            this.appendChild(new UI.CreditsModal({
                name : 'creditsModal'
            }));

            this.ui.checkboxes[0].checked = true; // hex
            this.ui.checkboxes[1].checked = true; // rgba
            this.checkboxUpdated(this.ui.checkboxes[0]);
            this.checkboxUpdated(this.ui.checkboxes[1]);

            if (this._isValidColorModel(this.hash)) {
                color = this.hash;
            } else {
                color = this.getRandomColor();
            }

            this.values = new Values(color).setStep(this.step);
            this.printValues(color);

            this._bindEvents();

            return this;
        },

        _bindEvents : function _bindEvents() {
            $(window).on('hashchange', this.checkHash.bind(this));
            this.ui.preview.on("click", this.showColorPicker.bind(this));
            this.ui.colorPicker.on("change", this.colorPickerUpdated.bind(this));
            this.ui.input.on("keypress", this.checkInput.bind(this));
            this.ui.randomColorBtn.on('click', this.randomColor.bind(this));
            this.ui.creditsBtn.on("click", this.showModal.bind(this));
            this.ui.checkboxes.on('change', function(event) {
                this.checkboxUpdated.call(this, event.target);
            }.bind(this));

            this.creditsModal.bind('render', function() {
                var app = this;

                setTimeout(function() {
                    app.creditsModal.activate();
                }, 0);
            }.bind(this));

            return this;
        },

        _isValidColorModel : function _isValidColorModel(color) {
            if (Values.Utils.isHEX(color)) return true;
            if (Values.Utils.isRGB(color)) return true;

            return false;
        },

        checkHash : function checkHash(e) {
            var new_color = window.location.hash;

            if (this.hash !== new_color) {
                if (this._isValidColorModel(new_color)) {
                    this.printValues(new_color);
                }
            }

            return this;
        },

        showColorPicker : function showColorPicker() {
            this.ui.colorPicker.click();

            return this;
        },

        colorPickerUpdated : function colorPickerUpdated() {
            this.printValues(this.ui.colorPicker[0].value);

            return this;
        },

        checkInput : function checkInput(event) {
            if (event.charCode === 13) {
                var new_color = this.ui.input[0].value;

                if (this._isValidColorModel(new_color)) {
                    this.printValues(new_color);
                    this.ui.input.removeClass('error');
                } else {
                    this.ui.input.addClass('error');
                }
            }

            return this;
        },

        showModal : function showModal(event) {
            event.preventDefault();
            this.creditsModal.render(this.body);

            return this;
        },

        randomColor : function randomColor(event) {
            this.printValues(this.getRandomColor());

            return this;
        },

        checkboxUpdated : function checkboxUpdated(element) {
            var classname = 'show--' + element.id;
            this.colors.element[0].classList[element.checked ? 'add' : 'remove'](classname);

            return this;
        },

        printValues : function printValues(color) {
            var original;

            this.values.setColor(color);
            this.current_color = this.values.hex;

            this.updateHash(this.values.hex.toUpperCase());
            this.updateUI();

            this.colors.children.forEach(function(child, i) {
                var value = this.values.all[i],
                    tc = (value.brightness > 50) ? '#000' : '#fff';

                child.element.removeClass("original");

                if (value.hex === this.values.hex) {
                    child.element.addClass("original");
                    original = child.element[0];
                }

                child.element[0].style.backgroundColor = value.hex;
                child.inner[0].style.color = tc;
                child.hexLabel[0].textContent = value.hex;
                child.rgbLabel[0].textContent = value.rgba;
                child.hslLabel[0].textContent = value.hsla;
            }, this);

            this.body[0].scrollTop = 0;

            if (original !== undefined) {
                this.body[0].scrollTop = (original.getBoundingClientRect().top - 225);
            }

            return this;
        },

        updateUI : function updateUI() {
            this.ui.preview[0].style.backgroundColor = this.current_color;
            this.ui.colorPicker[0].value = this.current_color;
            this.ui.input[0].value = this.current_color;

            return this;
        },

        updateHash : function updateHash(hash) {
            window.location.hash = hash;
            this.hash = hash;

            return this;
        },

        /**
         * @property getRandomColor <public> [Function]
         * @return #000 [String]
         */
        getRandomColor : function getRandomColor() {
            return "#" +  Math.random().toString(16).slice(2, 8);
        }
    }
});
