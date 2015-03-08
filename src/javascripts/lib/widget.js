Class('Widget').includes(CustomEventSupport, NodeSupport)({

    /**
    The default html for the widget, at the most simple case this is just a div.
    @name HTML
    @attribute_type CONSTANT
    @type String
    */
    HTML : '<div></div>',

    /**
    the widget container default class for all widgets is widget
    @name ELEMENT_CLASS
    @constant
    @type String
    **/
    ELEMENT_CLASS : 'widget',

    /**
    @property prototype
    @type Object
    **/
    prototype : {
        /**
        Holds the active status of the widget
        By default all widgets are deactivated waiting
        for an action to activate it.
        @property active <public> [Boolean] (false)
        **/
        active : false,

        /**
        Holds the disabled status of the widget
        By default all widgets are enabled and only by
        API could be disabled.
        @property disabled <public> [Boolean] (false)
        **/
        disabled : false,

        __destroyed : false,

        init : function init(config) {
            var property, temporalElement;

            Object.keys(config || {}).forEach(function (propertyName) {
                this[propertyName] = config[propertyName];
            }, this);

            if (this.element == null) {
                temporalElement = document.createElement('div');
                temporalElement.innerHTML = this.constructor.HTML.replace(/\s\s+/g, '');
                this.element = temporalElement.firstChild;

                this.constructor.ELEMENT_CLASS.split(' ').forEach(function(className) {
                    this.element.classList.add(className);
                }, this);

                temporalElement = null;
            }

            if (this.hasOwnProperty('className') === true) {
                this.className.split(' ').forEach(function(className) {
                    this.element.classList.add(className);
                }, this);
            }
        },

        /**
        implementation of the activate method, when you need an override, do it
        over this method instead of doing it on activate
        @property _activate <private> [Function]
        @return undefined [undefined]
        **/
        _activate : function _activate() {
            this.active = true;
            this.element.classList.add('active');
        },

        /**
        Public activation method for widget, you can listen to this event
        to take some other actions, but the most important part of this
        method is that it runs its default action, (its activation)
        this method uses _activate as its implementation to maintain
        the events order intact.
        @property activate <public> [Function]
        @method
        @dispatch beforeActivate
        @dispatch activate
        @return this [Widget]
        **/
        activate : function activate() {
            if (this.__destroyed === true) {
                console.warn('calling on destroyed object');
            }
            this.dispatch('beforeActivate');
            this._activate();
            this.dispatch('activate');
            return this;
        },

        /**
        deactivation implementation
        this is the oposite of activation method and as such it must be
        treated as important as that.
        @property _deactivate <private> [Function]
        @method
        @return undefined [undefined]
        **/
        _deactivate : function _deactivate() {
            this.active = false;
            this.element.classList.remove('active');
        },

        /**
        Public deactivation method for widget, you can listen to this event
        to take some other actions, but the most important part of this
        method is that it runs its default action, (its activation)
        this method uses _deactivate as its implementation to maintain
        the events order intact.
        @property activate <public> [Function]
        @method
        @dispatch beforeDeactivatee
        @dispatch deactivate
        @return this [Widget]
        **/
        deactivate : function deactivate() {
            if (this.__destroyed === true) {
                console.warn('calling on destroyed object');
            }
            this.dispatch('beforeDeactivate');
            this._deactivate();
            this.dispatch('deactivate');
            return this;
        },

        /**
        Enable implementation method
        if you need to provide a different procedure for enable
        you must override this method and call "super"
        @property _enable <private> [Function]
        @method
        @return undefined [undefined]
        **/
        _enable : function _enable() {
            this.disabled = false;
            this.element.classList.remove('disable');
        },

        /**
        Public enable method, this method should not be
        overriden.
        @property enable <public> [Function]
        @method
        @return this [Widget]
        **/
        enable : function enable() {
            if (this.__destroyed === true) {
                console.warn('calling on destroyed object');
            }
            this.dispatch('beforeEnable');
            this._enable();
            this.dispatch('enable');

            return this;
        },

        /**
        Disable implementation
        @property _disable <private> [Function]
        @return undefined [undefined]
        **/
        _disable : function _disable() {
            this.disabled = true;
            this.element.classList.add('disable');
        },

        /**
        Disables the widget, the idea behind disabling a widget
        comes from DOM form elements. so following this idea
        all widgets can be disabled and queried for its disabled
        state via the disabled property.
        Same as DOM form elements there is feedback and that is why
        the default implementation sets the "disable" class
        on the element so proper visual feedback can be provided
        to the user.
        @property disable <public> [Function]
        @method
        @return this [Widget]
        **/
        disable : function disable() {
            if (this.__destroyed === true) {
                console.warn('calling on destroyed object');
            }
            this.dispatch('beforeDisable');
            this._disable();
            this.dispatch('disable');

            return this;
        },

        /**
        Destroy implementation. Its main responsabilities are cleaning
        all references to other objects so garbage collector can collect
        the memory used by this and the other objects
        @property _destroy <private> [Function]
        @method
        @return undefined [undefined]
        **/
        _destroy : function _destroy() {
            var childrenLength;

            if (this.element) {
                if (this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
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

            this.children = null;
            this.element = null;
        },

        /**
        Destroy public method, this one should not be replaced
        @property destroy <public> [Function]
        @method
        @return null [null]
        **/
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

        /**
        The render method is the mechanism by which you pass a widget from
        living only on memory to get into the DOM and with this into the
        application flow. The recomendation is that render is the last method
        of the setup of a widget, including appending its children. this is
        because once a widget gets renderer, further operations cause browser
        reflows, and DOM operations are slower than memory operations.
        This method shoudl not be replaced by its children.
        @property render <public> [Function]
        @method
        @argument element <required> [JQuery] (undefined) This is the element
        into which the widget will be appended.
        @argument beforeElement <optional> [HTMLDOMElement] (undefined) this is the element
        that will be used as a reference to insert the widgets element. this argument
        must be a child of the "element" argument.
        @return this [Widget]
        **/
        render : function render(element, beforeElement) {
            if (this.__destroyed === true) {
                console.warn('calling on destroyed object');
            }
            this.dispatch('beforeRender', {
                element : element,
                beforeElement : beforeElement
            });
            if (beforeElement) {
                element.insertBefore(this.element, beforeElement);
            } else {
                element.appendChild(this.element);
            }
            this.dispatch('render');
            return this;
        }
    }
});
