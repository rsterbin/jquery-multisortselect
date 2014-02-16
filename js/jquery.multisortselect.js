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

    // {{{ registry

    /**
     * Index each new object (for use in css ids)
     */
    MultiSortSelect.registry = new Array();

    // }}}
    // {{{ new_id

    /**
     * If the item id is this, it's a placeholder
     */
    MultiSortSelect.new_id = '_multisortselect_new';

    // }}}
    // {{{ default_opts

    /**
     * The default options
     */
    MultiSortSelect.default_opts = {
        entry_type: 'autocomplete',
        backend: [],
        use_cache: true,
        format: function (item) { return item.label; },
        ui: true,
        unique: true,
        max_items: -1,
        cache_featured: true,
        allow_new: false,
        widgets: {}
    };

    // }}}
    // {{{ registered_widgets

    /**
     * The widgets registered and available to the plugin
     */
    MultiSortSelect.registered_widgets = {};

    // }}}
    // {{{ backend_call_types

    /**
     * The backend call definitions
     */
    MultiSortSelect.backend_call_types = {

        // {{{ item_by_id

        /**
         * Calls for an item using its id
         */
        item_by_id: {

            // {{{ accepts

            /**
             * Contents of params
             */
            accepts: {
                iid: 'required',
                handler: 'optional',
                pass: 'optional'
            },

            // }}}
            // {{{ returns

            /**
             * Contents of return
             */
            returns: {
                item: 'required'
            },

            // }}}
            // {{{ before()

            /**
             * Checks before the call to determine whether we need to proceed
             *
             * @param  MSS_Backend backend   the mss backend object
             * @param  object      params    the params, as described in 'accepts'
             * @param  object      call_info the call info (this object)
             * @return bool        whether to proceed
             */
            before: function (backend, params, call_info) {

                // New item?  Call for that instead.
                if (params.iid == MultiSortSelect.new_id) {
                    var newparams = { entry: '' };
                    if (typeof params.handler != 'undefined') {
                        newparams.handler = params.handler;
                    }
                    if (typeof params.pass != 'undefined') {
                        newparams.pass = params.pass;
                    }
                    backend.makeCall('new_item', newparams);
                    return false;
                }

                // Do we already have it?
                var cached = backend.mss.public_getCachedItem(params.iid);
                if (cached) {
                    if (typeof params.handler == 'function') {
                        params.handler(cached, params.pass);
                    }
                    return false;
                }

                return true;
            },

            // }}}
            // {{{ ajax

            /**
             * Options for the ajax call
             */
            ajax: {
                method: 'get',
                vars: { defaults: { key: 'iid', transform: 'json_array' } },
                ret: { item: { transform: 'first_item' } }
            },

            // }}}
            // {{{ from_array()

            /**
             * Pulls the necessary info from a backend array
             *
             * @param  Array       arr     the array
             * @param  MSS_Backend backend the mss backend object
             * @param  object      params  the params, as described in 'accepts'
             * @return object      the return values, as described in 'returns'
             */
            from_array: function (arr, backend, params) {
                var item = null;
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].id == iid) {
                        item = arr[i];
                        break;
                    }
                }
                return { 'item': item };
            },

            // }}}
            // {{{ success()

            /**
             * Work to do upon a successful return
             *
             * @param  MSS_Backend backend the mss backend object
             * @param  object      params  the params, as described in 'accepts'
             * @param  object      retvals the array
             */
            success: function (backend, params, retvals) {
                backend.mss.public_cacheItem(retvals.item);
                if (typeof params.handler == 'function') {
                    params.handler(retvals.item, params.pass);
                }
            }

            // }}}

        },

        // }}}
        // {{{ new_item

        /**
         * Calls out for a new item, possibly given some text
         */
        new_item: {

            // {{{ accepts

            /**
             * Contents of params
             */
            accepts: {
                entry: 'required',
                handler: 'optional',
                pass: 'optional'
            },

            // }}}
            // {{{ returns

            /**
             * Contents of return
             */
            returns: {
                item: 'required'
            },

            // }}}
            // {{{ ajax

            /**
             * Options for the ajax call
             */
            ajax: {
                method: 'post',
                vars: { new: { key: 'entry' } },
                ret: { item: {} }
            },

            // }}}
            // {{{ from_array()

            /**
             * Pulls the necessary info from a backend array
             *
             * @param  Array       arr     the array
             * @param  MSS_Backend backend the mss backend object
             * @param  object      params  the params, as described in 'accepts'
             * @return object      the return values, as described in 'returns'
             */
            from_array: function (arr, backend, params) {
                var item = backend.mss.public_buildItem(params.entry);
                return { 'item': item };
            },

            // }}}
            // {{{ success()

            /**
             * Work to do upon a successful return
             *
             * @param  MSS_Backend backend the mss backend object
             * @param  object      params  the params, as described in 'accepts'
             * @param  object      retvals the array
             */
            success: function (backend, params, retvals) {
                backend.mss.public_addNewItem(retvals.item);
                if (typeof params.handler == 'function') {
                    params.handler(retvals.item, params.pass);
                }
            }

            // }}}

        },

        // }}}
        // {{{ defaults

        /**
         * Calls out for a set of items by their ids
         */
        defaults: {

            // {{{ accepts

            /**
             * Contents of params
             */
            accepts: {
                entry: 'defaults',
                handler: 'optional',
                pass: 'optional'
            },

            // }}}
            // {{{ returns

            /**
             * Contents of return
             */
            returns: {
                items: 'required'
            },

            // }}}
            // {{{ before()

            /**
             * Checks before the call to determine whether we need to proceed
             *
             * @param  MSS_Backend backend   the mss backend object
             * @param  object      params    the params, as described in 'accepts'
             * @param  object      call_info the call info (this object)
             * @return bool        whether to proceed
             */
            before: function (backend, params, call_info) {
                var found = new Array;
                for (var i = 0; i < params.defaults.length; i++) {
                    var item = backend.mss.public_getCachedItem(params.defaults[i]);
                    if (item) {
                        found.push(item);
                    }
                }
                if (found.length == params.defaults.length) {
                    call_info.success(backend, params, { items: found });
                    return false;
                }
                return true;
            },

            // }}}
            // {{{ ajax

            /**
             * Options for the ajax call
             */
            ajax: {
                method: 'get',
                vars: { defaults: { key: 'defaults' } },
                ret: { items: {} }
            },

            // }}}
            // {{{ from_array()

            /**
             * Pulls the necessary info from a backend array
             *
             * @param  Array       arr     the array
             * @param  MSS_Backend backend the mss backend object
             * @param  object      params  the params, as described in 'accepts'
             * @return object      the return values, as described in 'returns'
             */
            from_array: function (arr, backend, params) {
                var items = new Array;
                for (var j = 0; j < params.defaults.length; j++) {
                    var item = backend.mss.public_getCachedItem(params.defaults[j]);
                    if (typeof item != 'object') {
                        var item = backend.mss.public_buildItem(params.defaults[j]);
                    }
                    items.push(item);
                }
                return { 'items': items };
            },

            // }}}
            // {{{ success()

            /**
             * Work to do upon a successful return
             *
             * @param  MSS_Backend backend the mss backend object
             * @param  object      params  the params, as described in 'accepts'
             * @param  object      retvals the array
             */
            success: function (backend, params, retvals) {
                for (var i = 0; i < retvals.items.length; i++) {
                    backend.mss.cacheItem(retvals.items[i]);
                    backend.mss.insertItem(retvals.items[i], false);
                }
                if (typeof params.handler == 'function') {
                    params.handler(retvals.items, params.pass);
                }
            }

            // }}}

        },

        // }}}
        // {{{ all_items

        /**
         * Calls out for a list of all the items
         */
        all_items: {

            // {{{ accepts

            /**
             * Contents of params
             */
            accepts: {
                handler: 'optional',
                pass: 'optional'
            },

            // }}}
            // {{{ returns

            /**
             * Contents of return
             */
            returns: {
                items: 'required'
            },

            // }}}
            // {{{ before()

            /**
             * Checks before the call to determine whether we need to proceed
             *
             * @param  MSS_Backend backend   the mss backend object
             * @param  object      params    the params, as described in 'accepts'
             * @param  object      call_info the call info (this object)
             * @return bool        whether to proceed
             */
            before: function (backend, params, call_info) {
                if (typeof backend.mss.allItems != 'string') {
                    call_info.success(backend, params, { items: backend.mss.allItems });
                    return false;
                }
                return true;
            },

            // }}}
            // {{{ ajax

            /**
             * Options for the ajax call
             */
            ajax: {
                method: 'get',
                vars: {},
                ret: { items: {} }
            },

            // }}}
            // {{{ from_array()

            /**
             * Pulls the necessary info from a backend array
             *
             * @param  Array       arr     the array
             * @param  MSS_Backend backend the mss backend object
             * @param  object      params  the params, as described in 'accepts'
             * @return object      the return values, as described in 'returns'
             */
            from_array: function (arr, backend, params) {
                return { 'items': arr };
            },

            // }}}
            // {{{ success()

            /**
             * Work to do upon a successful return
             *
             * @param  MSS_Backend backend the mss backend object
             * @param  object      params  the params, as described in 'accepts'
             * @param  object      retvals the array
             */
            success: function (backend, params, retvals) {
                backend.mss.setAllItems(retvals.items);
                if (typeof params.handler == 'function') {
                    params.handler(retvals.items, params.pass);
                }
            }

            // }}}

        },

        // }}}
        // {{{ featured

        /**
         * Calls out for a list of featured items
         */
        featured: {

            // {{{ accepts

            /**
             * Contents of params
             */
            accepts: {
                handler: 'optional',
                pass: 'optional'
            },

            // }}}
            // {{{ returns

            /**
             * Contents of return
             */
            returns: {
                items: 'required'
            },

            // }}}
            // {{{ ajax

            /**
             * Options for the ajax call
             */
            ajax: {
                method: 'get',
                vars: { featured: { hardcoded: true } },
                ret: { items: {} }
            },

            // }}}
            // {{{ from_array()

            /**
             * Pulls the necessary info from a backend array
             *
             * @param  Array       arr     the array
             * @param  MSS_Backend backend the mss backend object
             * @param  object      params  the params, as described in 'accepts'
             * @return object      the return values, as described in 'returns'
             */
            from_array: function (arr, backend, params) {
                return { 'items': arr };
            },

            // }}}
            // {{{ success()

            /**
             * Work to do upon a successful return
             *
             * @param  MSS_Backend backend the mss backend object
             * @param  object      params  the params, as described in 'accepts'
             * @param  object      retvals the array
             */
            success: function (backend, params, retvals) {
                backend.mss.setFeaturedItems(retvals.items);
                if (typeof params.handler == 'function') {
                    params.handler(retvals.items, params.pass);
                }
            }

            // }}}

        }

        // }}}

    };

    // }}}

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
    // {{{ registerWidget()

    /**
     * Registers a widget
     *
     * @param  object widget the widget
     * @return bool   whether the widget was accepted
     */
    MultiSortSelect.registerWidget = function (widget) {
        if (typeof widget != 'object' || typeof widget.id != 'string' || typeof widget.init != 'function') {
            return false;
        }
        MultiSortSelect.registered_widgets[widget.id] = widget;
        return true;
    };

    // }}}
    // {{{ widgetIsRegistered()

    /**
     * Returns whether a widget is registered
     *
     * @param  string pkey the widget id
     * @return bool   whether the widget is registered
     */
    MultiSortSelect.widgetIsRegistered = function (pkey) {
        return (typeof MultiSortSelect.registered_widgets[pkey] == 'object');
    };

    // }}}
    // {{{ getRegisteredWidget()

    /**
     * Returns a registered widget
     *
     * @param  string pkey the widget id
     * @return object the widget, or undefined if not found
     */
    MultiSortSelect.getRegisteredWidget = function (pkey) {
        if (typeof MultiSortSelect.registered_widgets[pkey] == 'undefined') {
            return false;
        }
        return MultiSortSelect.registered_widgets[pkey];
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
            var $li = $(this).closest('li'),
                iid = $li.data('multisortselect_iid'),
                index = $li.data('multisortselect_index');
            obj.remove(iid, index);
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
        featuredItems: '',
        fetchedFeatured: false,
        builtFeatured: false,
        $input: '',
        $node: '',
        $list: '',
        $entry: '',
        widgets: '',

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
            this.allItems = '';
            this.currentIds = new Array;
            this.featuredItems = '';

            // Set up the backend object
            var backend_type = typeof this.opts.backend;
            if (backend_type == 'object' && this.opts.backend instanceof Array) {
                backend_type = 'array';
            }
            if (backend_type == 'object') {
                this.backend = new MSS_Backend(this, this.opts.backend);
            } else if (backend_type == 'function' || backend_type == 'string' || backend_type == 'array') {
                this.backend = new MSS_Backend(this, { call_all: this.opts.backend });
            } else {
                throw 'Backend not supported';
            }
            for (var call_name in MultiSortSelect.backend_call_types) {
                this.backend.registerCallType(call_name, MultiSortSelect.backend_call_types[call_name]);
            }

            // Prep the item list, if we already have one
            if (this.backend.hasAllItems()) {
                this.backend.makeCall('all_items');
            }

            // Initialize the node
            this.$input.wrap('<div class="multisortselect" id="multisortselect_' + this.id + '" />');
            this.$node = this.$input.closest('.multisortselect');
            this.$node.data('multisortselect_id', this.id);
            if (this.opts.top_class) {
                this.$node.addClass(this.opts.top_class);
            }
            if (this.opts.ui) {
                this.$node.addClass('ui-widget')
                    .addClass('ui-widget-content')
                    .addClass('ui-corner-all');
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
                    entry_opts.source = this.backend.getAutocompleteSource();
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

            // Add featured button, if requested
            if (this.opts.show_featured) {
                var button = '<a href="#" class="multisortselect-featured_button multisortselect-button">Featured</a>';
                this.$node.append(button);
                this.$featured_button = this.$node.find('.multisortselect-featured_button');
                this.$featured_button.click(MultiSortSelect.eventShowFeatured);
                if (this.opts.ui) {
                    this.$featured_button.button({ icons: { primary: 'ui-icon-circle-triangle-s' } });
                }
                var flist = '<ul class="multisortselect-featured multisortselect-chooser"></ul>';
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
                try {
                    var iids = $.parseJSON(defaults);
                } catch (err) {
                    this.debug('defaults parse error: ' + defaults);
                    this.debug(err);
                }
                if (iids) {
                    this.backend.makeCall('defaults', { defaults: iids });
                }
            }

            // Initialize any widgets
            this.widgets = {};
            for (var pkey in this.opts.widgets) {
                var popts = this.opts.widgets[pkey];
                if (MultiSortSelect.widgetIsRegistered(pkey)) {
                    this.widgets[pkey] = MultiSortSelect.getRegisteredWidget(pkey);
                    this.widgets[pkey].init(this, popts);
                }
            }

        },

        // }}}
        // {{{ setAllItems()

        /**
         * Resets the list of all items and clears the cache
         *
         * @param  Array items the list of all items
         * @throws if the parameter passed in was not an array
         */
        setAllItems: function(items) {
            if (typeof items != 'object' || !(items instanceof Array)) {
                throw 'setAllItems() requires an object list';
            }
            this.allItems = new Array();
            this.emptyCache = {};
            for (var i = 0; i < items.length; i++) {
                this.cacheItem(items[i]);
                this.allItems.push(items[i]);
            }
            this.fetchedAll = true;
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
            if (typeof this.opts.build_item == 'function') {
                return this.opts.build_item(entry, this);
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
         * @param  mixed iid the item id
         * @return bool  whether the item is cached
         */
        hasCachedItem: function(iid) {
            if (!this.opts.use_cache) {
                return false;
            }
            if (typeof(this.cache) == 'string') {
                return false;
            }
            return (typeof this.cache[iid] != 'undefined');
        },

        // }}}
        // {{{ getCachedItem()

        /**
         * Returns a cached item
         *
         * @param  mixed  iid the item id
         * @return object the item, or false if not found
         */
        getCachedItem: function(iid) {
            if (!this.opts.use_cache) {
                return false;
            }
            if (typeof(this.cache) == 'string') {
                return false;
            }
            if (typeof this.cache[iid] != 'undefined') {
                return this.cache[iid];
            }
            return false;
        },

        // }}}
        // {{{ cacheItem()

        /**
         * Pushes an item into the cache
         *
         * @param  object item the item
         * @return bool   whether the item was cached
         */
        cacheItem: function(item) {
            if (!this.opts.use_cache) {
                return false;
            }
            if (typeof(this.cache) == 'string') {
                this.cache = {};
            }
            this.cache[item.id] = item;
            return true;
        },

        // }}}
        // {{{ emptyCache()

        /**
         * Empties the cache
         *
         * @return bool whether the cache was emptied
         */
        emptyCache: function() {
            if (!this.opts.use_cache) {
                return false;
            }
            this.cache = {};
            return true;
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
            if (this.opts.max_items > -1) {
                if (this.currentIds.length >= this.opts.max_items) {
                    return;
                }
            }

            if (item.multisortselect_is_new_option) {
                if (typeof this.opts.build_item == 'function') {
                    var built = this.opts.build_item(item.multisortselect_entry, this);
                } else {
                    var built = this.buildItemFromEntry(item.multisortselect_entry);
                }
                // Don't insert it if it didn't return an item
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
                    '<span class="multisortselect-move-icon"></span>' +
                    '<div class="multisortselect-item"></div>' +
                    '<a href="#" class="multisortselect-remove" title="Remove">&#xd7;</a>' +
                '</li>');
            $li.data('multisortselect_iid', iid);
            $li.data('multisortselect_index', this.currentIds.length - 1);
            $li.find('.multisortselect-item').append(this.opts.format(item));
            if (this.opts.ui) {
                $li.find('.multisortselect-move-icon')
                    .addClass('ui-icon')
                    .addClass('ui-icon-triangle-2-n-s');
                $li.find('.multisortselect-remove')
                    .addClass('ui-icon')
                    .addClass('ui-icon-closethick');
            }

            $li.find('.multisortselect-remove').click(MultiSortSelect.eventRemoveItem);
            this.$list.append($li);

            if (!this.hasCachedItem(item.id)) {
                this.cacheItem(item.id);
            }

            if (typeof this.opts.after_add == 'function') {
                this.opts.after_add($li);
            }
        },

        // }}}
        // {{{ insertNewItem()

        /**
         * Adds a new item to the list
         *
         * @param object item the new item
         */
        insertNewItem: function(item) {
            this.mss.cacheItem(item);
            this.mss.allItems.push(item);
            this.mss.broadcastEvent('newItemInsert', { 'item': item });
            this.insertItem(item);
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
            var handler = function (item, pass) {
                pass.mss.insertItem(item, pass.update);
            };
            var pass = { mss: this, update: update };
            this.backend.makeCall('item_by_id', { iid: iid });
        },

        // }}}
        // {{{ remove()

        /**
         * Removes an item from the list
         *
         * @param mixed iid   the item's id
         * @param int   index the item's index
         */
        remove: function(iid, index) {
            if (this.opts.unique) {
                var index = this.getCurrentIndex(iid);
                if (index < 0) {
                    this.$list.find('.multisortselect-list-item').each(function () {
                        var $el = $(this);
                        if ($el.data('multisortselect_iid') == iid) {
                            $el.remove();
                        }
                    });
                    return;
                }
            }
            if (this.currentIds[index] == iid) {
                this.currentIds.splice(index, 1);
                this.$input.attr('value', JSON.stringify(this.currentIds));
                $(this.$list.find('.multisortselect-list-item').get(index)).remove();
            }
        },

        // }}}
        // {{{ reorderInput()

        /**
         * Reorders the ids in the input to match the list
         */
        reorderInput: function() {
            var newOrder = new Array();
            this.$list.find('li').each(function (index) {
                var $li = $(this);
                $li.data('multisortselect_index', index);
                newOrder.push($li.data('multisortselect_iid'));
            });
            this.currentIds = newOrder;
            this.$input.attr('value', JSON.stringify(newOrder));
        },

        // }}}
        // {{{ hasWidget()

        /**
         * Returns whether we have a widget
         *
         * @param  string pkey the widget id
         * @return bool   whether the widget is set up
         */
        hasWidget: function(pkey) {
            return (typeof this.widgets[pkey] != 'undefined');
        },

        // }}}
        // {{{ getWidget()

        /**
         * Returns a widget
         *
         * @param  string pkey the widget id
         * @return object the item, or false if not found
         */
        getWidget: function(pkey) {
            if (typeof this.widgets[pkey] != 'undefined') {
                return this.widgets[pkey];
            }
            return false;
        },

        // }}}
        // {{{ showFeatured()

        /**
         * Shows the featured options
         */
        showFeatured: function() {
            if (!this.opts.show_featured) {
                return;
            }
            if (!this.opts.cache_featured || !this.fetchedFeatured) {
                this.backend.makeCall('featured', {
                    handler: function (items, pass) {
                        pass.mss.showFeatured();
                    },
                    pass: { mss: this }
                });
                return;
            }
            if (!this.opts.cache_featured || !this.builtFeatured) {
                for (var i = 0; i < this.featuredItems.length; i++) {
                    var item = this.featuredItems[i];
                    var $li = $('<li class="multisortselect-chooser-item">' +
                            '<span class="multisortselect-add-icon"></span>' +
                            '<div class="multisortselect-item"></div>' +
                        '</li>');
                    $li.attr('rel', item.id);
                    $li.find('.multisortselect-item').append(this.opts.format(item));
                    if (this.opts.ui) {
                        $li.find('.multisortselect-add-icon')
                            .addClass('ui-icon')
                            .addClass('ui-icon-plus');
                    }
                    $li.click(MultiSortSelect.eventShowFeaturedAdd);
                    this.$featured.append($li);
                }
                this.builtFeatured = true;
            }
            if (this.$featured.is(':visible')) {
                this.$featured.slideUp();
                if (this.opts.ui) {
                    this.$featured_button.button('option', 'icons', { primary: 'ui-icon-circle-triangle-s' });
                }
            } else {
                this.$featured.slideDown();
                if (this.opts.ui) {
                    this.$featured_button.button('option', 'icons', { primary: 'ui-icon-circle-triangle-n' });
                }
            }
            if (this.opts.ui) {
                this.$featured_button.button('refresh');
            }
        },

        // }}}
        // {{{ setFeaturedItems()

        /**
         * Sets the list of featured items
         *
         * @param  Array items the list of featured items
         * @throws if the parameter passed in was not an array
         */
        setFeaturedItems: function(items) {
            if (typeof items != 'object' || !(items instanceof Array)) {
                throw 'cacheFeaturedItems() requires an object list';
            }
            this.featuredItems = new Array();
            for (var i = 0; i < items.length; i++) {
                this.cacheItem(items[i]);
                this.featuredItems.push(items[i]);
            }
            this.fetchedFeatured = true;
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
        },

        // }}}
        // {{{ public_addItem()

        /**
         * Adds an item to the selected list
         *
         * @param object item the item
         */
        public_addItem: function(item) {
            this.insertItem(item, true);
        },

        // }}}
        // {{{ public_addNewItem()

        /**
         * Adds a new item to the selected list that didn't previously exist
         *
         * @param object item the item
         */
        public_addNewItem: function(item) {
            this.insertNewItem(item);
        },

        // }}}
        // {{{ public_removeItem()

        /**
         * Removes an item from the selected list
         *
         * @param mixed iid   the item's id
         * @param int   index the item's index
         */
        public_removeItem: function(iid, index) {
            this.remove(iid, index);
        },

        // }}}
        // {{{ public_cacheItem()

        /**
         * Caches an item (without adding it to the selected list)
         *
         * @param object item the item
         */
        public_cacheItem: function(item) {
            this.cacheItem(item);
        },

        // }}}
        // {{{ public_getCachedItem()

        /**
         * Pulls an item from the cache, by id
         *
         * @param  mixed  iid the item id
         * @return object the item, or false if not found
         */
        public_getCachedItem: function(iid) {
            return this.getCachedItem(iid);
        },

        // }}}
        // {{{ public_buildItem()

        /**
         * Builds an item (without adding it to the selected list)
         *
         * @param mixed entry [optional] some sort of text entry
         */
        public_buildItem: function(entry) {
            return this.buildItemFromEntry(entry);
        },

        // }}}
        // {{{ public_getNode()

        /**
         * Gets the root element for this plugin
         *
         * The root element looks roughly like this:
         *
         * <div class="multisortselect" id="multisortselect_{{internal-id}}">
         *  <ul class="multisortselect-list"></ul>
         *  <input type="hidden" name="called_on_element" />
         *  <div class="multisortselect-entry">{{some sort of entry element}}</div>
         * </div>
         *
         * @return Element the root element
         */
        public_getNode: function() {
            return this.$node;
        },

        // }}}
        // {{{ public_option()

        /**
         * Gets/sets an option
         *
         * @param  mixed name  the option name
         * @param  mixed value [optional] the option value, if we're setting it
         * @return mixed the option value, if we're getting it
         */
        public_option: function(name) {
            if (arguments.length > 1) {
                var value = arguments[1];
                this.opts[name] = value;
            } else {
                return this.opts[name];
            }
        }

        // }}}

    });

    // }}}

    // }}}
    // {{{ MSS_Backend class

    // {{{ Constructor

    /**
     * Initializes a new object
     *
     * @param MultiSortSelect mss   the associated MultiSortSelect object
     * @param mixed           setup the info necessary to set up
     */
    MSS_Backend = function(mss, setup) {
        this.init(mss, setup);
    }

    // }}}
    // {{{ Class-level properties

    MSS_Backend.default_call_opts = {
        accepts: {},
        returns: {},
        ajax: {
            method: 'GET',
            vars: {},
            ret: {}
        },
        from_array: function (arr, backend, params) { return {}; },
        success: function (backend, params, retvals) {}
    };

    // }}}
    // {{{ Prototype

    $.extend(MSS_Backend.prototype, {

        // {{{ Object variables

        mss: null,
        opts: {},
        callTypes: '',

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
            this.opts = $.extend({}, MSS_Backend.default_opts, opts);
            this.callTypes = {};
        },

        // }}}
        // {{{ registerCallType()

        /**
         * Registers a new call type
         *
         * @param string name the call name
         * @param object info the call info
         */
        registerCallType: function(name, info) {
            var call_info = $.extend({}, MSS_Backend.default_call_opts, info);
            this.callTypes[name] = call_info;
        },

        // }}}
        // {{{ callTypeIsRegistered()

        /**
         * Returns whether a call type is registered
         *
         * @param  string name the call name
         * @return bool   whether it's registered
         */
        callTypeIsRegistered: function(name) {
            if (typeof this.callTypes[name] == 'undefined') {
                return false;
            }
            return true;
        },

        // }}}
        // {{{ getCallInfo()

        /**
         * Returns the info for a call type
         *
         * @param  string name the call name
         * @return object the info, or false if not found
         */
        getCallInfo: function(name) {
            if (typeof this.callTypes[name] == 'undefined') {
                return false;
            }
            return this.callTypes[name];
        },

        // }}}
        // {{{ findCaller()

        /**
         * Finds the caller for a call type
         *
         * @param  string call_type the type of call
         * @return mixed  the caller
         * @throws exception if the call cannot be made
         */
        findCaller: function(call_type, primary, secondary, pass) {
            if (typeof this.opts['call_' + call_type] != 'undefined') {
                return this.opts['call_' + call_type];
            } else if (typeof this.opts.call_all != 'undefined') {
                return this.opts.call_all;
            } else {
                throw 'Caller for ' + call_type + ' not found';
            }
        },

        // }}}
        // {{{ getCallerType()

        /**
         * Gets the type of caller
         *
         * @param  mixed  the caller
         * @return string the caller type
         * @throws exception if the caller type is unknown
         */
        getCallerType: function(caller) {
            if (typeof caller == 'string') {
                return 'ajax';
            } else if (typeof caller == 'function') {
                return 'function';
            } else if (typeof caller == 'object' && caller instanceof Array) {
                return 'array';
            } else {
                throw 'Call type unknown';
            }
        },

        // }}}
        // {{{ hasAllItems()

        /**
         * Returns whether the backend has a list of all items
         *
         * @return bool whether the backend is an array
         */
        hasAllItems: function() {
            var caller = this.findCaller('AllItems');
            var caller_type = this.getCallerType(caller);
            return (caller_type == 'array');
        },

        // }}}
        // {{{ getAutocompleteSource()

        /**
         * Returns the proper source for the autocomplete plugin
         *
         * @return mixed the source
         */
        getAutocompleteSource: function() {
            var caller = this.findCaller('Search');
            var caller_type = this.getCallerType(caller);
            if (caller_type == 'ajax' || caller_type == 'array') {
                return caller;
            }
        },

        // }}}
        // {{{ makeCall()

        /**
         * Makes a call
         *
         * @param  string call_type the call type
         * @param  object params    the call parameters
         * @return bool   whether the call was successful
         */
        makeCall: function(call_type, params) {
            if (!this.callTypeIsRegistered(call_type)) {
                return false;
            }
            if (typeof params == 'undefined') {
                params = {};
            }
            var call_info = this.getCallInfo(call_type);

            // Handle preprocessing
            var proceed = true;
            if (typeof call_info.before == 'function') {
                proceed = call_info.before(this, params, call_info);
            }
            if (!proceed) {
                return false;
            }

            // Find the caller
            var caller = this.findCaller(call_type);
            var caller_type = this.getCallerType(caller);

            // Ajax call
            if (caller_type == 'ajax') {

                // Generate pass data
                var pass_data = {};
                for (var k in call_info.ajax.vars) {
                    var vopts = call_info.ajax.vars[k];
                    var v = null;
                    if (typeof vopts.key == 'string') {
                        v = params[vopts.key];
                    } else if (typeof vopts.hardcoded != 'undefined') {
                        v = vopts.hardcoded;
                    }
                    if (vopts.transform == 'json_array') {
                        var arr = new Array;
                        arr.push(v);
                        v = JSON.stringify(arr);
                    }
                    pass_data[k] = v;
                }

                // Ajax call
                $.ajax({
                    'type': call_info.method,
                    'url': caller,
                    'data': pass_data,
                    'dataType': 'json',
                    'context': { 'backend': this, 'call_info': call_info, 'params': params },
                    'success': function (data) {
                        var retvals = {};
                        var rinfo = this.call_info.ajax.ret;
                        for (var k in rinfo) {
                            if (typeof rinfo[k].key == 'undefined') {
                                var v = data;
                            } else {
                                var v = data[rinfo[k].key];
                            }
                            if (rinfo[k].transform == 'first_item' && typeof v == 'object' && v instanceof Array) {
                                v = v[0];
                            }
                            retvals[k] = v;
                        }
                        this.call_info.success(this.backend, this.params, retvals);
                    },
                    'error': this.handleAjaxError
                });

            // Function call
            } else if (caller_type == 'function') {
                var callback = function(retvals, pass_vars) {
                    pass_vars.call_info.success(pass_vars.backend, pass_vars.params, retvals);
                };
                var callback_vars = { 'backend': this, 'call_info': call_info, 'params': params };
                caller(params, call_type, callback, callback_vars, this.mss);

            // Pull from array
            } else if (caller_type == 'array') {
                var retvals = call_info.from_array(caller, this, params);
                call_info.success(this, params, retvals);
            }

            return true;
        },

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
    MSS_Entry_Autocomplete = function(mss, opts) {
        this.init(mss, opts);
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
    MSS_Entry_Select = function(mss, opts) {
        this.init(mss, opts);
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
            var id = $s.val();
            if (id) {
                mss.backend.makeCall('item_by_id', {
                    handler: function (item, pass) {
                        pass.mss.insertItem(item, true);
                    },
                    pass: { mss: mss, update: true }
                });
            }
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
                '<a href="#" class="multisortselect-select_button multisortselect-button">Add</a>' +
                '</div>');
            var $bttn = $entry.find('.multisortselect-select_button');
            $bttn.click(MSS_Entry_Select.eventAddButtonClick);
            if (this.mss.opts.ui) {
                $bttn.button({ icons: { primary: 'ui-icon-plus' } });
            }
            if (this.mss.opts.allow_new) {
                this.addSelectOption(this.mss.buildPlaceholderFromEntry('', this.opts.new_label), $entry.find('select'));
            }
            this.mss.backend.makeCall('all_items', {
                handler: function (items, pass) {
                    for (var i = 0; i < items.length; i++) {
                        pass.entry.addSelectOption(items[i], pass.$select);
                    }
                },
                pass: { entry: this, $select: $entry.find('select') }
            });
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
    MSS_Entry_Text = function(mss, opts) {
        this.init(mss, opts);
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
    // {{{ MSS_Widget_ShowAll class

    // {{{ Constructor

    /**
     * Initializes a new object
     */
    MSS_Widget_ShowAll = function() {
        this.id = MSS_Widget_ShowAll.id;
    };

    // }}}
    // {{{ Class-level properties

    MSS_Widget_ShowAll.id = 'show_all';
    MSS_Widget_ShowAll.default_opts = {
        button_text: 'Show All'
    };

    // }}}
    // {{{ Class-level methods

    // {{{ eventShowAll()

    /**
     * Click event that toggles the show-all box
     *
     * @param Event e the event
     */
    MSS_Widget_ShowAll.eventShowAll = function(e) {
        e.preventDefault();
        var obj = MultiSortSelect.objectFromElem($(this));
        if (obj) {
            obj.getWidget(MSS_Widget_ShowAll.id).toggle();
        }
    };

    // }}}
    // {{{ eventShowAllAdd()

    /**
     * Click event that adds an item from the show-all box
     *
     * @param Event e the event
     */
    MSS_Widget_ShowAll.eventShowAllAdd = function(e) {
        e.preventDefault();
        var obj = MultiSortSelect.objectFromElem($(this));
        if (obj) {
            var iid = $(this).closest('li').attr('rel');
            obj.getWidget(MSS_Widget_ShowAll.id).addItem(iid);
        }
    };

    // }}}

    // }}}
    // {{{ Prototype

    $.extend(MSS_Widget_ShowAll.prototype, {

        // {{{ Object variables

        mss: null,
        fetchedAll: false,
        builtShowAll: false,
        opts: {},
        $showall_button: '',
        $showall: '',

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
            this.opts = $.extend({}, MSS_Widget_ShowAll.default_opts, opts);
            if (typeof this.opts.format == 'undefined') {
                this.opts.format = this.mss.public_option('format');
            }
            if (typeof this.opts.ui == 'undefined') {
                this.opts.ui = this.mss.public_option('ui');
            }

            var $node = this.mss.public_getNode();
            var button = '<a href="#" class="multisortselect-showall_button multisortselect-button">' + this.opts.button_text + '</a>';
            $node.append(button);
            this.$showall_button = $node.find('.multisortselect-showall_button');
            this.$showall_button.click(MSS_Widget_ShowAll.eventShowAll);
            if (this.opts.ui) {
                this.$showall_button.button({ icons: { primary: 'ui-icon-circle-triangle-s' } });
            }
            var showall = '<ul class="multisortselect-showall multisortselect-chooser"></ul>';
            $node.append(showall);
            this.$showall = $node.find('.multisortselect-showall');
            this.$showall.hide();
        },

        // }}}
        // {{{ toggle()

        /**
         * Shows all the available options
         */
        toggle: function() {
            if (!this.fetchedAll) {
                this.mss.backend.makeCall('all_items', {
                    handler: function (items, pass) {
                        pass.widget.fetchedAll = true;
                        pass.widget.toggle();
                    },
                    pass: { widget: this }
                });
                return;
            }
            if (!this.builtShowAll) {
                for (var i = 0; i < this.mss.allItems.length; i++) {
                    var item = this.mss.allItems[i];
                    var $li = $('<li class="multisortselect-chooser-item">' +
                            '<span class="multisortselect-add-icon"></span>' +
                            '<div class="multisortselect-item"></div>' +
                        '</li>');
                    $li.attr('rel', item.id);
                    $li.find('.multisortselect-item').append(this.opts.format(item));
                    if (this.opts.ui) {
                        $li.find('.multisortselect-add-icon')
                            .addClass('ui-icon')
                            .addClass('ui-icon-plus');
                    }
                    $li.click(MSS_Widget_ShowAll.eventShowAllAdd);
                    this.$showall.append($li);
                }
                this.builtShowAll = true;
            }
            if (this.$showall.is(':visible')) {
                this.$showall.slideUp();
                if (this.opts.ui) {
                    this.$showall_button.button('option', 'icons', { primary: 'ui-icon-circle-triangle-s' });
                }
            } else {
                this.$showall.slideDown();
                if (this.opts.ui) {
                    this.$showall_button.button('option', 'icons', { primary: 'ui-icon-circle-triangle-n' });
                }
            }
            if (this.opts.ui) {
                this.$showall_button.button('refresh');
            }
        },

        // }}}
        // {{{ addItem()

        /**
         * Adds an item to the selected list
         *
         * @param mixed iid the item id
         */
        addItem: function(iid) {
            this.mss.insertItemById(iid, true);
        }

        // }}}

    });

    // }}}

    // }}}
    // {{{ Register built-in widgets

    MultiSortSelect.registerWidget(new MSS_Widget_ShowAll);

    // }}}
    // {{{ Add to jQuery

    /**
     * Adds the plugin to jquery
     *
     * Filters out any non-text-input elements.
     *
     * @param  mixed opts if object, any custom options for invocation; if
     *                    string, a public function
     * @param  mixed arg  an argument for the public function indicated
     * @return Array the return values of the public function, one per matching
     *               element
     */
    $.fn.multisortselect = function(opts, arg) {
        var $elems = this.filter('input[type=text]')
        if (typeof(opts) == 'object') {
            var retval = $elems;
        } else {
            var retval = new Array();
        }

        $elems.each(function () {
            if (typeof(opts) == 'object') {
                var newobj = new MultiSortSelect($(this), opts);
                return;
            }
            if (typeof(opts) == 'string') {
                var mss = MultiSortSelect.objectFromElem($(this));
                if (opts == 'addItem') {
                    retval.push(mss.public_addItem(arg));
                } else if (opts == 'cacheItem') {
                    retval.push(mss.public_cacheItem(arg));
                } else if (opts == 'removeItem') {
                    retval.push(mss.public_removeItem(arg));
                } else if (opts == 'getNode') {
                    retval.push(mss.public_getNode());
                }
            }
        });

        return retval;
    };

    // }}}

})(jQuery);

