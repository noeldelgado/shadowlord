Class(Sl.UI, 'Color').inherits(Widget)({
    HTML : '\
        <div class="item">\
            <div class="item__inner">\
            </div>\
        </div>\
    ',

    prototype : {
        inner : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            this.inner = this.element.querySelector('.item__inner');

            this.appendChild(new Sl.UI.Paragraph({
                name : 'hexLabel',
                className : 'hex--label'
            })).render(this.inner);

            this.appendChild(new Sl.UI.Paragraph({
                name : 'rgbLabel',
                className : 'rgb--label'
            })).render(this.inner);

            this.appendChild(new Sl.UI.Paragraph({
                name : 'hslLabel',
                className : 'hsl--label'
            })).render(this.inner);
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
            this.inner = null;
            Widget.prototype.destroy.call(this);

            return null;
        }
    }
})
