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
                <p>\
                    <a href="https://github.com/noeldelgado/shadowlord" class="flex" target="_blank" rel="noopener noreferrer">\
                        <svg class="mr05 block" focusable="false" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2 0 1.9 1.2 1.9 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8 0 3.2.9.8 1.3 1.9 1.3 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1 .9 2.2v3.3c0 .3.1.7.8.6A12 12 0 0 0 12 .3"></path></svg>\
                        <span>View source on GitHub</span>\
                    </a>\
                </p>\
                <p>Color tints and shades generator tool.</p>\
                <ul>\
                    <li>Color input accepts <b>hex</b>, <b>rgb/a</b> and <b>hsl/a</b> CSS color strings.\
                    <li>The accepted percent factor range goes from 1 to 100. The math is <code>round(100 / &lt;percent&gt;)</code>, so:\
                    <ul>\
                        <li>1 will produce 100 tints and 100 shades\
                        <li>2 will produce 50 tints and 50 shades\
                        <li>and so on...\
                    </ul>\
                </ul>\
                <h3>Credits</h3>\
                <ul>\
                    <li><a href="https://github.com/azendal/neon" target="_blank" rel="noopener noreferrer">Neon</a> Class System by Fernando Trasviña.</li>\
                    <li><a href="https://github.com/noeldelgado/values.js" target="_blank" rel="noopener noreferrer">values.js</a> — JS library to get the tints and shades.</li>\
                    <li>Material Design Icons by <a href="https://twitter.com/Google" target="_blank" rel="noopener noreferrer">@Google</a>.</li>\
                    <li>“Percent” icon by Austin Andrews <a href="https://twitter.com/templarian" target="_blank" rel="noopener noreferrer">@templarian</a></li>\
                </ul>\
                <h3>License</h3>\
                <p>MIT © <a href="https://github.com/noeldelgado" target="_blank" rel="noopener noreferrer">Noel Delgado</a></p>\
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
