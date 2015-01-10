Class(Sl.UI, 'Checkbox').inherits(Widget)({
    HTML : '\
        <div class="checkbox-wrapper">\
            <label>\
                <input type="checkbox">\
                <span class="checkbox-ui"></span>\
                <span class="checkbox-label"></span>\
            </label>\
        </div>\
        ',
    prototype : {
        id : null,
        checkbox : null,
        label : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.checkbox = this.element.querySelector('[type="checkbox"]');
            this.label = this.element.querySelector('label');
            this.text = this.element.querySelector('.checkbox-label');

            this.checkbox.setAttribute('id', this.id);
            this.label.setAttribute('for', this.id);
            this.text.appendChild(document.createTextNode(this.id));

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            this.checkbox.addEventListener('change', this._checkboxChangeHandler.bind(this), false);

            return this;
        },

        /*
         * Dispatch the 'change' event.
         * @property _checkboxChangeHandler <private> [Function]
         * @return undefined
         */
        _checkboxChangeHandler : function _checkboxChangeHandler() {
            this.constructor.dispatch('change', this);
        },

        /**
         * Toggle the status of the checkbox and dispatch it's 'change' event.
         * @property toggle <pubilc> [Function]
         * @return Sl.UI.Checkbox
         */
        toggle : function toggle() {
            this.checkbox.click();

            return this;
        },

        destroy : function destroy() {
            this.id = null;
            this.checkbox = null;
            this.label = null;

            Widget.prototype.destroy.call(this);
        }
    }
})
