jquery-multisortselect
=================

Use this plugin for form elements where you want to add several things,
possibly by autocomplete, sort them with drag and drop, remove them by clicking
an x button, and return them in the post as a JSON array of ids.

How to use
----------

Invoke the plugin on an `<input type="text">` element and provide a url or JSON
array in the `backend` option.  By default, this will create a sortable list
(showing the objects' `label` key, a sorting handle, and a delete icon) and an
autocomplete element for adding new items to the list.  Submitting the form
returns the `id` key of each object in a JSON array.

Important Notes
---------------

* You must invoke the plugin on a text input.

* Setting a JSON value on the field will populate the list on load.

* The value sent on post and used for defaulting is a JSON-encoded list of ids.
  An id must be a scalar value.  Note that duplicate checks (if option `unique`
  is on) are performed using jQuery.inArray().

* Items in the list are represented by objects.  These objects have one
  required key: `id`, as described above.  If you're using autocomplete, your
  items must also include the keys `label` (what you want to appear in
  autocomplete options), and `value` (what you want to appear in the
  autocomplete field when selected).  You may define any other keys you like.

* You can choose a backend of an ajax url (accepts `term` and returns json
  describing the results, and accepts `defaults` and returns the same, only for
  those ids), or you can provide a json array describing all the options.

* You can provide the option `format` (a function that takes an item object
  from your json and returns the html for that list item).  If you don't
  provide one, the `label` key will be used.

* You can set `show_all` to true if you want to have a link that shows a list
  of all the available options.  NB: if you're using a url backend, it must
  accept the parameter `all` and return all of the items.

Options
-------

| Option           | Type     | Default                                  | Description                                        |
|:---------------- |:-------- |:---------------------------------------- |:-------------------------------------------------- |
| `backend`        | mixed    | _none_                                   | how to get the objects (array or url)              |
| `format`         | function | `function (item) { return item.label; }` | how to display the element in the list             |
| `unique`         | boolean  | `true`                                   | whether to allow only one copy of any id           |
| `match`          | function | _none_                                   | use this to determine whether two ids are the same |
| `topClass`       | string   | _none_                                   | set this class on the wrapper div                  |
| `show_all`       | boolean  | `false`                                  | whether to provide a "Show All" button             |
| `afterAdd`       | function | _none_                                   | do this after each item is added                   |

Minimum Example
---------------

Assumes you've already included jquery, jquery ui, and the plugin css and js.

```html
 <input type="text" id="categories" name="categories" value="2,14,3" />
 <script>
   $(document).ready(function() {
     $('#categories').multisortselect({ backend: '/categories.php' });
   });
 </script>
```

Requirements
------------

 * JQuery x.x.x or greater (tested through x.x.x)
 * JQuery UI x.x.x or greater (tested through x.x.x)

TODO
-----

 * Plain text entry for case where you're not selecting but always entering new text
 * Support for adding a new item to selectable list on the fly
 * Support for backend as a function returning the item
 * Ability to define backend types per call type (e.g., one url for search and one for new item)
 * Featured button like Show All

