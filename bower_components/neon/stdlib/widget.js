/**
Base Class from which almost all widgets are based overall the project

The main idea behind constructing a new widget toolkit instead of using one of the many high quality widget
toolkits avaliable is that we considered that currently, no widget system provides all the features that where
required for this project.

Features of the widget system
* A custom and easy to handle event binding, dispatching and manipulation, with some sort of bubbling support
* A module system which we can use to include specific behaviour to any widget and reuse the code where needed
* A tree structure support for the widgets that the event system could bubble, and that also serves as
* A navigation system.
* The widgets must be able to be grouped to form more complex widgets
* Remove the complexity of DOM manipulation and handling
* A way to wrap widgets at our convenience to reuse widgets avaliable and make them comly to our needs
without the need to hack those widgets, that would force us to maintain the new versions of those widgets
and that is a very complex task when widgets become so complex.
* A widget system that would allow us to start wrapping some widgets for a fast start and later code our own widgets
at will.
* expose a consistent API that allow us to choose the use of widgets by API calls and user interaction at will and with the same
clearance and capacity
* an easy way to allow subclasing widgets
* an easy way to provide new html, class, and css for a specific instance of a widget that would remove us the need
to create complex inheritance structures that are hard to maintain.

Usage Example.

The most basic usage of a widget is to simply create an instance and render it at a target element
in this case body
var myWidgetInstance = new Breezi.Widget();
myWidgetInstance.render(document.body);

like this widget does renders does not display anything so lets give it something to display first
var myWidgetInstance = new Breezi.Widget();
myWidgetInstance.element.html('Im a simple widget');
myWidgetInstance.render(document.body);

this reveals that internally every widget has an element property that is initialized by default to a jQuery Instance
this allow easy DOM manipulation, animation and operations handled by a high quality third party library.
@class Widget
@namespace Breezi
@inlcudes CustomEventSupport
@includes NodeSupport
@dependency Neon
@dependency CustomEventSupport
@dependency NodeSupport
**/
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
            var property;

            Object.keys(config || {}).forEach(function (propertyName) {
                this[propertyName] = config[propertyName];
            }, this);

            if (this.element == null) {
                this.element = $(this.constructor.HTML.replace(/\s\s+/g, ''));
                this.element.addClass(this.constructor.ELEMENT_CLASS);
            }

            if (this.hasOwnProperty('className') === true) {
                this.element.addClass(this.className);
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
            this.element.addClass('active');
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
            this.element.removeClass('active');
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
            this.element.removeClass('disable');
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
            this.element.addClass('disable');
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
        @argument beforeElement <optional> [jQuery] (undefined) this is the element
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
                this.element.insertBefore(beforeElement);
            } else {
                this.element.appendTo(element);
            }
            this.dispatch('render');
            return this;
        }
    }
});