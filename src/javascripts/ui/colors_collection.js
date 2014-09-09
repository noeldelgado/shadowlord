Class(UI, 'ColorsCollection').inherits(Widget)({
    HTML : '\
        <div class="main-container scroll" role="main-content">\
        </div>\
    ',
    prototype : {
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.cached = [];

            this._storeInMemory(100);
            this._bindEvents();
        },

        _storeInMemory : function _storeInMemory(number_items) {
            var i = 0;
            for (; i < number_items; i++)
                this.cached.push(new UI.Color());
            i = number_items = null;
        },

        _bindEvents : function _bindEvents() {
            this.cached.forEach(function(child) {
                this.appendChild(child).render(this.element);
            }, this);

            return this;
        }
    }
})
