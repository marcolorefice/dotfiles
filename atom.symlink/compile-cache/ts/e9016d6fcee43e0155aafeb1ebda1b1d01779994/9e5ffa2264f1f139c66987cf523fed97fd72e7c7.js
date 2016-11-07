// Some docs
// http://www.html5rocks.com/en/tutorials/webcomponents/customelements/ (look at lifecycle callback methods)
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var TsView = (function (_super) {
    __extends(TsView, _super);
    function TsView() {
        _super.apply(this, arguments);
    }
    TsView.prototype.createdCallback = function () {
        var preview = this.innerText;
        this.innerText = "";
        // Based on markdown editor
        // https://github.com/atom/markdown-preview/blob/2bcbadac3980f1aeb455f7078bd1fdfb4e6fe6b1/lib/renderer.coffee#L111
        var editorElement = this.editorElement = document.createElement('atom-text-editor');
        editorElement.setAttributeNode(document.createAttribute('gutter-hidden'));
        editorElement.removeAttribute('tabindex'); // make read-only
        var editor = this.editor = editorElement.getModel();
        editor.getDecorations({ class: 'cursor-line', type: 'line' })[0].destroy(); // remove the default selection of a line in each editor
        editor.setText(preview);
        var grammar = atom.grammars.grammarForScopeName("source.tsx");
        editor.setGrammar(grammar);
        editor.setSoftWrapped(true);
        this.appendChild(editorElement);
    };
    // API
    TsView.prototype.text = function (text) {
        this.editor.setText(text);
    };
    return TsView;
})(HTMLElement);
exports.TsView = TsView;
document.registerElement('ts-view', TsView);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tdHlwZXNjcmlwdC9saWIvbWFpbi9hdG9tL2NvbXBvbmVudHMvdHMtdmlldy50cyIsInNvdXJjZXMiOlsiL2hvbWUvc3RlZmFuby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tdHlwZXNjcmlwdC9saWIvbWFpbi9hdG9tL2NvbXBvbmVudHMvdHMtdmlldy50cyJdLCJuYW1lcyI6WyJUc1ZpZXciLCJUc1ZpZXcuY29uc3RydWN0b3IiLCJUc1ZpZXcuY3JlYXRlZENhbGxiYWNrIiwiVHNWaWV3LnRleHQiXSwibWFwcGluZ3MiOiJBQUFBLFlBQVk7QUFDWiw0R0FBNEc7Ozs7Ozs7QUFFNUcsSUFBYSxNQUFNO0lBQVNBLFVBQWZBLE1BQU1BLFVBQW9CQTtJQUF2Q0EsU0FBYUEsTUFBTUE7UUFBU0MsOEJBQVdBO0lBMEJ2Q0EsQ0FBQ0E7SUF2QkdELGdDQUFlQSxHQUFmQTtRQUNJRSxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQTtRQUM3QkEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFJcEJBLEFBRkFBLDJCQUEyQkE7UUFDM0JBLGtIQUFrSEE7WUFDOUdBLGFBQWFBLEdBQUdBLElBQUlBLENBQUNBLGFBQWFBLEdBQUdBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLGtCQUFrQkEsQ0FBQ0EsQ0FBQ0E7UUFDcEZBLGFBQWFBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDMUVBLGFBQWFBLENBQUNBLGVBQWVBLENBQUNBLFVBQVVBLENBQUNBLEVBQUVBLGlCQUFpQkE7UUFDNURBLElBQUlBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLEdBQVNBLGFBQWNBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO1FBQzNEQSxNQUFNQSxDQUFDQSxjQUFjQSxDQUFDQSxFQUFFQSxLQUFLQSxFQUFFQSxhQUFhQSxFQUFFQSxJQUFJQSxFQUFFQSxNQUFNQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxPQUFPQSxFQUFFQSxFQUFFQSx3REFBd0RBO1FBQ3BJQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQTtRQUN4QkEsSUFBSUEsT0FBT0EsR0FBU0EsSUFBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFBQTtRQUNwRUEsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7UUFDM0JBLE1BQU1BLENBQUNBLGNBQWNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1FBRTVCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxhQUFhQSxDQUFDQSxDQUFDQTtJQUNwQ0EsQ0FBQ0E7SUFFREYsTUFBTUE7SUFDTkEscUJBQUlBLEdBQUpBLFVBQUtBLElBQVlBO1FBQ2JHLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQzlCQSxDQUFDQTtJQUNMSCxhQUFDQTtBQUFEQSxDQUFDQSxBQTFCRCxFQUE0QixXQUFXLEVBMEJ0QztBQTFCWSxjQUFNLEdBQU4sTUEwQlosQ0FBQTtBQUVLLFFBQVMsQ0FBQyxlQUFlLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gU29tZSBkb2NzXG4vLyBodHRwOi8vd3d3Lmh0bWw1cm9ja3MuY29tL2VuL3R1dG9yaWFscy93ZWJjb21wb25lbnRzL2N1c3RvbWVsZW1lbnRzLyAobG9vayBhdCBsaWZlY3ljbGUgY2FsbGJhY2sgbWV0aG9kcylcblxuZXhwb3J0IGNsYXNzIFRzVmlldyBleHRlbmRzIEhUTUxFbGVtZW50IHtcbiAgICBlZGl0b3JFbGVtZW50O1xuICAgIGVkaXRvcjtcbiAgICBjcmVhdGVkQ2FsbGJhY2soKSB7XG4gICAgICAgIHZhciBwcmV2aWV3ID0gdGhpcy5pbm5lclRleHQ7XG4gICAgICAgIHRoaXMuaW5uZXJUZXh0ID0gXCJcIjtcblxuICAgICAgICAvLyBCYXNlZCBvbiBtYXJrZG93biBlZGl0b3JcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2F0b20vbWFya2Rvd24tcHJldmlldy9ibG9iLzJiY2JhZGFjMzk4MGYxYWViNDU1ZjcwNzhiZDFmZGZiNGU2ZmU2YjEvbGliL3JlbmRlcmVyLmNvZmZlZSNMMTExXG4gICAgICAgIHZhciBlZGl0b3JFbGVtZW50ID0gdGhpcy5lZGl0b3JFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXRvbS10ZXh0LWVkaXRvcicpO1xuICAgICAgICBlZGl0b3JFbGVtZW50LnNldEF0dHJpYnV0ZU5vZGUoZG9jdW1lbnQuY3JlYXRlQXR0cmlidXRlKCdndXR0ZXItaGlkZGVuJykpO1xuICAgICAgICBlZGl0b3JFbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgndGFiaW5kZXgnKTsgLy8gbWFrZSByZWFkLW9ubHlcbiAgICAgICAgdmFyIGVkaXRvciA9IHRoaXMuZWRpdG9yID0gKDxhbnk+ZWRpdG9yRWxlbWVudCkuZ2V0TW9kZWwoKTtcbiAgICAgICAgZWRpdG9yLmdldERlY29yYXRpb25zKHsgY2xhc3M6ICdjdXJzb3ItbGluZScsIHR5cGU6ICdsaW5lJyB9KVswXS5kZXN0cm95KCk7IC8vIHJlbW92ZSB0aGUgZGVmYXVsdCBzZWxlY3Rpb24gb2YgYSBsaW5lIGluIGVhY2ggZWRpdG9yXG4gICAgICAgIGVkaXRvci5zZXRUZXh0KHByZXZpZXcpO1xuICAgICAgICB2YXIgZ3JhbW1hciA9ICg8YW55PmF0b20pLmdyYW1tYXJzLmdyYW1tYXJGb3JTY29wZU5hbWUoXCJzb3VyY2UudHN4XCIpXG4gICAgICAgIGVkaXRvci5zZXRHcmFtbWFyKGdyYW1tYXIpO1xuICAgICAgICBlZGl0b3Iuc2V0U29mdFdyYXBwZWQodHJ1ZSk7XG5cbiAgICAgICAgdGhpcy5hcHBlbmRDaGlsZChlZGl0b3JFbGVtZW50KTtcbiAgICB9XG5cbiAgICAvLyBBUElcbiAgICB0ZXh0KHRleHQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmVkaXRvci5zZXRUZXh0KHRleHQpO1xuICAgIH1cbn1cblxuKDxhbnk+ZG9jdW1lbnQpLnJlZ2lzdGVyRWxlbWVudCgndHMtdmlldycsIFRzVmlldyk7XG4iXX0=
//# sourceURL=/home/stefano/.dotfiles/atom.symlink/packages/atom-typescript/lib/main/atom/components/ts-view.ts
