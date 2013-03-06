/* demo */
$.event.add(window, "load", function() {
    //selector
    //#id
    $("#block1Btn1").bind("click", function() {
        alert($("#block1"));
    });
    $("#block1Btn2").bind("click", function() {
        alert($("#block1")[0]);
    });

    //#.className
    $("#block2Btn1").bind("click", function() {
        alert($(".block2"));
    });
    $("#block2Btn2").bind("click", function() {
        alert($(".block2")[0]);
    });

    //tagName.className
    $("#block3Btn1").bind("click", function() {
        alert($("li.block3"));
    });
    $("#block3Btn2").bind("click", function() {
        alert($("li.block3")[0]);
    });

    //@name
    $("#block4Btn1").bind("click", function() {
        alert($("@block4"));
    });
    $("#block4Btn2").bind("click", function() {
        alert($("@block4")[0]);
    });

    //node
    $("#block5Btn1").bind("click", function() {
        alert($($("#block1")[0]));
    });
    $("#block5Btn2").bind("click", function() {
        alert($($("#block1")[0])[0]);
    });
     $("#block5Btn3").bind("click", function() {
        alert($($(".block2")[0]));
    });
    $("#block5Btn4").bind("click", function() {
        alert($($(".block2")[0])[0]);
    });

    
    //dom
    //hasClass
    $("#block6Btn1").bind("click", function() {
        alert($("#block6").hasClass("block6"));
    });
    $("#block7Btn1").bind("click", function() {
        alert($("li.block7").hasClass("block7"));
    });

    //addClass
    $("#block8Btn1").bind("click", function() {
        alert($("#block8").addClass("current"));
    });
    $("#block8Btn2").bind("click", function() {
        alert($("li.block8").addClass("current"));
    });
    $("#block9Btn1").bind("click", function() {
        alert($("#block9").addClass("current current2"));
    });

    //removeClass
    $("#block10Btn1").bind("click", function() {
        alert($("#block10").removeClass("current"));
    });
    $("#block10Btn2").bind("click", function() {
        alert($("li.block10").removeClass("current"));
    });
    $("#block11Btn1").bind("click", function() {
        alert($("#block11").removeClass());
    });

    //css
    $("#block12Btn1").bind("click", function() {
        alert($("#block12").css("width"));
    });
    $("#block13Btn1").bind("click", function() {
        alert($("#block13").css({backgroundColor: "#000", color: "red", height: "100px"}));
    });
    $("#block14Btn1").bind("click", function() {
        alert($("li.block14").css("backgroundColor", "#ccc"));
    });

    //html
    $("#block15Btn1").bind("click", function() {
        alert($("#block15").html());
    });
    $("#block16Btn1").bind("click", function() {
        alert($("#block16").html("<span>嘿嘿！</span>"));
    });

    //remove
    $("#block17Btn1").bind("click", function() {
        alert($("#block17").remove());
    });
    $("#block18Btn1").bind("click", function() {
        alert($("li.block18").remove());
    });

    //offset
    $("#block19Btn1").bind("click", function() {
        var offset = $("#block19").offset();
        alert("left:" + offset.left + "\nright:" + offset.right + "\ntop:" + offset.top + "\nbottom:" + offset.bottom);
    });

    //position
    $("#block20Btn1").bind("click", function() {
        var position = $("#block20").position();
        alert("left:" + position.left + "\nright:" + position.right + "\ntop:" + position.top + "\nbottom:" + position.bottom);
    });

    //height
    $("#block21Btn1").bind("click", function() {
        alert($(document).height());
    });
    $("#block21Btn2").bind("click", function() {
        alert($("#block21").height());
    });
    $("#block21Btn3").bind("click", function() {
        alert($(window).height());
    });

    //width
    $("#block22Btn1").bind("click", function() {
        alert($(document).width());
    });
    $("#block22Btn2").bind("click", function() {
        alert($("#block22").width());
    });
    $("#block22Btn3").bind("click", function() {
        alert($(window).width());
    });

    //hide
    $("#block23Btn1").bind("click", function() {
        alert($("#block23").hide());
    });
    $("#block23Btn2").bind("click", function() {
        alert($("li.block23").hide());
    });

    //show
    $("#block24Btn1").bind("click", function() {
        alert($("#block24").show());
    });
    $("#block24Btn2").bind("click", function() {
        alert($("li.block24").show());
    });


    //event
    //bind
    $("#block25").bind("mouseover", function() {
        alert("hello world!");
    });
    var fun = function() {
        alert("hello world!");
    }
    $("#block26").bind("click", fun);
    var fun1 = function() {
        alert("hello world!");
    }
    var fun2 = function() {
        alert("hello world again!");
    }
    $("#block27").bind("mouseover", fun1).bind("mouseout", fun2);

    //unbind
    var func = function() {
        alert("hello world!");
    }
    $("#block28").bind("mouseover", func);
    $("#block28").unbind("mouseover", func);

    //event-add
    $("#block29").bind("mouseover", function() {
        alert("hello world!");
    });

    //event-remove
    var func1 = function() {
        alert("hello world!");
    }
    $("#block30").bind("mouseover", func1);
    $("#block30").unbind("mouseover", func1);
   
    //event-fix
    var func2 = function(event) {
        alert($.event.fix(event) === event); //true
        alert("事件类型:" + event.type + "\n被绑定事件的元素:" + event.target);
    };
    $("#block31").bind("click", func2);

    //event-preventDefault
    $("#anchor1").bind("click", function() {alert("嘿嘿，我将自动跳转!");});
    $("#anchor2").bind("click", function(event) {
        event.preventDefault();
        alert("嘿嘿，我不会跳转!");
    });

    //event-stopPropagation
    var func3 = function() {
        alert("body is clicked!");
    };
    //$(document.body || document.documentElement).bind("click", func3);
    $("#block34").bind("click", func3);

    var func4 = function(event) {
        event.stopPropagation();
        alert("嘿嘿，单击我事件只会触发一次，即事件不会传递到body元素!");
    }
    $("#block35").bind("click", func4); 

    //api
    //scrollLeft
    $("#block36Btn1").bind("click", function() {
        alert($(document).scrollLeft());
    });

    //scrollTop
    $("#block37Btn1").bind("click", function() {
        alert($(document).scrollTop());
    });

    //global-method
    //$.isWindow
    $("#block38Btn1").bind("click", function() {
        alert($.isWindow(window));
    });
    //$.isIE
    $("#block38Btn2").bind("click", function() {
        alert($.isIE());
    });
    //$.isChrome
    $("#block38Btn3").bind("click", function() {
        alert($.isChrome());
    });
    //$.isFirefox
    $("#block38Btn4").bind("click", function() {
        alert($.isFirefox());
    });
    //$.isStr
    $("#block38Btn5").bind("click", function() {
        alert($.isStr("hcy"));
    });
    //$.isNum
    $("#block38Btn6").bind("click", function() {
        alert($.isNum(2013));
    });
    //$.isObj
    $("#block38Btn7").bind("click", function() {
        alert($.isObj({name: "hcy", age: 22}));
    });
    //$.isAry
    $("#block38Btn8").bind("click", function() {
        alert($.isAry([1, 2, 3, 4]));
    });
    //$.isNodeList
    $("#block38Btn9").bind("click", function() {
        alert($.isNodeList($("li.block8")[0]));
    });
    //$.isNode
    $("#block38Btn10").bind("click", function() {
        alert($.isNode($("#block8")[0]));
    });
    //$.contains
    $("#block39Btn1").bind("click", function() {
        alert($.contains($("#block39")[0], $("#hd")[0]));
    });
    //$.extend
    $("#block39Btn2").bind("click", function() {
        var options = $.extend({
            name: "hcy", age: 22}, {name: "hcy2", job: "student"}, true);  
        for (var i in options) {
            alert(options[i]);
        }
    });
    $("#block39Btn3").bind("click", function() {
        var options2 = $.extend({
              name: "hcy", age: 22}, {name: "hcy2", job: "student"}, false);  
        for (var j in options2) {
             alert(options2[j]);
        }
    });
    //$.deepextend
    $("#block39Btn4").bind("click", function() {
        var options3 = $.deepextend({
            name: "hcy", age: 22}, {name: "hcy2", job: "student"});
        for (var k in options3) {
            alert(options3[k]);
        }
    });
    $("#block39Btn5").bind("click", function() {
        var options4 = $.deepextend({name: "hcy", age: 22, info: {address: "gz"}}, 
            {name: "hcy2", job: "student", info: {sex: "man", address: "yc"}});
        for (var l in options4) {
            var res = options4[l];
            //如果res是对象，还要继续遍历对象,否则直接输出
            if (typeof res === "object") {
                for (var m in res) {
                    alert(res[m]);
                }
            } else {
                alert(res);
            }
        }
    });
    //$.each
    $("#block39Btn6").bind("click", function() {
        $.each({name: "hcy", age: 22, job: "student"}, function(name, value) {//遍历对象
            alert(name + ":" + value);
        });
    });
    $("#block39Btn7").bind("click", function() {
        $.each([1, 2, 3, 4], function(index, value) {//迭代数组
            alert(index + ":" + value);
            //alert(this + 3); //4,5,6,7
        });
    });
    //$.css
    $("#block40Btn1").bind("click", function() {
        alert($.css($("#block40")[0], "width"));
    });
    //$.data
    $("#block41Btn1").bind("click", function() {
        $.data($("#block41")[0], "block41", "嘿嘿，我是block41!");
    });
    $("#block41Btn2").bind("click", function() {
        alert($.data($("#block41")[0], "block41"));
    });
    //$.removeData
    $("#block42Btn1").bind("click", function() {
        $.removeData($("#block41")[0], "block41");
    });
    $("#block42Btn2").bind("click", function() {
        alert($.data($("#block41")[0], "block41"));
    });

    //打印按钮
    // 打印按钮
    $('#print').bind("click", function () {
        print();
        return false;
    });

    
});