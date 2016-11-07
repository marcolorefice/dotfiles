var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require('./view');
var $ = view.$;
var AwesomePanelView = (function (_super) {
    __extends(AwesomePanelView, _super);
    function AwesomePanelView() {
        _super.apply(this, arguments);
    }
    AwesomePanelView.content = function () {
        var _this = this;
        return this.div({ class: 'awesome' }, function () { return _this.div({ class: 'dude', outlet: 'something' }); });
    };
    AwesomePanelView.prototype.init = function () {
        this.something.html('<div>tada</div>');
    };
    return AwesomePanelView;
})(view.View);
exports.AwesomePanelView = AwesomePanelView;
exports.panelView;
exports.panel;
function attach() {
    exports.panelView = new AwesomePanelView({});
    exports.panel = atom.workspace.addModalPanel({ item: exports.panelView, priority: 1000, visible: false });
    /*setInterval(() => {
        panel.isVisible() ? panel.hide() : panel.show();
        console.log('called');
    }, 1000);*/
}
exports.attach = attach;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvc3RlZmFuby8uYXRvbS9wYWNrYWdlcy9hdG9tLXR5cGVzY3JpcHQvbGliL21haW4vYXRvbS92aWV3cy9hd2Vzb21lUGFuZWxWaWV3LnRzIiwic291cmNlcyI6WyIvaG9tZS9zdGVmYW5vLy5hdG9tL3BhY2thZ2VzL2F0b20tdHlwZXNjcmlwdC9saWIvbWFpbi9hdG9tL3ZpZXdzL2F3ZXNvbWVQYW5lbFZpZXcudHMiXSwibmFtZXMiOlsiQXdlc29tZVBhbmVsVmlldyIsIkF3ZXNvbWVQYW5lbFZpZXcuY29uc3RydWN0b3IiLCJBd2Vzb21lUGFuZWxWaWV3LmNvbnRlbnQiLCJBd2Vzb21lUGFuZWxWaWV3LmluaXQiLCJhdHRhY2giXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU8sSUFBSSxXQUFXLFFBQVEsQ0FBQyxDQUFDO0FBQ2hDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFFZixJQUFhLGdCQUFnQjtJQUFTQSxVQUF6QkEsZ0JBQWdCQSxVQUF1QkE7SUFBcERBLFNBQWFBLGdCQUFnQkE7UUFBU0MsOEJBQWNBO0lBWXBEQSxDQUFDQTtJQVRVRCx3QkFBT0EsR0FBZEE7UUFBQUUsaUJBSUNBO1FBSEdBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLEtBQUtBLEVBQUVBLFNBQVNBLEVBQUVBLEVBQ2hDQSxjQUFNQSxPQUFBQSxLQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxLQUFLQSxFQUFFQSxNQUFNQSxFQUFFQSxNQUFNQSxFQUFFQSxXQUFXQSxFQUFFQSxDQUFDQSxFQUFoREEsQ0FBZ0RBLENBQ3JEQSxDQUFDQTtJQUNWQSxDQUFDQTtJQUVERiwrQkFBSUEsR0FBSkE7UUFDSUcsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxDQUFDQTtJQUMzQ0EsQ0FBQ0E7SUFDTEgsdUJBQUNBO0FBQURBLENBQUNBLEFBWkQsRUFBc0MsSUFBSSxDQUFDLElBQUksRUFZOUM7QUFaWSx3QkFBZ0IsR0FBaEIsZ0JBWVosQ0FBQTtBQUVVLGlCQUEyQixDQUFDO0FBQzVCLGFBQXFCLENBQUM7QUFDakMsU0FBZ0IsTUFBTTtJQUNsQkksaUJBQVNBLEdBQUdBLElBQUlBLGdCQUFnQkEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7SUFDckNBLGFBQUtBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLGFBQWFBLENBQUNBLEVBQUVBLElBQUlBLEVBQUVBLGlCQUFTQSxFQUFFQSxRQUFRQSxFQUFFQSxJQUFJQSxFQUFFQSxPQUFPQSxFQUFFQSxLQUFLQSxFQUFFQSxDQUFDQSxDQUFDQTtJQUUxRkE7OztlQUdXQTtBQUVmQSxDQUFDQTtBQVRlLGNBQU0sR0FBTixNQVNmLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xudmFyICQgPSB2aWV3LiQ7XG5cbmV4cG9ydCBjbGFzcyBBd2Vzb21lUGFuZWxWaWV3IGV4dGVuZHMgdmlldy5WaWV3PGFueT4ge1xuXG4gICAgcHJpdmF0ZSBzb21ldGhpbmc6IEpRdWVyeTtcbiAgICBzdGF0aWMgY29udGVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2KHsgY2xhc3M6ICdhd2Vzb21lJyB9LFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5kaXYoeyBjbGFzczogJ2R1ZGUnLCBvdXRsZXQ6ICdzb21ldGhpbmcnIH0pXG4gICAgICAgICAgICApO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuc29tZXRoaW5nLmh0bWwoJzxkaXY+dGFkYTwvZGl2PicpO1xuICAgIH1cbn1cblxuZXhwb3J0IHZhciBwYW5lbFZpZXc6IEF3ZXNvbWVQYW5lbFZpZXc7XG5leHBvcnQgdmFyIHBhbmVsOiBBdG9tQ29yZS5QYW5lbDtcbmV4cG9ydCBmdW5jdGlvbiBhdHRhY2goKSB7XG4gICAgcGFuZWxWaWV3ID0gbmV3IEF3ZXNvbWVQYW5lbFZpZXcoe30pO1xuICAgIHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHBhbmVsVmlldywgcHJpb3JpdHk6IDEwMDAsIHZpc2libGU6IGZhbHNlIH0pO1xuXG4gICAgLypzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIHBhbmVsLmlzVmlzaWJsZSgpID8gcGFuZWwuaGlkZSgpIDogcGFuZWwuc2hvdygpO1xuICAgICAgICBjb25zb2xlLmxvZygnY2FsbGVkJyk7XG4gICAgfSwgMTAwMCk7Ki9cblxufVxuIl19
//# sourceURL=/home/stefano/.atom/packages/atom-typescript/lib/main/atom/views/awesomePanelView.ts
