Class(Sl.UI, 'CreditsModal').inherits(Widget)({
    HTML : '\
        <div class="modal credits">\
          <div class="modal__wrapper">\
            <div class="modal__inner">\
                <button class="btn btn-icon btn-ghost modal__close" type="button" aria-label="close modal">\
                    <svg style="width:24px;height:24px" viewBox="0 0 24 24">\
                        <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />\
                    </svg>\
                </button>\
              <section>\
                <h3>About</h3>\
                <p>Color tints and shades generator tool.</p>\
                <ul>\
                    <li>Color input accepts hex, rgb and hsl CSS color strings.\
                    <li>The accepted percent factor range goes from 1 to 100. The math is <code>round(100 / &lt;percent&gt;)</code>, so:\
                    <ul>\
                        <li>1 will produce 100 tints and 100 shades\
                        <li>2 will produce 50 tints and 50 shades\
                        <li>3 will produce 33 tints and 33 shades\
                        <li>5 will produce 20 tints and 20 shades\
                        <li>10 will produce 10 tints and 10 shades\
                        <li>...\
                    </ul>\
                </ul>\
                <h3>Credits</h3>\
                <ul>\
                    <li><a href="https://github.com/azendal/neon" target="_blank">Neon</a> Class System by Fernando Trasviña.</li>\
                    <li><a href="https://github.com/noeldelgado/values.js" target="_blank">values.js</a> — JS library to get the tints and shades.</li>\
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
        _previousFocusedElement: null,
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

        activate: function activate() {
            var modal = this;

            Widget.prototype.activate.call(modal);

            modal._previousFocusedElement = document.activeElement;

            modal.element.addEventListener('transitionend', function () {
                modal.closeModal.focus();
            }, { once: true });

            return modal;
        },

        deactivate: function deactivate() {
            Widget.prototype.deactivate.call(this);

            if (this._previousFocusedElement) {
                this._previousFocusedElement.focus();
            }
            this._previousFocusedElement = null;
            return this;
        },

        destroy : function destroy() {
            this.closeModal = null;
            Widget.prototype.destroy.call(this);
        }
    }
})
