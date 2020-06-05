jQuery(function () {
    if (!("neutrino" in window)) {
        window.neutrino = {}
    }
    window.neutrino.click_event = $.fn.tap ? "tap" : "click"
});
(function (a, b) {
    a.fn.neutrino_wizard = function (c) {
        this.each(function () {
            var h = a(this);
            var d = h.find("li");
            var e = d.length;
            var f = parseFloat((100 / e).toFixed(1)) + "%";
            d.css({
                "min-width": f,
                "max-width": f
            });
            h.show().wizard();
            var g = h.siblings(".wizard-actions").eq(0);
            var i = h.data("wizard");
            i.$prevBtn.remove();
            i.$nextBtn.remove();
            i.$prevBtn = g.find(".btn-prev").eq(0).on(neutrino.click_event, function () {
                h.wizard("previous")
            }).attr("disabled", "disabled");
            i.$nextBtn = g.find(".btn-next").eq(0).on(neutrino.click_event, function () {
                h.wizard("next")
            }).removeAttr("disabled");
            i.nextText = i.$nextBtn.text()
        });
        return this
    }
})(window.jQuery);
