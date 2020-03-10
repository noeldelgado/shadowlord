Class(Sl.UI, 'Color').inherits(Widget)({
    HTML : '\
        <div class="item">\
            <div class="item_percent">\
                <svg class="icon-shade" width="12" height="12" viewBox="0 0 24 24">\
                    <path fill="currentColor" d="M12 2A10 10 0 1 1 2 12A10 10 0 0 1 12 2Z" />\
                </svg>\
                <svg class="icon-tint" width="12" height="12" viewBox="0 0 24 24">\
                    <path d="M12 20A8 8 0 1 1 20 12A8 8 0 0 1 12 20M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Z" />\
                </svg>\
            </div>\
        </div>\
    ',

    prototype : {
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.appendChild(new Sl.UI.Paragraph({
                name : 'percentage',
                className : 'percentage--label'
            })).render(this.element.querySelector('.item_percent'), this.element.querySelector('.item_percent').firstElementChild);

            this.appendChild(new Sl.UI.Paragraph({
                name : 'hexLabel',
                className : 'hex--label'
            })).render(this.element);

            // this.appendChild(new Sl.UI.Paragraph({
            //     name : 'rgbLabel',
            //     className : 'rgb--label'
            // })).render(this.element);

            // this.appendChild(new Sl.UI.Paragraph({
            //     name : 'hslLabel',
            //     className : 'hsl--label'
            // })).render(this.element);
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
         * Change the background-color of the element.
         * @property setBackgroundColor <public> [Function]
         * @argument color <required> [String]
         * @return Sl.UI.Color
         */
        setBackgroundColor : function setBackgroundColor(color) {
            this.element.style.backgroundColor = color;

            return this;
        },

        /**
         * Change the color of the element.
         * @property setColor <public> [Function]
         * @argument color <required> [String]
         * @return Sl.UI.Color
         */
        setColor : function setColor(color) {
            this.element.style.color = color;

            return this;
        },

        destroy : function destroy() {
            // this.inner = null;
            Widget.prototype.destroy.call(this);

            return null;
        }
    }
})
