Class(UI, 'Color').inherits(Widget)({
    HTML : '\
        <div class="item">\
            <div class="item__inner">\
                <p class="hex--label">#000</p>\
                <p class="rgb--label">rgb(0, 0, 0)</p>\
                <p class="hsl--label">hsl(0, 100%, 0%)</p>\
            </div>\
        </div>\
    ',

    prototype : {
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            this.inner      = this.element.find('.item__inner');
            this.hexLabel   = this.element.find('.hex--label');
            this.rgbLabel   = this.element.find('.rgb--label');
            this.hslLabel   = this.element.find('.hsl--label');
        }
    }
})
