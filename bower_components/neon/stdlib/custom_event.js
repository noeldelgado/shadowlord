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
