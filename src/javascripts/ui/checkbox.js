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
        el : null,
        id : null,
        checkbox : null,
        label : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            this.el = this.element[0];
            this.checkbox = this.element.find('[type="checkbox"]');
            this.label = this.element.find('label');
            this.text = this.element.find('.checkbox-label');

            this.checkbox[0].setAttribute('id', this.id);
            this.label[0].setAttribute('for', this.id);
            this.text[0].textContent = this.id;

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            this.checkbox.on('change', this._checkboxChangeHandler.bind(this));

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
            this.checkbox.off('change');
            this.el = null;
            this.id = null;
            this.checkbox = null;
            this.label = null;
            Widget.prototype.destroy.call(this);

            return null;
        }
    }
})
