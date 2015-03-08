Module('BubblingSupport')({
        dispatch : function (type, data) {
            data = data || {};
            var event = CustomEventSupport.prototype.dispatch.call(this, type, data);
            if (event.isPropagationStopped === false) {
                if (this.parent && this.parent.dispatch) {
                    data.target = event.target;
                    data.currentTarget = this.parent;
                    this.parent.dispatch(event.type, data);
                }
            }
            return event;
        },

        prototype : {
            dispatch : function (type, data) {
                data = data || {};

                var event = CustomEventSupport.prototype.dispatch.call(this, type, data);

                if (event.isPropagationStopped === false && event.bubbles === true) {
                    if (this.parent && this.parent.dispatch) {
                        data.target = event.target;
                        data.currentTarget = this.parent;
                        this.parent.dispatch(event.type, data);
                    }
                }

                return event;
            }
        }
    });
