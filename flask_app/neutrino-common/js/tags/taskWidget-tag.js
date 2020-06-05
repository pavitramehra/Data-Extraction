function taskWidgetTagScript(taskWidgetTagScriptInput) {
    $(document).ready(function() {

        if ($(window).width() <= 600) {
            $('.resp-card-label').removeClass('col-sm-3 resp-card-label');
            $(".crd-spacing").css({
                "float": "left",
                "width": "33%"
            });
        }
        
   $(function() {
            var id = taskWidgetTagScriptInput.id_taskWidget;
            var filterId = '#' + id + '_filterId';
            var filterableColSize = taskWidgetTagScriptInput.filterableColSize;
            for (let i = 0; i < filterableColSize; i++) {
                $(filterId + i).change(function() {
                    filter(this.id, filterableColSize, "false");

                });
            }

        });
    });
}

$(function() {
    $(".p_tasks").hide();
    $(".card-board").show();
    $(".p_listview").css("border", "2px solid");

    $(".p_thumbnail").click(function() {
        $(".card-board").hide();
        $(".p_listview").css("border", "");
        $(".p_tasks").show();
        $(this).css("border", "2px solid");



    })

    $(".p_listview").click(function() {
        $(".p_tasks").hide();
        $(".p_thumbnail").css("border", "");
        $(".card-board").show();
        $(this).css("border", "2px solid");



    })

})

function showWidget(widget) {
    if ((widget.css('display') == 'block')) {
        widget.show();
    }
}

function hideWidget(widget) {
    widget.hide();
}

function viewAll(widget) {
    $(widget).children('div').each(function() {
        $(this).show();
    });
    $(widget + "_viewAll").hide();
    $(widget + "_collapseView").show();
}

function collapseView(widget) {
    var count = 0;
    $(widget).children('div').each(function() {
        count++;
        if (count < 7) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
    $(widget + "_viewAll").show();
    $(widget + "_collapseView").hide();

}

function showAllChildren(widget) {
    var count;
    $(widget).children('div').each(function() {
        count++;
        $(this).show();
    });

    $(widget + "_viewAll").hide();
    $(widget + "_collapseView").hide();

}

function filterTAT(tat, id, filterableColSize) {
    var idCurr = id.split("_filterTAT")[0];
    var _cardBoardAIdChild2 = '#' + idCurr + '_cardBoardAIdChild2';

    filter(idCurr, filterableColSize, "true");

    $(_cardBoardAIdChild2).children('div').each(function() {
        if ($(this).find('.card-outer').hasClass('card-' + tat) || $(this).find('.panel-group').attr("class") == "accordion") {
            showWidget($(this));
        } else {
            hideWidget($(this));
        }
    });
}

function filter(idCurr, filterableColSize, filterTat) {
    var id = idCurr.split("_filterId")[0];
    var idCurr = idCurr.split("_filterId")[0] + "_filterId";
    var bool = "true";
    var _cardBoardAIdChild2 = '#' + id + '_cardBoardAIdChild2';

    for (var i = 0; i < filterableColSize; i++) {
        if ($('#' + idCurr + i + ' option:selected').text().indexOf("Select") != 0) {
            bool = "false";
        }
    }
    if (bool == "true" && filterTat != "true") {
        collapseView(_cardBoardAIdChild2);
    }
    if (bool == "true" && filterTat == "true") {
        showAllChildren(_cardBoardAIdChild2);
    }

    if (bool == "false") {
        showAllChildren(_cardBoardAIdChild2);
        $(_cardBoardAIdChild2).children('div').each(function() {

            for (var i = 0; i < filterableColSize; i++) {
                if ($('#' + idCurr + i + ' option:selected').text().indexOf("Select") == 0) {
                    showWidget($(this));
                } else {
                    if ($(this).text().toLowerCase().indexOf($('#' + idCurr + i + ' option:selected').text().toLowerCase()) < 0) {
                        hideWidget($(this));
                    } else {
                        showWidget($(this));
                    }
                }
            }

        });
    }
}

function clearfilter(id, filterableColSize) {
    var idCurr = id.split("_clearfilterId")[0];
    var _cardBoardAIdChild2 = '#' + idCurr + '_cardBoardAIdChild2';
    var filterId = '#' + idCurr + '_filterId';

    for (var i = 0; i < filterableColSize; i++) {
        var filterIdOptions = filterId + i + ' option';
        $(filterIdOptions)[0].selected = true;
        updateChosenFilter(filterId + i);
    }

    collapseView(_cardBoardAIdChild2);

}

function updateChosenFilter(dd) {
    $(dd).trigger("chosen:updated");
}

function sortSelectTagContent() {
    $('select.sortDataInSelect').each(function(index) {
        var appCountSelectID = "#" + $(this).attr("id");
        var options = $(appCountSelectID + ' option');

        var arr = options.map(function(_, o) {
            return {
                t: $(o).text(),
                v: o.value
            };
        }).get();
        arr.sort(function(o1, o2) {
            return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
        });
        options.each(function(i, o) {
            //console.log(i);
            o.value = arr[i].v;
            $(o).text(arr[i].t);
        });
        $(appCountSelectID).prepend($("<option></option>").val('Select').text('Select'));
        $(appCountSelectID).val('Select');
        $(appCountSelectID).trigger("chosen:updated");
    });
}