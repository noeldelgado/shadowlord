Class(UI, 'Color').inherits(Widget)({
    ELEMENT_NODE_TYPE: 'DIV',
    ELEMENT_CLASS : 'item',
    HTML : '\
        <div class="item__inner">\
            <p class="hex--label">#000</p>\
            <p class="rgb--label">rgb(0, 0, 0)</p>\
            <p class="hsl--label">hsl(0, 100%, 0%)</p>\
        </div>\
    ',
    prototype : {
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            this.inner      = this.element.querySelector('.item__inner');
            this.hexLabel   = this.element.querySelector('.hex--label');
            this.rgbLabel   = this.element.querySelector('.rgb--label');
            this.hslLabel   = this.element.querySelector('.hsl--label');
        }
    }
})
