(function($) {
    $.fn.menuMaker = function(options) {
        var settings = $.extend({
            fieldLevel: 3,
            m1: 10,
            m2: 10,
            m3: 10,
            menuCodeCount: 1,
            menuJson: {},
            menuType: 'V'
        }, options);
        var notifyText = "";
        var target = "";
        var l_m;
        var parentNode = 1;
        var linkProp = {};
        var addItemProp = {};
        var addInput = "<div class='leftBar'>" +
            "<div class='topBar clearfix'>" +
            "<h4>Menu Tree</h4>" +
            "<a href='javascript:void(0);' class='addBtn' id='addMenu'><i class='glyphicon glyphicon-plus'></i>Add</a>" +
            "</div>" +
            "<div id='leftMenuContent' class='leftMenuContent'></div>" +
            "</div>" +
            "<div class='rightBar clearfix'>" +
            "<div class='topBar clearfix'>" +
            "<h4>Properties</h4>" +
            "<a href='javascript:void(0);' id='getMenuPreview' style='right: 42px;'>Preview</a>" +
            "<a href='javascript:void(0);' id='savejson' style='right:135px'>Submit</a>" +
            '<a href="javascript:void(0);" id="helpIconMenuDesign" style="text-decoration: none;position: absolute;top: 23px;right: 9px;"><i class="neoicon-help1"></i></a>' +
            "</div>" +
            "<div id='editFieldContent' class='editFieldContent'></div>" +
            "</div>" +
            "<div id='previewContent' style='display:none;' class='previewContent'></div>" +
            "<a href='javascript:void(0);' style='display:none;' id='closePreview' class='closePreview'><i class='glyphicon glyphicon-remove'></i></a>";

        return this.each(function() {
            var elem = $(this);
            var fn = {
                init: function() {
                    fn._bindContent();
                    fn._initStructure();
                    fn._bindAction();
                },
                _bindContent: function() {
                    elem.html(addInput);
                    if (Object.keys(settings.menuJson).length != 0 && settings.menuJson.constructor === Object) {
                        fn._createLeftMenu(settings.menuJson);
                    } else {
                        elem.find("#leftMenuContent").append("<ul class='menuBar' data-fl='1' id='menuBar'></ul>");
                    }
                },
                _createLeftMenu: function(json) {

                    var l_html = fn._addLeftMenu(json);
                    elem.find("#leftMenuContent").html(l_html);
                },
                _addLeftMenu: function(json) {
                    var l_menuHtml = "";
                    var menuLevel = "";
                    if (parentNode == 1) {
                        l_menuHtml = "<ul class='menuBar' data-fl='" + parentNode + "' id='menuBar'>";
                    } else {
                        l_menuHtml = "<ul class='subMenu' data-fl='" + parentNode + "'>";
                    }

                    if (parentNode == 1) {
                        menuLevel = "ONE";
                    } else if (parentNode == 2) {
                        menuLevel = "TWO";
                    } else if (parentNode == 3) {
                        menuLevel = "THREE";
                    }

                    parentNode = parentNode + 1;
                    if (json.subLevel) {
                        for (var i = 0; i < json.subLevel.length; i++) {
                            l_menuHtml += "<li><a class='menuLink' data-menuname='" + json.subLevel[i].menuName + "' data-function='" + json.subLevel[i].linkedFunction + "' data-menucode='" + json.subLevel[i].menuCode + "' data-menuorder='" + json.subLevel[i].menuOrder + "' data-menulevel='" + menuLevel + "'  data-id='" + json.subLevel[i].id + "' data-sysdefined = '" + json.subLevel[i].systemDefined + "' data-shortcut='" + json.subLevel[i].shortcut + "' data-tooltip='" + json.subLevel[i].toolTip + "' data-url='" + json.subLevel[i].url + "' data-auth='" + json.subLevel[i].auth + "' data-parentnum='" + json.subLevel[i].parent + "' data-parent='" + json.subLevel[i].parentName + "' data-imagelinkedfunction='" + json.subLevel[i].imageLinkedFunction + "' data-imagelinkedurl='" + json.subLevel[i].imageLinkedUrl + "' data-isdivide='" + json.subLevel[i].divided + "' data-iconname='" + json.subLevel[i].iconClassName + "' href='javascript:void(0);' title='" + json.subLevel[i].menuDisplayName + "'";

                            if (json.subLevel[i].elementId != null) {
                                l_menuHtml += "data-elementid='" + json.subLevel[i].elementId + "'";
                            }
                            if (json.subLevel[i].dividedBtnId != null) {
                                l_menuHtml += "data-dividedbtnid='" + json.subLevel[i].dividedBtnId + "'";
                            }

                            l_menuHtml += ">" + json.subLevel[i].menuDisplayName + "</a>";
                            if (json.subLevel[i].systemDefined === false) {
                                l_menuHtml += "<a href='javascript:void(0);' class='delLink'><i class='glyphicon glyphicon-trash'></i></a>";
                            }

                            if (json.subLevel[i]["subLevel"]) {
                                l_menuHtml += fn._addLeftMenu(json.subLevel[i]);
                            }
                            l_menuHtml += "</li>"

                        }
                    }
                    parentNode = parentNode - 1;
                    l_menuHtml += "</ul>"
                    return l_menuHtml;
                },
                _validateStructure: function(dom) {

                    if (dom == "noValidate") {
                        new PNotify({
                            title: 'Error',
                            text: 'System Defined menu cannot be moved',
                            type: 'error',
                            opacity: .8
                        });

                        linkProp = {};
                        addItemProp = {};
                        notifyText = "";
                        target = "";
                        l_m;
                        parentNode = 1;
                        elem.find("#menuBar").sortable("destroy");
                        elem.html("");
                        fn.init();
                    }
                    //Check for Divide Button to not be a parent menu button while drag and drop
                    else if (dom == "dividedInvalidate") {
                        new PNotify({
                            title: 'Error',
                            text: 'Divided Button Cannot Be a Parent',
                            type: 'error',
                            opacity: .8
                        });
                        linkProp = {};
                        addItemProp = {};
                        notifyText = "";
                        target = "";
                        l_m;
                        parentNode = 1;
                        elem.find("#menuBar").sortable("destroy");
                        elem.html("");
                        fn.init();

                    } else {
                        var len, depth = 0;
                        $('#leftMenuContent li:not(:has(ul))').each(function() {
                            len = $(this).parents('ul').length;
                            if (len > depth) {
                                depth = len;
                            }
                        });

                        if (depth > settings.fieldLevel) {
                            new PNotify({
                                title: 'Error',
                                text: 'Field level maximum length is 3',
                                type: 'error',
                                opacity: .8
                            });
                            linkProp = {};
                            addItemProp = {};
                            notifyText = "";
                            target = "";
                            l_m;
                            parentNode = 1;
                            elem.find("#menuBar").sortable("destroy");
                            elem.html("");
                            fn.init();
                        }
                        elem.find("#leftMenuContent ul").each(function() {
                            var d_len = $(this).children("li").length;
                            var d_fl = $(this).data("fl");
                            if (eval("settings.m" + d_fl) < d_len) {
                                new PNotify({
                                    title: 'Error',
                                    text: 'Menu item length error',
                                    type: 'error',
                                    opacity: .8
                                });
                                linkProp = {};
                                addItemProp = {};
                                notifyText = "";
                                target = "";
                                l_m;
                                parentNode = 1;
                                elem.find("#menuBar").sortable("destroy");
                                elem.html("");
                                fn.init();
                            }
                        });

                    }
                    fn._setMenuOrder();

                },
                _bindAction: function() {

                    $(window).on("resize", function() {
                        fn._initStructure();
                    });

                    var oldContainer;
                    elem.find("#menuBar").sortable({
                        group: 'nested',
                        delay: 100,
                        afterMove: function(placeholder, container) {
                            if (oldContainer != container) {
                                if (oldContainer) {
                                    oldContainer.el.removeClass("active");
                                }
                                container.el.addClass("active");
                                oldContainer = container;
                            }
                        },
                        onDrop: function($item, container, _super) {
                            container.el.removeClass("active");
                            _super($item, container);
                            if ($item.children("a").data("sysdefined")) {
                                fn._validateStructure('noValidate');
                            } else if ($item.children("a").data("isdivide")) {
                                var linkElem = $item.children("a");
                                if (linkElem.parent().parent().hasClass("menuBar")) {
                                    fn._validateStructure('dividedInvalidate');
                                } else {
                                    fn._validateStructure(elem.find("#leftMenuContent").html());
                                }
                            } else {
                                fn._validateStructure(elem.find("#leftMenuContent").html());
                            }
                        }
                    });

                    // add menu item
                    elem.find("#addMenu").on("click", function() {
                        $.ajax({
                            type: 'GET',
                            url: getContextPath() + '/app/menuController/getAutoCompleteJsp',
                            success: function(data) {
                                elem.find("#menuAddModel").remove();
                                addItemProp = {};
                                if (target) {
                                    addItemProp.parentName = (target.text() == 'undefined') ? '--' : target.text();
                                } else {
                                    addItemProp.parentName = '--';
                                }
                                var addMenuModel = "<div class='menuAddModel' id='menuAddModel'>" +
                                    "<div class='menuAddContainer'>" +
                                    "<div class='menuAddHeading'>" +
                                    "<h4>Add Menu Item</h4>" +
                                    "<a href='javascript:void(0);' id='closeAddMenuModel'><i class='glyphicon glyphicon-remove'></i></a>" +
                                    "</div>" +
                                    "<div class='menuAddContent'>";
                                if (target) {
                                    if (target.closest("ul").data("fl") < 2) {
                                        addMenuModel += "<div class='isParent'><input type='checkbox' id='isParent' /><label>Parent</label></div>";
                                    }
                                } else {
                                    addMenuModel += "<div class='isParent'><input type='checkbox' id='isParent' /><label>Parent</label></div>";
                                }
                                addMenuModel += "<ul class='menufieldList clearfix'>" +
                                    "<li>" +
                                    "<span class='label'>Parent Name</span>" +
                                    "<span class='value' id='parentName'>" + addItemProp.parentName + "</span>" +
                                    "</li>" +
                                    "<li class='fullBlock'>" + data + "</li>" +
                                    "<li>" +
                                    "<span class='label'>Tool-tip</span>" +
                                    "<input type='text' id='addtooltip' class='inputText' value='' />" +
                                    "</li>" +
                                    "<li>" +
                                    "<span class='label'>Shortcut</span>" +
                                    "<input type='text' id='addshortcut' class='inputText' value='' />" +
                                    "</li>" +
                                    "<li>" +
                                    "<span class='label'>URL Name</span>" +
                                    "<input type='text' id='addurlname' class='inputText' value='' />" +
                                    "</li>" +
                                    "<li>" +
                                    "<span class='label'>Linked function</span>" +
                                    "<input type='text' id='linkedfunction' class='inputText' value='' />" +
                                    "</li>" +
                                    "</ul>" +
                                    "</div>" +
                                    "<div class='addbottomBtn text-right'><class='isParent'a href='javascript:void(0);' id='addItem'><i class='glyphicon glyphicon-ok'></i>Save</a></div>" +
                                    "</div>" +
                                    "</div>";

                                elem.append(addMenuModel);

                                if (target) {
                                    if (target.closest("ul").data("fl") < 1) {
                                        //do nothing
                                    } else {
                                        $("#menuAddModel").find("ul  li").last().after("<li class='isDividelist'>" +
                                            "<span class='label'>Enable Divide Button</span>" +
                                            "<input type='checkbox' id='divideButton'  val='' />" +
                                            "</li>" +
                                            "<li class='optionalField hide'>" +
                                            "<span class='label'>Image Linked URL Name</span>" +
                                            "<input type='text' id='imagelinkedUrlname' class='inputText' value='' />" +
                                            "</li>" +
                                            "<li class='optionalField hide'>" +
                                            "<span class='label'>Image Linked function</span>" +
                                            "<input type='text' id='imagelinkedfunction' class='inputText' value='' />" +
                                            "</li>" +
                                            "<li id='iconNamelistItem'class='optionalField hide'>" +
                                            "<span class='label'>Glyphicon Icon Name</span>" +
                                            "<input type='text' id='iconname' class='inputText' value='' />" +
                                            "</li>"
                                        );
                                    }
                                }

                            },
                            error: function(e) {
                                $.sticky("Some Error Occured", {
                                    position: "top-right",
                                    type: "st-failure"
                                });
                            }
                        });



                    });

                    $(elem).on("click", "#isParent", function() {
                        var elemParent = $(this);
                        if ($(elemParent).prop("checked")) {
                            elem.find(".isDividelist").addClass("hide");
                            elem.find(".optionalField").addClass("hide");
                            $("#divideButton").prop("checked", false);
                            $("#imagelinkedUrlname").val("");
                            $("#imagelinkedfunction").val("");
                            $("#iconname").val("");
                        } else {
                            elem.find(".isDividelist").removeClass("hide");
                        }
                    });

                    $(elem).on("click", "#divideButton", function() {
                        var elemPosition = $(this).parent();
                        if ($(this).prop("checked")) {
                            $(elemPosition).siblings(".optionalField").removeClass("hide");
                            $("#imagelinkedUrlname").focus();
                        } else {
                            $(elemPosition).siblings(".optionalField").addClass("hide");
                            $("#imagelinkedUrlname").val("");
                            $("#imagelinkedfunction").val("");
                            $("#iconname").val("");
                        }
                    });

                    // add menu model close
                    elem.on("click", "#menuAddModel #closeAddMenuModel", function() {
                        elem.find("#menuAddModel").remove();
                    });

                    // add menu save
                    elem.off("click", "#menuAddModel #addItem");
                    elem.on("click", "#menuAddModel #addItem", function() {
                    PNotify.removeAll();
                        if (fn._checkDuplicate(elem.find("#Text_menuName").val(),'add')){
                            new PNotify({
                                title: 'Error',
                                text: 'Label already exists',
                                type: 'error',
                                opacity: .8
                            }); 
                        }
                        else{
                            addItemProp.name = elem.find("#Text_menuName").val();
                            addItemProp.auth = elem.find("#authArrLong").val();
                            addItemProp.tooltip = elem.find("#addtooltip").val();
                            addItemProp.shortcut = elem.find("#addshortcut").val();
                            addItemProp.url = elem.find("#addurlname").val();
                            addItemProp.linkfun = elem.find("#linkedfunction").val();
                            var isdivide = false;
                            isdivide = elem.find("#divideButton").prop("checked");
                            if (isdivide) {
                                addItemProp.isdivide = true;
                                addItemProp.imagelinkedfunction = elem.find("#imagelinkedfunction").val();
                                addItemProp.imagelinkedurl = elem.find("#imagelinkedUrlname").val();
                                addItemProp.iconname = elem.find("#iconname").val();
                            } else {
                                addItemProp.isdivide = false;
                            }
                            if (target) {
                                addItemProp.parentnum = target.data("menucode");
                                addItemProp.menulevel = target.closest("ul").data("fl") + 1;
                                addItemProp.menuorder = target.closest("li").children("ul").children("li").length + 1;
                            } else {
                                addItemProp.menulevel = 1;
                                addItemProp.menuorder = elem.find("#menuBar").children("li").length + 1;
                            }

                            settings.menuCodeCount = settings.menuCodeCount + 20;
                            addItemProp.setMenuCode = "menu_" + settings.menuCodeCount;



                            if (addItemProp.name != "") {
                                if (elem.find("#isParent").prop("checked") == false || (elem.find("#isParent").prop("checked") == "undefined") || (elem.find("#isParent").prop("checked") == undefined)) {

                                    if ((addItemProp.url == "" && addItemProp.linkfun == "")) {
                                        new PNotify({
                                            title: 'Error',
                                            text: 'Please enter either url or linked function',
                                            type: 'error',
                                            opacity: .8
                                        });
                                    } else {
                                        if (target) {
                                            if (target.data("url") != "" || target.data("url") != "undefined" || target.data("url") != "--") {
                                                if ($(elem.find("#divideButton").prop("checked"))) {
                                                    if (addItemProp.imagelinkedfunction == "" && addItemProp.imagelinkedurl == "") {
                                                        new PNotify({
                                                            title: 'Error',
                                                            text: 'Please enter either Image url or Image function',
                                                            type: 'error',
                                                            opacity: .8
                                                        });
                                                    } else {
                                                        if (addItemProp.iconname == "") {
                                                            new PNotify({
                                                                title: 'Error',
                                                                text: 'Please enter Icon Display Name',
                                                                type: 'error',
                                                                opacity: .8
                                                            });

                                                        } else {
                                                            fn._Itemadd(addItemProp);
                                                        }
                                                    }
                                                } else {
                                                    fn._Itemadd(addItemProp);
                                                }


                                            } else {
                                                new PNotify({
                                                    title: 'Error',
                                                    text: 'Root is not parent type',
                                                    type: 'error',
                                                    opacity: .8
                                                });
                                            }

                                        } else {

                                            fn._Itemadd(addItemProp);
                                        }
                                    }
                                } else {
                                    addItemProp.url = "";
                                    addItemProp.linkfun = "";
                                    addItemProp.auth = "";
                                    fn._Itemadd(addItemProp);
                                    /*           if(target){
                                                                    if(target.data("url") != "" || target.data("url") != "undefined" || target.data("url") != "--"){
                                                                    new PNotify({
                                                                                    title : 'Error',
                                                                                    text : 'Root is not parent type',
                                                                                    type : 'error',
                                                                                    opacity : .8
                                                                    });
                                                    }
                                                    else if(target.data("function") != "" || target.data("function") != "undefined" || target.data("function") != "--"){
                                                                    new PNotify({
                                                                                    title : 'Error',
                                                                                    text : 'Root is not parent type',
                                                                                    type : 'error',
                                                                                    opacity : .8
                                                                    });
                                                    }
                                                    else{
                                                                    addItemProp.url = "";
                                                                    fn._Itemadd(addItemProp);
                                                    }
                                                    }
                                                    else{
                                                                    addItemProp.url = "";
                                                                    addItemProp.linkfun = "";
                                                                    addItemProp.auth = "";
                                                                    fn._Itemadd(addItemProp);
                                                    }*/
                                }
                            } else {
                                new PNotify({
                                    title: 'Error',
                                    text: 'Please enter name',
                                    type: 'error',
                                    opacity: .8
                                });
                            }

                        }
                    });

                    // left bar menu item click
                    elem.on("click", "#menuBar a.menuLink", function(e) {

                        e.stopPropagation();
                        target = $(this);
                        linkProp.parentname = ($(this).data("parent") == 'undefined' || $(this).data("parent") == '') ? '--' : $(this).data("parent");

                        if ($(this).data("sysdefined") == true) {
                            linkProp.name = ($(this).text() == 'undefined' || $(this).text() == '') ? '--' : $(this).text();
                            linkProp.url = ($(this).data("url") == 'undefined' || $(this).data("url") == '') ? '--' : $(this).data("url");
                            linkProp.auth = ($(this).data("auth") == 'undefined' || $(this).data("auth") == '') ? '--' : $(this).data("auth");
                            linkProp.tooltip = ($(this).data("tooltip") == 'undefined' || $(this).data("tooltip") == '') ? '--' : $(this).data("tooltip");
                            linkProp.shortcut = ($(this).data("shortcut") == 'undefined' || $(this).data("shortcut") == '') ? '--' : $(this).data("shortcut");
                            linkProp.linkedfunction = ($(this).data("function") == 'undefined' || $(this).data("function") == '') ? '--' : $(this).data("function");
                            linkProp.imagelinkedfunction = ($(this).data("imagelinkedfunction") == 'undefined' || $(this).data("imagelinkedfunction") == '') ? '--' : $(this).data("imagelinkedfunction");
                            linkProp.imagelinkedurl = ($(this).data("imagelinkedurl") == 'undefined' || $(this).data("imagelinkedurl") == '') ? '--' : $(this).data("imagelinkedurl");
                            linkProp.iconname = ($(this).data("iconname") == 'undefined' || $(this).data("iconname") == '') ? '--' : $(this).data("iconname");
                            linkProp.isdivide = ($(this).data("isdivide") == 'undefined' || $(this).data("isdivide") == '') ? false : $(this).data("isdivide");
                        } else {
                            linkProp.name = ($(this).text() == 'undefined' || $(this).text() == '') ? '--' : $(this).text();
                            linkProp.url = ($(this).data("url") == 'undefined' || $(this).data("url") == '') ? '--' : $(this).data("url");
                            linkProp.auth = ($(this).data("auth") == 'undefined' || $(this).data("auth") == '') ? '--' : $(this).data("auth");
                            linkProp.tooltip = ($(this).data("tooltip") == 'undefined' || $(this).data("tooltip") == '') ? '--' : $(this).data("tooltip");
                            linkProp.shortcut = ($(this).data("shortcut") == 'undefined' || $(this).data("shortcut") == '') ? '--' : $(this).data("shortcut");
                            linkProp.linkedfunction = ($(this).data("function") == 'undefined' || $(this).data("function") == '') ? '--' : $(this).data("function");
                            linkProp.imagelinkedfunction = ($(this).data("imagelinkedfunction") == 'undefined' || $(this).data("imagelinkedfunction") == '') ? '--' : $(this).data("imagelinkedfunction");
                            linkProp.imagelinkedurl = ($(this).data("imagelinkedurl") == 'undefined' || $(this).data("imagelinkedurl") == '') ? '--' : $(this).data("imagelinkedurl");
                            linkProp.iconname = ($(this).data("iconname") == 'undefined' || $(this).data("iconname") == '') ? '--' : $(this).data("iconname");
                            linkProp.isdivide = ($(this).data("isdivide") == 'undefined' || $(this).data("isdivide") == '') ? false : $(this).data("isdivide");
                        }
                        linkProp.elementId = ($(this).data("elementid") == 'undefined' || $(this).data("elementid") == undefined) ? null : $(this).data("elementid");
                        linkProp.dividedBtnId = ($(this).data("dividedbtnid") == 'undefined' || $(this).data("dividedbtnid") == undefined) ? null : $(this).data("dividedbtnid");
                        var editFileds = "<ul class='itemField clearfix'>" +
                            "<li>" +
                            "<span class='label'>Parent Name</span>" +
                            "<span class='value' id='parentNameEdit'>" + linkProp.parentname + "</span>" +
                            "</li>" +
                            "<li>" +
                            "<span class='label'>Name</span>" +
                            "<span class='value'>" + linkProp.name + "</span>" +
                            "</li>";
                        $.ajax({
                            type: 'GET',
                            url: getContextPath() + '/app/menuController/getMenuNameForEditMode',
                            async: false,
                            success: function(data) {
                                editFileds +=
                                    "<li class='fullrow clearfix'>" + data + "</li>";

                            }
                        });
                        if ($(this).data("sysdefined") == true) {
                            editFileds += "<li class='fullrow'>" +
                                "<span class='label'>Authority</span>" +
                                "<span class='value'>" + linkProp.auth + "</span>" +
                                "</li>";
                        } else {
                            $.ajax({
                                type: 'GET',
                                url: getContextPath() + '/app/menuController/getMenuAuthForEditMode',
                                async: false,
                                success: function(data) {
                                    editFileds +=
                                        "<li>" + data + "</li>";

                                }
                            });
                        }

                        if ($(this).data("sysdefined") == true) {

                            //linkProp.name .text() == 'undefined' || $(this).text() == '') ? '--' : $(this).text();
                            editFileds += "<li>" +
                                "<span class='label'>Tool-tip</span>" +
                                "<span class='value'>" + linkProp.tooltip + "</span>" +
                                "</li>";
                        } else {
                            editFileds += "<li>" +
                                "<span class='label'>Tool-tip</span>" +
                                "<input type='text' id='e_tooltip' class='inputText' value='" + linkProp.tooltip + "' />" +
                                "</li>";
                        }

                        if ($(this).data("sysdefined") == true) {
                            editFileds += "<li>" +
                                "<span class='label'>Shortcut</span>" +
                                "<span class='value'>" + linkProp.shortcut + "</span>" +
                                "</li>";
                        } else {
                            editFileds += "<li>" +
                                "<span class='label'>Shortcut</span>" +
                                "<input type='text' id='e_shorcut' class='inputText' value='" + linkProp.shortcut + "' />" +
                                "</li>";
                        }

                        if ($(this).data("sysdefined") == true) {

                            editFileds += "<li>" +
                                "<span class='label'>Linked Function</span>" +
                                "<span class='value'>" + linkProp.linkedfunction + "</span>" +
                                "</li>";
                        } else {
                            editFileds += "<li>" +
                                "<span class='label'>Linked Function</span>" +
                                "<input type='text' id='e_linkedfunction' class='inputText' value='" + linkProp.linkedfunction + "' />" +
                                "</li>";
                        }

                        if ($(this).data("sysdefined") == true) {
                            editFileds += "<li>" +
                                "<span class='label'>URL Name</span>" +
                                "<span class='value'>" + linkProp.url + "</span>" +
                                "</li>";
                        } else {
                            editFileds += "<li>" +
                                "<span class='label'>URL Name</span>" +
                                "<input type='text' id='e_url' class='inputText' value='" + linkProp.url + "' />" +
                                "</li>";
                        }
                        if ($(this).data("sysdefined") == true) {
                            editFileds += "<li>" +
                                "<span class='label'>Enable Divide Button</span>" +
                                "<input type='checkbox' id='e_divideButton'  />" +
                                "</li>";
                        } else {
                            editFileds += "<li>" +
                                "<span class='label'>Enable Divide Button</span>" +
                                "<input type='checkbox' id='e_divideButton'  />" +
                                "</li>";
                        }


                        if ($(this).data("sysdefined") == true) {
                            editFileds += "<li>" +
                                "<span class='label'>Image Linked URL Name</span>" +
                                "<input type='text' id='e_imagelinkedUrlname' class='inputText' value='" + linkProp.imagelinkedurl + "' />" +
                                "</li>";
                        } else {
                            editFileds += "<li>" +
                                "<span class='label'>Image Linked URL Name</span>" +
                                "<input type='text' id='e_imagelinkedUrlname' class='inputText' value='" + linkProp.imagelinkedurl + "' />" +
                                "</li>";
                        }

                        if ($(this).data("sysdefined") == true) {
                            editFileds += "<li>" +
                                "<span class='label'>Image Linked function</span>" +
                                "<input type='text' id='e_imagelinkedfunction' class='inputText' value='" + linkProp.imagelinkedfunction + "' />" +
                                "</li>";
                        } else {
                            editFileds += "<li>" +
                                "<span class='label'>Image Linked function</span>" +
                                "<input type='text' id='e_imagelinkedfunction' class='inputText' value='" + linkProp.imagelinkedfunction + "' />" +
                                "</li>";
                        }
                        if ($(this).data("sysdefined") == true) {
                            editFileds += "<li id='iconNamelistItem'>" +
                                "<span class='label'>Glyphicon Name</span>" +
                                "<input type='text' id='e_iconName' class='inputText' value='" + linkProp.iconname + "' />" +
                                "</li>";
                        } else {
                            editFileds += "<li id='iconNamelistItem'>" +
                                "<span class='label'>Glyphicon Name</span>" +
                                "<input type='text' id='e_iconName' class='inputText' value='" + linkProp.iconname + "' />" +
                                "</li>";
                        }
                        editFileds += "<li class='text-right fullrow fieldBtn'>" +
                            "<input type='button' id='saveField' class='saveBtn' value='Save' />" +
                            "</li>" +
                            "</ul>";
                        elem.find("#editFieldContent").html(editFileds);

                        if ($(this).data("menulevel") == "ONE") {

                            elem.find("#e_divideButton").prop("disabled", true);
                            $("#e_imagelinkedUrlname").prop("disabled", true);
                            $("#e_imagelinkedfunction").prop("disabled", true);
                            $("#e_iconName").prop("disabled", true);

                        } else {
                            var e_divideCheckBox = elem.find("#e_divideButton");
                            if (linkProp.url != '--' || linkProp.linkedfunction != '--') {
                                e_divideCheckBox.prop("disabled", false);
                                if (linkProp.isdivide) {
                                    e_divideCheckBox.prop("checked", true);
                                } else {
                                    e_divideCheckBox.prop("checked", false);
                                    $("#e_imagelinkedUrlname").prop("disabled", true);
                                    $("#e_imagelinkedfunction").prop("disabled", true);
                                    $("#e_iconName").prop("disabled", true);
                                    $("#e_imagelinkedUrlname").val("");
                                    $("#e_imagelinkedfunction").val("");
                                    $("#e_iconName").val("");

                                }
                            } else {
                                e_divideCheckBox.prop("disabled", true);
                                $("#e_imagelinkedUrlname").prop("disabled", true);
                                $("#e_imagelinkedfunction").prop("disabled", true);
                                $("#e_iconName").prop("disabled", true);

                            }

                        }

                        $(elem).on("click", "#e_divideButton ", function() {


                            if ($(this).prop("checked")) {
                                $("#e_imagelinkedUrlname").prop("disabled", false);
                                $("#e_imagelinkedfunction").prop("disabled", false);
                                $("#e_iconName").prop("disabled", false);
                            } else {

                                $("#e_imagelinkedUrlname").prop("disabled", true);
                                $("#e_imagelinkedfunction").prop("disabled", true);
                                $("#e_iconName").prop("disabled", true);
                                $("#e_imagelinkedUrlname").val("");
                                $("#e_imagelinkedfunction").val("");
                                $("#e_iconName").val("");
                            }
                        });


                        elem.find("#menuBar a.menuLink").removeClass("activeLink");
                        $(this).addClass("activeLink");
                        elem.find("#editFieldContent").find("#Text_menuNameForEditMode").val($(this).data("menuname"));
                        elem.find("#editFieldContent").find("#authArrLongForEdit").val($(this).data("auth").split(","));
                        $("#authArrLongForEdit_chosen input").focus();
                        setTimeout(function() {
                            $("#Text_menuNameForEditMode").click();
                        }, 200);
                        //$("span.label").focus().click();

                        if (linkProp.url == "" || linkProp.url == "undefined") {
                            elem.find(".itemField #e_url").addClass("disable");
                        } else {
                            elem.find(".itemField #e_url").removeClass("disable");
                        }
                    });

                    // left menu bar link reset
                    elem.find("#menuBar").on("click", function() {
                        elem.find("#menuBar a.menuLink").removeClass("activeLink");
                        target = "";
                        elem.find("#editFieldContent").html("");
                    });

                    // get menu preview
                    elem.find("#getMenuPreview").on("click", function() {
                        fn._createPreview(settings.menuJson);
                    });

                    // get menu help
                    elem.find("#helpIconMenuDesign").on("click", function() {
                        openHelpModalWindow("contentwrapper#MenuDesign");
                    });

                    // close menu preview
                    elem.find("#closePreview").on("click", function() {
                        $(this).hide();
                        elem.find("#previewContent li").removeClass("active");
                        elem.find("#previewContent").hide();
                    });

                    // save menu json
                    elem.find("#savejson").on("click", function() {
                        fn._saveJson(fn._createJson());
                    });

                    // check add menu parent or not
                    elem.on("change", "#isParent", function() {
                        if ($(this).prop("checked") == true) {
                            elem.find("#addurlname").val('');
                            elem.find("#linkedfunction").val('');
                            elem.find("#authArrLong").val('');
                            elem.find("#addurlname").addClass("disable");
                            elem.find("#linkedfunction").addClass("disable");
                            elem.find('#authArrLong').attr('disabled', true);
                        } else {
                            elem.find("#addurlname").removeClass("disable");
                            elem.find("#linkedfunction").removeClass("disable");
                            elem.find('#authArrLong').removeAttr("disabled");
                            elem.find("#authArrLong_chosen").removeAttr("disabled");
                            elem.find("#authArrLong_chosen").removeClass("chosen-disabled");
                            elem.find("#authArrLong_chosen > ul > li > input").removeAttr("disabled");
                            elem.find("#authArrLong_chosen input").val("");
                        }
                    });

                    // edit field
                    elem.on("click", ".itemField #saveField", function() {
                       if (fn._checkDuplicate(elem.find("#Text_menuNameForEditMode").val(),'edit')){
                            new PNotify({
                                title: 'Error',
                                text: 'Label already exists',
                                type: 'error',
                                opacity: .8
                            }); 
                        }
                        else {
                            if (elem.find(".itemField #name").val() == "") {
                                new PNotify({
                                    title: 'Error',
                                    text: 'Please enter name',
                                    type: 'error',
                                    opacity: .8
                                });
                            } else {
                                if ((target.closest("li").find("li").length > 0) || (target.data("parent") == "--")) {
                                    fn._saveField();
                                } else {
                                    if (elem.find(".itemField #e_url").val() == "") {
                                        new PNotify({
                                            title: 'Error',
                                            text: 'Please enter url',
                                            type: 'error',
                                            opacity: .8
                                        });
                                    } else {
                                        var isDividedCheck = $("#e_divideButton").prop("checked");
                                        if (isDividedCheck) {
                                            if ((elem.find("#e_imagelinkedUrlname").val() != '' && elem.find("#e_imagelinkedUrlname").val() != '--') || (elem.find("#e_imagelinkedfunction").val() != '' && elem.find("#e_imagelinkedfunction").val() != '--')) {
                                                if (elem.find("#e_iconName").val() != '') {
                                                    fn._saveField();
                                                } else {
                                                    elem.find("#e_iconName").focus();
                                                    new PNotify({
                                                        title: 'Error',
                                                        text: 'Please enter Icon Display Name',
                                                        type: 'error',
                                                        opacity: .8
                                                    });
                                                }
                                            } else {
                                                elem.find("#e_imagelinkedUrlname").focus();
                                                new PNotify({
                                                    title: 'Error',
                                                    text: 'Please enter either Image Function or Image URL',
                                                    type: 'error',
                                                    opacity: .8
                                                });
                                            }

                                        } else {
                                            fn._saveField();

                                        }
                                    }
                                }
                            }
                        }
                    });

                    // delete sub menu
                    elem.on("click", "#menuBar a.delLink", function(e) {

                        var del_auth = true;
                        if ($(this).closest("li").find("li").length > 0) {
                            del_auth = false;
                        }
                        if (del_auth) {
                            fn._itemDel($(this));
                        } else {
                            new PNotify({
                                title: 'Error',
                                text: 'Please delete child first',
                                type: 'error',
                                opacity: .8
                            });
                        }
                    });

                },
                _initStructure: function() {
                    elem.css({
                        "height": window.innerHeight - elem.offset().top
                    });
                    elem.find("#editFieldContent").css({
                        "height": window.innerHeight - (elem.offset().top + 66)
                    });

                },
                _Itemadd: function(value) {
                    if (value.auth.length > 1) {
                        value.auth = value.auth.join(",");
                    }

                    if (value.menulevel == 1) {
                        value.menulevel = "ONE";
                    } else if (value.menulevel == 2) {
                        value.menulevel = "TWO";
                    } else if (value.menulevel == 3) {
                        value.menulevel = "THREE";
                    }

                    if (value.name) {
                        var item = "<li><a data-sysdefined='" + false + "' data-function='" + value.linkfun + "' data-menuname='" + value.name + "' data-menuorder='" + value.menuorder + "' data-menulevel='" + value.menulevel + "' data-menucode='" + value.setMenuCode + "' data-url='" + value.url + "' data-sysdefined='false' data-shortcut='" + value.shortcut + "' data-tooltip='" + value.tooltip + "' data-auth='" + value.auth + "' data-parentnum='" + value.parentnum + "' data-parent='" + value.parentName + "' data-imagelinkedfunction='" + value.imagelinkedfunction + "' data-imagelinkedurl='" + value.imagelinkedurl + "' data-isdivide='" + value.isdivide + "' data-iconname='" + value.iconname + "' href='javascript:void(0);' title='" + value.name + "' class='menuLink'>" + value.name + "</a><a href='javascript:void(0);' class='delLink'><i class='glyphicon glyphicon-trash'></i></a></li>"
                        if (target) {
                            var fl = target.closest("ul").data("fl");
                            if (settings.fieldLevel > fl) {
                                var newFL = parseInt(fl) + 1;
                                l_m = target.closest("li").children(".subMenu").children("li").length;
                                if (eval("settings.m" + newFL) > l_m) {
                                    if (target.closest("li").children(".subMenu").length > 0) {
                                        target.closest("li").children(".subMenu").append(item);
                                    } else {
                                        target.closest("li").append("<ul class='subMenu' data-fl='" + newFL + "'>" + item + "</ul>");
                                    }
                                } else {
                                    new PNotify({
                                        title: 'Error',
                                        text: 'Maximum level 2 length is ' + eval("settings.m" + newFL),
                                        type: 'error',
                                        opacity: .8
                                    });
                                }
                            } else {
                                new PNotify({
                                    title: 'Error',
                                    text: 'Maximum field level length is ' + settings.fieldLevel,
                                    type: 'error',
                                    opacity: .8
                                });
                            }
                        } else {
                            l_m = elem.find("#menuBar > li").length;
                            if (settings.m1 > l_m) {
                                elem.find("#menuBar").append(item);
                                new PNotify({
                                    title: 'Success',
                                    text: value.name + ' add successfully',
                                    type: 'success',
                                    opacity: .8
                                });
                            } else {
                                new PNotify({
                                    title: 'Error',
                                    text: 'Maximum root level length is ' + settings.m1,
                                    type: 'error',
                                    opacity: .8
                                });
                            }
                        }
                    } else {
                        new PNotify({
                            title: 'Error',
                            text: 'Please insert menu name',
                            type: 'error',
                            opacity: .8
                        });
                    }


                    setTimeout(function() {
                        elem.find("#menuAddModel").remove();
                    }, 100)
                    fn._createJson();

                },
                _saveField: function() {

                    if (target.data("sysdefined") == true) {
                        var editLink = {};
                        editLink.name = elem.find(".itemField #Text_menuNameForEditMode").val();
                        if (editLink.name == "" || editLink.name == undefined) {
                            $("#content_menuNameForEditMode").addClass("error");
                            new PNotify({
                                title: 'Error',
                                text: 'Menu edit name cannot be empty.',
                                type: 'error',
                                opacity: .8
                            });
                            return;
                        } else {
                            $("#content_menuNameForEditMode").removeClass("error");
                        }
                        elem.find("#menuBar a.activeLink").data("menuname", editLink.name);
                        elem.find("#menuBar a.activeLink").closest("li").children("ul.subMenu").each(function() {
                            $(this).children("li").children(".menuLink").data("parent", editLink.name);
                        });
                        editLink.isdivide = elem.find(".itemField #e_divideButton").prop("checked");
                        editLink.imagelinkedurl = elem.find(".itemField #e_imagelinkedUrlname").val();
                        editLink.imagelinkedfunction = elem.find(".itemField #e_imagelinkedfunction").val();
                        editLink.iconname = elem.find(".itemField #e_iconName").val();
                        elem.find("#menuBar a.activeLink").data("imagelinkedurl", editLink.imagelinkedurl);
                        elem.find("#menuBar a.activeLink").data("imagelinkedfunction", editLink.imagelinkedfunction);
                        elem.find("#menuBar a.activeLink").data("isdivide", editLink.isdivide);
                        elem.find("#menuBar a.activeLink").data("iconname", editLink.iconname);

                        new PNotify({
                            title: 'Success',
                            text: 'Menu link updated successfully.',
                            type: 'success',
                            opacity: .8
                        });
                        fn._createJson();
                        setTimeout(function() {
                            elem.find(".notification").remove();
                        }, 1000)
                    } else if (target.data("sysdefined") == false) {
                        var editLink = {};
                        editLink.name = elem.find(".itemField #Text_menuNameForEditMode").val();
                        if (editLink.name == "" || editLink.name == undefined) {
                            $("#content_menuNameForEditMode").addClass("error");
                            new PNotify({
                                title: 'Error',
                                text: 'Menu edit name cannot be empty.',
                                type: 'error',
                                opacity: .8
                            });
                            return;
                        } else {
                            $("#content_menuNameForEditMode").removeClass("error");
                        }
                        editLink.tooltip = elem.find(".itemField #e_tooltip").val();
                        editLink.shortcut = elem.find(".itemField #e_shorcut").val();
                        editLink.url = elem.find(".itemField #e_url").val();
                        editLink.auth = elem.find(".itemField #authArrLongForEdit").val().toString();
                        editLink.linkedfunction = elem.find(".itemField #e_linkedfunction").val();
                        elem.find("#menuBar a.activeLink").closest("li").children("ul.subMenu").each(function() {
                            $(this).children("li").children(".menuLink").data("parent", editLink.name);
                        });
                        editLink.isdivide = elem.find(".itemField #e_divideButton").prop("checked");
                        editLink.imagelinkedurl = elem.find(".itemField #e_imagelinkedUrlname").val();
                        editLink.imagelinkedfunction = elem.find(".itemField #e_imagelinkedfunction").val();
                        editLink.iconname = elem.find(".itemField #e_iconName").val();
                        //elem.find("#menuBar a.activeLink").text(editLink.name);
                        elem.find("#menuBar a.activeLink").data("menuname", editLink.name);
                        elem.find("#menuBar a.activeLink").data("tooltip", editLink.tooltip);
                        elem.find("#menuBar a.activeLink").data("shortcut", editLink.shortcut);
                        elem.find("#menuBar a.activeLink").data("url", editLink.url);
                        elem.find("#menuBar a.activeLink").data("auth", editLink.auth);
                        elem.find("#menuBar a.activeLink").data("function", editLink.linkedfunction);
                        elem.find("#menuBar a.activeLink").data("imagelinkedurl", editLink.imagelinkedurl);
                        elem.find("#menuBar a.activeLink").data("imagelinkedfunction", editLink.imagelinkedfunction);
                        elem.find("#menuBar a.activeLink").data("isdivide", editLink.isdivide);
                        elem.find("#menuBar a.activeLink").data("iconname", editLink.iconname);
                        new PNotify({
                            title: 'Success',
                            text: 'Menu link update successfully.',
                            type: 'success',
                            opacity: .8
                        });
                        fn._createJson();
                        setTimeout(function() {
                            elem.find(".notification").remove();
                        }, 1000)
                    }
                },
                _itemDel: function(i) {

                    if ($(i).parent("li").find("a.menuLink").attr("data-id") != undefined) {
                        if (i.closest("ul.subMenu").find("li").length == 1) {
                            i.closest("ul.subMenu").remove();
                        } else {
                            i.closest("li").remove();
                        }
                        var id = $(i).parent("li").find("a.menuLink").data("id");
                        $.ajax({
                            type: 'GET',
                            url: getContextPath() + '/app/menuController/deleteMenu',
                            data: {
                                "id": id
                            },
                            success: function(data) {
                                new PNotify({
                                    title: 'Success',
                                    text: 'Remove menu item successfully.',
                                    type: 'success',
                                    opacity: .8
                                });
                            },
                            error: function(e) {


                            }
                        });
                    } else {
                        if (i.closest("ul.subMenu").find("li").length == 1) {
                            i.closest("ul.subMenu").remove();
                        } else {
                            i.closest("li").remove();
                        }
                    }
                    fn._setMenuOrder();


                    fn._createJson();
                    setTimeout(function() {
                        elem.find(".notification").remove();
                    }, 1000)
                },
                _createJson: function() {
                    settings.menuJson = {};
                    var list = elem.find("#menuBar > li").map(function() {
                        return $(this);
                    }).get();
                    settings.menuJson["subLevel"] = [];
                    for (var i = 0; i < list.length; i++) {
                        settings.menuJson["subLevel"].push({});
                        fn._addJson(settings.menuJson["subLevel"][i], list[i]);
                    }
                    return settings.menuJson;
                },
                _addJson: function(json, elem) {
                    var list = elem.children("ul.subMenu").children("li").map(function() {
                        return $(this);
                    }).get();

                    if (list.length > 0) {
                        json["subLevel"] = [];
                    }

                    for (var i = 0; i < list.length; i++) {
                        json["subLevel"].push({});
                        fn._addJson(json["subLevel"][i], list[i]);
                    }

                    json["menuName"] = elem.children(".menuLink").data("menuname");
                    json["menuDisplayName"] = elem.children(".menuLink").text();

                    if (elem.children(".menuLink").data("url") != undefined && elem.children(".menuLink").data("url") != "undefined" && elem.children(".menuLink").data("url") != null && elem.children(".menuLink").data("url") != "" && elem.children(".menuLink").data("url") != "--") {
                        json["url"] = elem.children(".menuLink").data("url");
                    }
                    if (elem.children(".menuLink").data("sysdefined") != undefined && elem.children(".menuLink").data("sysdefined") != "undefined" && elem.children(".menuLink").data("sysdefined") != null && elem.children(".menuLink").data("sysdefined") != "--") {
                        json["systemDefined"] = elem.children(".menuLink").data("sysdefined");
                    }
                    if (elem.children(".menuLink").data("parent") != undefined && elem.children(".menuLink").data("parent") != "undefined" && elem.children(".menuLink").data("parent") != null && elem.children(".menuLink").data("parent") != "" && elem.children(".menuLink").data("parent") != "--") {
                        json["parentName"] = elem.children(".menuLink").data("parent");
                    }
                    if (elem.children(".menuLink").data("shortcut") != undefined && elem.children(".menuLink").data("shortcut") != "undefined" && elem.children(".menuLink").data("shortcut") != null && elem.children(".menuLink").data("shortcut") != "" && elem.children(".menuLink").data("shortcut") != "--") {
                        json["shortcut"] = elem.children(".menuLink").data("shortcut");
                    }
                    if (elem.children(".menuLink").data("tooltip") != undefined && elem.children(".menuLink").data("tooltip") != "undefined" && elem.children(".menuLink").data("tooltip") != null && elem.children(".menuLink").data("tooltip") != "" && elem.children(".menuLink").data("tooltip") != "--") {
                        json["toolTip"] = elem.children(".menuLink").data("tooltip");
                    }
                    if (elem.children(".menuLink").data("auth") != undefined && elem.children(".menuLink").data("auth") != "undefined" && elem.children(".menuLink").data("auth") != null && elem.children(".menuLink").data("auth") != "" && elem.children(".menuLink").data("auth") != "--") {
                        json["auth"] = elem.children(".menuLink").data("auth");
                    }
                    if (elem.children(".menuLink").data("id") != undefined && elem.children(".menuLink").data("id") != "undefined" && elem.children(".menuLink").data("id") != null && elem.children(".menuLink").data("id") != "" && elem.children(".menuLink").data("id") != "--") {
                        json["id"] = elem.children(".menuLink").data("id");
                    }
                    if (elem.children(".menuLink").data("parentnum") != undefined && elem.children(".menuLink").data("parentnum") != "undefined" && elem.children(".menuLink").data("parentnum") != null && elem.children(".menuLink").data("parentnum") != "" && elem.children(".menuLink").data("parentnum") != "--") {
                        json["parent"] = elem.children(".menuLink").data("parentnum");
                    }
                    if (elem.children(".menuLink").data("menulevel") != undefined && elem.children(".menuLink").data("menulevel") != "undefined" && elem.children(".menuLink").data("menulevel") != null && elem.children(".menuLink").data("menulevel") != "" && elem.children(".menuLink").data("menulevel") != "--") {
                        json["menuLevel"] = elem.children(".menuLink").data("menulevel");
                    }
                    if (elem.children(".menuLink").data("menuorder") != undefined && elem.children(".menuLink").data("menuorder") != "undefined" && elem.children(".menuLink").data("menuorder") != null && elem.children(".menuLink").data("menuorder") != "" && elem.children(".menuLink").data("menuorder") != "--") {
                        json["menuOrder"] = elem.children(".menuLink").data("menuorder");
                    }
                    if (elem.children(".menuLink").data("menucode") != undefined && elem.children(".menuLink").data("menucode") != "undefined" && elem.children(".menuLink").data("menucode") != null && elem.children(".menuLink").data("menucode") != "" && elem.children(".menuLink").data("menucode") != "--") {
                        json["menuCode"] = elem.children(".menuLink").data("menucode");
                    }
                    if (elem.children(".menuLink").data("function") != undefined && elem.children(".menuLink").data("function") != "undefined" && elem.children(".menuLink").data("function") != null && elem.children(".menuLink").data("function") != "" && elem.children(".menuLink").data("function") != "--") {
                        json["linkedFunction"] = elem.children(".menuLink").data("function");
                    }
                    if (elem.children(".menuLink").data("imagelinkedurl") != undefined && elem.children(".menuLink").data("imagelinkedurl") != "undefined" && elem.children(".menuLink").data("imagelinkedurl") != null && elem.children(".menuLink").data("imagelinkedurl") != "" && elem.children(".menuLink").data("imagelinkedurl") != "--") {
                        json["imageLinkedUrl"] = elem.children(".menuLink").data("imagelinkedurl");
                    }
                    if (elem.children(".menuLink").data("imagelinkedfunction") != undefined && elem.children(".menuLink").data("imagelinkedfunction") != "undefined" && elem.children(".menuLink").data("imagelinkedfunction") != null && elem.children(".menuLink").data("imagelinkedfunction") != "" && elem.children(".menuLink").data("imagelinkedfunction") != "--") {
                        json["imageLinkedFunction"] = elem.children(".menuLink").data("imagelinkedfunction");
                    }
                    if (elem.children(".menuLink").data("iconname") != undefined && elem.children(".menuLink").data("iconname") != "undefined" && elem.children(".menuLink").data("iconname") != null && elem.children(".menuLink").data("iconname") != "" && elem.children(".menuLink").data("iconname") != "--") {
                        json["iconClassName"] = elem.children(".menuLink").data("iconname");
                    }
                    if (elem.children(".menuLink").data("isdivide") != undefined && elem.children(".menuLink").data("isdivide") != "undefined" && elem.children(".menuLink").data("isdivide") != null && elem.children(".menuLink").data("isdivide") != "" && elem.children(".menuLink").data("isdivide") != "--") {
                        json["divided"] = elem.children(".menuLink").data("isdivide");
                    }
                    if (elem.children(".menuLink").data("elementid") != undefined && elem.children(".menuLink").data("elementid") != "undefined" && elem.children(".menuLink").data("elementid") != null && elem.children(".menuLink").data("elementid") != "" && elem.children(".menuLink").data("elementid") != "--") {
                        json["elementId"] = elem.children(".menuLink").data("elementid");
                    }
                    if (elem.children(".menuLink").data("dividedbtnid") != undefined && elem.children(".menuLink").data("dividedbtnid") != "undefined" && elem.children(".menuLink").data("dividedbtnid") != null && elem.children(".menuLink").data("dividedbtnid") != "" && elem.children(".menuLink").data("dividedbtnid") != "--") {
                        json["dividedBtnId"] = elem.children(".menuLink").data("dividedbtnid");
                    }


                },
                _createPreview: function(json) {
                    var html = fn._addPreview(json);
                    if (settings.menuType === 'V_M') {
                        elem.find("#previewContent").addClass('Mobile_verticle');
                        elem.on("click", "#previewContent ul a", function(e) {
                            $(this).closest("ul").find("li").removeClass("active");
                            $(this).closest("li").addClass("active");
                        });
                    } else if (settings.menuType === 'V') {
                        elem.find("#previewContent").addClass('verticle');
                        elem.on("mouseover", "#previewContent ul a", function(e) {
                            $(this).closest("ul").find("li").removeClass("active");
                            $(this).closest("li").addClass("active");
                        });

                        elem.on("mouseover", "#previewContent ul", function(e) {
                            e.stopPropagation();
                        });

                        $("body").on("mouseover", function(e) {
                            elem.find("#previewContent ul li").removeClass("active");
                        });
                    } else {
                        html += "<a href='javascript:void(0);' class='closemenuhover' style='display:none;' id='closemenuhover'><i class='glyphicon glyphicon-remove'></i></a>";
                        var menuHoverevent = true;
                        elem.on("mouseover", "#previewContent ul a", function(e) {
                            if (menuHoverevent) {
                                $(this).closest("ul").find("li").removeClass("active");
                                $(this).closest("li").addClass("active");
                                elem.find("#closemenuhover").show();
                            }
                        });
                        elem.on("click", "#previewContent ul li a", function() {
                            if ($(this).hasClass("clicked")) {
                                menuHoverevent = true;
                                $(this).removeClass("clicked");
                            } else {
                                menuHoverevent = false;
                                $(this).addClass("clicked");
                            }
                            $(this).closest("ul").find("li").removeClass("active");
                            $(this).closest("li").addClass("active");
                        });

                        elem.on("click", "#closemenuhover", function() {
                            elem.find("#previewContent ul li").removeClass("active");
                            elem.find("#closemenuhover").hide();
                        });
                        elem.on("keydown", function(e) {
                            var code = e.keyCode || e.which;
                            if (code == 27) {
                                elem.find("#closemenuhover").click();
                            }
                        });

                    }

                    elem.find("#previewContent").html(html).show();
                    elem.find("#closePreview").show();
                },
                _addPreview: function(json) {
                    var menuHtml = "<ul class='clearfix'>";
                    for (var i = 0; i < json.subLevel.length; i++) {
                        if (json.subLevel[i]["subLevel"]) {
                            if (json.subLevel[i].divided) {
                                menuHtml += "<li><div class='row'><div class='col-md-10'><a href='javascript:void(0);' onclick='javascript:void(00);'>" + json.subLevel[i].menuDisplayName +
                                    "</a></div><div class='col-md-2'><a href='javascript:void(0);' onclick='javascript:void(0);'><i class='glyphicon " +
                                    json.subLevel[i].iconClassName + " imageLinked'></i></a></div></div>";
                            } else {

                                menuHtml += "<li class='submenu'><a href='javascript:void(0);'>" + json.subLevel[i].menuDisplayName + "</a>";
                            }
                        } else {
                            if (json.subLevel[i].divided) {
                                menuHtml += "<li><div class='row'><div class='col-md-10'><a href='javascript:void(0);' onclick='javascript:void(0);'>" + json.subLevel[i].menuDisplayName +
                                    "</a></div><div class='col-md-2'><a href='javascript:void(0);' onclick='javascript:void(0);'><i class='glyphicon " +
                                    json.subLevel[i].iconClassName + " imageLinked'></i></a></div></div>";
                            } else {

                                menuHtml += "<li><a href='javascript:void(0);'>" + json.subLevel[i].menuDisplayName + "</a>";
                            }
                        }
                        if (json.subLevel[i]["subLevel"]) {
                            menuHtml += fn._addPreview(json.subLevel[i]);
                        }
                        menuHtml += "</li>"
                    }
                    menuHtml += "</ul>";
                    return menuHtml;
                },
                _saveJson: function(json) {
                    jsonVal = encodeURIComponent(JSON.stringify(json));
                    //jsonVal = "abc";

                    $.ajax({
                        type: 'POST',
                        url: getContextPath() + '/app/menuController/saveMenu',
                        data: {
                            "jsonString": jsonVal
                        },
                        async: false,
                        success: function(data) {
                            $('#savejson').css('pointer-events', "none");
                            new PNotify({
                                title: 'Success',
                                text: 'Saved successfully.',
                                type: 'success',
                                opacity: .8
                            });
                        },
                        error: function(e) {
                            $.sticky("Some Error Occured", {
                                position: "top-right",
                                type: "st-failure"
                            });
                        }
                    }).done(function() {
                        setTimeout(function() {
                            location.reload(true);
                        }, 2000);
                    });
                },
                _setMenuOrder: function() {
                    elem.find(".menuLink").each(function() {
                        var thisOrder = $(this).closest("li").index() + 1;
                        var thisLevel = $(this).closest("li").parents('ul').length;
                        var thisParent = $(this).closest("ul").closest("li").children(".menuLink").data("menucode");
                        var thisParentName = $(this).closest("ul").closest("li").children(".menuLink").text();

                        if (thisLevel == 1) {
                            thisLevel = "ONE";
                        } else if (thisLevel == 2) {
                            thisLevel = "TWO";
                        } else if (thisLevel == 3) {
                            thisLevel = "THREE";
                        }

                        $(this).data("menuorder", thisOrder);
                        $(this).data("menulevel", thisLevel);
                        $(this).data("parentnum", thisParent);
                        $(this).data("parent", thisParentName)
                    });
                    fn._createJson();
                },
                _checkDuplicate :function(value,mode){
                    if(mode == 'add'){
                        if(target){
                            var checking = $(target).closest("li").children(".subMenu").children("li").map(function(a,b){
                                return b;
                            }).get();
                            return checking.some(function(a,b){
                                return ($(a).find("a.menuLink").data("menuname") == value);
                            });
                        }
                        else{
                            var checking = elem.find("#leftMenuContent").children("#menuBar").children("li").map(function(a,b){
                                return b;
                            }).get();
                            return checking.some(function(a,b){
                                return ($(a).find("a.menuLink").data("menuname") == value);
                            });
                        }
                    }
                    if(mode == 'edit'){
                        var checking = $(target).closest("ul").children("li").map(function(a,b){
                            return b;
                        }).get();
                        var count=0;
                        for(var i=0;i<checking.length;i++){
                            if(($(checking[i]).find("a.menuLink").attr("title") == value) || ($(checking[i]).find("a.menuLink").data("menuname") == value)){
                                count++;       
                            }
                        }
                        return count > 1;
                    }
                    return false;
                }
            };
            fn.init();
        });
    };
}(jQuery));