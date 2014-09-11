Class(Sl.UI, 'CreditsModal').inherits(Widget)({
    HTML : '\
        <div class="modal credits">\
          <div class="modal__wrapper">\
            <div class="modal__inner">\
              <button class="btn borderless modal__close">&#10062;</button>\
              <section>\
                <h3>About</h3>\
                <p>\
                    Tints and shades generator made by Noel Delgado –&nbsp;\
                    <a href="http://twitter.com/pixelia_me" target="_blank">\
                        @pixelia_me\
                    </a>.\
                </p>\
                <p>\
                    Build using <a href="https://github.com/azendal/neon" target="_blank">Neon<a/>&nbsp;\
                    by Fernando Trasviña and&nbsp;\
                    <a href="https://github.com/noeldelgado/values.js" target="_blank">Values.js</a>\
                <p>\
                    Entypo pictograms by Daniel Bruce –&nbsp;\
                    <a href="http://www.entypo.com" target="_blank">\
                        http://www.entypo.com\
                    </a>\
                </p>\
              </section>\
            </div>\
          </div>\
        </div>\
        ',
    prototype : {
        _doc : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            this._doc = $(document);
            this.closeModal = this.element.find('.modal__close');

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            this.bind('render', this._renderHandler.bind(this));

            this.element.on('click', function(event) {
                this._checkBeforeClose(event);
            }.bind(this));

            this.closeModal.on('click', this.deactivate.bind(this));

            this.bind('deactivate', this._deactivateHandler.bind(this));

            return this;
        },

        _renderHandler : function _renderHandler() {
            this._doc.on('keydown.modal', function(e) {
                if (e.which === 27) {
                    this.deactivate();
                }
            }.bind(this));

            return this;
        },

        _checkBeforeClose : function _checkBeforeClose(event) {
            if (event.target.classList.contains('modal__wrapper')) {
                this.deactivate();
            }

            return this;
        },

        _deactivateHandler : function _deactivateHandler() {
            var modal = this;

            setTimeout(function() {
                modal._doc.off('keydown.modal');
                modal.element.detach();
            }, 300);

            return this;
        },

        destroy : function destroy() {
            this.closeModal = null;
            Widget.prototype.destroy.call(this);
        }
    }
})
