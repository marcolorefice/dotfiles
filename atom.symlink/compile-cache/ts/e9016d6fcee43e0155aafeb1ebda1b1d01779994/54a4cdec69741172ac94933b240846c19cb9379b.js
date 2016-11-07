var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var atomUtils = require("../atomUtils");
/**
 * https://github.com/atom/atom-space-pen-views
 */
var FileSymbolsView = (function (_super) {
    __extends(FileSymbolsView, _super);
    function FileSymbolsView() {
        _super.apply(this, arguments);
        this.panel = null;
    }
    Object.defineProperty(FileSymbolsView.prototype, "$", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    FileSymbolsView.prototype.setNavBarItems = function (tsItems, filePath) {
        var items = tsItems;
        this.filePath = filePath;
        super.setItems.call(this, items);
    };
    /** override */
    FileSymbolsView.prototype.viewForItem = function (item) {
        return "\n            <li>\n                <div class=\"highlight\">" + (Array(item.indent * 2).join('&nbsp;') + (item.indent ? "\u221F " : '') + item.text) + "</div>\n                <div class=\"pull-right\" style=\"font-weight: bold; color:" + atomUtils.kindToColor(item.kind) + "\">" + item.kind + "</div>\n                <div class=\"clear\"> line: " + (item.position.line + 1) + "</div>\n            </li>\n        ";
    };
    /** override */
    FileSymbolsView.prototype.confirmed = function (item) {
        atom.workspace.open(this.filePath, {
            initialLine: item.position.line,
            initialColumn: item.position.col
        });
        this.hide();
    };
    FileSymbolsView.prototype.getFilterKey = function () {
        return 'text';
    };
    FileSymbolsView.prototype.show = function () {
        this.storeFocusedElement();
        if (!this.panel)
            this.panel = atom.workspace.addModalPanel({ item: this });
        this.panel.show();
        this.focusFilterEditor();
    };
    FileSymbolsView.prototype.hide = function () {
        this.panel.hide();
        this.restoreFocus();
    };
    FileSymbolsView.prototype.cancelled = function () {
        this.hide();
    };
    return FileSymbolsView;
})(sp.SelectListView);
exports.FileSymbolsView = FileSymbolsView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvc3RlZmFuby8uYXRvbS9wYWNrYWdlcy9hdG9tLXR5cGVzY3JpcHQvbGliL21haW4vYXRvbS92aWV3cy9maWxlU3ltYm9sc1ZpZXcudHMiLCJzb3VyY2VzIjpbIi9ob21lL3N0ZWZhbm8vLmF0b20vcGFja2FnZXMvYXRvbS10eXBlc2NyaXB0L2xpYi9tYWluL2F0b20vdmlld3MvZmlsZVN5bWJvbHNWaWV3LnRzIl0sIm5hbWVzIjpbIkZpbGVTeW1ib2xzVmlldyIsIkZpbGVTeW1ib2xzVmlldy5jb25zdHJ1Y3RvciIsIkZpbGVTeW1ib2xzVmlldy4kIiwiRmlsZVN5bWJvbHNWaWV3LnNldE5hdkJhckl0ZW1zIiwiRmlsZVN5bWJvbHNWaWV3LnZpZXdGb3JJdGVtIiwiRmlsZVN5bWJvbHNWaWV3LmNvbmZpcm1lZCIsIkZpbGVTeW1ib2xzVmlldy5nZXRGaWx0ZXJLZXkiLCJGaWxlU3ltYm9sc1ZpZXcuc2hvdyIsIkZpbGVTeW1ib2xzVmlldy5oaWRlIiwiRmlsZVN5bWJvbHNWaWV3LmNhbmNlbGxlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsSUFBTyxTQUFTLFdBQVcsY0FBYyxDQUFDLENBQUM7QUFNM0MsQUFIQTs7R0FFRztJQUNVLGVBQWU7SUFBU0EsVUFBeEJBLGVBQWVBLFVBQTBCQTtJQUF0REEsU0FBYUEsZUFBZUE7UUFBU0MsOEJBQWlCQTtRQXVDbERBLFVBQUtBLEdBQW1CQSxJQUFJQSxDQUFDQTtJQWdCakNBLENBQUNBO0lBckRHRCxzQkFBSUEsOEJBQUNBO2FBQUxBO1lBQ0lFLE1BQU1BLENBQU1BLElBQUlBLENBQUNBO1FBQ3JCQSxDQUFDQTs7O09BQUFGO0lBR01BLHdDQUFjQSxHQUFyQkEsVUFBc0JBLE9BQTRCQSxFQUFFQSxRQUFRQTtRQUV4REcsSUFBSUEsS0FBS0EsR0FBd0JBLE9BQU9BLENBQUNBO1FBRXpDQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxRQUFRQSxDQUFDQTtRQUV6QkEsS0FBS0EsQ0FBQ0EsUUFBUUEsWUFBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQUE7SUFDekJBLENBQUNBO0lBRURILGVBQWVBO0lBQ2ZBLHFDQUFXQSxHQUFYQSxVQUFZQSxJQUF1QkE7UUFDL0JJLE1BQU1BLENBQUNBLG1FQUUyQkEsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsNEZBQ2xEQSxTQUFTQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxXQUFNQSxJQUFJQSxDQUFDQSxJQUFJQSw2REFDN0VBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLEdBQUdBLENBQUNBLHlDQUV6REEsQ0FBQ0E7SUFDTkEsQ0FBQ0E7SUFFREosZUFBZUE7SUFDZkEsbUNBQVNBLEdBQVRBLFVBQVVBLElBQXVCQTtRQUM3QkssSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsRUFBRUE7WUFDL0JBLFdBQVdBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBO1lBQy9CQSxhQUFhQSxFQUFFQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQTtTQUNuQ0EsQ0FBQ0EsQ0FBQ0E7UUFFSEEsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7SUFDaEJBLENBQUNBO0lBRURMLHNDQUFZQSxHQUFaQTtRQUFpQk0sTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7SUFBQ0EsQ0FBQ0E7SUFHakNOLDhCQUFJQSxHQUFKQTtRQUNJTyxJQUFJQSxDQUFDQSxtQkFBbUJBLEVBQUVBLENBQUNBO1FBQzNCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxhQUFhQSxDQUFDQSxFQUFFQSxJQUFJQSxFQUFFQSxJQUFJQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUMzRUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQUE7UUFFakJBLElBQUlBLENBQUNBLGlCQUFpQkEsRUFBRUEsQ0FBQ0E7SUFDN0JBLENBQUNBO0lBQ0RQLDhCQUFJQSxHQUFKQTtRQUNJUSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTtRQUNsQkEsSUFBSUEsQ0FBQ0EsWUFBWUEsRUFBRUEsQ0FBQ0E7SUFDeEJBLENBQUNBO0lBRURSLG1DQUFTQSxHQUFUQTtRQUNJUyxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTtJQUNoQkEsQ0FBQ0E7SUFDTFQsc0JBQUNBO0FBQURBLENBQUNBLEFBdkRELEVBQXFDLEVBQUUsQ0FBQyxjQUFjLEVBdURyRDtBQXZEWSx1QkFBZSxHQUFmLGVBdURaLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc3AgPSByZXF1aXJlKCdhdG9tLXNwYWNlLXBlbi12aWV3cycpO1xuaW1wb3J0IG1haW5QYW5lbFZpZXcgPSByZXF1aXJlKCcuL21haW5QYW5lbFZpZXcnKTtcbmltcG9ydCBhdG9tVXRpbHMgPSByZXF1aXJlKFwiLi4vYXRvbVV0aWxzXCIpO1xuXG5cbi8qKiBcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F0b20tc3BhY2UtcGVuLXZpZXdzXG4gKi9cbmV4cG9ydCBjbGFzcyBGaWxlU3ltYm9sc1ZpZXcgZXh0ZW5kcyBzcC5TZWxlY3RMaXN0VmlldyB7XG5cbiAgICBnZXQgJCgpOiBKUXVlcnkge1xuICAgICAgICByZXR1cm4gPGFueT50aGlzO1xuICAgIH1cblxuICAgIHB1YmxpYyBmaWxlUGF0aDogc3RyaW5nO1xuICAgIHB1YmxpYyBzZXROYXZCYXJJdGVtcyh0c0l0ZW1zOiBOYXZpZ2F0aW9uQmFySXRlbVtdLCBmaWxlUGF0aCkge1xuXG4gICAgICAgIHZhciBpdGVtczogTmF2aWdhdGlvbkJhckl0ZW1bXSA9IHRzSXRlbXM7XG5cbiAgICAgICAgdGhpcy5maWxlUGF0aCA9IGZpbGVQYXRoO1xuXG4gICAgICAgIHN1cGVyLnNldEl0ZW1zKGl0ZW1zKVxuICAgIH1cblxuICAgIC8qKiBvdmVycmlkZSAqL1xuICAgIHZpZXdGb3JJdGVtKGl0ZW06IE5hdmlnYXRpb25CYXJJdGVtKSB7XG4gICAgICAgIHJldHVybiBgXG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhpZ2hsaWdodFwiPiR7IEFycmF5KGl0ZW0uaW5kZW50ICogMikuam9pbignJm5ic3A7JykgKyAoaXRlbS5pbmRlbnQgPyBcIlxcdTIyMUYgXCIgOiAnJykgKyBpdGVtLnRleHR9PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInB1bGwtcmlnaHRcIiBzdHlsZT1cImZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjoke2F0b21VdGlscy5raW5kVG9Db2xvcihpdGVtLmtpbmQpIH1cIj4ke2l0ZW0ua2luZH08L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2xlYXJcIj4gbGluZTogJHtpdGVtLnBvc2l0aW9uLmxpbmUgKyAxfTwvZGl2PlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgYDtcbiAgICB9XG4gICAgXG4gICAgLyoqIG92ZXJyaWRlICovXG4gICAgY29uZmlybWVkKGl0ZW06IE5hdmlnYXRpb25CYXJJdGVtKSB7XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4odGhpcy5maWxlUGF0aCwge1xuICAgICAgICAgICAgaW5pdGlhbExpbmU6IGl0ZW0ucG9zaXRpb24ubGluZSxcbiAgICAgICAgICAgIGluaXRpYWxDb2x1bW46IGl0ZW0ucG9zaXRpb24uY29sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cblxuICAgIGdldEZpbHRlcktleSgpIHsgcmV0dXJuICd0ZXh0JzsgfVxuXG4gICAgcGFuZWw6IEF0b21Db3JlLlBhbmVsID0gbnVsbDtcbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLnN0b3JlRm9jdXNlZEVsZW1lbnQoKTtcbiAgICAgICAgaWYgKCF0aGlzLnBhbmVsKSB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHRoaXMgfSk7XG4gICAgICAgIHRoaXMucGFuZWwuc2hvdygpXG5cbiAgICAgICAgdGhpcy5mb2N1c0ZpbHRlckVkaXRvcigpO1xuICAgIH1cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLnBhbmVsLmhpZGUoKTtcbiAgICAgICAgdGhpcy5yZXN0b3JlRm9jdXMoKTtcbiAgICB9XG5cbiAgICBjYW5jZWxsZWQoKSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbn1cbiJdfQ==
//# sourceURL=/home/stefano/.atom/packages/atom-typescript/lib/main/atom/views/fileSymbolsView.ts
