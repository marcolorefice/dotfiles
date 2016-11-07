var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var sp = require("atom-space-pen-views");
var View = (function (_super) {
    __extends(View, _super);
    function View(options) {
        _super.call(this);
        this.options = options;
        this.init();
    }
    Object.defineProperty(View.prototype, "$", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    View.content = function () {
        throw new Error('Must override the base View static content member');
    };
    View.prototype.init = function () {
    };
    return View;
})(sp.View);
exports.View = View;
exports.$ = sp.$;
var ScrollView = (function (_super) {
    __extends(ScrollView, _super);
    function ScrollView(options) {
        _super.call(this);
        this.options = options;
        this.init();
    }
    Object.defineProperty(ScrollView.prototype, "$", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    ScrollView.content = function () {
        throw new Error('Must override the base View static content member');
    };
    ScrollView.prototype.init = function () {
    };
    return ScrollView;
})(sp.ScrollView);
exports.ScrollView = ScrollView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvc3RlZmFuby8uYXRvbS9wYWNrYWdlcy9hdG9tLXR5cGVzY3JpcHQvbGliL21haW4vYXRvbS92aWV3cy92aWV3LnRzIiwic291cmNlcyI6WyIvaG9tZS9zdGVmYW5vLy5hdG9tL3BhY2thZ2VzL2F0b20tdHlwZXNjcmlwdC9saWIvbWFpbi9hdG9tL3ZpZXdzL3ZpZXcudHMiXSwibmFtZXMiOlsiVmlldyIsIlZpZXcuY29uc3RydWN0b3IiLCJWaWV3LiQiLCJWaWV3LmNvbnRlbnQiLCJWaWV3LmluaXQiLCJTY3JvbGxWaWV3IiwiU2Nyb2xsVmlldy5jb25zdHJ1Y3RvciIsIlNjcm9sbFZpZXcuJCIsIlNjcm9sbFZpZXcuY29udGVudCIsIlNjcm9sbFZpZXcuaW5pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBTyxFQUFFLFdBQVcsc0JBQXNCLENBQUMsQ0FBQztBQUU1QyxJQUFhLElBQUk7SUFBa0JBLFVBQXRCQSxJQUFJQSxVQUF5QkE7SUFTdENBLFNBVFNBLElBQUlBLENBU01BLE9BQWdCQTtRQUMvQkMsaUJBQU9BLENBQUNBO1FBRE9BLFlBQU9BLEdBQVBBLE9BQU9BLENBQVNBO1FBRS9CQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTtJQUNoQkEsQ0FBQ0E7SUFYREQsc0JBQUlBLG1CQUFDQTthQUFMQTtZQUNJRSxNQUFNQSxDQUFNQSxJQUFJQSxDQUFDQTtRQUNyQkEsQ0FBQ0E7OztPQUFBRjtJQUVNQSxZQUFPQSxHQUFkQTtRQUNJRyxNQUFNQSxJQUFJQSxLQUFLQSxDQUFDQSxtREFBbURBLENBQUNBLENBQUNBO0lBQ3pFQSxDQUFDQTtJQU1ESCxtQkFBSUEsR0FBSkE7SUFBU0ksQ0FBQ0E7SUFDZEosV0FBQ0E7QUFBREEsQ0FBQ0EsQUFkRCxFQUFtQyxFQUFFLENBQUMsSUFBSSxFQWN6QztBQWRZLFlBQUksR0FBSixJQWNaLENBQUE7QUFFVSxTQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUVwQixJQUFhLFVBQVU7SUFBa0JLLFVBQTVCQSxVQUFVQSxVQUErQkE7SUFTbERBLFNBVFNBLFVBQVVBLENBU0FBLE9BQWdCQTtRQUMvQkMsaUJBQU9BLENBQUNBO1FBRE9BLFlBQU9BLEdBQVBBLE9BQU9BLENBQVNBO1FBRS9CQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTtJQUNoQkEsQ0FBQ0E7SUFYREQsc0JBQUlBLHlCQUFDQTthQUFMQTtZQUNJRSxNQUFNQSxDQUFNQSxJQUFJQSxDQUFDQTtRQUNyQkEsQ0FBQ0E7OztPQUFBRjtJQUVNQSxrQkFBT0EsR0FBZEE7UUFDSUcsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EsbURBQW1EQSxDQUFDQSxDQUFDQTtJQUN6RUEsQ0FBQ0E7SUFNREgseUJBQUlBLEdBQUpBO0lBQVNJLENBQUNBO0lBQ2RKLGlCQUFDQTtBQUFEQSxDQUFDQSxBQWRELEVBQXlDLEVBQUUsQ0FBQyxVQUFVLEVBY3JEO0FBZFksa0JBQVUsR0FBVixVQWNaLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJcblxuaW1wb3J0IHNwID0gcmVxdWlyZShcImF0b20tc3BhY2UtcGVuLXZpZXdzXCIpO1xuXG5leHBvcnQgY2xhc3MgVmlldzxPcHRpb25zPiBleHRlbmRzIHNwLlZpZXcge1xuICAgIGdldCAkKCk6IEpRdWVyeSB7XG4gICAgICAgIHJldHVybiA8YW55PnRoaXM7XG4gICAgfVxuXG4gICAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBvdmVycmlkZSB0aGUgYmFzZSBWaWV3IHN0YXRpYyBjb250ZW50IG1lbWJlcicpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBvcHRpb25zOiBPcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cbiAgICBpbml0KCkgeyB9XG59XG5cbmV4cG9ydCB2YXIgJCA9IHNwLiQ7XG5cbmV4cG9ydCBjbGFzcyBTY3JvbGxWaWV3PE9wdGlvbnM+IGV4dGVuZHMgc3AuU2Nyb2xsVmlldyB7XG4gICAgZ2V0ICQoKTogSlF1ZXJ5IHtcbiAgICAgICAgcmV0dXJuIDxhbnk+dGhpcztcbiAgICB9XG5cbiAgICBzdGF0aWMgY29udGVudCgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IG92ZXJyaWRlIHRoZSBiYXNlIFZpZXcgc3RhdGljIGNvbnRlbnQgbWVtYmVyJyk7XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHVibGljIG9wdGlvbnM6IE9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICAgIGluaXQoKSB7IH1cbn0iXX0=
//# sourceURL=/home/stefano/.atom/packages/atom-typescript/lib/main/atom/views/view.ts
