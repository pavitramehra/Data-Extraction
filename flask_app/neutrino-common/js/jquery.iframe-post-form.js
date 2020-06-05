(function(a){a.fn.iframePostForm=function(e){var d,b,f,c=true,g;
e=a.extend({},a.fn.iframePostForm.defaults,e);
if(!a("#"+e.iframeID).length){a("body").append('<iframe id="'+e.iframeID+'" name="'+e.iframeID+'" style="display:none" />')
}return a(this).each(function(){f=a(this);
f.attr("target",e.iframeID);
f.submit(function(){c=e.post.apply(this);
if(c===false){return c
}g=a("#"+e.iframeID).on('load',function(){d=g.contents().find("body");
b=d.html();
e.complete.apply(this,[d]);
g.unbind("load");
setTimeout(function(){d.html("")
},1)
})
})
})
};
a.fn.iframePostForm.defaults={iframeID:"iframe-post-form",json:false,post:function(){},complete:function(b){}}
})($);