var $ = require('jquery');

module.exports = {
    render: function(o){
        o.beforeRender && o.beforeRender();
        var target = this.getDOM(o.target || (o.conf && o.conf.target) || (o.params && o.params.target) || null);
        if(o.tpl){
            var tmpDOM = document.createElement('div');
            tmpDOM.innerHTML = o.tpl;
            var parent = target.parentElement;
            var targetDOM = tmpDOM.firstChild;
            parent.replaceChild(targetDOM, target);
            target = targetDOM;
        }
        if(target){
            o.dom = target;
            o.doms = this.bindDOMs(target, o.doms);
            this.bindEvents(target, o.events, o);
        }
        return o;
    },
    getDOM: function(o){
        return typeof o == 'string' ? document.body.querySelector(o) : o;
    },
    bindDOMs: function(dom, selectors){
        var doms = {};
        if(selectors){
            selectors = selectors || {};
            for(var key in selectors){
                if(selectors.hasOwnProperty(key)){
                    var selector = selectors[key];
                    doms[key] = dom.querySelector(selector);
                }
            }
        }
        return doms;
    },
    bindEvents: function(dom, events, ctx){
        if(events){
            for(var key in events){
                if(events.hasOwnProperty(key)){
                    var event = this.parseEvent(key);
                    var handler = events[key];
                    (function(e, h){
                        $(dom).on(e.name, e.selector, function(evt){
                            var returnValue = null;
                            if(h){
                                returnValue = h.call(ctx, this, evt);
                                if(returnValue !== undefined){
                                    return returnValue;
                                }
                            }
                        });
                    })(event, handler);
                }
            }
        }
    },
    parseEvent: function(evt){
        var e = {
            name: 'click',
            selector: null
        };
        var evtSecs = evt.split(':');
        if(evtSecs.length > 1){
            e.name = evtSecs[0];
            e.selector = evtSecs[1];
        }else{
            e.selector = evtSecs[0];
        }
        return e;
    }
};