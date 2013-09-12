/**
 * MultiSortSelect plugin
 *
 * Use this plugin for form elements where you want to add several things by
 * autocomplete, sort them with drag and drop, remove them by clicking an x
 * button, and returning them to the form as a comma-separated list of ids.
 *
 * - You must invoke the plugin on a text input.
 * - To default the form, you must fill in a comma-separated list of ids.
 * - You can choose a backend of an ajax url (accepts "term" and returns json
 *   describing the results, and accepts "defaults" and returns the same,
 *   only for those ids).
 * - Or, for short lists, you can choose a backend of hardcoded json describing
 *   all the options.
 * - The json describing the items must include at least "id" (the id), "label"
 *   (what you want to appear in autocomplete options), and "value" (what you
 *   want to appear in the autocomplete field when selected).
 * - You can provide the option "format" (a function that takes an item object
 *   from your json and returns the html for that list item) if you want more to
 *   show than the autocomplete label.
 * - You can set "show_all" to true if you want to have a link that shows a list
 *   of all the available options.  NB: if you're using a url backend, it must
 *   accept the parameter "all" and return all of the items.
 *
 * Example:
 * <code>
 *  <form action="">
 *    <label for="categories">Categories</label>
 *    <input id="categories" name="categories" value="2,14,3" />
 *    ...
 *  </form>
 *  <script>
 *    $(document).ready(function() {
 *      $('#categories').multiSortSelect({
 *        backend: '/categories/search',
 *        format: function (item) { return '<b>' . item.label . '</b>'; }
 *      });
 *    });
 *  </script>
 * </code>
 *
 * @package    MultiSortSelect
 * @copyright  Copyright (c) 2013 Reha Sterbin
 * @version    $Id$
 * @author     Reha Sterbin <reha@omniti.com>
 * @note       First draft developed for Ora Media, LLC
 */

// {{{ define plugin

if (typeof(MultiSortSelect) === "undefined") {
    // Constructor
    MultiSortSelect = function(el, opts) {
        this.init(el, opts);
    }

    // {{{ properties

    // Class-level properties
    MultiSortSelect.registry = new Array(); // Index each new object (for use in css ids)
    MultiSortSelect.default_opts = {
        backend: [],
        format: function (item) { return item.label; },
        unique: true,
        show_all: false
    };

    // }}}
    // {{{ static methods

    // {{{ fetch()

    /**
     * Fetch a particular object
     *
     * @param  int             id the object id
     * @return MultiSortSelect the object
     */
    MultiSortSelect.fetch = function (id) {
        return MultiSortSelect.registry[id];
    };

    // }}}
    // {{{ eventRemoveItem()

    /**
     * Click event to remove an item from the list
     *
     * @param Event e the click event
     */
    MultiSortSelect.eventRemoveItem = function (e) {
        e.preventDefault();
        var mid = $(this).closest('.multisortselect').data('multisortselect_id');
        var obj = MultiSortSelect.fetch(mid);
        if (obj) {
            var iid = $(this).closest('li').attr('rel');
            obj.remove(iid);
        }
    };

    // }}}
    // {{{ eventAutocompleteSelect()

    /**
     * On-select event for the autocomplete
     *
     * @param Event  e  the event
     * @param object ui the info, including the item selected
     */
    MultiSortSelect.eventAutocompleteSelect = function(e, ui) {
        var $c = $(this);
        var mid = $c.closest('.multisortselect').data('multisortselect_id');
        var obj = MultiSortSelect.fetch(mid);
        if (obj) {
            obj.insertItem(ui.item, true);
        }
        $c.val('');
        return false;
    };

    // }}}
    // {{{ eventAutocompleteResponse()

    /**
     * On-response event for the autocomplete
     *
     * @param Event  e  the event
     * @param object ui the info, including the item selected
     */
    MultiSortSelect.eventAutocompleteResponse = function(e, ui) {
        var $c = $(this);
        var mid = $c.closest('.multisortselect').data('multisortselect_id');
        var obj = MultiSortSelect.fetch(mid);
        if (obj) {
            for (var i = 0; i < ui.content.length; i++) {
                obj.cacheItem(ui.content[i]);
            }
        }
    };

    // }}}
    // {{{ eventSortStop()

    /**
     * On-stop event for the sort
     *
     * @param Event  e  the event
     * @param object ui the info
     */
    MultiSortSelect.eventSortStop = function(e, ui) {
        var mid = $(this).closest('.multisortselect').data('multisortselect_id');
        var obj = MultiSortSelect.fetch(mid);
        if (obj) {
            obj.reorderInput();
        }
    };

    // }}}
    // {{{ eventShowAll()

    /**
     * Click event that toggles the show-all box
     *
     * @param Event e the event
     */
    MultiSortSelect.eventShowAll = function(e) {
        e.preventDefault();
        var mid = $(this).closest('.multisortselect').data('multisortselect_id');
        var obj = MultiSortSelect.fetch(mid);
        if (obj) {
            obj.showAll();
        }
    };

    // }}}
    // {{{ eventShowAllAdd()

    /**
     * Click event that adds an item from the show-all box
     *
     * @param Event e the event
     */
    MultiSortSelect.eventShowAllAdd = function(e) {
        e.preventDefault();
        var mid = $(this).closest('.multisortselect').data('multisortselect_id');
        var obj = MultiSortSelect.fetch(mid);
        if (obj) {
            var iid = $(this).closest('li').attr('rel');
            obj.insertItemById(iid);
        }
    };

    // }}}

    // }}}
    // {{{ prototype

    // Object prototype
    $.extend(MultiSortSelect.prototype, {
        // object variables
        id: 0,
        opts: {},
        cache: '',
        fetchedAll: false,
        allItems: [],
        builtShowAll: false,
        $input: '',
        $node: '',
        $list: '',
        $showall_button: '',
        $showall: '',
        $newitem: '',

        // {{{ init()

        /**
         * Init method, run only once, on launch
         *
         * @param JQueryElement $el  the calling element (assumed to be textbox)
         * @param object        opts any custom options
         */
        init: function($el, opts) {
            var id = 0;
            do { id++; } while (typeof(MultiSortSelect.registry[id]) != 'undefined');
            MultiSortSelect.registry[id] = this;
            this.id = id;
            this.$input = $el;
            this.$input.data('multisortselect_id', this.id);
            this.opts = $.extend({}, MultiSortSelect.default_opts, opts);

            // Initialize the node
            this.$input.wrap('<div class="multisortselect" id="multisortselect_' + this.id + '" />');
            this.$node = this.$input.closest('.multisortselect');
            this.$node.data('multisortselect_id', this.id);
            if (this.opts.topClass) {
                this.$node.addClass(this.opts.topClass);
            }

            // Add the list
            var list = '<ul class="multisortselect-list"></ul>';
            this.$node.prepend(list);
            this.$list = this.$node.find('.multisortselect-list');
            this.$list.sortable({
                stop: MultiSortSelect.eventSortStop
            });

            // Add the autocomplete field, and give it the name and value we want
            var newitem = '<input type="text" class="multisortselect-autocomplete" />';
            this.$node.append(newitem);
            this.$newitem = this.$node.find('.multisortselect-autocomplete');
            this.$newitem.autocomplete({
                source: this.opts.backend,
                response: MultiSortSelect.eventAutocompleteResponse,
                select: MultiSortSelect.eventAutocompleteSelect
            });

            // Add show-all button, if requested
            if (this.opts.show_all) {
                var button = '<a href="#" class="btn multisortselect-showall_button">Show All</a>';
                this.$node.append(button);
                this.$showall_button = this.$node.find('.multisortselect-showall_button');
                this.$showall_button.click(MultiSortSelect.eventShowAll);
                var showall = '<ul class="multisortselect-showall"></ul>';
                this.$node.append(showall);
                this.$showall = this.$node.find('.multisortselect-showall');
                this.$showall.hide();
            }

            // Hide the input field
            this.$input.addClass('multisortselect-hidden');
            this.$input.hide();

            // Prep the item list, if we already have one
            if (typeof(this.opts.backend) == 'object') {
                this.allItems = this.opts.backend;
                this.fetchedAll = true;
                for (var i = 0; i < this.allItems.length; i++) {
                    this.cacheItem(this.allItems[i]);
                }
            }

            // Load up the list with default items
            var defaults = this.$input.val();
            if (defaults != '') {
                this.loadDefaults(defaults);
            }
        },

        // }}}
        // {{{ loadDefaults()

        /**
         * Loads the list with defaults
         *
         * @param string defaults a comma-separated list of item ids
         */
        loadDefaults: function(defaults) {
            if (typeof(this.opts.backend) == 'string') {
                $.ajax({
                    'type': 'GET',
                    'url': this.opts.backend,
                    'data': { 'defaults': defaults },
                    'dataType': 'json',
                    'context': this,
                    'success': function (data) {
                        for (var i = 0; i < data.length; i++) {
                            this.cacheItem(data[i]);
                            this.insertItem(data[i], false);
                        }
                    }
                });
            } else {
                var item_ids = defaults.split(',');
                for (var i = 0; i < item_ids.length; i++) {
                    if (typeof(this.cache[item_ids[i]]) == 'object') {
                        this.insertItem(this.cache[item_ids[i]], false);
                    }
                }
            }
        },

        // }}}
        // {{{ cacheItem()

        /**
         * Pushes an item into the cache
         *
         * @param object item the item
         */
        cacheItem: function(item) {
            if (typeof(this.cache) == 'string') {
                this.cache = {};
            }
            this.cache[item.id] = item;
        },

        // }}}
        // {{{ insertItem()

        /**
         * Pushes an item into the list
         *
         * @param object item the item
         * @param bool   update whether to update the value
         */
        insertItem: function(item, update) {
            var iid = item.id;
            var val = this.$input.val();
            var bits = val == '' ? new Array : val.split(',');
            if (this.opts.unique) {
                var i = $.inArray(iid + '', bits);
                if (i >= 0 && update) {
                    return;
                }
            }
            if (update) {
                bits.push(iid);
                this.$input.attr('value', bits.join(','));
            }
            var $li = $('<li><div class="multisortselect-item"></div><a href="#" class="multisortselect-remove" title="Remove">&#xd7;</a></li>');
            $li.attr('id', 'multisortselect_' + this.id + '_' + iid);
            $li.attr('rel', iid);
            $li.find('.multisortselect-item').html('<i class="icon-sort"></i>' + this.opts.format(item));
            $li.find('.multisortselect-remove').click(MultiSortSelect.eventRemoveItem);
            this.$list.append($li);
            if (typeof this.opts.afterAdd == 'function') {
                this.opts.afterAdd($li);
            }
        },

        // }}}
        // {{{ insertItemById()

        /**
         * Pushes an item into the list, given its id
         *
         * @param int iid the item's id
         */
        insertItemById: function(iid) {
            if (typeof(this.cache[iid]) == 'object') {
                return this.insertItem(this.cache[iid], true);
            } else {
                $.ajax({
                    'type': 'GET',
                    'url': this.opts.backend,
                    'data': { 'defaults': iid },
                    'dataType': 'json',
                    'context': this,
                    'success': function (data) {
                        for (var i = 0; i < data.length; i++) {
                            this.cacheItem(data[i]);
                            this.insertItem(data[i], false);
                        }
                    }
                });
            }
        },

        // }}}
        // {{{ remove()

        /**
         * Removes an item from the list
         *
         * @param string iid the item id
         */
        remove: function(iid) {
            var bits = this.$input.val().split(',');
            var i = $.inArray(iid, bits);
            if (i >= 0) {
                bits.splice(i, 1);
                this.$input.attr('value', bits.join(','));
            }
            this.$list.find('#multisortselect_' + this.id + '_' + iid).remove();
        },

        // }}}
        // {{{ reorderInput()

        /**
         * Reorders the ids in the input to match the list
         */
        reorderInput: function() {
            var newOrder = new Array();
            this.$list.find('li').each(function () {
                newOrder.push($(this).attr('rel'));
            });
            this.$input.attr('value', newOrder.join(','));
        },

        // }}}
        // {{{ showAll()

        /**
         * Shows all the available options
         */
        showAll: function() {
            if (!this.fetchedAll) {
                $.ajax({
                    'type': 'GET',
                    'url': this.opts.backend,
                    'data': { 'all': true },
                    'dataType': 'json',
                    'context': this,
                    'success': function (data) {
                        this.allItems = new Array();
                        for (var i = 0; i < data.length; i++) {
                            this.cacheItem(data[i]);
                            this.allItems.push(data[i]);
                        }
                        this.fetchedAll = true;
                        this.showAll();
                    }
                });
            }
            if (this.fetchedAll && !this.builtShowAll) {
                for (var i = 0; i < this.allItems.length; i++) {
                    var item = this.allItems[i];
                    var $li = $('<li></li>');
                    $li.attr('rel', item.id);
                    $li.html('<i class="icon-plus"></i>' + this.opts.format(item));
                    $li.click(MultiSortSelect.eventShowAllAdd);
                    this.$showall.append($li);
                }
                this.builtShowAll = true;
            }
            if (this.builtShowAll) {
                this.$showall.toggle();
            }
        }

        // }}}

    });

    // }}}

}

// }}}
// {{{ add to jquery

// Add to Jquery as a plugin
$.fn.multisortselect = function(opts) {
    if (typeof(opts) == 'object') {
        var objs = [];
        $(this).each(function () {
            var newobj = new MultiSortSelect($(this), opts);
            objs.push(newobj);
        });
        return objs;
    }
};

// }}}

