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
  required key: `id`, as described above.  If you're using autocomplete or
  select, your items must also include the key `label` (what you want to appear
  in options), and if you're using autocomplete, you'll need `value` as well
  (what you want to appear in the autocomplete field when selected).  You may
  define any other keys you like, but keys that start with `multisortselect_`
  are reserved.

* There are three entry types: select, autocomplete, and text.  Select and
  autocomplete require that you provide the `backend`, which provides a way of
  retrieving items.  It can be a url which accepts the get variables `term`
  (autocomplete), `all` (select), and `defaults` (both), or a json array
  describing all the options.

* If you want to use an autocomplete entry, you can choose a backend of an ajax
  url (accepts `term` and returns json describing the results, and accepts
  `defaults` and returns the same, only for those ids), or you can provide a
  json array describing all the options.

* If you want to use a select entry, you can choose a backend of an ajax url
  (accepts `all` and returns json for all the objects, and accepts `defaults`
  and returns the same, only for those ids), or you can provide a json array
  describing all the options.

* If you want to use the plain text entry, you can provide two functions:
  `validate` and `build_item`.  The first accepts the value of the text field
  and returns true or false, and the second accepts two parameters, the text
  value and the current MultiSortSelect object, and returns an item object.

* If you'd like to use different backends for different calls, you can define
  the `backend` option as a object containing keys for each call.  If you want
  most to use the same backend and a different backend for only certain calls,
  you can define the key `call_all` for your fallback.  A complete list of
  backend calls is provided below.  To define a call backend, prefix its name
  with `call_` (e.g. `call_Featured`).

* If you want to allow the user to create a new item inline, set the
  `allow_new` option to true and provide `build_suggestion` and `build_item`
  functions.  The `build_suggestion` function takes the text entry and the
  string that will be the suggestion label.  The `build_item` function takes
  the text entry and the MultiSortSelect object as parameters, and it can
  return either the item object, or true to indicate that an ajax function has
  been called to create the item.  To add your item after an ajax call, use the
  insertItem() method on the MultiSortSelect object passed in.  If you're using
  a JSON array backend, you'll also want to push your new item onto the
  `allItems` property.

* You can provide the option `format` (a function that takes an item object
  from your json and returns the html for that list item).  If you don't
  provide one, the `label` key will be used.

* You can set `show_all` to true if you want to have a link that shows a list
  of all the available options.  NB: if you're using a url backend, it must
  accept the parameter `all` and return all of the items.

* You can set `featured` if you want to have a link that shows a list of
  specially-selected options, similar to the show-all link.  This should be a
  function that returns the list of items you want.  Set `cache_featured` to
  false if you want to call it on every button press.

Options
-------

| Option             | Type     | Default                                  | Description                                                  |
|:------------------ |:-------- |:---------------------------------------- |:------------------------------------------------------------ |
| `entry_type`       | string   | `autocomplete`                           | the entry type: `autocomplete` (default), `select` or `text` |
| `backend`          | mixed    | _none_                                   | how to get the objects (array or url)                        |
| `format`           | function | `function (item) { return item.label; }` | how to display the element in the list                       |
| `unique`           | boolean  | `true`                                   | whether to allow only one copy of any id                     |
| `match`            | function | _none_                                   | use this to determine whether two ids are the same           |
| `top_class`        | string   | _none_                                   | set this class on the wrapper div                            |
| `validate`         | function | _none_                                   | when adding a text entry, check this first                   |
| `build`            | function | _none_                                   | use this to turn a text entry into an object                 |
| `allow_new`        | boolean  | `false`                                  | whether to allow a new item to be added                      |
| `build_suggestion` | function | _none_                                   | returns the label for the autcomplete option                 |
| `show_all`         | boolean  | `false`                                  | whether to provide a "Show All" button                       |
| `featured`         | function | _none_                                   | how to find the featured items                               |
| `cache_featured`   | boolean  | `true`                                   | whether to cache the list of featured items                  |
| `after_add`        | function | _none_                                   | do this after each item is added                             |


Complex Backend Options
-----------------------

| Call name     | Key                  | Arguments  | Description                                                                      |
|:------------- |:-------------------- |:---------- | -------------------------------------------------------------------------------- |
| Search        | `call_Search`        | `term`     | The autocomplete search; returns a json array of objects                         |
| ItemById      | `call_ItemById`      | `defaults` | Fetches an item by its id; ajax uses single-item arrays, but function uses plain |
| NewItem       | `call_NewItem`       | `entry`    | Creates a new item; accepts the text entry, if applicable                        |
| Defaults      | `call_Defaults`      | `defaults` | Fetches an array of items by an array of ids; order should be the same           |
| AllItems      | `call_AllItems`      | `all`      | Fetches all available items; value of `all` is always true                       |
| FeaturedItems | `call_FeaturedItems` | `featured` | Fetches all available items; value of `all` is always true                       |

Minimum Example
---------------

Assumes you've already included jquery, jquery ui, and the plugin css and js.

```html
 <input type="text" id="categories" name="categories" value="[2,14,3]" />
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

 * Support for adding a new item to selectable list on the fly
 * Pluggable entry types (select, autocomplete, text, user-defined) in their own classes

