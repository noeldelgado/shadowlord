Class(Sl.UI, 'CreditsModal').inherits(Widget)({
    HTML : '\
        <div class="modal credits">\
          <div class="modal__wrapper">\
            <div class="modal__inner">\
                <button class="btn btn-icon btn-ghost modal__close">\
                    <svg style="width:24px;height:24px" viewBox="0 0 24 24">\
                        <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />\
                    </svg>\
                </button>\
              <section>\
                <h3>About</h3>\
                <p>Color tints and shades generator tool.</p>\
                <p>Color input only accepts hex color values.</p>\
                <p>The accepted percent factor range is from 1 to 100.</p>\
                <h3>Credits</h3>\
                <ul>\
                    <li><a href="https://github.com/azendal/neon" target="_blank">Neon</a> Class System by Fernando Trasviña.</li>\
                    <li><a href="https://github.com/noeldelgado/values.js" target="_blank">values.js</a> — JS library to get the tints and shades of a color.</li>\
                    <li>Material Design Icons by <a href="https://twitter.com/Google" target="_blank">@Google</a>.</li>\
                    <li>“Percent” icon by Austin Andrews <a href="https://twitter.com/templarian" target="_blank">@templarian</a></li>\
                </ul>\
              </section>\
            </div>\
          </div>\
        </div>\
        ',
    prototype : {
        _doc : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            this._doc = document;
            this.closeModal = this.element.querySelector('.modal__close');

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            this._doc.addEventListener('keydown', this._keyDownHandler.bind(this), false);

            this.element.addEventListener('click', function(event) {
                this._checkBeforeClose(event);
            }.bind(this), false);

            this.closeModal.addEventListener('click', this.deactivate.bind(this), false);

            return this;
        },

        _keyDownHandler : function _keyDownHandler(e) {
            if (e.which === 27) {
                this.deactivate();
            }
        },

        _checkBeforeClose : function _checkBeforeClose(event) {
            if (event.target.classList.contains('modal__wrapper')) {
                this.deactivate();
            }

            return this;
        },

        destroy : function destroy() {
            this.closeModal = null;
            Widget.prototype.destroy.call(this);
        }
    }
})
