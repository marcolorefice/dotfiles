var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var view = require('./view');
var $ = view.$;
var PlainMessageView = (function (_super) {
    __extends(PlainMessageView, _super);
    function PlainMessageView() {
        _super.apply(this, arguments);
    }
    PlainMessageView.content = function () {
        this.div({
            class: 'plain-message'
        });
    };
    PlainMessageView.prototype.init = function () {
        this.$.html(this.options.message);
        this.$.addClass(this.options.className);
    };
    PlainMessageView.prototype.getSummary = function () {
        return {
            summary: this.options.message,
            rawSummary: true,
            className: this.options.className
        };
    };
    return PlainMessageView;
})(view.View);
exports.PlainMessageView = PlainMessageView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvc3RlZmFuby8uYXRvbS9wYWNrYWdlcy9hdG9tLXR5cGVzY3JpcHQvbGliL21haW4vYXRvbS92aWV3cy9wbGFpbk1lc3NhZ2VWaWV3LnRzIiwic291cmNlcyI6WyIvaG9tZS9zdGVmYW5vLy5hdG9tL3BhY2thZ2VzL2F0b20tdHlwZXNjcmlwdC9saWIvbWFpbi9hdG9tL3ZpZXdzL3BsYWluTWVzc2FnZVZpZXcudHMiXSwibmFtZXMiOlsiUGxhaW5NZXNzYWdlVmlldyIsIlBsYWluTWVzc2FnZVZpZXcuY29uc3RydWN0b3IiLCJQbGFpbk1lc3NhZ2VWaWV3LmNvbnRlbnQiLCJQbGFpbk1lc3NhZ2VWaWV3LmluaXQiLCJQbGFpbk1lc3NhZ2VWaWV3LmdldFN1bW1hcnkiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQU8sSUFBSSxXQUFXLFFBQVEsQ0FBQyxDQUFDO0FBQ2hDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFTZixJQUFhLGdCQUFnQjtJQUFTQSxVQUF6QkEsZ0JBQWdCQSxVQUErQkE7SUFBNURBLFNBQWFBLGdCQUFnQkE7UUFBU0MsOEJBQXNCQTtJQW9CNURBLENBQUNBO0lBbEJVRCx3QkFBT0EsR0FBZEE7UUFDSUUsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDTEEsS0FBS0EsRUFBRUEsZUFBZUE7U0FDekJBLENBQUNBLENBQUNBO0lBQ1BBLENBQUNBO0lBRURGLCtCQUFJQSxHQUFKQTtRQUNJRyxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUNsQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7SUFDNUNBLENBQUNBO0lBRURILHFDQUFVQSxHQUFWQTtRQUNJSSxNQUFNQSxDQUFDQTtZQUNIQSxPQUFPQSxFQUFFQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQTtZQUM3QkEsVUFBVUEsRUFBRUEsSUFBSUE7WUFDaEJBLFNBQVNBLEVBQUVBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBO1NBQ3BDQSxDQUFDQTtJQUNOQSxDQUFDQTtJQUNMSix1QkFBQ0E7QUFBREEsQ0FBQ0EsQUFwQkQsRUFBc0MsSUFBSSxDQUFDLElBQUksRUFvQjlDO0FBcEJZLHdCQUFnQixHQUFoQixnQkFvQlosQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB2aWV3ID0gcmVxdWlyZSgnLi92aWV3Jyk7XG52YXIgJCA9IHZpZXcuJDtcbmltcG9ydCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFZpZXdPcHRpb25zIHtcbiAgICAvKiogeW91ciBtZXNzYWdlIHRvIHRoZSBwZW9wbGUgKi9cbiAgICBtZXNzYWdlOiBzdHJpbmc7XG4gICAgY2xhc3NOYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBQbGFpbk1lc3NhZ2VWaWV3IGV4dGVuZHMgdmlldy5WaWV3PFZpZXdPcHRpb25zPiB7XG5cbiAgICBzdGF0aWMgY29udGVudCgpIHtcbiAgICAgICAgdGhpcy5kaXYoe1xuICAgICAgICAgICAgY2xhc3M6ICdwbGFpbi1tZXNzYWdlJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLiQuaHRtbCh0aGlzLm9wdGlvbnMubWVzc2FnZSk7XG4gICAgICAgIHRoaXMuJC5hZGRDbGFzcyh0aGlzLm9wdGlvbnMuY2xhc3NOYW1lKTtcbiAgICB9XG5cbiAgICBnZXRTdW1tYXJ5KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3VtbWFyeTogdGhpcy5vcHRpb25zLm1lc3NhZ2UsXG4gICAgICAgICAgICByYXdTdW1tYXJ5OiB0cnVlLFxuICAgICAgICAgICAgY2xhc3NOYW1lOiB0aGlzLm9wdGlvbnMuY2xhc3NOYW1lXG4gICAgICAgIH07XG4gICAgfVxufSJdfQ==
//# sourceURL=/home/stefano/.atom/packages/atom-typescript/lib/main/atom/views/plainMessageView.ts
