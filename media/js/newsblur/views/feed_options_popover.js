NEWSBLUR.FeedOptionsPopover = NEWSBLUR.ReaderPopover.extend({
    
    className: "NB-filter-popover",
    
    options: {
        'width': 236,
        'anchor': '.NB-feedbar-options',
        'placement': 'top',
        offset: {
            top: 6,
            left: 1
        }
    },
    
    events: {
        "click .NB-view-setting-option": "change_view_setting"
    },
    
    initialize: function(options) {
        this.options = _.extend({}, this.options, options);
        this.model = NEWSBLUR.assets;
        this.make_modal();
        
        NEWSBLUR.ReaderPopover.prototype.initialize.apply(this);
        
        this.show_correct_feed_view_options_in_menu();
    },

    make_modal: function() {
        var self = this;
        
        this.$el.html($.make('div', [
            $.make('ul', { className: 'segmented-control NB-menu-manage-view-setting-readfilter' }, [
                $.make('li', { className: 'NB-view-setting-option NB-view-setting-readfilter-all  NB-active' }, 'All stories'),
                $.make('li', { className: 'NB-view-setting-option NB-view-setting-readfilter-unread' }, 'Unread only')
            ]),
            $.make('ul', { className: 'segmented-control NB-menu-manage-view-setting-order' }, [
                $.make('li', { className: 'NB-view-setting-option NB-view-setting-order-newest NB-active' }, 'Newest first'),
                $.make('li', { className: 'NB-view-setting-option NB-view-setting-order-oldest' }, 'Oldest')
            ])
        ]));
        
        return this;
    },
    
    show_correct_feed_view_options_in_menu: function() {
        var order = NEWSBLUR.assets.view_setting(this.options.feed_id, 'order');
        var read_filter = NEWSBLUR.assets.view_setting(this.options.feed_id, 'read_filter');
        var $oldest = this.$('.NB-view-setting-order-oldest');
        var $newest = this.$('.NB-view-setting-order-newest');
        var $unread = this.$('.NB-view-setting-readfilter-unread');
        var $all = this.$('.NB-view-setting-readfilter-all');

        $oldest.toggleClass('NB-active', order == 'oldest');
        $newest.toggleClass('NB-active', order != 'oldest');
        $oldest.text('Oldest' + (order == 'oldest' ? ' first' : ''));
        $newest.text('Newest' + (order != 'oldest' ? ' first' : ''));
        $unread.toggleClass('NB-active', read_filter == 'unread');
        $all.toggleClass('NB-active', read_filter != 'unread');
    },

    
    // ==========
    // = Events =
    // ==========
    
    change_view_setting: function(e) {
        var $target = $(e.target);
        
        if ($target.hasClass("NB-view-setting-order-newest")) {
            this.update_feed({order: 'newest'});
        } else if ($target.hasClass("NB-view-setting-order-oldest")) {
            this.update_feed({order: 'oldest'});
        } else if ($target.hasClass("NB-view-setting-readfilter-all")) {
            this.update_feed({read_filter: 'all'});
        } else if ($target.hasClass("NB-view-setting-readfilter-unread")) {
            this.update_feed({read_filter: 'unread'});
        }
        
        this.close();
    },
    
    update_feed: function(setting) {
        var changed = NEWSBLUR.assets.view_setting(this.options.feed_id, setting);
        
        if (!changed) return;
        
        if (this.options.feed_id == NEWSBLUR.reader.active_feed &&
            NEWSBLUR.reader.flags.social_view) {
            NEWSBLUR.reader.open_social_stories(this.options.feed_id);
        } else if (this.options.feed_id == NEWSBLUR.reader.active_feed &&
                   NEWSBLUR.reader.flags.river_view) {
            var folder = NEWSBLUR.reader.active_folder;
            $feed = folder.folder_view.$el;
            NEWSBLUR.reader.open_river_stories($feed, folder);
        } else if (this.options.feed_id == NEWSBLUR.reader.active_feed) {
            NEWSBLUR.reader.open_feed(this.options.feed_id);
        }
    }

    
});