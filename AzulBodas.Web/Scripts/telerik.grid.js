(function ($) {
    var keys = {            
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,            
            SPACEBAR: 32,
            PAGEUP: 33,
            PAGEDOWN: 34,
            F12: 123
        };
    var $t = $.telerik;
    var rdate = /"+\\\/Date\((.*?)\)\\\/"+/g;
    var ROWSELECTOR = "tr:not(.t-grouping-row,.t-group-footer,.t-detail-row,.t-no-data,.t-footer-template):visible",
        CELLSELECTOR = ">td:not(.t-group-cell,.t-hierarchy-cell)",
        FIRST_CELL_SELECTOR = ROWSELECTOR + CELLSELECTOR + ":first"
        FOCUSED = "t-state-focused";

    $t.scripts.push("telerik.grid.js");

    function template(value) {
        return new Function('data', ("var p=[];" +
            "with(data){p.push('" + unescape(value).replace(/[\r\t\n]/g, " ")
                .replace(/'(?=[^#]*#>)/g, "\t")
                .split("'").join("\\'")
                .split("\t").join("'")
                .replace(/<#=(.+?)#>/g, "',$1,'")
                .split("<#").join("');")
                .split("#>").join("p.push('")
                + "');}return p.join('');"));
    }

    function encode(value) {
        return (value != null ? value + '' : '').replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    }    

    

    $t.grid = function (element, options) {
        this.element = element;
        this.groups = [];
        this.editing = {};
        this.filterBy = '';
        this.groupBy = '';
        this.orderBy = '';

        $.extend(this, options);

        this.sorted = $.grep(this.columns, function (column) { return column.order; });

        this.$tbody = $('> .t-grid-content > table > tbody', element);
        this.scrollable = this.$tbody.length > 0;

        if (!this.scrollable) {
            this.$tbody = $('> table > tbody', element);
            this.$header = $('> table > thead tr', element);
            this.$footer = $('> table > tfoot', element);
        } else {
            
            $('> .t-grid-content', element).tScrollable();

            this.$header = $('> .t-grid-header tr', element);
            this.$footer = $('> .t-grid-footer', element);
        }

        this.$headerWrap = $('> .t-grid-header > .t-grid-header-wrap', element);
        this.$footerWrap = $('> .t-grid-footer > .t-grid-footer-wrap', element);

        var scrollables = this.$headerWrap.add(this.$footerWrap);
        
        var grid = this;        
        $('> .t-grid-content', element).bind('scroll', function () {
            if(grid.pageOnScroll) {
                var pos = this.scrollTop + this.clientHeight;                
                if(pos === this.scrollHeight && grid.currentPage < grid.totalPages()) {
                    grid.pageTo(grid.currentPage + 1);    
                }
            }
            scrollables.scrollLeft(this.scrollLeft);
        });

        if (this.rowTemplate) {
            this.rowTemplate = template(this.rowTemplate);
        }

        this.$tbody.delegate('.t-hierarchy-cell .t-plus, .t-hierarchy-cell .t-minus', 'click', $t.stopAll(function (e) {
            var $icon = $(e.target);
            var expanding = $icon.hasClass('t-plus');

            $icon.toggleClass('t-minus', expanding)
                .toggleClass('t-plus', !expanding);
            var $tr = $icon.closest('tr.t-master-row');
            if (this.detail && !$tr.next().hasClass('t-detail-row')) {
                var colSpan = 0;
                $.each(this.columns, function(){ if(!this.hidden){ colSpan++; } });                

                $(new $t.stringBuilder()
                        .cat('<tr class="t-detail-row">')
                        .rep('<td class="t-group-cell"></td>', $tr.find('.t-group-cell').length)
                        .cat('<td class="t-hierarchy-cell"></td>')
                        .cat('<td class="t-detail-cell" colspan="')
                        .cat(colSpan)
                        .cat('">')
                        .cat(this.displayDetails(this.dataItem($tr)))
                        .cat('</td></tr>').string()).insertAfter($tr);
            }
            $t.trigger(this.element, expanding ? 'detailViewExpand' : 'detailViewCollapse', { masterRow: $tr[0], detailRow: $tr.next('.t-detail-row')[0] });
            $tr.next().toggle(expanding);
        }, this));

        this.$pager = $('> .t-grid-pager .t-pager', element);

        var dropDown = new $t.dropDown({ 
            effects: $t.fx.slide.defaults(),
            onClick: $.proxy(function (e) {                                             
                this.changePageSize($(e.item).text());                                
                dropDown.close();   
            },this)
        });

        dropDown.dataBind(options.pageSizesInDropDown || []);
        
        $(document.documentElement).bind('mousedown', function (e) {
            var element = dropDown.$element[0];

            if (!$.contains(element, e.target)) {
                dropDown.close();
            }
        });

        this.$pager.delegate('.t-state-disabled', 'click', $t.preventDefault)
                   .delegate('.t-link:not(.t-state-disabled)', 'mouseenter', $t.hover)
                   .delegate('.t-link:not(.t-state-disabled)', 'mouseleave', $t.leave)
                   .delegate('input[type=text]', 'keydown', $.proxy(this.pagerKeyDown, this))
                   .delegate('.t-page-size .t-dropdown-wrap', 'click', function(){
                        var a = $(this);
                        dropDown.open({
                            offset: a.offset(),
                            outerHeight: a.outerHeight(),
                            outerWidth: a.outerWidth(),
                            zIndex: $t.getElementZIndex(this)
                        });
                    });

        $('> .t-grid-pager', element).delegate('.t-refresh', 'click', $.proxy(this.refreshClick, this));

        $(element).delegate('.t-button', 'hover', $t.preventDefault);

        if (this.sort)
            this.$header.delegate('a.t-link', 'hover', function () {
                $(this).toggleClass('t-state-hover');
            });

        var nonSelectableRows = 'tr:not(.t-grouping-row,.t-detail-row,.t-no-data,:has(>.t-edit-container))';
        
        if (this.selectable) {
            var tbody = this.$tbody[0];
            this.$tbody.delegate(nonSelectableRows, 'click', function (e) {
                if (this.parentNode == tbody)
                    grid.rowClick(e);
            })
            .delegate(nonSelectableRows, 'hover', function (e) {                
                if (this.parentNode == tbody) {                 
                    if(e.type == "mouseenter") {
                        $(this).addClass('t-state-hover');
                    } else {
                        $(this).removeClass('t-state-hover');
                    }
                }
            });
        }
        if (this.isAjax() || this.operationMode === "client") {
            this.$pager.delegate('.t-link:not(.t-state-disabled)', 'click', $t.stop(this.pagerClick, this));
            if (this.sort)
                this.$header.delegate('a.t-link', 'click', $t.stop(this.headerClick, this));
        }
        
        for (var i = 0; i < this.plugins.length; i++)
            $t[this.plugins[i]].initialize(this);

        $t.bind(this, {
            columnResize: this.onColumnResize,
            columnReorder: this.onColumnReorder,
            'delete': this.onDelete,
            detailViewExpand: this.onDetailViewExpand,
            detailViewCollapse: this.onDetailViewCollapse,
            dataBinding: this.onDataBinding,
            dataBound: this.onDataBound,
            edit: this.onEdit,
            error: this.onError,
            load: this.onLoad,
            rowSelect: this.onRowSelect,
            rowDataBound: this.onRowDataBound,
            save: this.onSave,
            submitChanges: this.onSubmitChanges
        });

        this.initializeColumns(); 
                
        if(this.keyboardNavigation) {
            this.initializeNavigation();
        }

        if(this.isAjax() || this.operationMode === "client") {
            this._dataSource();
        }        
    }    

    $t.grid.prototype = {
        initializeNavigation: function() {
            var that = this,
                element = $(that.element).attr("tabIndex", 0),
                KEYDOWN = "keydown",
                keyDownProxy = $.proxy(that._keyDown, that);                
            
            that._initNavigationMouseEvents();    
            element.bind({
                focus: function(e) {
                    var current = that.current();
                    if(current) {
                        current.addClass(FOCUSED);
                    } else if(current = that.$tbody.find("td." + FOCUSED).eq(0), current.length) {
                        that._current = current;
                    } else {
                        that.current(element.find(FIRST_CELL_SELECTOR));
                    }
                },
                focusout: function() {
                    if (that._current) {
                        that._current.removeClass(FOCUSED);
                    }
                },
                keydown: keyDownProxy
            });
                       
            if(that.editing && that.editing.mode == "PopUp") {
                element.bind("edit", function(e) {
                    $(e.form).bind(KEYDOWN, keyDownProxy);
                });
                
                $("#" + that.formId()+":visible").bind(KEYDOWN, keyDownProxy);
            }

            if(that.pageOnScroll) {
                element.bind("dataBinding", function() {
                    var current = that.current(),
                        rowIndex = current ? current.parent().index(ROWSELECTOR) - 1 : 0,
                        cellIndex = current ? current.index() : 0;
                    
                    element.one("dataBound", function () {                          
                        var rows = that.$tbody.find(ROWSELECTOR);
                        that._focusGridElement();                        
                        if(that._current) {
                            that._current.removeClass(FOCUSED);
                        }
                        that._current = rows.eq(rowIndex).children().eq(cellIndex).addClass(FOCUSED);
                    });
                });
            }
        },
        _keyDown: function(e) {
            var that = this,
                element = $(that.element),
                tbody = that.$tbody,
                isRtl = element.closest('.t-rtl').length,
                key = e.keyCode,
                DATABOUND = "dataBound",
                currentProxy = $.proxy(that.current, that),
                current = currentProxy(),
                pageable = that.$pager.length > 0,
                clientSelect = that.selectable, 
                serverSelect = tbody.has("tr>td>.t-grid-select").length > 0,
                target = $(e.target),
                canHandle = !target.is(':button,a,:input,a>.t-icon'),
                editable = that.editRow,
                handled = false,
                cellIndex;
            
            if(!current) {
                if(that.editing && that.editing.mode == "PopUp") {
                    current = that._current = element.find(FIRST_CELL_SELECTOR);                    
                } else {
                    return;
                }
            }            
            cellIndex = current.index();
            if(!$.browser.msie) {
                canHandle = canHandle && target[0] === element[0];
            }

            if(canHandle) {
                if(pageable && keys.PAGEUP == key) {
                    if(!that.pageOnScroll) {
                        element.one(DATABOUND, function () {
                            currentProxy(element.find(FIRST_CELL_SELECTOR));
                            that._focusGridElement();
                        });
                    }
                    if(that.currentPage < that.totalPages()) {
                        that.pageTo(that.currentPage + 1);
                    }
                    handled = true;
                } else if(pageable && keys.PAGEDOWN == key) { 
                    if(!that.pageOnScroll) {
                        element.one(DATABOUND, function () {
                            currentProxy(element.find(FIRST_CELL_SELECTOR));
                            that._focusGridElement();
                        });
                        that.pageTo(Math.max(that.currentPage - 1, 1));
                    }
                    handled = true;
                } else if(keys.UP === key) {                    
                    currentProxy(current ? current.parent().prevAll(ROWSELECTOR).last().children(":eq(" + cellIndex + "),:eq(0)").last() : element.find(FIRST_CELL_SELECTOR));
                    handled = true;
                } else if(keys.DOWN === key) {
                    currentProxy(current ? current.parent().nextAll(ROWSELECTOR).first().children(":eq(" + cellIndex + "),:eq(0)").last() : element.find(FIRST_CELL_SELECTOR));
                    handled = true;                    
                } else if (keys.LEFT === key) {
                    if(current) {
                        if(isRtl) {
                            current = current.next();
                        } else {
                            current = current.prev(":not(.t-group-cell, .t-hierarchy-cell)");
                        }
                    } else {
                        current = element.find(FIRST_CELL_SELECTOR);
                    }                    
                    currentProxy(current);
                    handled = true;
                } else if (keys.RIGHT === key) {
                    if(current) {
                        if(isRtl) {
                            current = current.prev(":not(.t-group-cell, .t-hierarchy-cell)");
                        } else {
                            current = current.next();
                        }
                    } else {
                        current = element.find(FIRST_CELL_SELECTOR);
                    }
                    currentProxy(current);
                    handled = true;
                } else if((clientSelect || serverSelect) && keys.SPACEBAR == key) {
                    handled = true;
                    var elements = current.parent().find(".t-grid-select:first").andSelf();
                    if(serverSelect && elements[1]) {
                        location.href = elements[1].href;
                    } else if(clientSelect) {
                        elements.click();
                    }
                }
            }
            
            if(!handled && editable && !target.is(":button,a,a>.t-icon")) {
                handled = that._handleEditing(e);
            }
            
            if(handled) {
                e.preventDefault();
                e.stopPropagation();
            }            
        },
        _handleEditing: function(e) {
            var that = this,
                key = e.keyCode,
                currentProxy = $.proxy(that.current, that),
                clearInputSelection = $.proxy(that._clearInputSelection, that),
                focusGridElement = $.proxy(that._focusGridElement, that),
                current = currentProxy(),                
                element = $(that.element),
                tbody = that.$tbody,
                row = current.parent(),
                rowIndex = row.index(),
                valid,
                handled = false,
                editCellSelector = "td.t-grid-edit-cell",
                firstInputSelector = ":input:visible:first",
                isAjax = that.isAjax(),                
                isInsert = row.closest("tr.t-grid-new-row")[0],
                isInCell = that.editing.mode === "InCell",
                isPopup = that.editing.mode === "PopUp",
                isEdited = row.closest("tr.t-grid-edit-row")[0] || (isPopup && $("#" + that.formId()+":visible").length);
            
            if(keys.ENTER == key || keys.F12 == key) {
                handled = true;                
                if(isEdited) {                    
                    clearInputSelection(current.find(firstInputSelector)[0]);
                    if(isInCell) {
                        valid = that.validate();                        
                        if(!valid) { 
                            current.find(firstInputSelector).focus();
                            return;
                        }
                        if(current.is(editCellSelector)) {
                            that.saveCell(current[0]);
                        } else {                                                                                
                            row.find(editCellSelector)
                                .each(function() {
                                    that.saveCell(this);
                                });
                            that.editCell(current[0]);
                        }
                        if(that.valid) {
                            focusGridElement();                                       
                        } 
                    } else if(isAjax) {                        
                        element.one("dataBound", function () {
                            var grid = $(this).data("tGrid");
                            grid._current = grid.$tbody.children().eq(rowIndex).find(CELLSELECTOR).eq(0);
                            focusGridElement();
                        });
                        if(isPopup) {                            
                            $(".t-grid-update,.t-grid-insert","#" + that.formId()).click();
                        } else {
                            if(isInsert) {
                                that.insertRow(row);
                            } else {
                                that.updateRow(row);
                            }
                        }
                    } else {
                        if(that.validate()) {
                            if(isPopup) {
                                row = $("#" + that.formId());
                            }
                            row.find(".t-grid-update,.t-grid-insert").click();
                        }
                    }
                } else {                    
                    if(isInCell) {
                        tbody.find(editCellSelector)
                            .each(function() {
                                that.saveCell(this);
                            });
                        that.editCell(current[0]);
                    } else if(isAjax) {
                        that.editRow(row);
                        currentProxy(row.children().eq(0));
                        if(isPopup) {
                            row = $("#" + that.formId());
                        }
                        row.find(firstInputSelector).focus();                                                
                    } else {
                        location.href = row.find(".t-grid-edit:first").attr("href");
                    }
                }
            } else if (keys.ESC == key && isEdited) {
                handled = true;                
                clearInputSelection(current.find(firstInputSelector)[0]);
                if(isInCell && current.is(editCellSelector)) {
                    that.cancelCell(current);
                    focusGridElement();
                } else if(isAjax) {   
                    if(isPopup) {
                        $(".t-grid-cancel","#" + this.formId()).click();
                    } else {                 
                        that.cancelRow(row);
                    }
                    currentProxy(row.find(CELLSELECTOR).eq(0));
                    focusGridElement();
                } else {                    
                    if(isPopup) {
                        row = $("#" + that.formId());
                    }                    
                    location.href = row.find(".t-grid-cancel:first").attr("href");
                }
            } else if(isEdited && isInCell && keys.TAB == key) {
                handled = true;
                clearInputSelection(current.find(firstInputSelector)[0]);
                that.saveCell(current);
                if(that.valid) {                    
                    focusGridElement();
                    currentProxy(e.shiftKey ? current.prev() : current.next());
                }
            }

            return handled;
        },
        _initNavigationMouseEvents: function() {
            var that = this,
                tbody = that.$tbody,
                selector = ROWSELECTOR + CELLSELECTOR,
                browser = $.browser,
                CLICK = "click",
                DOWN = "mousedown",
                current,
                target,
                currentTarget,
                editRowClass = ".t-grid-edit-row",
                escapedSelector = ":button,a,:input,a>.t-icon";
            
            if(browser.msie) {
                tbody.delegate(selector, CLICK, function(e) { 
                    target = $(e.target),
                    currentTarget = $(e.currentTarget),
                    current = that._current;
                    
                    if(currentTarget.closest("tbody")[0] !== tbody[0]) {
                        return;
                    }
                    if (target.is(escapedSelector)) {
                        if(!(current && !currentTarget.parent().is(editRowClass))) {
                            if(current) {
                                current.removeClass(FOCUSED);
                            }
                            that._current = currentTarget;                            
                        }                                                
                    } else {                        
                        if(current && current[0] === currentTarget[0]) {
                            that._current = null;
                        }
                        that.current(currentTarget);
                        e.preventDefault();
                    }
                });
            } else {                
                tbody.delegate(selector, DOWN, function(e) {
                    target = $(e.target),
                    currentTarget = $(e.currentTarget),
                    current = that._current;

                    if(currentTarget.closest("tbody")[0] !== tbody[0]) {
                        return;
                    }
                    if (target.is(escapedSelector)) {                        
                        if(!(current && !currentTarget.parent().is(editRowClass))) {
                            if(current) {
                                current.removeClass(FOCUSED);
                            }
                            that._current = currentTarget;
                        }
                    } else {
                        that.current(currentTarget);
                    }                    
                });
            }
        },
        _clearInputSelection: function(input) {
            if(!input) {
                return;
            }
            var browser = $.browser,
                range;
            if(browser.msie && parseInt(browser.version) == 8) {
                range = input.createTextRange();
                range.moveStart('textedit', 1);
                range.select();
            }
        },
        _focusGridElement: function() {
            var browser = $.browser;
            if(browser.msie && parseInt(browser.version) < 9) {
                $("body", document).focus();
            }
            this.element.focus();
        },
        current: function(element) {
            var that = this,
                current = that._current;                
            if(element !== undefined && element.length) {
                if (!current || current[0] !== element[0]) {
                    element.addClass(FOCUSED);                    
                    if (current) {
                        current.removeClass(FOCUSED);
                    }
                    that._current = element;
                    that._scrollTo(element.parent()[0]);
                }
            } else {
                return that._current;
            }
        },
        _scrollTo: function(element) {            
            var container = this.$tbody.closest("div.t-grid-content")[0];
            if(!element || !container) {
                return;
            }
            
            var elementOffsetTop = element.offsetTop,
                elementOffsetHeight = element.offsetHeight,                
                containerScrollTop = container.scrollTop,
                containerOffsetHeight = container.clientHeight,
                bottomDistance = elementOffsetTop + elementOffsetHeight;
                        
            container.scrollTop = containerScrollTop > elementOffsetTop
                                    ? elementOffsetTop
                                    : bottomDistance > (containerScrollTop + containerOffsetHeight)
                                    ? bottomDistance - containerOffsetHeight
                                    : containerScrollTop;        
        },
        _transformParams: function(data) {
            var that = this, 
                remoteOperations = that._isServerOperation();
                params = {},
                filter = $.isFunction(that.filterExpr) ?  that.filterExpr() : "";

            if (remoteOperations) {
                if(data["page"]) {
                    params[that.queryString.page] = data["page"];
                }

                if(data["pageSize"]) {
                    params[that.queryString.size] = data["pageSize"];                    
                }

                if(data["sort"] && data["sort"].length) {
                    params[that.queryString.orderBy] = $.map(data["sort"], function (s) { return s.field + '-' + s.dir; }).join('~');                                        
                }                                    

                if(filter !== "") {
                    params[that.queryString.filter] = filter;                                        
                }
                                    
                if(that.groupBy) {
                    params[that.queryString.groupBy] = that.groupBy;                                        
                }                   
                                                     
                if(data["aggregates"] && data["aggregates"].length) {
                    params["aggregates"] = $.map(that.columns, function(c) {
                        if (c.aggregates) {
                            return c.member + '-' + c.aggregates.join('-');
                        }
                    }).join('~')                                        
                }                
            }
            delete data["page"];
            delete data["pageSize"];
            delete data["sort"];
            delete data["filter"];
            delete data["group"];
            delete data["aggregates"];

            params = $.extend(params, data);

            if (that.ws) {
                params =  $t.toJson({ state: params });
            }

            return params;
        },
        _dataSourceOptions: function() {
            var that = this, 
                paging = this.pageSize > 0,
                options,
                data = that.data || [];
                remoteOperations = that._isServerOperation(),
                deserializer = {
                    translateGroup: function(group) {                        
                        return { 
                            value: group.Key,
                            hasSubgroups: group.HasSubgroups,
                            aggregates: group.Aggregates,
                            items: group.HasSubgroups ? $.map(group.Items, $.proxy(this.translateGroup, this)) : group.Items
                        };
                    },
                    flatGroups: function(group) {
                        if(group.HasSubgroups) {
                            return this.flatGroups(group.Items);
                        }
                        return group.Items;
                    },
                    convert: function (data) {                        
                        return data.d || data;
                    },
                    mergeChanges: function(data, updated, deleted) {
                        var id,
                            idx,
                            length,
                            inserted = [],
                            found,
                            dataSource = that.dataSource;

                        $.each(deleted, function(index, id) {
                            for(idx = 0, length = data.length; idx < length; idx++){
                                if(id === dataSource.id(data[idx])) {
                                    data.splice(idx, 1);
                                    break;
                                }
                            }                                
                        });

                        $.each(updated, function(index, item) {
                            id = dataSource.id(this);
                            found = false;
                            for(idx = 0, length = data.length; idx < length; idx++) {
                                if(id === dataSource.id(data[idx])) {
                                    $.extend(true, data[idx], item); 
                                    found = true;                                       
                                    break;
                                }
                            }
                            if(!found) {
                                inserted.push(item);
                            }
                        });                            
                        return data.concat(inserted);
                    },
                    data: function(data) {
                        var dataSource = that.dataSource,
                            currentData = dataSource.data(),
                            pageIndex = dataSource.page() - 1,
                            pageSize = dataSource.pageSize(),
                            deleted = that.deletedIds || [];                

                        that.deletedIds = [];
                        if(data) {
                            data = this.convert(data);                         
                            data = !$.isArray(data) ? data.data || data.Data : data;

                            if (currentData && currentData.length && !remoteOperations && dataSource.id) {
                                if(data.length && typeof data[0].HasSubgroups != 'undefined' && !remoteOperations) {                                
                                    data = $.map(data, $.proxy(this.flatGroups, this));
                                }
                                return this.mergeChanges(currentData, data, deleted);
                            }
                        }
                        return data;
                    },
                    total: function(data) {
                        if(data) {
                            data = this.convert(data);  
                            return !$.isArray(data) ? data.total || data.Total : data.length;
                        }
                        return 0;
                    },
                    groups: function(data) {
                        data = this.data(data);
                        return $.map(data, $.proxy(this.translateGroup, this));
                    },
                    aggregates: function(data) {
                        data = this.convert(data);
                        return data.aggregates || {};
                    }
                };

            options = {
                serverSorting: remoteOperations,
                serverPaging: remoteOperations,
                serverFiltering: remoteOperations,
                serverGrouping: remoteOperations,
                serverAggregates: remoteOperations,
                page: paging ? that.currentPage : undefined,
                pageSize: paging ? that.pageSize : undefined,
                aggregates: that.aggregates,
                change: $.proxy(that._dataChange, that)
            };

            if (remoteOperations || (that.isAjax() && !data.length)) {
                $.extend(options, {
                    transport: {
                        dialect: {
                            read: $.proxy(that._transformParams, this)
                        },
                        read: {
                            type: "POST",
                            //url: that.url("selectUrl"),
                            dataType: 'text', // using 'text' instead of 'json' because of DateTime serialization
                            dataFilter: function (data, dataType) {
                                // convert "\/Date(...)\/" to "new Date(...)"
                                try {
                                    return eval('(' + data.replace(rdate, 'new Date($1)') + ')');
                                } catch (e) {
                                    // in case the result is not JSON raise the 'error' event
                                    if (!$t.ajaxError(that.element, 'error', {}, 'parseeror'))
                                        alert('Error! The requested URL did not return JSON.');
                                }
                            },
                            contentType: that.ws ? "application/json; charset=utf-8" : undefined,
                            complete: $.proxy(that.hideBusy, that)                   
                        }
                    },                   
                    deserializer: deserializer
                });
            } else if (data.length){
                $.extend(options, {
                    data: {
                        data: that.data,
                        total: that.total
                    },
                    deserializer: deserializer
                });
            }
            return options;
        },
        _dataSource: function() {
            var that = this;
            that.dataSource = new $t.DataSource(that._dataSourceOptions());
        },
        _mapAggregates: function(aggregates) {
            var result = {};
            for(var member in aggregates) {
                result[member.replace(/^\w/, function($0) { return $0.toUpperCase(); })] = aggregates[member];
            }
            return result;
        },
        rowClick: function (e) {
            var $target = $(e.target);
            if (!$target.is(':button,a,:input,a>.t-icon')) {
                e.stopPropagation();
                var $row = $target.closest('tr')
                                  .addClass('t-state-selected')
                                  .siblings()
                                  .removeClass('t-state-selected')
                                  .end();
                $t.trigger(this.element, 'rowSelect', { row: $row[0] });
            }
        },

        $rows: function () {
            return this.$tbody.find('> tr:not(.t-grouping-row,.t-detail-row)');
        },

        expandRow: function (tr) {
            $(tr).find('> td .t-plus, > td .t-expand').click();
        },

        collapseRow: function (tr) {
            $(tr).find('> td .t-minus, > td .t-collapse').click();
        },

        headerClick: function (e) {
            e.preventDefault();
            this.toggleOrder(this.$columns().index($(e.target).closest('th')));
            this.sort(this.sortExpr());
        },

        refreshClick: function (e, element) {
            if ($(element).is('.t-loading'))
                return;

            if (this.isAjax()) {
                e.preventDefault();
                if(!this._isServerOperation()) {
                    this.dataSource.read();
                } else {
                    this.ajaxRequest(true);
                }
            }
        },

        sort: function (orderBy) {
            this.orderBy = orderBy;
            this.ajaxRequest();
        },
        
        columnFromTitle: function (title) {
            title = $.trim(title);
            
            var result = $.grep(this.$columns(), function(th) {
                return $.trim($(th).text()) == title;
            })[0];

            if (result)
                return this.columns[this.$columns().index(result)];

            return $.grep(this.columns, function (c) { return c.title == title; })[0];
        },

        columnFromMember: function (member) {
            var column = $.grep(this.columns, function (c) { return c.member == member })[0];

            if (!column)
                column = $.grep(this.columns, function (c) {
                    var suffix = "." + c.member;
                    return member.substr(member.length - suffix.length) == suffix
                })[0];

            return column;
        },

        toggleOrder: function (column) {
            column = typeof column == 'number' ? this.columns[column] : column;

            var order = 'asc';

            if (column.order == 'asc')
                order = 'desc';
            else if (column.order == 'desc')
                order = null;

            column.order = order;

            var sortedIndex = $.inArray(column, this.sorted);

            if (this.sortMode == 'single' && sortedIndex < 0) {
                $.each(this.sorted, function () {
                    this.order = null;
                });
                this.sorted = [];
            }
            if (sortedIndex < 0 && order)
                this.sorted.push(column);

            if (!order)
                this.sorted.splice(sortedIndex, 1);
        },

        sortExpr: function () {
            return $.map(this.sorted, function (s) { return s.member + '-' + s.order; }).join('~');
        },

        pagerKeyDown: function (e) {
            if (e.keyCode == 13) {
                var page = this.sanitizePage($(e.target).val());
                if (page != this.currentPage)
                    this.pageTo(page);
                else
                    $(e.target).val(page);
            }
        },

        isAjax: function () {
            return this.ajax || this.ws || this.onDataBinding;
        },

        url: function (which) {
            return (this.ajax || this.ws)[which];
        },

        pagerClick: function (e) {
            e.preventDefault();
            var $element = $(e.target).closest('.t-link');

            var page = this.currentPage;
            var pagerButton = $element.find('.t-icon');

            if (pagerButton.hasClass('t-arrow-next'))
                page++;
            else if (pagerButton.hasClass('t-arrow-last'))
                page = this.totalPages();
            else if (pagerButton.hasClass('t-arrow-prev'))
                page--;
            else if (pagerButton.hasClass('t-arrow-first'))
                page = 1;
            else {
                var linkText = $element.text();

                if (linkText == '...') {
                    var elementIndex = $element.parent().children().index($element);

                    if (elementIndex == 0)
                        page = parseInt($element.next().text()) - 1;
                    else
                        page = parseInt($element.prev().text()) + 1;
                } else {
                    page = parseInt(linkText);
                }
            }

            this.pageTo(isFinite(page) ? page : this.currentPage);
        },

        changePageSize: function (size) {            
            var result = parseInt(size, 10);
            if (isNaN(result) || result < 1) {
                return this.pageSize;
            }
        
            result = Math.max(result, 1);
            this.currentPage = 1;
            this.pageSize = result;

            if (this.isAjax()) {
                this.ajaxRequest();
            } else {
                this.serverRequest();            
            }
        },

        pageTo: function (page) {
            this._pagingInProgress = true;
            this.currentPage = page;
            if (this.isAjax())
                this.ajaxRequest();
            else
                this.serverRequest();
        },
        _dataChange: function() {
            var dataSource = this.dataSource;

            this.total = dataSource.total();

            this.aggregates = dataSource.aggregates();
            var data = dataSource.view();      
                  
            if(this.pageOnScroll && this._pagingInProgress === true) {
                data = (this.data || []).concat(data);
                this._pagingInProgress = false;
            }

            this._current = null;

            this._populate(data);           
        },
        _populate: function(data) {
            this.data = [];
            this.bindTo(data);

            this.bindFooter();
            
            this.updatePager();
            this.updateSorting();
            $t.trigger(this.element, 'dataBound');
            $t.trigger(this.element, 'repaint'); 
        },
        ajaxOptions: function (options) {                        
            var result = {
                type: 'POST',
                dataType: 'text', // using 'text' instead of 'json' because of DateTime serialization
                dataFilter: function (data, dataType) {
                    // convert "\/Date(...)\/" to "new Date(...)"
                    return data.replace(rdate, 'new Date($1)');
                },
                error: $.proxy(function (xhr, status) {
                    if ($t.ajaxError(this.element, 'error', xhr, status))
                        return;
                }, this),

                complete: $.proxy(this.hideBusy, this),

                success: $.proxy(function (data, status, xhr) {
                    try {
                        data = eval('(' + data + ')');
                    } catch (e) {
                        // in case the result is not JSON raise the 'error' event
                        if (!$t.ajaxError(this.element, 'error', xhr, 'parseeror'))
                            alert('Error! The requested URL did not return JSON.');
                        return;
                    }

                    data = data.d || data; // Support the `d` returned by MS Web Services 

                    if (options.hasErrors && options.hasErrors(data)) {
                        if(!$t.trigger(this.element, 'error', {
                                XMLHttpRequest: xhr, 
                                textStatus: 'modelstateerror', 
                                modelState: data.modelState
                            })) {
                            options.displayErrors(data);
                        }
                        return;
                    }

                    this.dataSource.success(data);
                }, this)
            };
            $.extend(result, options);

            var state = this.ws ? result.data.state = {} : result.data;

            state[this.queryString.page] = this.currentPage;
            state[this.queryString.size] = this.pageSize;
            state[this.queryString.orderBy] = this.orderBy || '';
            state[this.queryString.groupBy] = this.groupBy;
            state[this.queryString.filter] = (this.filterBy || '').replace(/\"/g, '\\"');
            state[this.queryString.aggregates] = $.map(this.columns, function(c) {
                if (c.aggregates)
                    return c.member + '-' + c.aggregates.join('-');
            }).join('~');

            if (this.ws) {
                result.data = $t.toJson(result.data);
                result.contentType = 'application/json; charset=utf-8';
            }
            return result;
        },

        showBusy: function () {
            this.busyTimeout = setTimeout($.proxy(function () {
                $('> .t-grid-pager .t-status .t-icon', this.element).addClass('t-loading');
            }, this), 100);
        },

        hideBusy: function () {
            clearTimeout(this.busyTimeout);
            $('> .t-grid-pager .t-status .t-icon', this.element).removeClass('t-loading');
        },

        serverRequest: function () {
            if (this.operationMode === "client") {
                this.ajaxRequest();
            } else {
                location.href = $t.formatString(unescape(this.urlFormat),
                    this.currentPage, this.orderBy || '~', this.groupBy || '~', encodeURIComponent(this.filterBy) || '~', this.pageSize || '~');
            }
        },
        _isServerOperation: function() {
            return this.operationMode !== "client";
        },
        ajaxRequest: function (additionalData) {           
            var that = this,
                pageSize = that.pageSize,                
                currentPage = that.currentPage,
                aggregates = $.map(that.columns, function(c) {
                    return $.map(c.aggregates || [], function(a) {
                        return { field: c.member, aggregate: a };
                    });
                });                
            
            if(currentPage > 1 && that.pageOnScroll && !that._pagingInProgress) {                
                pageSize = currentPage * that.pageSize;
                currentPage = 1;
            }

            var e = {
                page: currentPage,
                sortedColumns: that.sorted,
                filteredColumns: $.grep(that.columns, function (column) {
                    return column.filters;
                })
            };

            if ($t.trigger(that.element, 'dataBinding', e))
                return;

            if (!that.ajax && !that.ws && this.operationMode !== "client")
                return;

            if(that.dataSource.transport.options && that.dataSource.transport.options.read) {
                that.dataSource.transport.options.read.url = this.url('selectUrl');
            }

            if(that._isServerOperation()) {
                that.showBusy();                
            }            

            that.dataSource.query($.extend({
                page: currentPage,
                pageSize: pageSize,
                sort: $.map(that.sorted, function(column) {
                    return { 
                        field: column.member,
                        dir: column.order
                    }
                }),
                filter: $.map($.grep(that.columns, function (column) {
                    return column.filters;
                }), function(column) {
                    return $.map(column.filters, function(filter) {
                        if (column.type == "Number") {
                            filter.value = parseFloat(filter.value);
                        } else if (column.type == "Date") {
                            var format = column.format ? /\{0(:([^\}]+))?\}/.exec(column.format)[2] : $t.cultureInfo.shortDate;
                            filter.value = $t.datetime.parse({ value: filter.value, format: format }).toDate();
                        }
                        return {
                            field: column.member,
                            operator: filter.operator,
                            value: filter.value                       
                        }; 
                    });
                }),
                group: $.map(that.groups, function(group) {                    
                    return { field: group.member, dir: group.order, aggregates: aggregates };
                }),
                aggregates: aggregates                
            }, $.extend({}, e.data, additionalData)));
//            $.ajax(this.ajaxOptions({
//                data: $.extend({}, e.data, additionalData),
//                url: this.url('selectUrl')
//            }));
        },
        valueFor: function (column) {
            if (column.type == 'Date')
                return new Function('data', 'var value = data.' + column.member +
                    '; if (!value) return null; return value instanceof Date? value : new Date(parseInt(value.replace(/\\/Date\\((.*?)\\)\\//, "$1")));');

            return new Function('data', 'return data' + (column.member ? '.' + column.member : '') + ';');
        },

        displayFor: function (column) {
            var localization = this.localization;

            if (column.commands) {
                var html = $.map(column.commands, function(command) {
                    var builder = $t.grid.ButtonBuilder.create($.extend({text:localization[command.name]}, command));
                    return builder.build();
                }).join('');

                return function() {
                    return html;
                };
            }

            if (!column.template) {
                var result = column.value || function () { return "" };

                if (column.format || column.type == 'Date')
                    result = function (data) {
                        var value = column.value(data);
                        return value == null ? '' : $t.formatString(column.format || '{0:G}', value);
                    };

                return column.encoded === false ? result : function (data) { return encode(result(data)) };
            }

            return template(column.template);
        },
        
        insertFor: function(column) {
            return this.displayFor(column);
        },

        editFor: function(column) {
            return this.displayFor(column);
        },
        
        initializeColumns: function () {
            $.each(this.columns, $.proxy(function (_, column) {
                if (column.member !== undefined) {
                    column.value = this.valueFor(column);
                } else {
                    column.readonly = true;
                }
                
                column.insert = this.insertFor(column)
                column.edit = this.editFor(column);
                column.display = this.displayFor(column);
                
                if (column.footerTemplate)
                    column.footer = template(column.footerTemplate);
                
                if (column.groupFooterTemplate) {
                    this.showGroupFooter = true;
                    column.groupFooter = template(column.groupFooterTemplate);
                }
                
                column.groupHeader = template('<#= Title #>: <#= Key #>');
                
                if (column.groupHeaderTemplate)
                    column.groupHeader = template(column.groupHeaderTemplate);
            }, this));

            var j = this.columns.length - 1;
            while (j >= 0)
            {
                var col = this.columns[j];

                if (col.hidden) {
                    j--;
                    continue;
                }

                if (!col.attr) {
                    col.attr = ' class="t-last"';
                    break;
                } else if (col.attr.indexOf("class") == -1) {
                    col.attr += ' class="t-last"';
                    break;
                } else {
                    col.attr = col.attr.replace('class="', 'class="t-last ');
                    break;
                }
                j--;
            }

            if (this.detail)
                this.displayDetails = template(this.detail.template);
        },

        bindData: function (data, html, groups) {
            Array.prototype.push.apply(this.data, data);

            var dataLength = this.pageOnScroll ? data.length : Math.min(this.pageSize, data.length);
            var colspan = this.columns.length;

            dataLength = this.pageSize ? dataLength : data.length;

            /* fix for ie8 hidden columns in ajax binding becoming ghosts */
            if ($.browser.msie)
                $(this.element).find('.t-grid-content colgroup:first col').css('display', '');

            for (var rowIndex = 0; rowIndex < dataLength; rowIndex++) {
                var className = $.trim((this.detail ? 't-master-row' : '') + (rowIndex % 2 == 1 ? ' t-alt' : ''));

                if (className)
                    html.cat('<tr class="')
                        .cat(className)
                        .cat('">')
                else
                    html.cat('<tr>');

                html.rep('<td class="t-group-cell"></td>', groups)
                    .catIf('<td class="t-hierarchy-cell"><a class="t-icon t-plus" href="#" /></td>', this.detail);

                if (this.rowTemplate) {
                    html.cat('<td colspan="')
                    .cat(colspan)
                    .cat('">')
                    .cat(this.rowTemplate(data[rowIndex]))
                    .cat("</td>");
                } else { 
                    for (var i = 0, len = this.columns.length; i < len; i++) {
                        var column = this.columns[i];
                       
                        html.cat('<td')
                            .cat(column.attr)
                            .cat('>')
                            .cat(column.display(data[rowIndex]));
    
                        html.cat('</td>');
                    }
                }

                html.cat('</tr>');
            }
        },

        normalizeColumns: function () {
            // empty - overridden in telerik.grid.grouping.js
        },

        dataItem: function (tr) {
            return this.data[this.$tbody.find('> tr:not(.t-grouping-row,.t-detail-row,.t-grid-new-row,.t-group-footer)').index($(tr))];
        },

        _colspan: function() {
            return this.groups.length + this.columns.length + (this.detail ? 1 : 0);
        }, 
        bindTo: function (data) {                    
            var html = new $t.stringBuilder();
            var colspan = this._colspan();

            if (data && data.length) {

                this.normalizeColumns(colspan);
                if (typeof data[0].hasSubgroups != 'undefined')
                    for (var i = 0, l = data.length; i < l; i++)
                        this.bindGroup(data[i], colspan, html, 0);
                else
                    this.bindData(data, html);
            }
            else
                html.cat("<tr class='t-no-data'>")
                    .cat("<td colspan='")
                    .cat(colspan)
                    .cat("'>")
                    .cat(this.noRecordsTemplate ? this.noRecordsTemplate : this.localization.noRecords)
                    .cat('</td></tr>');

            this.$tbody.html(html.string());

            if (this.onRowDataBound) {

                var rows = jQuery.grep(this.$tbody[0].rows, function (row) {
                    return !$(row).hasClass('t-grouping-row')
                });

                for (var i = 0, l = this.data.length; i < l; i++)
                    $t.trigger(this.element, 'rowDataBound', { row: rows[i], dataItem: this.data[i] });
            }
        },

        updatePager: function () {
            var totalPages = this.totalPages(this.total);
            var currentPage = this.currentPage;
            var pageSize = this.pageSize;

            // nextPrevious
            // work-around for weird issue in IE, when using comma-based selector
            this.$pager.find('.t-arrow-next').parent().add(this.$pager.find('.t-arrow-last').parent())
	            .toggleClass('t-state-disabled', currentPage >= totalPages)
	            .removeClass('t-state-hover');

            this.$pager.find('.t-arrow-prev').parent().add(this.$pager.find('.t-arrow-first').parent())
	            .toggleClass('t-state-disabled', currentPage == 1)
	            .removeClass('t-state-hover');

            var localization = this.localization;
            // pageInput
            this.$pager.find('.t-page-i-of-n').each(function () {
                this.innerHTML = new $t.stringBuilder()
                                       .cat(localization.page)
                                       .cat('<input type="text" value="')
                                       .cat(currentPage)
                                       .cat('" /> ')
                                       .cat($t.formatString(localization.pageOf, totalPages))
                                       .string();
            });

            this.$pager.find('.t-page-size').each(function () {
                var html = '<div style="width: 50px;" class="t-dropdown t-header">' +
                             '<div class="t-dropdown-wrap t-state-default"><span class="t-input">' + pageSize + '</span>' + 
                                '<span class="t-select"><span class="t-icon t-arrow-down">select</span></span>' + 
                             '</div>' + 
                           '</div>';
                this.innerHTML = html;
            });

            // numeric
            this.$pager.find('.t-numeric').each($.proxy(function (index, element) {
                this.numericPager(element, currentPage, totalPages);
            }, this));

            // status
            this.$pager.parent()
                       .find('.t-status-text')
                       .text($t.formatString(localization.displayingItems,
                            this.firstItemInPage(),
	                        this.lastItemInPage(),
	                        this.total));
        },

        numericPager: function (pagerElement, currentPage, totalPages) {
            var numericLinkSize = 10;
            var numericStart = 1;

            if (currentPage > numericLinkSize) {
                var reminder = (currentPage % numericLinkSize);

                numericStart = (reminder == 0) ? (currentPage - numericLinkSize) + 1 : (currentPage - reminder) + 1;
            }

            var numericEnd = (numericStart + numericLinkSize) - 1;

            numericEnd = Math.min(numericEnd, totalPages);

            var pagerHtml = new $t.stringBuilder();
            if (numericStart > 1)
                pagerHtml.cat('<a class="t-link">...</a>');

            for (var page = numericStart; page <= numericEnd; page++) {
                if (page == currentPage) {
                    pagerHtml.cat('<span class="t-state-active">')
                        .cat(page)
                        .cat('</span>');
                } else {
                    pagerHtml.cat('<a class="t-link">')
	                .cat(page)
	                .cat('</a>');
                }
            }

            if (numericEnd < totalPages)
                pagerHtml.cat('<a class="t-link">...</a>');

            pagerElement.innerHTML = pagerHtml.string();
        },

        $columns: function () {
            return this.$header.find('th:not(.t-hierarchy-cell,.t-group-cell)');
        },

        updateSorting: function () {
            this.sorted = [];
            $.each(this.orderBy.split('~'), $.proxy(function (_, expr) {
                var memberAndOrder = expr.split('-');
                var column = this.columnFromMember(memberAndOrder[0]);
                if (column) {
                    column.order = memberAndOrder[1];
                    this.sorted.push(column);
                }
            }, this));

            this.$columns().each($.proxy(function (i, header) {
                var direction = this.columns[i].order;
                var $link = $(header).children('a.t-link');
                var $icon = $link.children('.t-icon');

                if (!direction) {
                    $icon.hide();
                } else {
                    if ($icon.length == 0)
                        $icon = $('<span class="t-icon"/>').appendTo($link);

                    $icon.toggleClass('t-arrow-up', direction == 'asc')
                        .toggleClass('t-arrow-down', direction == 'desc')
                        .html('(' + (direction == 'asc' ? this.localization.sortedAsc : this.localization.sortedDesc) + ')')
                        .show();
                }
            }, this));
        },

        sanitizePage: function (value) {
            var result = parseInt(value, 10);
            if (isNaN(result) || result < 1)
                return this.currentPage;
            return Math.min(result, this.totalPages());
        },

        totalPages: function () {
            return Math.ceil(this.total / this.pageSize);
        },

        firstItemInPage: function () {
            return this.total > 0 ? (this.currentPage - 1) * this.pageSize + 1 : 0;
        },

        lastItemInPage: function () {
            return Math.min(this.currentPage * this.pageSize, this.total);
        },

        dataBind: function (data) {
            this.dataSource.success(data);
        },
        
        bindFooter: function() {
            var that = this, 
                $footerCells = that.$footer.find('td:not(.t-group-cell,.t-hierarchy-cell)'),
                aggregates = that.aggregates;
            
            $.each(that.columns, function(index) {
                if (this.footer)
                    $footerCells.eq(index).html(this.footer(that._mapAggregates(aggregates[this.member] || {})));
            });
        },

        rebind: function (args) {
            this.sorted = [];
            this.orderBy = '';
            this.filterBy = '';
            this.currentPage = 1;

            $.each(this.columns, function () {
                this.order = null;
                this.filters = null;
            });

            $('.t-filter-options', this.element)
                .find('input[type="text"], select')
                .val('')
                .removeClass('t-state-error')
                .end()
                .find('div.t-formatted-value')
                .html('');

            $('.t-grid-filter', this.element)
                .removeClass('t-active-filter');

            this.ajaxRequest(args);
        }
    }
    
    $t.grid.ButtonBuilder = function (button) {
        this.classNames = ['t-button', 't-grid-' + button.name];
        
        this.content = function () {
            return button.text;
        }

        this.build = function() {
            return '<a href="#" class="' + this.classNames.join(' ') +  '" ' + (button.attr? button.attr : '') + '>' +
                        this.content() +
                   '</a>';
        }
    }
       
    $t.grid.ButtonBuilder.create = function(button) {        
        return new (buttonBuilderTypes[button.buttonType])(button);    
    }

    function sprite(name, imageAttr) {
        return '<span class="t-icon t-' + name + '"' + (imageAttr? imageAttr : '') + '>' + '</span>'
    }

    $t.grid.ImageButtonBuilder = function (button) {
        $t.grid.ButtonBuilder.call(this, button);
        
        this.classNames.push('t-button-icon');
         
        this.content = function() {
            return sprite(button.name, button.imageAttr);
        }
    }    
    
    $t.grid.ImageTextButtonBuilder = function (button) {
        $t.grid.ButtonBuilder.call(this, button);
        
        this.classNames.push('t-button-icontext');
        
        this.content = function() {
            return '<span class="t-icon t-' + button.name + '"' + (button.imageAttr? button.imageAttr : '') + '>' +
                   '</span>' + button.text;
        }
    }    
    
    $t.grid.BareImageButtonBuilder = function (button, localization) {
        $t.grid.ImageButtonBuilder.call(this, button, localization);
        this.classNames.push('t-button-icon', 't-button-bare');
    }
 
    var buttonBuilderTypes = {
        Text: $t.grid.ButtonBuilder,
        ImageAndText: $t.grid.ImageTextButtonBuilder,
        Image: $t.grid.ImageButtonBuilder,
        BareImage: $t.grid.BareImageButtonBuilder
    };

    $.fn.tGrid = function (options) {
        return $t.create(this, {
            name: 'tGrid',
            init: function (element, options) {
                return new $t.grid(element, options);
            },
            options: options,
            success: function (grid) {
                if (grid.$tbody.find('tr.t-no-data').length)
                    grid.ajaxRequest();
            }
        });
    }

    // default options

    $.fn.tGrid.defaults = {
        columns: [],
        plugins: [],
        currentPage: 1,
        pageSize: 10,
        localization: {
            addNew: 'Add new record',
            'delete': 'Delete',
            cancel: 'Cancel',
            insert: 'Insert',
            update: 'Update',
            select: 'Select',
            pageOf: 'of {0}',
            displayingItems: 'Displaying items {0} - {1} of {2}',
            edit: 'Edit',
            noRecords: 'No records to display.',
            page: 'Page ',
            filter: 'Filter',
            filterClear: 'Clear Filter',
            filterShowRows: 'Show rows with value that',
            filterAnd: 'And',
            filterStringEq: 'Is equal to',
            filterStringNe: 'Is not equal to',
            filterStringStartsWith: 'Starts with',
            filterStringSubstringOf: 'Contains',
            filterStringEndsWith: 'Ends with',
            filterNumberEq: 'Is equal to',
            filterNumberNe: 'Is not equal to',
            filterNumberLt: 'Is less than',
            filterNumberLe: 'Is less than or equal to',
            filterNumberGt: 'Is greater than',
            filterNumberGe: 'Is greater than or equal to',
            filterDateEq: 'Is equal to',
            filterDateNe: 'Is not equal to',
            filterDateLt: 'Is before',
            filterDateLe: 'Is before or equal to',
            filterDateGt: 'Is after',
            filterDateGe: 'Is after or equal to',
            filterEnumEq: 'Is equal to',
            filterEnumNe: 'Is not equal to',
            filterBoolIsTrue: 'is true',
            filterBoolIsFalse: 'is false',
            filterSelectValue: '-Select value-',
            filterOpenPopupHint: 'Open the calendar popup',
            groupHint: 'Drag a column header and drop it here to group by that column',
            deleteConfirmation: 'Are you sure you want to delete this record?',
            sortedAsc: 'sorted ascending',
            sortedDesc: 'sorted descending',
            ungroup: 'ungroup'
        },
        queryString: {
            page: 'page',
            size: 'size',
            orderBy: 'orderBy',
            groupBy: 'groupBy',
            filter: 'filter',
            aggregates: 'aggregates'
        }
    };
})(jQuery);
