Class(Sl.UI, 'ColorsCollection').inherits(Widget)({
    HTML : '\
        <div class="main-container" role="main-content">\
        </div>\
    ',
    prototype : {
        el : null,
        /**
         * Array to hold references to Sl.UI.Color instances.
         * @property _cached <private> [Array]
         */
        _cached : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this._cached = [];
            this.el = this.element[0];
            this._storeInMemory(100);
        },

        /**
         * Store color instances in variables.
         * @property _storeInMemory <private> [Function]
         * @argument number_items <require> [Number] How many items to create.
         * @return Sl.UI.ColorsCollection
         */
        _storeInMemory : function _storeInMemory(number_items) {
            var i;

            for (i = 0; i < number_items; i++) {
                this._cached.push(new Sl.UI.Color());
            }

            return this;
        },

        /**
         * Return the DOM element reference.
         * @property getElement <public> [Function]
         * @return this.el [Object]
         */
        getElement : function getElement() {
            return this.el;
        },

        /**
         * Append and render Sl.UI.Color instances.
         * @property renderColors <public> [Function]
         * @return Sl.UI.ColorsCollection
         */
        renderColors : function renderColors() {
            this._cached.forEach(function(child) {
                this.appendChild(child).render(this.element);
            }, this);

            return this;
        }
    }
})
