var urlsArray;
function checkAvailableHelp(a){var c="";
for(var b=0;
b<urlsArray.length;
b++){if(urlsArray[b][0]==a){c=urlsArray[b][1];
break
}}return c
}function mergePageHelpArrayGlobally(a){if(typeof urlsArray===undefined){urlsArray=new Array()
}else{if(urlsArray==null){urlsArray=new Array()
}}for(var b=0;
b<a.length;
b++){urlsArray[urlsArray.length]=new Array();
urlsArray[urlsArray.length-1][0]=a[b][0];
urlsArray[urlsArray.length-1][1]=a[b][1]
}};