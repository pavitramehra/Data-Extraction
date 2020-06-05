jQuery(function () {
    handle_side_menu();
    general_things();
    widget_boxes()
});

function handle_side_menu() {
    $("#menu-toggler").on(neutrino.click_event, function () {
        $("#sidebar").toggleClass("display");
        $(this).toggleClass("display");
        return false
    });
    var b = $("#sidebar").hasClass("menu-min");
    $("#sidebar-collapse").on(neutrino.click_event, function () {
        $("#sidebar").toggleClass("menu-min");
        $("#sidebar-collapse i").toggleClass("glyphicon glyphicon-forward glyphicon glyphicon-backward");
        b = $("#sidebar").hasClass("menu-min");
        if (b) {
            $(".open > .submenu").removeClass("open")
        }
    });
    var a = "ontouchend" in document;
    $(".nav-list").on(neutrino.click_event, function (g) {
        var f = $(g.target).closest("a");
        if (!f || f.length == 0) {
            return
        }
        if (!f.hasClass("dropdown-toggle")) {
            if (b && neutrino.click_event == "tap" && f.get(0).parentNode.parentNode == this) {
                var h = f.find(".menu-text").get(0);
                if (g.target != h && !$.contains(h, g.target)) {
                    return false
                }
            }
            return
        }
       
        var d = f.next().get(0);
        if (!$(d).is(":visible")) {
            var c = $(d.parentNode).closest("ul");
            if (b && c.hasClass("nav-list")) {
                return
            }
            /*c.find("> .open .active > .submenu").each(function () {
            	alert("no use")
                if (this != d && !$(this.parentNode).hasClass("actve")) {
                    $(this).slideUp(200).parent().removeClass("open active");
                    alert("removed open from active")
                }
            })*/
        } else {} if (b && $(d.parentNode.parentNode).hasClass("nav-list")) {
            return false
        }
        $(d).slideToggle(200).parent().toggleClass("open active");
        return false
       
    })
}

function general_things() {
    $('.neutrino-nav [class*="glyphicon glyphicon-animated-"]').closest("a").on("click", function () {
        var b = $(this).find('[class*="glyphicon glyphicon-animated-"]').eq(0);
        var a = b.attr("class").match(/icon\-animated\-([\d\w]+)/);
        b.removeClass(a[0]);
        $(this).off("click")
    });
    $(".nav-list .badge[title],.nav-list .label[title]").tooltip({
        placement: "right"
    });
    $("#neutrino-settings-btn").on(neutrino.click_event, function () {
        $(this).toggleClass("open");
        $("#neutrino-settings-box").toggleClass("open")
    });
    $("#btn-scroll-up").on(neutrino.click_event, function () {
        var a = Math.max(100, parseInt($("html").scrollTop() / 3));
        $("html,body").animate({
            scrollTop: 0
        }, a);
        return false
    });
}

function widget_boxes() {
    $(".page-content").delegate(".widget-toolbar > [data-action]", "click", function (k) {
        k.preventDefault();
        var j = $(this);
        var l = j.data("action");
        var a = j.closest(".widget-box");
        if (a.hasClass("ui-sortable-helper")) {
            return
        }
        if (l == "collapse") {
            var d = a.find(".widget-body");
            var i = j.find("[class*=icon-]").eq(0);
            var e = i.attr("class").match(/icon\-(.*)\-(up|down)/);
            var b = "glyphicon glyphicon-" + e[1] + "-down";
            var f = "glyphicon glyphicon-" + e[1] + "-up";
            var h = d.find(".widget-body-inner");
            if (h.length == 0) {
                d = d.wrapInner('<div class="widget-body-inner"></div>').find(":first-child").eq(0)
            } else {
                d = h.eq(0)
            }
            var c = 300;
            var g = 200;
            if (a.hasClass("collapsed")) {
                if (i) {
                    i.addClass(f).removeClass(b)
                }
                a.removeClass("collapsed");
                d.slideUp(0, function () {
                    d.slideDown(c)
                })
            } else {
                if (i) {
                    i.addClass(b).removeClass(f)
                }
                d.slideUp(g, function () {
                    a.addClass("collapsed")
                })
            }
        } else {
            if (l == "close") {
                var n = parseInt(j.data("close-speed")) || 300;
                a.hide(n, function () {
                    a.remove()
                })
            } else {
                if (l == "reload") {
                    j.blur();
                    var m = false;
                    if (a.css("position") == "static") {
                        m = true;
                        a.addClass("position-relative")
                    }
                    a.append('<div class="widget-box-layer"><i class="glyphicon glyphicon-refresh"></i></div>');
                    setTimeout(function () {
                        a.find(".widget-box-layer").remove();
                        if (m) {
                            a.removeClass("position-relative")
                        }
                    }, parseInt(Math.random() * 1000 + 1000))
                } else {
                    if (l == "settings") {}
                }
            }
        }
    })
}
