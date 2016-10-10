'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {

  excludeLowerPriorityProviders: {

    title: 'Exclude lower priority providers',
    description: 'Whether to exclude lower priority providers (e.g. autocomplete-paths)',
    type: 'boolean',
    'default': false,
    order: 0
  },
  guess: {

    title: 'Guess',
    description: 'When completing a property and no completions are found, Tern will use some heuristics to try and return some properties anyway. Set this to false to turn that off.',
    type: 'boolean',
    'default': true,
    order: 1
  },
  sort: {

    title: 'Sort',
    description: 'Determines whether the result set will be sorted.',
    type: 'boolean',
    'default': true,
    order: 2
  },
  caseInsensitive: {

    title: 'Case-insensitive',
    description: 'Whether to use a case-insensitive compare between the current word and potential completions.',
    type: 'boolean',
    'default': true,
    order: 3
  },
  useSnippets: {

    title: 'Use autocomplete-snippets',
    description: 'Adds snippets to autocomplete+ suggestions',
    type: 'boolean',
    'default': false,
    order: 4
  },
  snippetsFirst: {

    title: 'Display above snippets',
    description: 'Displays snippets above tern suggestions. Requires a restart.',
    type: 'boolean',
    'default': false,
    order: 5
  },
  useSnippetsAndFunction: {

    title: 'Display both, autocomplete-snippets and function name',
    description: 'Choose to just complete the function name or expand the snippet',
    type: 'boolean',
    'default': false,
    order: 6
  },
  inlineFnCompletion: {

    title: 'Display inline suggestions for function params',
    description: 'Displays a inline suggestion located right next to the current cursor',
    type: 'boolean',
    'default': true,
    order: 7
  },
  inlineFnCompletionDocumentation: {

    title: 'Display inline suggestions with additional documentation (if any)',
    description: 'Adds documentation to the inline functionm completion',
    type: 'boolean',
    'default': false,
    order: 8
  },
  documentation: {

    title: 'Documentation',
    description: 'Whether to include documentation string (if found) in the result data.',
    type: 'boolean',
    'default': true,
    order: 9
  },
  urls: {

    title: 'Url',
    description: 'Whether to include documentation urls (if found) in the result data.',
    type: 'boolean',
    'default': true,
    order: 10
  },
  origins: {

    title: 'Origin',
    description: 'Whether to include origins (if found) in the result data.',
    type: 'boolean',
    'default': true,
    order: 11
  },
  ternServerGetFileAsync: {

    title: 'Tern Server getFile async',
    description: 'Indicates whether getFile is asynchronous. Default is true. Requires a restart.',
    type: 'boolean',
    'default': true,
    order: 12
  },
  ternServerDependencyBudget: {

    title: 'Tern Server dependency-budget',
    description: 'http://ternjs.net/doc/manual.html#dependency_budget. Requires a restart.',
    type: 'number',
    'default': 20000,
    order: 13
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zdGVmYW5vLmNvcmFsbG8vLmRvdGZpbGVzL2F0b20uc3ltbGluay9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7cUJBRUc7O0FBRWIsK0JBQTZCLEVBQUU7O0FBRTdCLFNBQUssRUFBRSxrQ0FBa0M7QUFDekMsZUFBVyxFQUFFLHVFQUF1RTtBQUNwRixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxPQUFLLEVBQUU7O0FBRUwsU0FBSyxFQUFFLE9BQU87QUFDZCxlQUFXLEVBQUUsc0tBQXNLO0FBQ25MLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELE1BQUksRUFBRTs7QUFFSixTQUFLLEVBQUUsTUFBTTtBQUNiLGVBQVcsRUFBRSxtREFBbUQ7QUFDaEUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsaUJBQWUsRUFBRTs7QUFFZixTQUFLLEVBQUUsa0JBQWtCO0FBQ3pCLGVBQVcsRUFBRSwrRkFBK0Y7QUFDNUcsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsYUFBVyxFQUFFOztBQUVYLFNBQUssRUFBRSwyQkFBMkI7QUFDbEMsZUFBVyxFQUFFLDRDQUE0QztBQUN6RCxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxlQUFhLEVBQUU7O0FBRWIsU0FBSyxFQUFFLHdCQUF3QjtBQUMvQixlQUFXLEVBQUUsK0RBQStEO0FBQzVFLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0FBQ2QsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELHdCQUFzQixFQUFFOztBQUV0QixTQUFLLEVBQUUsdURBQXVEO0FBQzlELGVBQVcsRUFBRSxpRUFBaUU7QUFDOUUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0Qsb0JBQWtCLEVBQUU7O0FBRWxCLFNBQUssRUFBRSxnREFBZ0Q7QUFDdkQsZUFBVyxFQUFFLHVFQUF1RTtBQUNwRixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxpQ0FBK0IsRUFBRTs7QUFFL0IsU0FBSyxFQUFFLG1FQUFtRTtBQUMxRSxlQUFXLEVBQUUsdURBQXVEO0FBQ3BFLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0FBQ2QsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELGVBQWEsRUFBRTs7QUFFYixTQUFLLEVBQUUsZUFBZTtBQUN0QixlQUFXLEVBQUUsd0VBQXdFO0FBQ3JGLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELE1BQUksRUFBRTs7QUFFSixTQUFLLEVBQUUsS0FBSztBQUNaLGVBQVcsRUFBRSxzRUFBc0U7QUFDbkYsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsRUFBRTtHQUNWO0FBQ0QsU0FBTyxFQUFFOztBQUVQLFNBQUssRUFBRSxRQUFRO0FBQ2YsZUFBVyxFQUFFLDJEQUEyRDtBQUN4RSxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxFQUFFO0dBQ1Y7QUFDRCx3QkFBc0IsRUFBRTs7QUFFdEIsU0FBSyxFQUFFLDJCQUEyQjtBQUNsQyxlQUFXLEVBQUUsaUZBQWlGO0FBQzlGLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLEVBQUU7R0FDVjtBQUNELDRCQUEwQixFQUFFOztBQUUxQixTQUFLLEVBQUUsK0JBQStCO0FBQ3RDLGVBQVcsRUFBRSwwRUFBMEU7QUFDdkYsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsRUFBRTtHQUNWO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL3N0ZWZhbm8uY29yYWxsby8uZG90ZmlsZXMvYXRvbS5zeW1saW5rL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGV4Y2x1ZGVMb3dlclByaW9yaXR5UHJvdmlkZXJzOiB7XG5cbiAgICB0aXRsZTogJ0V4Y2x1ZGUgbG93ZXIgcHJpb3JpdHkgcHJvdmlkZXJzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgdG8gZXhjbHVkZSBsb3dlciBwcmlvcml0eSBwcm92aWRlcnMgKGUuZy4gYXV0b2NvbXBsZXRlLXBhdGhzKScsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG9yZGVyOiAwXG4gIH0sXG4gIGd1ZXNzOiB7XG5cbiAgICB0aXRsZTogJ0d1ZXNzJyxcbiAgICBkZXNjcmlwdGlvbjogJ1doZW4gY29tcGxldGluZyBhIHByb3BlcnR5IGFuZCBubyBjb21wbGV0aW9ucyBhcmUgZm91bmQsIFRlcm4gd2lsbCB1c2Ugc29tZSBoZXVyaXN0aWNzIHRvIHRyeSBhbmQgcmV0dXJuIHNvbWUgcHJvcGVydGllcyBhbnl3YXkuIFNldCB0aGlzIHRvIGZhbHNlIHRvIHR1cm4gdGhhdCBvZmYuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogMVxuICB9LFxuICBzb3J0OiB7XG5cbiAgICB0aXRsZTogJ1NvcnQnLFxuICAgIGRlc2NyaXB0aW9uOiAnRGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSByZXN1bHQgc2V0IHdpbGwgYmUgc29ydGVkLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDJcbiAgfSxcbiAgY2FzZUluc2Vuc2l0aXZlOiB7XG5cbiAgICB0aXRsZTogJ0Nhc2UtaW5zZW5zaXRpdmUnLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciB0byB1c2UgYSBjYXNlLWluc2Vuc2l0aXZlIGNvbXBhcmUgYmV0d2VlbiB0aGUgY3VycmVudCB3b3JkIGFuZCBwb3RlbnRpYWwgY29tcGxldGlvbnMuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogM1xuICB9LFxuICB1c2VTbmlwcGV0czoge1xuXG4gICAgdGl0bGU6ICdVc2UgYXV0b2NvbXBsZXRlLXNuaXBwZXRzJyxcbiAgICBkZXNjcmlwdGlvbjogJ0FkZHMgc25pcHBldHMgdG8gYXV0b2NvbXBsZXRlKyBzdWdnZXN0aW9ucycsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG9yZGVyOiA0XG4gIH0sXG4gIHNuaXBwZXRzRmlyc3Q6IHtcblxuICAgIHRpdGxlOiAnRGlzcGxheSBhYm92ZSBzbmlwcGV0cycsXG4gICAgZGVzY3JpcHRpb246ICdEaXNwbGF5cyBzbmlwcGV0cyBhYm92ZSB0ZXJuIHN1Z2dlc3Rpb25zLiBSZXF1aXJlcyBhIHJlc3RhcnQuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDVcbiAgfSxcbiAgdXNlU25pcHBldHNBbmRGdW5jdGlvbjoge1xuXG4gICAgdGl0bGU6ICdEaXNwbGF5IGJvdGgsIGF1dG9jb21wbGV0ZS1zbmlwcGV0cyBhbmQgZnVuY3Rpb24gbmFtZScsXG4gICAgZGVzY3JpcHRpb246ICdDaG9vc2UgdG8ganVzdCBjb21wbGV0ZSB0aGUgZnVuY3Rpb24gbmFtZSBvciBleHBhbmQgdGhlIHNuaXBwZXQnLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBvcmRlcjogNlxuICB9LFxuICBpbmxpbmVGbkNvbXBsZXRpb246IHtcblxuICAgIHRpdGxlOiAnRGlzcGxheSBpbmxpbmUgc3VnZ2VzdGlvbnMgZm9yIGZ1bmN0aW9uIHBhcmFtcycsXG4gICAgZGVzY3JpcHRpb246ICdEaXNwbGF5cyBhIGlubGluZSBzdWdnZXN0aW9uIGxvY2F0ZWQgcmlnaHQgbmV4dCB0byB0aGUgY3VycmVudCBjdXJzb3InLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiA3XG4gIH0sXG4gIGlubGluZUZuQ29tcGxldGlvbkRvY3VtZW50YXRpb246IHtcblxuICAgIHRpdGxlOiAnRGlzcGxheSBpbmxpbmUgc3VnZ2VzdGlvbnMgd2l0aCBhZGRpdGlvbmFsIGRvY3VtZW50YXRpb24gKGlmIGFueSknLFxuICAgIGRlc2NyaXB0aW9uOiAnQWRkcyBkb2N1bWVudGF0aW9uIHRvIHRoZSBpbmxpbmUgZnVuY3Rpb25tIGNvbXBsZXRpb24nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBvcmRlcjogOFxuICB9LFxuICBkb2N1bWVudGF0aW9uOiB7XG5cbiAgICB0aXRsZTogJ0RvY3VtZW50YXRpb24nLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciB0byBpbmNsdWRlIGRvY3VtZW50YXRpb24gc3RyaW5nIChpZiBmb3VuZCkgaW4gdGhlIHJlc3VsdCBkYXRhLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDlcbiAgfSxcbiAgdXJsczoge1xuXG4gICAgdGl0bGU6ICdVcmwnLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciB0byBpbmNsdWRlIGRvY3VtZW50YXRpb24gdXJscyAoaWYgZm91bmQpIGluIHRoZSByZXN1bHQgZGF0YS4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiAxMFxuICB9LFxuICBvcmlnaW5zOiB7XG5cbiAgICB0aXRsZTogJ09yaWdpbicsXG4gICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIHRvIGluY2x1ZGUgb3JpZ2lucyAoaWYgZm91bmQpIGluIHRoZSByZXN1bHQgZGF0YS4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiAxMVxuICB9LFxuICB0ZXJuU2VydmVyR2V0RmlsZUFzeW5jOiB7XG5cbiAgICB0aXRsZTogJ1Rlcm4gU2VydmVyIGdldEZpbGUgYXN5bmMnLFxuICAgIGRlc2NyaXB0aW9uOiAnSW5kaWNhdGVzIHdoZXRoZXIgZ2V0RmlsZSBpcyBhc3luY2hyb25vdXMuIERlZmF1bHQgaXMgdHJ1ZS4gUmVxdWlyZXMgYSByZXN0YXJ0LicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDEyXG4gIH0sXG4gIHRlcm5TZXJ2ZXJEZXBlbmRlbmN5QnVkZ2V0OiB7XG5cbiAgICB0aXRsZTogJ1Rlcm4gU2VydmVyIGRlcGVuZGVuY3ktYnVkZ2V0JyxcbiAgICBkZXNjcmlwdGlvbjogJ2h0dHA6Ly90ZXJuanMubmV0L2RvYy9tYW51YWwuaHRtbCNkZXBlbmRlbmN5X2J1ZGdldC4gUmVxdWlyZXMgYSByZXN0YXJ0LicsXG4gICAgdHlwZTogJ251bWJlcicsXG4gICAgZGVmYXVsdDogMjAwMDAsXG4gICAgb3JkZXI6IDEzXG4gIH1cbn07XG4iXX0=
//# sourceURL=/Users/stefano.corallo/.dotfiles/atom.symlink/packages/atom-ternjs/lib/config.js
