Class(UI, 'ColorsCollection').inherits(Widget)({
    ELEMENT_CLASS : 'colors-wrapper',
    HTML : '\
        <div class="main-container scroll" role="main-content">\
        </div>\
    ',
    prototype : {
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.cached = [];

            this._storeInMemory(100);
            this.bindings();
        },

        _storeInMemory : function _storeInMemory(number_items) {
            var i = 0;
            for (; i < number_items; i++)
                this.cached.push(new UI.Color());
            i = number_items = null;
        },

        bindings : function bindings() {
            var i = 0,
                cachedLength = this.cached.length;
            for (; i < cachedLength; i++)
                this.appendChild(this.cached[i]).render(this.element);
            i = cachedLength = null;
        }
    }
})
