Class(Sl.UI, 'Paragraph').inherits(Widget)({
    HTML : '<p></p>',
    prototype : {
        init : function init(config) {
            Widget.prototype.init.call(this, config);
        },

        /**
         * Return the DOM element reference.
         * @property getElement <public> [Function]
         * @return this.el [Object]
         */
        getElement : function getElement() {
            return this.element;
        },

        /**
         * Change the text of the element.
         * @property setText <public> [Function]
         * @argument text <optional> [String]
         * @return Sl.UI.Paragraph
         */
        setText : function setText(text) {
            this.element.textContent = text;

            return this;
        },

        destroy : function destroy() {
            Widget.prototype.destroy.call(this);

            return null;
        }
    }
})
