Class(Sl.UI, 'Paragraph').inherits(Widget)({
    HTML : '<p></p>',
    prototype : {
        el : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            this.el = this.element[0];
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
         * Change the text of the element.
         * @property setText <public> [Function]
         * @argument text <optional> [String]
         * @return Sl.UI.Paragraph
         */
        setText : function setText(text) {
            this.el.textContent = text;

            return this;
        },

        destroy : function destroy() {
            this.el = null;
            Widget.prototype.destroy.call(this);

            return null;
        }
    }
})
