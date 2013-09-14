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
    MultiSortSelect.new_id = '_multisortselect_new';
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
    // {{{ debug()

    /**
     * Wrapper for console.log
     *
     * @param mixed obj the thing to dump
     */
    MultiSortSelect.debug = function(obj) {
        if (typeof console != 'undefined' && typeof console.log == 'function') {
            console.log(obj);
        }
    };

    // }}}

    // }}}
    // {{{ Prototype

    $.extend(MultiSortSelect.prototype, {

        // {{{ Object variables

        id: 0,
        eventRegistry: '',
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
        $entry: '',

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
            this.eventRegistry = {
                newItemInsert: []
            };

            // Initialize tracking properties
            this.currentIds = new Array;
            this.allItems = new Array;
            this.featuredItems = new Array;

            // Prep the item list, if we already have one
            if (typeof(this.opts.backend) == 'object') {
                this.allItems = this.opts.backend;
                this.fetchedAll = true;
                for (var i = 0; i < this.allItems.length; i++) {
                    this.cacheItem(this.allItems[i]);
                }
            }

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

            // Add the entry field
            this.$node.append('<div class="multisortselect-entry"></div>');
            if (this.opts.entry_type == 'autocomplete') {
                var entry_opts = $.extend({}, this.opts.entry);
                if (typeof entry_opts.source == 'undefined') {
                    entry_opts.source = this.opts.backend;
                }
                this.entryObj = new MSS_Entry_Autocomplete(this, entry_opts);
            } else if (this.opts.entry_type == 'text') {
                this.entryObj = new MSS_Entry_Text(this, this.opts.entry);
            } else if (this.opts.entry_type == 'select') {
                this.entryObj = new MSS_Entry_Select(this, this.opts.entry);
            } else {
                var customClass = this.findFunctionFromString(this.opts.entry_type);
                if (typeof customClass != 'function') {
                    throw 'Entry type "' + this.opts.entry_type + '" is not supported';
                }
                this.entryObj = new customClass(this, this.opts.entry);
            }
            this.$entry = this.$node.find('.multisortselect-entry');
            this.$entry.append(this.entryObj.build());

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
                    'context': { self: this, call: 'loadDefaults' },
                    'success': function (data) {
                        for (var i = 0; i < data.length; i++) {
                            this.self.cacheItem(data[i]);
                            this.self.insertItem(data[i], false);
                        }
                    },
                    'error': this.handleAjaxError
                });
            } else {
                var item_ids = new Array;
                try {
                    var item_ids = JSON.parse(defaults);
                } catch (ex) {
                    console.log(ex);
                }
                for (var i = 0; i < item_ids.length; i++) {
                    var item = null;
                    if (typeof(this.cache[item_ids[i]]) == 'object') {
                        item = this.cache[item_ids[i]];
                    } else {
                        item = this.buildItemFromId(item_ids[i]);
                    }
                    this.insertItem(item, false);
                }
            }
        },

        // }}}
        // {{{ registerEvent()

        /**
         * Registers a function for an event
         *
         * @param string   name the event name
         * @param function observer   the observer function
         */
        registerEvent: function(name, observer) {
            if (typeof this.eventRegistry[name] != 'undefined') {
                this.eventRegistry[name].push(observer);
            }
        },

        // }}}
        // {{{ broadcastEvent()

        /**
         * Broadcasts an event to all registered functions
         *
         * @param string name   the event name
         * @param object params info to pass to the registered function
         */
        broadcastEvent: function(name, params) {
            if (typeof this.eventRegistry[name] != 'undefined') {
                for (var i = 0; i < this.eventRegistry[name].length; i++) {
                    var fn = this.eventRegistry[name][i];
                    fn(params, this);
                }
            }
        },

        // }}}
        // {{{ callForAllItems()

        /**
         * Calls out for a list of all items
         *
         * @param  function  handler a function that handles the list of all items
         *                           (args: item array, pass object)
         * @param  object    pass    an object containing anything the function
         *                           needs passed to it
         * @throws exception if the handler is not a function
         */
        callForAllItems: function(handler, pass) {
            if (typeof handler != 'function') {
                throw 'Handler must be a function';
            } else if (typeof this.allItems != 'string') {
                handler(this.allItems, pass);
                return;
            } else if (typeof(this.opts.backend) == 'string') {
                $.ajax({
                    'type': 'GET',
                    'url': this.opts.backend,
                    'data': { 'all': true },
                    'dataType': 'json',
                    'context': { self: this, call: 'callForAllItems', pass: pass, handler: handler },
                    'success': function (data) {
                        this.self.allItems = new Array();
                        for (var i = 0; i < data.length; i++) {
                            this.self.cacheItem(data[i]);
                            this.self.allItems.push(data[i]);
                        }
                        this.self.fetchedAll = true;
                        this.handler(this.self.allItems, this.pass);
                    },
                    'error': this.handleAjaxError
                });
            } else {
                this.debug('Cannot retrieve all items');
            }
        },

        // }}}
        // {{{ callForItemById()

        /**
         * Calls out for an item by its id
         *
         * @param  mixed     iid     the item id
         * @param  function  handler a function that handles the item (args:
         *                           item, pass object)
         * @param  object    pass    an object containing anything the function
         *                           needs passed to it
         * @throws exception if the handler is not a function
         */
        callForItemById: function(iid, handler, pass) {
            if (typeof handler != 'function') {
                throw 'Handler must be a function';
            }

            if (iid == MultiSortSelect.new_id) {
                this.callForNewItem('', handler, pass);
                return;
            }

            if (typeof this.cache[iid] != 'undefined') {
                handler(this.cache[iid], pass);
                return;
            }

            if (typeof(this.opts.backend) == 'string') {
                var arr = new Array(iid);
                $.ajax({
                    'type': 'GET',
                    'url': this.opts.backend,
                    'data': { 'defaults': JSON.stringify(arr) },
                    'dataType': 'json',
                    'context': { self: this, call: 'callForItemById', pass: pass, handler: handler },
                    'success': function (data) {
                        for (var i = 0; i < data.length; i++) {
                            this.self.cacheItem(data[i]);
                            this.handler(data[i], this.pass);
                        }
                    },
                    'error': this.handleAjaxError
                });
                return;
            }

            this.debug('Cannot retrieve item by id');
        },

        // }}}
        // {{{ callForNewItem()

        /**
         * Calls out for a new item, possibly given some text
         *
         * @param  string    entry   something from which to build the item
         * @param  function  handler a function that handles the item (args:
         *                           item, pass object)
         * @param  object    pass    an object containing anything the function
         *                           needs passed to it
         * @throws exception if the handler is not a function
         */
        callForNewItem: function(entry, handler, pass) {
            if (typeof handler != 'function') {
                throw 'Handler must be a function';
            }

            if (typeof(this.opts.backend) == 'string') {
                $.ajax({
                    'type': 'POST',
                    'url': this.opts.backend,
                    'data': { 'new': entry },
                    'dataType': 'json',
                    'context': { self: this, call: 'callForNewItem', pass: pass, handler: handler },
                    'success': function (data) {
                        this.self.cacheItem(data);
                        this.self.broadcastEvent('newItemInsert', { 'item': item });
                        this.handler(data, this.pass);
                    },
                    'error': this.handleAjaxError
                });
                return;
            }

            var item = this.buildPlaceholderFromEntry(entry);
            handler(item, pass);
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
        // {{{ buildPlaceholderFromEntry()

        /**
         * Builds a placeholder item from some text entry
         *
         * @param  string entry the text entry
         * @param  string label [optional] the label
         * @return object an object usable here
         */
        buildPlaceholderFromEntry: function(entry, label) {
            return {
                id: MultiSortSelect.new_id,
                label: typeof label != 'undefined' ? label : 'New',
                multisortselect_is_new_option: true,
                multisortselect_entry: entry
            };
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
        // {{{ hasCachedItem()

        /**
         * Returns whether we have a cached item
         *
         * @param  object item    the item
         * @return bool   whether the item is cached
         */
        hasCachedItem: function(item) {
            if (typeof(this.cache) == 'string') {
                return false;
            }
            return (typeof this.cache[item.id] != 'undefined');
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
            if (item.multisortselect_is_new_option) {
                if (typeof this.opts.build_item == 'function') {
                    var built = this.opts.build_item(item.multisortselect_entry, this);
                } else {
                    var built = this.buildItemFromEntry(item.multisortselect_entry);
                }
                // Don't insert it it didn't return an item
                if (typeof built != 'object' || !built.id) {
                    return;
                }
                item = built;
                this.broadcastEvent('newItemInsert', { 'item': item });
            }

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

            if (!this.hasCachedItem(item)) {
                this.cacheItem(item);
            }

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
            if (iid == MultiSortSelect.new_id) {
                return this.insertItem(this.buildPlaceholderFromEntry(''), update);
            } else if (typeof(this.cache[iid]) == 'object') {
                return this.insertItem(this.cache[iid], update);
            } else {
                var arr = new Array(iid);
                $.ajax({
                    'type': 'GET',
                    'url': this.opts.backend,
                    'data': { 'defaults': JSON.stringify(arr) },
                    'dataType': 'json',
                    'context': { self: this, call: 'insertItemById', update: update },
                    'success': function (data) {
                        for (var i = 0; i < data.length; i++) {
                            this.self.cacheItem(data[i]);
                            this.self.insertItem(data[i], this.update);
                        }
                    },
                    'error': this.handleAjaxError
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
                    'context': { self: this, call: 'showAll' },
                    'success': function (data) {
                        this.self.allItems = new Array();
                        for (var i = 0; i < data.length; i++) {
                            this.self.cacheItem(data[i]);
                            this.self.allItems.push(data[i]);
                        }
                        this.self.fetchedAll = true;
                        this.self.showAll();
                    },
                    'error': this.handleAjaxError
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
        },

        // }}}
        // {{{ findFunctionFromString()

        /**
         * Given a string, return the function/class by that name
         *
         * @param string name the function name
         * @return function the function, or null if not found
         */
        findFunctionFromString: function(name) {
            if (name == '') {
                return null;
            }
            var parts = name.split('.');
            var fn = window;
            for (var i = 0, len = parts.length; i < len; i++) {
                fn = fn[parts[i]];
            }
            if (typeof fn !== 'function') {
                return null;
            }
            return fn;
        },

        // }}}
        // {{{ handleAjaxError()

        /**
         * Handles error responses from the json in a generic way
         *
         * @param jqXHR  xhr    the request object
         * @param string status the status ("timeout", "error", "abort", "parsererror", or null)
         * @param string error  the text part of the http status
         */
        handleAjaxError: function(xhr, status, error) {
            MultiSortSelect.debug(this);
            MultiSortSelect.debug(xhr);
            MultiSortSelect.debug('Status: ' + status + '; Error: ' + error);
        },

        // }}}
        // {{{ debug()

        /**
         * Wrapper for class-level debug
         *
         * @param mixed obj the thing to dump
         */
        debug: function(obj) {
            MultiSortSelect.debug(obj);
        }

        // }}}

    });

    // }}}

    // }}}
    // {{{ MSS_Entry_Autocomplete class

    // {{{ Constructor

    /**
     * Initializes a new object
     *
     * @param MultiSortSelect mss  the associated MultiSortSelect object
     * @param object          opts any custom options
     */
    MSS_Entry_Autocomplete = function($el, opts) {
        this.init($el, opts);
    }

    // }}}
    // {{{ Class-level properties

    MSS_Entry_Autocomplete.default_opts = {};

    // }}}
    // {{{ Class-level methods

    // {{{ eventAutocompleteSelect()

    /**
     * On-select event for the autocomplete
     *
     * @param Event  e  the event
     * @param object ui the info, including the item selected
     */
    MSS_Entry_Autocomplete.eventAutocompleteSelect = function(e, ui) {
        var $c = $(this);
        var mss = MultiSortSelect.objectFromElem($c);
        if (mss) {
            mss.insertItem(ui.item, true);
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
     * @param object ui contains "content", a list of the responses
     */
    MSS_Entry_Autocomplete.eventAutocompleteResponse = function(e, ui) {
        var $c = $(this);
        var mss = MultiSortSelect.objectFromElem($c);
        if (mss) {
            for (var i = 0; i < ui.content.length; i++) {
                mss.cacheItem(ui.content[i]);
            }
            if (mss.opts.allow_new) {
                var entry = $(e.target).val();
                mss.entryObj.addNewSuggestion(entry, ui);
            }
        }
    };

    // }}}

    // }}}
    // {{{ Prototype

    $.extend(MSS_Entry_Autocomplete.prototype, {

        // {{{ Object variables

        mss: null,
        opts: {},

        // }}}
        // {{{ init()

        /**
         * Init method, run only once, on launch
         *
         * @param MultiSortSelect mss  the associated MultiSortSelect object
         * @param object          opts any custom options
         */
        init: function(mss, opts) {
            this.mss = mss;
            this.opts = $.extend({}, MSS_Entry_Autocomplete.default_opts, opts);
            if (typeof this.opts.source == 'undefined') {
                throw 'Option "source" is required for autocomplete';
            }
        },

        // }}}
        // {{{ build()

        /**
         * Builds the entry
         *
         * All necessary events should be attached
         *
         * @return Element the entry
         */
        build: function() {
            var $entry = $('<input type="text" class="multisortselect-autocomplete" />');
            var ac_opts = $.extend({}, this.opts, {
                response: MSS_Entry_Autocomplete.eventAutocompleteResponse,
                select: MSS_Entry_Autocomplete.eventAutocompleteSelect
            });
            $entry.autocomplete(ac_opts);
            return $entry;
        },

        // }}}
        // {{{ addNewSuggestion()

        /**
         * Adds a "new" suggetion to the autocomplete list
         *
         * @param string entry the typed-in text
         * @param object ui    contains "content", a list of the responses
         */
        addNewSuggestion: function(entry, ui) {
            if (typeof this.opts.build_suggestion == 'function') {
                var label = this.opts.build_suggestion(entry, this);
            } else {
                var label = 'New: ' + entry;
            }
            var suggest = this.mss.buildPlaceholderFromEntry(entry, label);
            ui.content.unshift(suggest);
        }

        // }}}

    });

    // }}}

    // }}}
    // {{{ MSS_Entry_Select class

    // {{{ Constructor

    /**
     * Initializes a new object
     *
     * @param MultiSortSelect mss  the associated MultiSortSelect object
     * @param object          opts any custom options
     */
    MSS_Entry_Select = function($el, opts) {
        this.init($el, opts);
    }

    // }}}
    // {{{ Class-level properties

    MSS_Entry_Select.default_opts = {
        new_label: 'New'
    };

    // }}}
    // {{{ Class-level methods

    // {{{ eventAddButtonClick()

    /**
     * On-click event for the select's add button
     *
     * @param Event e the event
     */
    MSS_Entry_Select.eventAddButtonClick = function(e) {
        e.preventDefault();
        var mss = MultiSortSelect.objectFromElem($(this));
        if (mss) {
            var $s = mss.$entry.find('select');
            mss.callForItemById($s.val(), function (item, pass) {
                pass.mss.insertItem(item, true);
            }, { mss: mss, update: true });
            $s.val('');
        }
    };

    // }}}
    // {{{ eventNewItemInsert()

    /**
     * Called when a new item is inserted
     *
     * @param object          params the params passed to the observer
     * @param MultiSortSelect mss    the multisortselect object
     */
    MSS_Entry_Select.eventNewItemInsert = function(params, mss) {
        mss.entryObj.addSelectOption(params.item, mss.$entry.find('select'));
    };

    // }}}

    // }}}
    // {{{ Prototype

    $.extend(MSS_Entry_Select.prototype, {

        // {{{ Object variables

        mss: null,
        opts: {},

        // }}}
        // {{{ init()

        /**
         * Init method, run only once, on launch
         *
         * @param MultiSortSelect mss  the associated MultiSortSelect object
         * @param object          opts any custom options
         */
        init: function(mss, opts) {
            this.mss = mss;
            this.opts = $.extend({}, MSS_Entry_Select.default_opts, opts);
            this.mss.registerEvent('newItemInsert', MSS_Entry_Select.eventNewItemInsert);
        },

        // }}}
        // {{{ build()

        /**
         * Builds the entry
         *
         * All necessary events should be attached
         *
         * @return Element the entry
         */
        build: function() {
            var $entry = $('<div class="multisortselect-selection">' +
                '<select class="multisortselect-select"><option value=""></option></select>' +
                '<a href="#" class="btn multisortselect-select_button">Add</a>' +
                '</div>');
            $entry.find('.multisortselect-select_button').click(MSS_Entry_Select.eventAddButtonClick);
            if (this.mss.opts.allow_new) {
                this.addSelectOption(this.mss.buildPlaceholderFromEntry('', this.opts.new_label), $entry.find('select'));
            }
            this.mss.callForAllItems(function (items, pass) {
                for (var i = 0; i < items.length; i++) {
                    pass.entry.addSelectOption(items[i], pass.$select);
                }
            }, { entry: this, $select: $entry.find('select') });
            return $entry;
        },

        // }}}
        // {{{ addSelectOption()

        /**
         * Pushes an item into the select
         *
         * @param object  item    the item
         * @param Element $select the select element
         */
        addSelectOption: function(item, $select) {
            var $opt = $('<option></option>');
            $opt.attr('value', item.id);
            $opt.text(item.label);
            $select.append($opt);
        }

        // }}}

    });

    // }}}

    // }}}
    // {{{ MSS_Entry_Text class

    // {{{ Constructor

    /**
     * Initializes a new object
     *
     * @param MultiSortSelect mss  the associated MultiSortSelect object
     * @param object          opts any custom options
     */
    MSS_Entry_Text = function($el, opts) {
        this.init($el, opts);
    }

    // }}}
    // {{{ Class-level properties

    MSS_Entry_Text.default_opts = {
    };

    // }}}
    // {{{ Class-level methods

    // {{{ eventTextEnter()

    /**
     * On-enter event for the entry box
     *
     * @param Event e the event
     */
    MSS_Entry_Text.eventTextEnter = function(e) {
        var $c = $(e.target);
        var mss = MultiSortSelect.objectFromElem($c);
        if (mss) {
            var val = $c.val();
            if (mss.validateEntry(val)) {
                mss.insertItem(mss.buildItemFromEntry(val), true);
            }
        }
        $c.val('');
        return false;
    };

    // }}}

    // }}}
    // {{{ Prototype

    $.extend(MSS_Entry_Text.prototype, {

        // {{{ Object variables

        mss: null,
        opts: {},

        // }}}
        // {{{ init()

        /**
         * Init method, run only once, on launch
         *
         * @param MultiSortSelect mss  the associated MultiSortSelect object
         * @param object          opts any custom options
         */
        init: function(mss, opts) {
            this.mss = mss;
            this.opts = $.extend({}, MSS_Entry_Text.default_opts, opts);
        },

        // }}}
        // {{{ build()

        /**
         * Builds the entry
         *
         * All necessary events should be attached
         *
         * @return Element the entry
         */
        build: function() {
            var $entry = $('<input type="text" class="multisortselect-entry" />');
            $entry.keydown(function (e) {
                if (e.which == 13) { // Enter
                    e.preventDefault();
                    MSS_Entry_Text.eventTextEnter(e);
                }
            });
            return $entry;
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

