Class(Sl.UI, 'Color').inherits(Widget)({
    HTML : '\
        <div class="item">\
            <div class="item__inner">\
            </div>\
        </div>\
    ',

    prototype : {
        el : null,
        inner : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            this.el = this.element[0];
            this.inner = this.element.find('.item__inner');

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
            return this.el;
        },

        /**
         * Change the background-color of the element.
         * @property setBackgroundColor <public> [Function]
         * @argument color <required> [String]
         * @return Sl.UI.Color
         */
        setBackgroundColor : function setBackgroundColor(color) {
            this.el.style.backgroundColor = color;

            return this;
        },

        /**
         * Change the color of the element.
         * @property setColor <public> [Function]
         * @argument color <required> [String]
         * @return Sl.UI.Color
         */
        setColor : function setColor(color) {
            this.el.style.color = color;

            return this;
        },

        destroy : function destroy() {
            this.el = null;
            this.inner = null;
            Widget.prototype.destroy.call(this);

            return null;
        }
    }
})
