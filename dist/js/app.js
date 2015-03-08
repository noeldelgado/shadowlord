
if (typeof global === "undefined") {
  global = window;
}

global.Interface = function Interface(nameOrNameSpace, name) {
    var nameSpace, interfaceName, factory;
    nameSpace = (nameOrNameSpace && name) ? nameOrNameSpace : this;
    interfaceName = (nameOrNameSpace && name) ? name :
        (nameOrNameSpace) ? nameOrNameSpace : 'interface' + Math.random().toString();
    factory = function(definition) {
        definition.isInterface = true;
        definition.name = interfaceName;
        nameSpace[interfaceName] = definition;
        return nameSpace[interfaceName];
    };
    return factory;
};

global.Module = function Module(nameOrNameSpace, name) {
    var nameSpace, moduleName, factory, newModule;

    nameSpace = (nameOrNameSpace && name) ? nameOrNameSpace : this;
    moduleName = (nameOrNameSpace && name) ? name :
        (nameOrNameSpace) ? nameOrNameSpace : 'module' + Math.random().toString();

    newModule = {
        moduleName : moduleName,
         prototype : {},
         __includedModules : [],
         include : function(module) {
             var property;
             for (property in module) {
                 if (module.hasOwnProperty(property)
                         && property !== 'prototype'
                         && property !== 'isModule'
                         && property !== '__includedModules'
                         && property !== 'include'
                         && property !== 'moduleName') {
                     newModule[property] = module[property];
                 }
             }

             if (module.hasOwnProperty('prototype') && module.prototype) {
                 for (property in module.prototype) {
                     if (module.prototype.hasOwnProperty(property)) {
                         newModule.prototype[property] = module.prototype[property];
                     }
                 }
             }
             else {
                module.prototype = {};
             }

             this.__includedModules.push(module);

             return this;
         }
    }
    
    factory = function(definition){
        var property;
        
        newModule.isModule = true;
        
        for (property in definition) {
            if (definition.hasOwnProperty(property)
                && property !== 'prototype'
                && property !== 'isModule'
                && property !== '__includedModules'
                && property !== 'include'
                && property !== 'moduleName') {
                newModule[property] = definition[property];
            }
        }
        
        if (definition.hasOwnProperty('prototype') && definition.prototype) {
            for (property in definition.prototype) {
                if (definition.prototype.hasOwnProperty(property)) {
                    newModule.prototype[property] = definition.prototype[property];
                }
            }
        }
        
        nameSpace[moduleName] = newModule;
        
        return nameSpace[moduleName];
    };
    
    factory.includes = function () {
        for(var i = 0; i < arguments.length; i++){
            newModule.include(arguments[i]);
        }
        return factory;
    };
    
    return factory;
};

global.Class = function Class(classNameOrNameSpace, className) {
    var nameSpace, newClass, classFactory;
    nameSpace = (classNameOrNameSpace && className) ? classNameOrNameSpace : global;
    className = (classNameOrNameSpace && className) ? className :
        (classNameOrNameSpace) ? classNameOrNameSpace : 'class' + Math.random().toString();

    newClass = function() {
        if (this.init) {
            this.init.apply(this, arguments);
        }
    };

    newClass.__descendants = [];
    newClass.__implementedInterfaces = [];
    newClass.__includedModules = [];
    newClass.className = className;
    newClass.include = function(module) {
        var property;
        for (property in module) {
            if (module.hasOwnProperty(property)
                && property != 'prototype'
                && property != 'constructor'
                && property != 'isModule'
                && property != 'superClass'
                && property != 'include') {
                newClass[property] = module[property];
            }
        }

        if (module.hasOwnProperty('prototype') && module.prototype) {
            for (property in module.prototype) {
                if (module.prototype.hasOwnProperty(property)) {
                    newClass.prototype[property] = module.prototype[property];
                }
            }
        } else {
            module.prototype = {};
        }

        newClass.__includedModules.push(module);
        return this;
    };

    classFactory = function(classDefinition) {
        var i, il, j, jl, property, classPrototype = classDefinition.prototype;
        if (classPrototype) {
            for (property in classPrototype) {
                if (classPrototype.hasOwnProperty(property)) {
                    newClass.prototype[property] = classPrototype[property];
                }
            }
            delete classDefinition.prototype;
        }
        for (property in classDefinition) {
            if (classDefinition.hasOwnProperty(property)) {
                newClass[property] = classDefinition[property];
            }
        }

        for (i = 0, il = newClass.__implementedInterfaces.length; i < il; i++) {
            for (j = 0, jl = newClass.__implementedInterfaces[i].constructor.length; j < jl; j++) {
                if (!newClass[ newClass.__implementedInterfaces[i].constructor[j] ]) {
                    console.log('must implement static ' + newClass.__implementedInterfaces[i].name);
                    break;
                }
            }

            if (newClass.__implementedInterfaces[i].hasOwnProperty('prototype')
                && newClass.__implementedInterfaces[i].prototype) {
                for (j = 0, jl = newClass.__implementedInterfaces[i].prototype.length; j < jl; j++) {
                    if (!newClass.prototype[newClass.__implementedInterfaces[i].prototype[j]]) {
                        console.log('must implement prototype ' + newClass.__implementedInterfaces[i].name);
                        break;
                    }
                }
            }
        }

        try {
            if (Li && Li.ObjectSpy && Li.Spy) {
                newClass.__objectSpy = new Li.ObjectSpy();
                newClass.__objectSpy.spy(newClass);
                newClass.__objectSpy.spy(newClass.prototype);
            }
        } catch (error) {}

        nameSpace[className] = newClass;
        return newClass;
    };

    classFactory.inherits = function(superClass) {
        var i, inheritedClass;
        newClass.superClass = superClass;
        if (superClass.hasOwnProperty('__descendants')) {
            superClass.__descendants.push(newClass);
        }
        inheritedClass = function() {
        };
        inheritedClass.prototype = superClass.prototype;
        newClass.prototype = new inheritedClass();
        newClass.prototype.constructor = newClass;

        for (i in superClass) {
            if (superClass.hasOwnProperty(i)
                && i != 'prototype'
                && i !== 'className'
                && i !== 'superClass'
                && i !== 'include'
                && i != '__descendants') {
                newClass[i] = superClass[i];
            }
        }

        delete this.inherits;
        return this;
    };

    classFactory.ensures = function(interfaces) {
        for (var i = 0; i < arguments.length; i++) {
            newClass.__implementedInterfaces.push(arguments[i]);
        }
        delete this.ensures;
        return classFactory;
    };

    classFactory.includes = function() {
        for (var i = 0; i < arguments.length; i++) {
            newClass.include(arguments[i]);
        }
        return classFactory;
    };

    return classFactory;

};

Class('CustomEvent')({
    prototype : {
        bubbles                       : true,
        cancelable                    : true,
        currentTarget                 : null,
        timeStamp                     : 0,
        target                        : null,
        type                          : '',
        isPropagationStopped          : false,
        isDefaultPrevented            : false,
        isImmediatePropagationStopped : false,
        areImmediateHandlersPrevented : false,
        init : function init(type, data) {
            this.type = type;
            if (typeof data !== 'undefined') {
                for(var property in data) {
                    if (data.hasOwnProperty(property)) {
                        this[property] = data[property];
                    }
                }
            }
        },
        stopPropagation : function stopPropagation() {
            this.isPropagationStopped = true;
        },
        preventDefault : function preventDefault() {
            this.isDefaultPrevented = true;
        },
        stopImmediatePropagation : function stopImmediatePropagation() {
            this.preventImmediateHandlers();
            this.stopPropagation();
        },
        preventImmediateHandlers : function preventImmediateHandlers() {
            this.areImmediateHandlersPrevented = true;
        }
    }
});

Module('CustomEventSupport')({

    eventListeners : null,

    bind : function(type, eventHandler) {
        var found, i, listeners;

        if(!this.eventListeners) {
            this.eventListeners = {};
        }

        if(!this.eventListeners[type]) {
            this.eventListeners[type] = [];
        }

        found  = false;

        listeners = this.eventListeners[type];
        for (i = 0; i < listeners.length; i++) {
            if (listeners[i] === eventHandler) {
                found = true;
                break;
            }
        }

        if(!found) {
            this.eventListeners[type].push(eventHandler);
        }

        return this;
    },

    unbind : function(type, eventHandler) {
        var i, found, listeners;

        found  = false;

        if(!this.eventListeners) {
            this.eventListeners = {};
        }

        if(typeof eventHandler == 'undefined') {
            this.eventListeners[type] = [];
        }

        listeners = this.eventListeners[type];
        for (i = 0; i < listeners.length; i++) {
            if(listeners[i] === eventHandler) {
                found = true;
                break;
            }
        }

        if(found) {
            this.eventListeners[type].splice(i, 1);
        }

        return this;
    },

    dispatch : function(type, data) {
            var event, listeners, instance, i;

            if (this.eventListeners === null) {
                this.eventListeners = {};
            }

            if (typeof data === 'undefined') {
                data = {};
            }

            if (data.hasOwnProperty('target') === false) {
                data.target = this;
            }

            event         = new CustomEvent(type, data);
            listeners     = this.eventListeners[type] || [];
            instance      = this;

            for (i = 0; i < listeners.length; i = i + 1) {
                listeners[i].call(instance, event);
                if (event.areImmediateHandlersPrevented === true) {
                    break;
                }
            }

            return event;
    },

    prototype : {

        eventListeners : null,

        bind : function(type, eventHandler) {
            var found, i, listeners;

            if(!this.eventListeners) {
                this.eventListeners = {};
            }

            if(!this.eventListeners[type]) {
                this.eventListeners[type] = [];
            }

            found  = false;

            listeners = this.eventListeners[type];
            for (i = 0; i < listeners.length; i++) {
                if(listeners[i] === eventHandler) {
                    found = true;
                    break;
                }
            }

            if(!found) {
                this.eventListeners[type].push(eventHandler);
            }

            return this;
        },

        unbind : function(type, eventHandler) {
            var i, found, listeners;

            found = false;
            i     = 0;

            if(!this.eventListeners) {
                this.eventListeners = {};
            }

            if(typeof eventHandler == 'undefined') {
                this.eventListeners[type] = [];
            }

            listeners = this.eventListeners[type];
            for (i = 0; i < listeners.length; i++) {
                if(listeners[i] == eventHandler) {
                    found = true;
                    break;
                }
            }

            if(found) {
                this.eventListeners[type].splice(i, 1);
            }

            return this;
        },

        dispatch : function(type, data) {
            var event, listeners, instance, i;

            if (this.eventListeners === null) {
                this.eventListeners = {};
            }

            if (typeof data === 'undefined') {
                data = {};
            }

            if (data.hasOwnProperty('target') === false) {
                data.target = this;
            }

            event         = new CustomEvent(type, data);
            listeners     = this.eventListeners[type] || [];
            instance      = this;

            for (i = 0; i < listeners.length; i = i + 1) {
                listeners[i].call(instance, event);
                if (event.areImmediateHandlersPrevented === true) {
                    break;
                }
            }

            return event;
        }
    }
});

Module('NodeSupport')({
    prototype : {
        parent      : null,

        children    : [],

        appendChild : function(child) {
            if(child.parent) {
                child.parent.removeChild(child);
            }

            if(!this.hasOwnProperty('children')) {
                this.children = [];
            }

            this.children.push(child);
            this[child.name] = child;
            child.setParent(this);
            return child;
        },

        insertBefore : function (child, beforeChild) {
            var position;

            if (child.parent) {
                child.parent.removeChild(child);
            }

            if (!this.hasOwnProperty('children')) {
                this.children = [];
            }

            if (typeof beforeChild === 'undefined') {
                this.appendChild(child);
            } else {
                position = this.children.indexOf(beforeChild);
                this.children.splice(position, 0, child);

                this[child.name] = child;
                child.setParent(this);
            }

            return child;

        },

        insertChild : function(child, position) {
            console.warn('NodeSupport insertChild method is deprecated, try insertBefore');

            if (child.parent) {
                child.parent.removeChild(child);
            }

            if (!this.hasOwnProperty('children')) {
                this.children = [];
            }

            if (typeof position == 'undefined') {
                this.children.push(child);
                this[child.name] = child;
                child.setParent(this);
                return child;
            }

            this.children.splice(position, 0, child);
            this[child.name] = child;
            child.setParent(this);
            return child;
        },

        removeChild : function (child) {
            var position = this.children.indexOf(child);

            if (position !== -1) {
                this.children.splice(position, 1);
                delete this[child.name];
                child.parent = null;
            }

            return child;
        },

        setParent   : function (parent) {
            this.parent = parent;
            return this;
        },

        getDescendants : function () {
            var nodes = [];
            this.children.forEach(function (node) {
                nodes.push(node);
            });
            this.children.forEach(function (node) {
                nodes = nodes.concat(node.getDescendants());
            });
            return nodes;
        },

        getPreviousSibling : function () {
            if (typeof this.parent === 'undefined') {
                return;
            }

            if (this.parent.children[0] === this) {
                return;
            }

            return this.parent.children[ this.parent.children.indexOf(this) - 1 ];
        },

        getNextSibling : function () {
            if (typeof this.parent === 'undefined') {
                return;
            }

            if (this.parent.children[ this.parent.children.length - 1 ] === this) {
                return;
            }

            return this.parent.children[ this.parent.children.indexOf(this) + 1 ];
        }
    }
});

/**
Base Class from which almost all widgets are based overall the project

The main idea behind constructing a new widget toolkit instead of using one of the many high quality widget
toolkits avaliable is that we considered that currently, no widget system provides all the features that were
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
var myWidgetInstance = new Widget();
myWidgetInstance.render(document.body);

like this widget does renders does not display anything so lets give it something to display first
var myWidgetInstance = new Widget();
myWidgetInstance.element.innerHTML('Im a simple widget');
myWidgetInstance.render(document.body);

this reveals that internally every widget has an element property that is initialized by default to a HTMLElement,
this allow easy DOM manipulation.
@class Widget
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
            var property, temporalElement;

            Object.keys(config || {}).forEach(function (propertyName) {
                this[propertyName] = config[propertyName];
            }, this);

            if (this.element == null) {
                temporalElement = document.createElement('div');
                temporalElement.innerHTML = this.constructor.HTML.replace(/\s\s+/g, '');
                this.element = temporalElement.firstChild;
                this.element.classList.add(this.constructor.ELEMENT_CLASS);
                temporalElement = null;
            }

            if (this.hasOwnProperty('className') === true) {
                this.element.classList.add(this.className);
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
                    this.element.parentNode.removeChild(el);
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

(function() {
    var Utils = {
        reHash : new RegExp("^#"),
        reHEX : new RegExp("^(#)?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$"),
        reRGB : new RegExp("rgba?\\s*\\((\\d+)\\,\\s*(\\d+)\\,\\s*(\\d+)(,\\s*((\\d+)?(\\.\\d+)?))?\\)","i"),
        reHSL : new RegExp("hsla?\\((\\d+),\\s*([\\d.]+)%,\\s*([\\d.]+)%,?\\s*(?:0?(\\.\\d+)?|1(\\.0)?)?\\)","i"),

        isHEX : function isHEX(value) {
            return this.reHEX.test(value);
        },

        isRGB : function isRGB(value) {
            var rgb = value.match(this.reRGB);

            if (rgb) {
                if ((rgb[1] <= 255) && (rgb[2] <= 255) && (rgb[3] <= 255)) {
                    return true;
                }
            }

            return false;
        },

        isHSL : function isHSL(value) {
            var hsl = value.match(this.reHSL);

            if (hsl) {
                if ((hsl[1] <= 360) && (hsl[2] <= 100) && (hsl[3] <= 100)) {
                    return true;
                }
            }

            return false;
        },

        HEXtoRGB : function HEXtoRGB(hex) {
            hex = hex.replace('#', '');

            if (hex.length === 3) {
                var h1 = hex.charAt(0), h2 = hex.charAt(1), h3 = hex.charAt(2);
                hex = h1 + h1 + h2 + h2 + h3 + h3;
            }
            var bw = parseInt(hex, 16);

            return {r: (bw >> 16) & 255, g: (bw >> 8) & 255, b: bw & 255};
        },

        RGBtoHEX : function RGBtoHEX(r, g, b) {
            return (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },

        RGBtoHSL : function RGBtoHSL(r, g, b) {
            var min, max, h, s, l;

            r = (r / 255);
            g = (g / 255);
            b = (b / 255);

            max = Math.max(r, g, b);
            min = Math.min(r, g, b);
            l = ((max + min) / 2);

            if (max === min) h = s = 0;
            else {
                var d = (max - min);
                s = (l > 0.5) ? (d / (2 - max - min)) : (d / (max + min));

                if (max === r)      h = ((g - b) / d + (g < b ? 6 : 0));
                else if (max === g) h = ((b - r) / d + 2);
                else if (max === b) h = ((r - g) / d + 4);

                h /= 6;
            }

            return {h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100)};
        },

        HUEtoRGB : function HUEtoRGB(v1, v2, vh) {
            if (vh < 0) vh += 1;
            if (vh > 1) vh -= 1;

            if ((6 * vh) < 1) return (v1 + (v2 - v1) * 6 * vh);
            if ((2 * vh) < 1) return v2;
            if ((3 * vh) < 2) return (v1 + (v2 - v1) * ((2/3) - vh) * 6);
            return v1;
        },

        HSLtoRGB : function HSLtoRGB(h, s, l) {
            var r, g, b;

            h /= 360;
            s /= 100;
            l /= 100;

            if (s == 0) r = g = b = l;
            else {
                var q = (l < 0.5) ? (l * (1 + s)) : (l + s - l * s);
                var p = (2 * l - q);
                r = this.HUEtoRGB(p, q, h + 1/3);
                g = this.HUEtoRGB(p, q, h);
                b = this.HUEtoRGB(p, q, h - 1/3);
            }

            return {r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255)};
        },

        mix : function mix(color1, color2, percentage) {
            percentage = percentage || 50;

            var weight = (percentage / 100.0);
            var w = (weight * 2 - 1);
            var a = 0;

            var w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
            var w2 = (1 - w1);

            var r = Math.round(color1.rgb.r * w1 + color2.rgb.r * w2);
            var g = Math.round(color1.rgb.g * w1 + color2.rgb.g * w2);
            var b = Math.round(color1.rgb.b * w1 + color2.rgb.b * w2);

            return new Values(Utils.RGBtoHEX(r,g,b));
        }
    };

    function Values(color) {
        this.hex = '';
        this.hsl = {};
        this.rgb = {};

        if (color) return this.setColor(color);

        return this;
    }

    Values.Utils = {};
    Values.Utils = Utils;

    /**
    @return Values instance || Error [Object]
    */
    Values.prototype.setColor = function(color) {
        if (Utils.isHEX(color)) {
            return this._setFromHexString(color);
        } else if (Utils.isRGB(color)) {
            return this._setFromRGBString(color);
        } else if (Utils.isHSL(color)) {
            return this._setFromHSLString(color);
        }

        return new Error('Invalid Color Format');
    };

    /**
    Lightens the instance by mixing it with white as specified by @percentage.
    @method tint <public> [Function]
    @param percentage <optional> [Number] (0)
    @return new Values instance [Object]
    */
    Values.prototype.tint = function tint(percentage) {
        return Utils.mix({rgb:{r:255, g:255, b:255}}, this, percentage);
    };

    /**
    Darkens the instance color by mixing it with black as specified by @percentage.
    @method shade <public> [Function]
    @param percentage <optional> [Number] (0)
    @return new Values instance [Object]
    */
    Values.prototype.shade = function shade(percentage) {
        return Utils.mix({rgb:{r:0, g:0, b:0}}, this, percentage);
    };

    /**
    Darkens the instance color by mixing it with black as specified by @percentage.
    @method tints <public> [Function]
    @param percentage <optional> [Number] (1)
    @return Array of Values instances [Array]
    */
    Values.prototype.tints = function tint(percentage) {
        percentage = percentage || 1;

        var i = percentage;
        var tints = [];

        while (i <= 100) {
            tints.push(this.tint(i));
            i += percentage;
        };

        return tints;
    };

    /**
    Darkens the instance color by mixing it with black as specified by @percentage.
    @method shades <public> [Function]
    @param percentage <optional> [Number] (1)
    @return Array of Values instances [Array]
    */
    Values.prototype.shades = function tint(percentage) {
        percentage = percentage || 1;

        var i = percentage;
        var shades = [];

        while (i <= 100) {
            shades.push(this.shade(i));
            i += percentage;
        };

        return shades;
    };

    Values.prototype.all = function all(percentage) {
        percentage = percentage || 1;

        var tints = this.tints(percentage).reverse();
        var shades = this.shades(percentage);
        tints.push(this);

        return tints.concat(shades);
    };

    Values.prototype.getBrightness = function getBrightness() {
        var sum = (this.rgb.r + this.rgb.g + this.rgb.b);

        return Math.round(sum / (255 * 3) * 100);
    };

    /**
    Returns the instance color in hex format.
    @returns '#000000' [String]
    */
    Values.prototype.hexString = function() {
        return '#' + this.hex;
    };

    Values.prototype.rgbString = function() {
        return 'rgb(' + this.rgb.r + ', ' + this.rgb.g + ', ' + this.rgb.b + ')';
    };

    Values.prototype.hslString = function() {
        return 'hsl(' + this.hsl.h + ', ' + this.hsl.s + '%, ' + this.hsl.l + '%)';
    };


    /**
        @private methods
    */

    Values.prototype._setFromHexString = function _setFromHexString(color) {
        this.hex = (Utils.reHash.test(color)) ? color.replace('#','') : color;
        this.rgb = Utils.HEXtoRGB(color);
        this.hsl = Utils.RGBtoHSL(this.rgb.r, this.rgb.g, this.rgb.b);

        return this
    };

    Values.prototype._setFromRGBString = function _setFromRGBString(color) {
        var rgb = color.replace(/[^\d,]/g, '').split(','),
            r = parseInt(rgb[0], 10),
            g = parseInt(rgb[1], 10),
            b = parseInt(rgb[2], 10);

        this.rgb = {r: r, g: g, b: b};
        this.hex = Utils.RGBtoHEX(r, g, b);
        this.hsl = Utils.RGBtoHSL(this.rgb.r, this.rgb.g, this.rgb.b);

        return this;
    };

    Values.prototype._setFromHSLString = function _setFromHSLString(color) {
        var hsl = color.match(Utils.reHSL),
            h = Math.round(hsl[1]),
            s = Math.round(hsl[2]),
            l = Math.round(hsl[3]);

        this.hsl = {h: h, s: s, l: l};
        this.rgb = Utils.HSLtoRGB(h, s, l);
        this.hex = Utils.RGBtoHEX(this.rgb.r, this.rgb.g, this.rgb.b);

        return this;
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = Values;
    } else window.Values = Values;
})()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
// https://github.com/remy/polyfills/blob/master/classList.js
(function () {

if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

var prototype = Array.prototype,
    push = prototype.push,
    splice = prototype.splice,
    join = prototype.join;

function DOMTokenList(el) {
  this.el = el;
  // The className needs to be trimmed and split on whitespace
  // to retrieve a list of classes.
  var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
  for (var i = 0; i < classes.length; i++) {
    push.call(this, classes[i]);
  }
};

DOMTokenList.prototype = {
  add: function(token) {
    if(this.contains(token)) return;
    push.call(this, token);
    this.el.className = this.toString();
  },
  contains: function(token) {
    return this.el.className.indexOf(token) != -1;
  },
  item: function(index) {
    return this[index] || null;
  },
  remove: function(token) {
    if (!this.contains(token)) return;
    for (var i = 0; i < this.length; i++) {
      if (this[i] == token) break;
    }
    splice.call(this, i, 1);
    this.el.className = this.toString();
  },
  toString: function() {
    return join.call(this, ' ');
  },
  toggle: function(token) {
    if (!this.contains(token)) {
      this.add(token);
    } else {
      this.remove(token);
    }

    return this.contains(token);
  }
};

window.DOMTokenList = DOMTokenList;

function defineElementGetter (obj, prop, getter) {
    if (Object.defineProperty) {
        Object.defineProperty(obj, prop,{
            get : getter
        });
    } else {
        obj.__defineGetter__(prop, getter);
    }
}

defineElementGetter(Element.prototype, 'classList', function () {
  return new DOMTokenList(this);
});

})();
window.Sl = {};
Sl.UI = {};


Class(Sl.UI, 'Checkbox').inherits(Widget)({
    HTML : '\
        <div class="checkbox-wrapper">\
            <label>\
                <input type="checkbox">\
                <span class="checkbox-ui"></span>\
                <span class="checkbox-label"></span>\
            </label>\
        </div>\
        ',
    prototype : {
        id : null,
        checkbox : null,
        label : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this.checkbox = this.element.querySelector('[type="checkbox"]');
            this.label = this.element.querySelector('label');
            this.text = this.element.querySelector('.checkbox-label');

            this.checkbox.setAttribute('id', this.id);
            this.label.setAttribute('for', this.id);
            this.text.appendChild(document.createTextNode(this.id));

            this._bindEvents();
        },

        _bindEvents : function _bindEvents() {
            this.checkbox.addEventListener('change', this._checkboxChangeHandler.bind(this), false);

            return this;
        },

        /*
         * Dispatch the 'change' event.
         * @property _checkboxChangeHandler <private> [Function]
         * @return undefined
         */
        _checkboxChangeHandler : function _checkboxChangeHandler() {
            this.constructor.dispatch('change', this);
        },

        /**
         * Toggle the status of the checkbox and dispatch it's 'change' event.
         * @property toggle <pubilc> [Function]
         * @return Sl.UI.Checkbox
         */
        toggle : function toggle() {
            this.checkbox.click();

            return this;
        },

        destroy : function destroy() {
            this.id = null;
            this.checkbox = null;
            this.label = null;

            Widget.prototype.destroy.call(this);
        }
    }
})

Class(Sl.UI, 'Color').inherits(Widget)({
    HTML : '\
        <div class="item">\
            <div class="item__inner">\
            </div>\
        </div>\
    ',

    prototype : {
        inner : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);
            this.inner = this.element.querySelector('.item__inner');

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
            return this.element;
        },

        /**
         * Change the background-color of the element.
         * @property setBackgroundColor <public> [Function]
         * @argument color <required> [String]
         * @return Sl.UI.Color
         */
        setBackgroundColor : function setBackgroundColor(color) {
            this.element.style.backgroundColor = color;

            return this;
        },

        /**
         * Change the color of the element.
         * @property setColor <public> [Function]
         * @argument color <required> [String]
         * @return Sl.UI.Color
         */
        setColor : function setColor(color) {
            this.element.style.color = color;

            return this;
        },

        destroy : function destroy() {
            this.inner = null;
            Widget.prototype.destroy.call(this);

            return null;
        }
    }
})

Class(Sl.UI, 'ColorsCollection').inherits(Widget)({
    HTML : '\
        <div class="main-container" role="main-content">\
        </div>\
    ',
    prototype : {
        /**
         * Array to hold references to Sl.UI.Color instances.
         * @property _cached <private> [Array]
         */
        _cached : null,
        init : function init(config) {
            Widget.prototype.init.call(this, config);

            this._cached = [];
            this._storeInMemory(67);
        },

        /**
         * Store color instances in variables.
         * @property _storeInMemory <private> [Function]
         * @argument number_items <require> [Number] How many items to create.
         * @return Sl.UI.ColorsCollection
         */
        _storeInMemory : function _storeInMemory(number_items) {
            var i;

            for (i = 0; i < number_items; i++) {
                this._cached.push(new Sl.UI.Color());
            }

            return this;
        },

        /**
         * Return the DOM element reference.
         * @property getElement <public> [Function]
         * @return this.el [Object]
         */
        getElement : function getElement() {
            return this.element;
        },

        /**
         * Append and render Sl.UI.Color instances.
         * @property renderColors <public> [Function]
         * @return Sl.UI.ColorsCollection
         */
        renderColors : function renderColors() {
            this._cached.forEach(function(child) {
                this.appendChild(child).render(this.element);
            }, this);

            return this;
        }
    }
})

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

Class(Sl.UI, 'Paragraph').inherits(Widget)({
    HTML : '<p></p>',
    prototype : {
        init : function init(config) {
            Widget.prototype.init.call(this, config);
        },

        /**
         * Return the DOM element reference.
         * @property getElement <public> [Function]
         * @return this.el [Object]
         */
        getElement : function getElement() {
            return this.element;
        },

        /**
         * Change the text of the element.
         * @property setText <public> [Function]
         * @argument text <optional> [String]
         * @return Sl.UI.Paragraph
         */
        setText : function setText(text) {
            this.element.textContent = text;

            return this;
        },

        destroy : function destroy() {
            Widget.prototype.destroy.call(this);

            return null;
        }
    }
})

Class(Sl, 'App').includes(CustomEventSupport, NodeSupport)({
    prototype : {
        _body : null,
        _values : null,
        _hash : null,
        _ui : null,
        init : function init() {
            this._body = document.body;
            this._hash = window.location.hash;
            this._ui = {
                colorPicker : document.querySelector('[type="color"]'),
                preview : document.querySelector('.preview__color'),
                optionsWrapper : document.querySelector('.options-wrapper'),
                input : document.querySelector('[name="input"]'),
                randomColorBtn : document.querySelector('.random-color-btn'),
                creditsBtn : document.querySelector('.credits-btn'),
            }
        },

        /**
         * Boot the little app.
         * @property run <public> [Function]
         * @return Sl.App [Object]
         */
        run : function run() {
            var color;

            if (this._isValidColorModel(this._hash)) {
                color = this._hash;
            } else {
                color = this._getRandomHexColor();
            }

            this._values = new Values();

            this.appendChild(new Sl.UI.Checkbox({
                name : 'checkboxHex',
                id : 'hex'
            }));

            this.appendChild(new Sl.UI.Checkbox({
                name : 'checkboxRgb',
                id : 'rgb'
            }));

            this.appendChild(new Sl.UI.Checkbox({
                name : 'checkboxHsl',
                id : 'hsl'
            }));

            this.appendChild(new Sl.UI.ColorsCollection({
                name : 'colorsContainer'
            }));

            this.appendChild(new Sl.UI.CreditsModal({
                name : 'creditsModal'
            }));

            this.checkboxHex.render(this._ui.optionsWrapper);
            this.checkboxRgb.render(this._ui.optionsWrapper);
            this.checkboxHsl.render(this._ui.optionsWrapper);
            this.colorsContainer.renderColors().render(this._body, this._body.querySelector('footer'));
            this.creditsModal.render(this._body);
            this.updateUI(color);
            this._bindEvents();

            this.checkboxHex.toggle();
            this.checkboxRgb.toggle();

            return this;
        },

        _bindEvents : function _bindEvents() {
            window.addEventListener('hashchange', this._hashChangeHandler.bind(this), false);
            this._ui.preview.addEventListener("click", this._previewClickHandler.bind(this));
            this._ui.colorPicker.addEventListener("change", this._colorPickerChangeHandler.bind(this));
            this._ui.input.addEventListener("keypress", this._inputKeypressHandler.bind(this), false);
            this._ui.input.addEventListener("click", function(event) {
                event.target.select();
            }.bind(this));
            this._ui.randomColorBtn.addEventListener('click', this._randomColorClickHandler.bind(this));
            this._ui.creditsBtn.addEventListener("click", this._creditsClickHandler.bind(this));

            Sl.UI.Checkbox.bind('change', function(data) {
                this._checkboxChangeHandler.call(this, data.checkbox);
            }.bind(this));

            this.creditsModal.bind('render', function() {
                var app = this;

                setTimeout(function() {
                    app.creditsModal.activate();
                }, 0);
            }.bind(this));

            return this;
        },

        /**
         * Compare the current color vs the hexadecimal color code represented
         * by the hash. If they are different then the ui is updated with the
         * color holded on the hash.
         * @property _hashChangeHandler <private> [Function]
         * @return Sl.App [Object]
         */
        _hashChangeHandler : function _hashChangeHandler() {
            var newColor = window.location.hash;

            if (this._hash !== newColor) {
                if (this._isValidColorModel(newColor)) {
                    this.updateUI(newColor);
                }
            }

            newColor = null;

            return this;
        },

        /**
         * For browser that support the color input type, a native color picker
         * will be displayed so we can select a color.
         * @property _previewClickHandler <private> [Function]
         * @return Sl.App [Object]
         */
        _previewClickHandler : function _previewClickHandler() {
            this._ui.colorPicker.click();

            return this;
        },

        /**
         * Get the current color holded as value on the color-picker an update
         * the ui using that color as new value.
         * @property _colorPickerChangeHandler <private> [Function]
         * @return Sl.App [Object]
         */
        _colorPickerChangeHandler : function _colorPickerChangeHandler() {
            this.updateUI(this._ui.colorPicker.value);

            return this;
        },

        /*
         * Checks if the text typed on the input is a valid hex or rgb color.
         * If so the ui is updated with that color, otherwhise an 'error'
         * css-class is added to the input to show feedback.
         * @property _inputKeypressHandler <private> [Function]
         * @return Sl.App [Object]
         */
        _inputKeypressHandler : function _inputKeypressHandler(e) {
            var charCode, newColor;

           charCode = (typeof e.which === "number") ? e.which : e.keyCode;

            if (charCode === 13) {
                newColor = this._ui.input.value;

                if (this._isValidColorModel(newColor)) {
                    this.updateUI(newColor);
                    this._ui.input.classList.remove('error');
                } else {
                    this._ui.input.classList.add('error');
                }
            }

            charCode = newColor = null;

            return this;
        },

        /**
         * Render the creditsModal.
         * @property _creditsClickHandler <private> [Function]
         * @return Sl.App [Object]
         */
        _creditsClickHandler : function _creditsClickHandler(ev) {
            ev.preventDefault();
            this.creditsModal.activate();

            return this;
        },

        /**
         * Update the ui with a new random color.
         * @property _randomColorClickHandler <private> [Function]
         * @return Sl.App [Object]
         */
        _randomColorClickHandler : function _randomColorClickHandler(event) {
            return this.updateUI(this._getRandomHexColor());
        },

        /**
         * Handle the change event dispached by the checkbox widgets.
         * @property _checkboxChangeHandler <private> [Function]
         * @argument element <required> [DOMElement]
         * @return undefined
         */
        _checkboxChangeHandler : function _checkboxChangeHandler(element) {
            var className, isChecked, action;

            className = 'show--' + element.id;
            isChecked = element.checked;
            action = isChecked ? 'add' : 'remove';

            this.colorsContainer.getElement().classList[action](className);

            className = isChecked = action = null;
        },

        /**
         * Checks if the String is a valid hex or rgb color model using
         * the helper methods provided by Values.js
         * @property _isValidColorModel <private> [Function]
         * @argument color <required> [String]
         * @return true|false [Boolean]
         */
        _isValidColorModel : function _isValidColorModel(color) {
            if (Values.Utils.isHEX(color)) return true;
            if (Values.Utils.isRGB(color)) return true;
            if (Values.Utils.isHSL(color)) return true;

            return false;
        },

        /**
         * Updates the hash with the passed argument.
         * @property _updateHash <private> [Function]
         * @argument hash <required> [String]
         * @return Sl.App [Object]
         */
        _updateHash : function _updateHash(hash) {
            this._hash = window.location.hash = hash;

            return this;
        },

        /**
         * Return a valid random hexadecimal color code.
         * @property _getRandomHexColor <public> [Function]
         * @return #000000 [String]
         */
        _getRandomHexColor : function _getRandomHexColor() {
            return "#" +  Math.random().toString(16).slice(2, 8);
        },

        /**
         * Update the whole UI with a the passed color as param.
         * @property updateUI <public> [Function]
         * @argument color <required> [String] A valid hexadecimal color code.
         * @return Sl.App [Object]
         */
        updateUI : function updateUI(color) {
            var baseColor;

            this._values.setColor(color);
            this._updateHash(this._values.hex.toUpperCase());
            this._ui.preview.style.backgroundColor = this._values.hexString();
            this._ui.colorPicker.value = this._values.hexString();
            this._ui.input.value = this._values.hexString();

            this.colorsContainer.children.forEach(function(child, index) {
                var value, textColor, element;

                value = this._values.all(3)[index];
                textColor = (value.getBrightness() > 50) ? '#000' : '#fff';
                element = child.getElement();

                element.classList.remove("original");

                if (value.hex === this._values.hex) {
                    element.classList.add("original");
                    baseColor = element;
                }

                child.setBackgroundColor(value.hexString()).setColor(textColor);
                child.hexLabel.setText(value.hexString());
                child.rgbLabel.setText(value.rgbString());
                child.hslLabel.setText(value.hslString());

                value = textColor = element = null;
            }, this);

            this._body.scrollTop = 0;

            if (baseColor !== undefined) {
                this._body.scrollTop = (baseColor.getBoundingClientRect().top - 80);
            }

            baseColor = null;

            return this;
        },

        destroy : function destroy() {
            this._body = null;
            this._values = null;
            this._hash = null;
            this._ui = null;

            Widget.prototype.destroy.call(this);
        }
    }
});

(function() {
    Shadowlord = new Sl.App();
    Shadowlord.run();
})();
