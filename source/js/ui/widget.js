Class('Widget').includes(CustomEventSupport, NodeSupport)({
    ELEMENT_NODE_TYPE: 'DIV',
    HTML : '',
    ELEMENT_CLASS : 'widget',

    prototype : {
        active : false,
        disabled : false,
        __destroyed : false,

        init : function init(config) {
            var property;

            Object.keys(config || {}).forEach(function (propertyName) {
                this[propertyName] = config[propertyName];
            }, this);

            if (this.element == null) {
                this.element = document.createElement(this.constructor.ELEMENT_NODE_TYPE);
                this.element.innerHTML = this.constructor.HTML.replace(/\s\s+/g, '');
                this.element.className += this.constructor.ELEMENT_CLASS;
            }

            if (this.hasOwnProperty('className') === true)
                this.element.className(this.className);
        },

        _activate : function _activate() {
            this.active = true;
            this.element.addClass('active');
        },

        activate : function activate(params) {
            if (this.__destroyed === true) {
                console.warn('calling on destroyed object');
            }
            this.dispatch('beforeActivate');
            this._activate(params);
            this.dispatch('activate');
            return this;
        },

        _deactivate : function _deactivate() {
            this.active = false;
            this.element.removeClass('active');
        },

        deactivate : function deactivate(params) {
            if (this.__destroyed === true) {
                console.warn('calling on destroyed object');
            }
            this.dispatch('beforeDeactivate');
            this._deactivate(params);
            this.dispatch('deactivate');
            return this;
        },

        _enable : function _enable() {
            this.disabled = false;
            this.element.removeClass('disable');
        },

        enable : function enable() {
            if (this.__destroyed === true) {
                console.warn('calling on destroyed object');
            }
            this.dispatch('beforeEnable');
            this._enable();
            this.dispatch('enable');

            return this;
        },

        _disable : function _disable() {
            this.disabled = true;
            this.element.addClass('disable');
        },

        disable : function disable() {
            if (this.__destroyed === true) {
                console.warn('calling on destroyed object');
            }
            this.dispatch('beforeDisable');
            this._disable();
            this.dispatch('disable');

            return this;
        },

        _destroy : function _destroy() {
            var childrenLength;

            if (this.element) {
                this.element.remove();
            }

            if (this.children !== null){
                childrenLength = this.children.length;
                while(childrenLength > 0){
                    this.children[0].destroy();
                    if (this.children.length === childrenLength) {
                        this.children.shift();
                    }
                    childrenLength--;
                }
            }

            if (this.parent) {
                this.parent.removeChild(this);
            }

            this.children       = null;
            this.element        = null;
        },

        destroy : function destroy() {
            if (this.__destroyed === true) {
                console.warn('calling on destroyed object');
            }

            this.dispatch('beforeDestroy');
            this._destroy();
            this.dispatch('destroy');

            this.eventListeners = null;
            this.__destroyed    = true;

            return null;
        },

        render : function render(element, beforeElement) {
            if (this.__destroyed === true) {
                console.warn('calling on destroyed object');
            }
            this.dispatch('beforeRender', {
                element : element,
                beforeElement : beforeElement
            });

            if (beforeElement) {
                this.element.insertBefore(beforeElement);
            } else {
                element.appendChild(this.element);
            }
            this.dispatch('render');
            return this;
        }
    }
});
