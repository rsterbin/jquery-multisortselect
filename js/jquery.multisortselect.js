/**
 * MultiSortSelect plugin
 *
 * @package    MultiSortSelect
 * @copyright  Copyright (c) 2013 Reha Sterbin
 * @version    $Id$
 * @author     Reha Sterbin <reha@omniti.com>
 * @note       First draft developed for Ora Media, LLC
 */

(function ($) {

    // {{{ MultiSortSelect class

    // {{{ Constructor

    /**
     * Initializes a new object
     *
     * @param Element $el  the subject element (must be <input type="text">)
     * @param object  opts any custom options
     */
    MultiSortSelect = function($el, opts) {
        this.init($el, opts);
    }

    // }}}
    // {{{ Class-level properties

    MultiSortSelect.registry = new Array(); // Index each new object (for use in css ids)
    MultiSortSelect.default_opts = {
        entry_type: 'autocomplete',
        backend: [],
        format: function (item) { return item.label; },
        unique: true,
        show_all: false,
        cache_featured: true,
        allow_new: false
    };

    // }}}
    // {{{ Class-level methods

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
    // {{{ objectFromElem()

    /**
     * Finds the MultiSortSelect object, given an element within the node
     *
     * @param  Element         $el the inner element
     * @return MultiSortSelect the object, or null if not found
     */
    MultiSortSelect.objectFromElem = function ($el) {
        var mid = $el.closest('.multisortselect').data('multisortselect_id');
        return MultiSortSelect.fetch(mid);
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
        var obj = MultiSortSelect.objectFromElem($(this));
        if (obj) {
            var iid = $(this).closest('li').data('multisortselect_iid');
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
        var obj = MultiSortSelect.objectFromElem($(this));
        if (obj) {
            obj.insertItem(ui.item, true);
        }
        $c.val('');
        return false;
    };

    // }}}
    // {{{ eventTextEnter()

    /**
     * On-enter event for the entry box
     *
     * @param Event e the event
     */
    MultiSortSelect.eventTextEnter = function(e) {
        var $c = $(e.target);
        var obj = MultiSortSelect.objectFromElem($(this));
        if (obj) {
            var val = $c.val();
            if (obj.validateEntry(val)) {
                var item = obj.buildItemFromEntry(val);
                obj.insertItem(item, true);
            }
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
        var obj = MultiSortSelect.objectFromElem($(this));
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
        var obj = MultiSortSelect.objectFromElem($(this));
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
        var obj = MultiSortSelect.objectFromElem($(this));
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
        var obj = MultiSortSelect.objectFromElem($(this));
        if (obj) {
            var iid = $(this).closest('li').attr('rel');
            obj.insertItemById(iid, true);
        }
    };

    // }}}
    // {{{ eventShowFeatured()

    /**
     * Click event that toggles the featured box
     *
     * @param Event e the event
     */
    MultiSortSelect.eventShowFeatured = function(e) {
        e.preventDefault();
        var obj = MultiSortSelect.objectFromElem($(this));
        if (obj) {
            obj.showFeatured();
        }
    };

    // }}}
    // {{{ eventShowFeaturedAdd()

    /**
     * Click event that adds an item from the featured box
     *
     * @param Event e the event
     */
    MultiSortSelect.eventShowFeaturedAdd = function(e) {
        e.preventDefault();
        var obj = MultiSortSelect.objectFromElem($(this));
        if (obj) {
            var iid = $(this).closest('li').attr('rel');
            obj.insertItemById(iid, true);
        }
    };

    // }}}

    // }}}
    // {{{ Prototype

    $.extend(MultiSortSelect.prototype, {

        // {{{ Object variables

        id: 0,
        opts: {},
        cache: '',
        currentIds: '',
        allItems: '',
        fetchedAll: false,
        builtShowAll: false,
        featuredItems: '',
        fetchedFeatured: false,
        builtFeatured: false,
        $input: '',
        $node: '',
        $list: '',
        $showall_button: '',
        $showall: '',
        $newitem: '',

        // }}}
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

            // Initialize tracking properties
            this.currentIds = new Array;
            this.allItems = new Array;
            this.featuredItems = new Array;

            // Initialize the node
            this.$input.wrap('<div class="multisortselect" id="multisortselect_' + this.id + '" />');
            this.$node = this.$input.closest('.multisortselect');
            this.$node.data('multisortselect_id', this.id);
            if (this.opts.top_class) {
                this.$node.addClass(this.opts.top_class);
            }

            // Add the list
            var list = '<ul class="multisortselect-list"></ul>';
            this.$node.prepend(list);
            this.$list = this.$node.find('.multisortselect-list');
            this.$list.sortable({
                stop: MultiSortSelect.eventSortStop
            });

            // Add the autocomplete field, if we're doing that
            if (this.opts.entry_type == 'autocomplete') {
                var newitem = '<input type="text" class="multisortselect-autocomplete" />';
                this.$node.append(newitem);
                this.$newitem = this.$node.find('.multisortselect-autocomplete');
                this.$newitem.autocomplete({
                    source: this.opts.backend,
                    response: MultiSortSelect.eventAutocompleteResponse,
                    select: MultiSortSelect.eventAutocompleteSelect
                });
            }

            // Add the text entry field, if we're doing that
            if (this.opts.entry_type == 'text') {
                var newitem = '<input type="text" class="multisortselect-entry" />';
                this.$node.append(newitem);
                this.$newitem = this.$node.find('.multisortselect-entry');
                this.$newitem.keydown(function (e) {
                    if (e.which == 13) { // Enter
                        e.preventDefault();
                        MultiSortSelect.eventTextEnter(e);
                    }
                });
            }

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

            // Add featured button, if requested
            if (typeof this.opts.featured == 'function') {
                var button = '<a href="#" class="btn multisortselect-featured_button">Featured</a>';
                this.$node.append(button);
                this.$featured_button = this.$node.find('.multisortselect-featured_button');
                this.$featured_button.click(MultiSortSelect.eventShowFeatured);
                var flist = '<ul class="multisortselect-featured"></ul>';
                this.$node.append(flist);
                this.$featured = this.$node.find('.multisortselect-featured');
                this.$featured.hide();
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
         * @param string defaults json describing the items
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
                var item_ids = new Array;
                try {
                    var item_ids = JSON.parse(defaults);
                } catch (ex) {
                    console.log(ex);
                }
                for (var i = 0; i < item_ids.length; i++) {
                    if (typeof(this.cache[item_ids[i]]) == 'object') {
                        this.insertItem(this.cache[item_ids[i]], false);
                    } else {
                        this.insertItemById(item_ids[i], false);
                    }
                }
            }
        },

        // }}}
        // {{{ validateEntry()

        /**
         * Validates an entry
         *
         * @param  string entry the text entry
         * @return bool   whether the text entry is acceptible
         */
        validateEntry: function(entry) {
            if (typeof this.opts.validate == 'function') {
                return this.opts.validate(entry);
            }
            return true;
        },

        // }}}
        // {{{ buildItemFromEntry()

        /**
         * Builds an item from an entry
         *
         * @param  string entry the text entry
         * @return object an object usable here
         */
        buildItemFromEntry: function(entry) {
            if (typeof this.opts.build == 'function') {
                return this.opts.build(entry);
            }
            return { id: entry, label: entry, value: entry };
        },

        // }}}
        // {{{ buildItemFromId()

        /**
         * Builds an item from an id
         *
         * @param  mixed  id the id
         * @return object an object usable here
         */
        buildItemFromId: function(id) {
            if (typeof this.opts.build == 'function') {
                return this.opts.build(null, id);
            }
            return { id: id, label: id, value: id };
        },

        // }}}
        // {{{ getCurrentIndex()

        /**
         * Returns the index of a given id in the list
         *
         * @param  mixed iid the item id
         * @return int   the index, or -1 if not found
         */
        getCurrentIndex: function(iid) {
            var index = -1;
            for (var k = 0; k < this.currentIds.length; k++) {
                var match = false;
                if (typeof this.opts.match == 'function') {
                    match = this.opts.match(this.currentIds[k], iid);
                } else {
                    match = this.currentIds[k] == iid;
                }
                if (match) {
                    index = k;
                }
            }
            return index;
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
            if (this.opts.unique) {
                var index = this.getCurrentIndex(iid);
                if (index >= 0 && update) {
                    return;
                }
            }
            this.currentIds.push(iid);
            if (update) {
                this.$input.attr('value', JSON.stringify(this.currentIds));
            }
            var $li = $('<li class="multisortselect-list-item">' +
                    '<div class="multisortselect-item"></div>' +
                    '<a href="#" class="multisortselect-remove" title="Remove">&#xd7;</a>' +
                '</li>');
            $li.data('multisortselect_iid', iid);
            $li.find('.multisortselect-item').html('<i class="icon-sort"></i>' + this.opts.format(item));
            $li.find('.multisortselect-remove').click(MultiSortSelect.eventRemoveItem);
            this.$list.append($li);
            if (typeof this.opts.after_add == 'function') {
                this.opts.after_add($li);
            }
        },

        // }}}
        // {{{ insertItemById()

        /**
         * Pushes an item into the list, given its id
         *
         * @param int  iid    the item's id
         * @param bool update whether to update the value
         */
        insertItemById: function(iid, update) {
            if (typeof(this.cache[iid]) == 'object') {
                return this.insertItem(this.cache[iid], update);
            } else if (this.opts.entry_type == 'text') {
                return this.insertItem(this.buildItemFromId(iid), update);
            } else {
                var arr = new Array(iid);
                $.ajax({
                    'type': 'GET',
                    'url': this.opts.backend,
                    'data': { 'defaults': JSON.stringify(arr) },
                    'dataType': 'json',
                    'context': { obj: this, update: update },
                    'success': function (data) {
                        for (var i = 0; i < data.length; i++) {
                            this.obj.cacheItem(data[i]);
                            this.obj.insertItem(data[i], this.update);
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
            var index = this.getCurrentIndex(iid);
            if (index >= 0) {
                this.currentIds.splice(index, 1);
                this.$input.attr('value', JSON.stringify(this.currentIds));
            }
            this.$list.find('.multisortselect-list-item').each(function () {
                var $el = $(this);
                if ($el.data('multisortselect_iid') == iid) {
                    $el.remove();
                }
            });
        },

        // }}}
        // {{{ reorderInput()

        /**
         * Reorders the ids in the input to match the list
         */
        reorderInput: function() {
            var newOrder = new Array();
            this.$list.find('li').each(function () {
                newOrder.push($(this).data('multisortselect_iid'));
            });
            this.currentIds = newOrder;
            this.$input.attr('value', JSON.stringify(newOrder));
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
        },

        // }}}
        // {{{ showFeatured()

        /**
         * Shows the featured options
         */
        showFeatured: function() {
            if (typeof this.opts.featured == 'function' && (!this.opts.cache_featured || !this.fetchedFeatured)) {
                this.featuredItems = this.opts.featured(this);
                this.fetchedFeatured = true;
            }
            if (this.fetchedFeatured && (!this.opts.cache_featured || !this.builtFeatured)) {
                for (var i = 0; i < this.featuredItems.length; i++) {
                    var item = this.featuredItems[i];
                    var $li = $('<li></li>');
                    $li.attr('rel', item.id);
                    $li.html('<i class="icon-plus"></i>' + this.opts.format(item));
                    $li.click(MultiSortSelect.eventShowFeaturedAdd);
                    this.$featured.append($li);
                }
                this.builtFeatured = true;
            }
            if (this.builtFeatured) {
                this.$featured.toggle();
            }
        }

        // }}}

    });

    // }}}

    // }}}
    // {{{ Add to jQuery

    /**
     * Adds the plugin to jquery
     *
     * Filters out any non-text-input elements.
     *
     * @param object opts any custom options
     */
    $.fn.multisortselect = function(opts) {
        return this.filter('input[type=text]').each(function () {
            var newobj = new MultiSortSelect($(this), opts);
        });
    };

    // }}}

})(jQuery);

