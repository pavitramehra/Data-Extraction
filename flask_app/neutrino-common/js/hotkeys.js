/*********************************************** Hotkeys/Shortcuts **************************************************/
// Object containing mapping of shortcut keys and nav menu IDs

var activeMenu;
var activeMenuIndex = 0;
var activeMenuAllLi = [];
var linkIndex = 0;
var lastLinkIndex = 0;
var anchorIndex = 0;
var HotKeyType = Object.freeze({
	"ACTION": 0,
	"NAVIGATION": 1,
	"HIDDEN_ACTION": 3
});

function isReallyVisible(elementSelector) {
	if ($("body").hasClass("modal-open")) {
		var allOpenModals = $(".modal.in");
		if ($(allOpenModals[allOpenModals.length - 1]).find($(elementSelector)).length == 0) {
			return false;
		} else {
			if ($(allOpenModals[allOpenModals.length - 1]).find(elementSelector).is(":hidden") || $(allOpenModals[allOpenModals.length - 1]).find(elementSelector).parents(":hidden").length != 0) {

				return false;
			} else {
				return true;
			}
		}
	} else {
		if ($(elementSelector).length==0 || $(elementSelector).is(":hidden") || $(elementSelector).parents(":hidden").length != 0) {
			return false;
		} else {
			return true;
		}
	}
};

function getShortcutMapping(type) {
	var shortcutMapping;

	if (localStorage[getContextPath() + "/app/gethotkeys" + "type=" + type]) {
		var cachingTimeStamp1 = JSON.parse(localStorage[getContextPath() + "/app/gethotkeys" + "type=" + type]).timestamp;
		var currentTimeStamp1 = new Date().getTime();

		if (timeDiff(currentTimeStamp1, cachingTimeStamp1) > 30) {
			shortcutMapping = getShortcutMappingFromServer(type);
		} else {
			shortcutMapping = JSON.parse(localStorage[getContextPath() + "/app/gethotkeys" + "type=" + type]).response;
		}
	} else {
		shortcutMapping = getShortcutMappingFromServer(type);
	}
	return shortcutMapping;
}

function getShortcutMappingFromServer(type) {
	var resultData;
	$.ajax({
		async: false,
		url: getContextPath() + "/app/gethotkeys",
		data: "type=" + type,
		success: function (response) {
			resultData = response;
			if (localStorage) {
				var responseObject = {
					response: response,
					timestamp: new Date().getTime()
				};
				localStorage.setItem(getContextPath() + "/app/gethotkeys" + "type=" + type, JSON.stringify(responseObject));
			}
		}
	});
	return resultData;
}

var globalActionsShortcutMapping = getShortcutMapping(HotKeyType.ACTION);
var shortcutMenuMapping = getShortcutMapping(HotKeyType.NAVIGATION);
var hiddenActionsShortcutMapping = getShortcutMapping(HotKeyType.HIDDEN_ACTION);

if (shortcutMenuMapping.length == 0 && globalActionsShortcutMapping.length == 0 && hiddenActionsShortcutMapping.length == 0) {
	$("#showConfiguredShortcuts").css("display", "none");
} else {
	$("#shortCutSwitch").css("display", "none");
	$("#shortCutListModalBtn").css("display", "none");
}

function showListOfShortCuts() {
	if (globalActionsShortcutMapping.length != 0) {
		var html = "";
		globalActionsShortcutMapping.forEach(function (item) {
			html += "<div class='col-sm-12'><span class='keys btn btn-inverse disabled'>" + item.shortCutKey + "</span><span>" + item.description + "</span></div>"
		});
		$("#globalActionHotkeysList").html(html);
	}
	if (shortcutMenuMapping.length != 0) {
		var html1 = "";
		shortcutMenuMapping.forEach(function (item) {
			html1 += "<div class='col-sm-12'><span class='keys btn btn-inverse disabled'>" + item.shortCutKey + "</span><span>" + item.description + "</span></div>"
		});
		$("#menuHotkeysList").html(html1);
	}
	if (hiddenActionsShortcutMapping.length != 0) {
		var html1 = "";
		hiddenActionsShortcutMapping.forEach(function (item) {
			html1 += "<div class='col-sm-12'><span class='keys btn btn-inverse disabled'>" + item.shortCutKey + "</span><span>" + item.description + "</span></div>"
		});
		$("#hiddenActionHotkeysList").html(html1);
	}
}
showListOfShortCuts();
// Enable disable Hotkeys/Shortcuts
