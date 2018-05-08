/*
 * @Author: Think
 * @Date:   2018-04-14 12:15:35
 * @Last Modified by:   Think
 * @Last Modified time: 2018-05-06 21:39:50
 */
var mine = {
    mineA: {},
    mineTag: { length: 0 },
    mineNumber: {},
    mineTemp: { length: 0 },
    mineNum: null,
    flag: true,
    init: function(widths, heights, mines) {
        this.initialize(widths, heights, mines);
        this.cancel();

    },
    initialize: function(widths, heights, mines) {
        var w = widths,
            h = heights,
            m = mines,
            elem = document.getElementsByClassName("show")[0];
        this.mineA = this.creatMine(w, h, mines);
        this.render(elem, w, h);
        this.mineNumber = this.renderdata(this.mineA, h, w);
        this.event(elem, this.mineNumber, w, h, this.mineA, m);
        this.renderNumber("n", m);
        this.renderNumber("t", "000");
        var oLi = document.getElementById("start");
        oLi.className = "";
        if(!mine.flag){
            clearInterval(mine.mineNum);
            mine.flag = true;
            mine.mineNum = null;
        }
    },
    cancel: function() {
        document.oncontextmenu = function(e) {
            var event = e || window.event;
            cancelHandler(event);
        }

        function cancelHandler(even) {
            if (even.preventDefault) {
                even.preventDefault();
            } else {
                even.returnValue = false;
            }
        }
    },
    creatArr: function(leng) {
        var arr = [];
        for (var j = 0; j < leng; j++) {
            arr.push(j);
        }
        return arr;
    },
    scort: function(arr) {
        arr.sort(function() {
            return Math.random(1) - 0.5;
        });
        return arr;
    },
    random: function(num) {
        return Math.floor(Math.random(1) * num);
    },
    creatMine: function(w, h, mineM) {
        obj = {};
        var turned = true,
            count = 0,
            mineX = this.creatArr(h),
            mineY = this.creatArr(w);
        this.scort(mineX);
        this.scort(mineY);
        while (turned) {
            var x = this.random(h),
                y = this.random(w),
                str = mineX[x] + "-" + mineY[y];
            if (count < mineM) {
                if (!obj[str]) {
                    obj[str] = -1;
                    count++;
                    obj["length"] = count;
                }
            } else {
                turned = false;
            }
        }
        return obj;
    },
    timer: function() {
        var n = init();
        var timer = setInterval(function() {
            var num = n();
            mine.renderNumber("t", num);
        }, 1000);
        return timer;

        function init() {
            var n = 0;

            function add() {
                n++;
                return n;
            }
            return add;
        }

    },
    renderNumber: function(str, num) {
        var st = num + "",
            len = st.length;
        for (var i = len; i; i--) {
            if (len == 1) {
                setNumber(str + 1, 0);
            }
            if (len < 4) {
                setNumber(str + (len - i), st[i - 1]);
            }
        }

        function setNumber(elem, num) {
            var target = document.getElementsByClassName(elem)[0];
            target.className = elem + " c" + num;

        }

    },
    render: function(elem, w, h) {
        elem.innerHTML = "";
        elem.setAttribute("style", "width:" + 20 * w + "px;");
        var str = "<ul>";
        for (i = 0; i < h; i++) {
            for (j = 0; j < w; j++) {
                str += "<li id ='" + i + "-" + j + "'></li>"
            }
        }
        str += "</ul>";
        elem.innerHTML = str;
    },
    renderdata: function(mineAs, h, w) {
        var str = "",
            obj = {};
        for (var i = 0; i < h; i++) {
            for (var j = 0; j < w; j++) {
                str = i + "-" + j;
                if (!mineAs[str]) {
                    obj[str] = traverse(str, mineAs, w, h);
                }
                // else{
                //     var goal = document.getElementById(str);
                //     goal.className = "cm";
                // }

            }
        }
        return obj;

        function traverse(str, mineA, widths, heights) {

            var arr = str.split("-"),
                i = parseInt(arr[0]),
                j = parseInt(arr[1]),
                max = widths - 1,
                maxY = heights - 1,
                temp,
                tempY,
                string,
                count = 0;
            var goal = document.getElementById(str);

            for (var r = -1; r < 2; r++) {
                temp = i + r;
                if (temp < 0 || temp > maxY) {
                    continue;
                } else {
                    for (var L = -1; L < 2; L++) {
                        tempy = j + L;
                        if (tempy < 0 || tempy > max || (r == 0 && L == 0)) {
                            continue;
                        } else {
                            string = temp + "-" + tempy;
                            if (mineA[string]) {
                                count++;
                            }
                        }

                    }
                }
            }
            return count;
        }

    },
    event: function(elem, mineNumber, w, h, mineA, count) {
        var timenow = 0,
            interval = 0,
            timeS = 0,
            timeE = 0,
            downflg = false,
            flg = false,
            widths = w,
            heights = h,
            elem = elem.getElementsByTagName("ul")[0];
        addEvent(elem, 'mousedown', downClick);
        addEvent(elem, "mouseup", upClick);

        function addEvent(elem, type, handle) {
            if (elem.addEventListener) {
                elem.addEventListener(type, handle, false);

            } else if (elem.attchEvent) {
                elem.attchEvent("on" + type, function() {
                    handle.call(elem);
                });
            } else {
                elem["on" + type] = handle;
            }
        }

        function cancelEvent(elem, type, handle) {
            if (elem.removeEventListener) {
                elem.removeEventListener(type, handle, false);
            } else if (elem.detachEvent) {
                elem.detachEvent("on" + type, handle);
            } else {
                elem["on" + type] = null;
            }
        }

        function downClick(elem) {
            var event = elem || window.event,
                target = event.target || event.srcElement,
                id = target.id,
                bt = event.button;
            if (bt % 2 == 0) {
                bt == 2 ? timenow = Date.now() : interval = Date.now();
                var timer = setTimeout(function() {
                    var t = Math.abs(timenow - interval);
                    if (t < 60) {
                        if (bt == 0) {
                            doubleClick(id);
                            flg = true;
                        }
                        clearTimeout(timer);
                    } else {
                        singleClick(id, bt, count);
                        flg = false;
                    }

                }, 60);

            }
        }

        function inter(start, end, bt, timer, direc) {
            var t = Math.abs(end - start);
            if (t <= 60) {
                if (bt == 0) {
                    doubleClick(direc);
                    flg = direc != "up" ? true : false;
                }
                clearTimeout(timer);
            } else {
                if (direc == "up") {
                    if (flg) {
                        doubleClick(id, direc);
                        flg = false;
                    }
                } else {
                    singleClick(id, bt);
                }

            }
        }

        function upClick(elem) {
            var event = elem || window.event,
                target = event.target || event.srcElement,
                id = target.id,
                bt = event.button;
            if (bt % 2 == 0) {
                bt == 2 ? timeS = Date.now() : timeE = Date.now();
                var timer = setTimeout(function() {
                    var t = Math.abs(timeS - timeE);
                    if (t <= 60) {
                        if (bt == 0) {
                            doubleClick(id, "up");
                            flg = false;
                        }
                        clearTimeout(timer);
                    } else {
                        doubleClick(id, "up");
                    }
                }, 60);
            }

        }

        function doubleClick(id, direc) {
            var arr = ergodic(id, widths, heights),
                mineNum = mineNumber[id];
            !direc ? doubleDown(id) : doubleUp(id);

            function doubleDown(id) {
                var oLi = document.getElementById(id),
                    oLiClass = oLi.className;
                if (mineNum != arr["length"]) {
                    delete arr["length"];
                    for (var key in arr) {
                        var target = document.getElementById(key);
                        target.className = "ce";
                        target.setAttribute("tempSign", "1");
                    }
                } else {
                    delete arr["length"];
                    for (var key in arr) {
                        var target = document.getElementById(key),
                            count = mineNumber[key];
                        if (typeof(count) !== "undefined") {
                            if (oLiClass == "") {
                                target.className = "ce";
                                target.setAttribute("tempSign", "1");
                            } else {
                                target.className = "c" + count;
                                if (count == 0) {
                                    singleClick(key, 0);
                                }
                                mine.gameOver();
                            }
                            // console.log("666");
                        } else {
                            singleClick(key, 0);
                        }

                    }
                }
            }

            function doubleUp(id) {
                // console.log("鼠标抬起！");
                delete arr["length"];
                for (var key in arr) {
                    var target = document.getElementById(key);
                    target.className && (target.className = "");
                    target.removeAttribute("tempSign");
                }

            }

            function ergodic(str, widhts, heights) {
                var arr = str.split("-"),
                    i = parseInt(arr[0]),
                    j = parseInt(arr[1]),
                    max = widths - 1,
                    maxY = heights - 1,
                    temp,
                    tempY,
                    string,
                    obj = { length: 0 };

                for (var r = -1; r < 2; r++) {
                    temp = i + r;
                    if (temp < 0 || temp > maxY) {
                        continue;
                    } else {
                        for (var L = -1; L < 2; L++) {
                            tempy = j + L;
                            if (tempy < 0 || tempy > max || (r == 0 && L == 0)) {
                                continue;
                            } else {
                                string = temp + "-" + tempy;
                                var elem = document.getElementById(string),
                                    tempSign = elem.getAttribute("tempSign");
                                if (!obj[string]) {
                                    (elem.className == "" || tempSign) && (obj[string] = 1);
                                    elem.className == "ctag" && obj["length"]++;
                                }

                            }

                        }
                    }
                }

                return obj;

            }

        }

        function singleClick(id, sign, count) {
            var target = document.getElementById(id);
            sign == 2 ? mineTag = rightClick(id, target) : leftClick(id, target);
            //左击鼠标处理函数

            function leftClick(id, target) {
                var num = mineNumber[id];
                if (target.className != "ctag") {
                    if (typeof(num) === "undefined") {
                        target.className = "cerr";
                        showMine(mineA);
                        // console.log("你的游戏已结束，game over！");
                        if (!mine.flag) {
                            clearInterval(mine.mineNum);
                            mine.flag = true;
                            mine.mineNum = null;
                        }
                        var star = document.getElementById("start");
                        star.className = "cry";

                    } else {
                        target.className = "c" + num;
                        if (num == 0) {
                            spread(id, widths, heights);
                        }
                        if (mine.flag) {
                            mine.mineNum = mine.timer();
                            mine.flag = false;
                            // console.log(mine.mineNum);
                        }
                    }
                }
                this.mine.gameOver();

            }
            //右击处理函数
            function rightClick(id, target) {
                var classname = target.className;
                if (classname == "") {
                    target.className = "ctag";
                } else if (classname == "ctag") {
                    target.className = "cun";
                } else if (classname == "cun") {
                    target.className = "";
                }
                var num = count - elem.getElementsByClassName("ctag").length;
                mine.renderNumber("n", num);
                return num;
            }

            function spread(str, widths, heights) {
                var elem = document.getElementById(str),
                    sign = elem.getAttribute("iSign");
                var arr = str.split("-"),
                    i = parseInt(arr[0]),
                    j = parseInt(arr[1]),
                    max = widths - 1,
                    maxY = heights - 1,
                    temp,
                    tempY,
                    strl,
                    count = 0;
                if (i - maxY == 1 || j - max == 1 || sign == 2) {
                    return false;
                }

                for (var r = -1; r < 2; r++) {
                    temp = i + r;
                    if (temp < 0 || temp > maxY) {
                        continue;
                    } else {
                        for (var L = -1; L < 2; L++) {
                            tempy = j + L;
                            if (tempy < 0 || tempy > max || (r == 0 && L == 0)) {
                                continue;
                            } else {
                                strl = temp + "-" + tempy;
                                var tag = document.getElementById(strl);
                                var num = mineNumber[strl],
                                    tempSign = tag.getAttribute("iSign");
                                if (tag.className == "") {
                                    if (typeof(num) != "undefined") {
                                        tag.className = "c" + num;
                                        if (num == 0 && tempSign != 2) {
                                            spread(strl, widths, heights);
                                        }
                                    }
                                } else {
                                    if (num == 0 && tempSign != 2) {
                                        tag.setAttribute("iSign", 2);
                                        spread(strl, widths, heights);
                                    }
                                }

                            }

                        }
                    }
                }
            }

            function showMine(mineA) {
                var obj = {},
                    mineGroup = elem.getElementsByClassName("ctag"),
                    len = mineGroup.length,
                    temp = null,
                    id = null;

                obj = mine.clone(mineA);

                for (var i = 0; i < len; i++) {
                    if (mineGroup[i] != undefined) {
                        id = mineGroup[i].id;
                        if (!obj[id]) {
                            mineGroup[i].className = "cno";
                        } else {
                            delete obj[id];

                        }
                    }

                }
                obj["length"] && (delete obj["length"]);

                for (var key in obj) {
                    temp = document.getElementById(key);
                    if (temp.className != "cerr") {
                        temp.className = "cm";
                    }


                }


            }

            function clone(origin, target) {
                target = target || {};
                for (var key in origin) {
                    target[key] = origin[key];

                }
                return target;
            }


        }

    },
    clone: function(origin, target) {
        target = target || {};
        for (var key in origin) {
            target[key] = origin[key];

        }
        return target;

    },
    gameOver: function() {
        var obj = {},
            count = 0;
        obj = this.clone(this.mineNumber);
        for (var key in obj) {
            var oLi = document.getElementById(key),
                sign = "c" + obj[key];
            if (oLi.className == sign) {
                delete obj[key];
            } else {
                count++;
            }
        }!count && (this.readerMine());
    },
    readerMine: function() {
        var obj = this.clone(this.mineA);
        delete obj["length"];
        for (var key in obj) {
            var oLi = document.getElementById(key),
                className = oLi.className;
            if (oLi.className == "") {
                oLi.className = "ctag";
            }
        }
        mine.renderNumber("n", 0);
        if (!mine.flag) {
            clearInterval(mine.mineNum);
            mine.flag = true;
            mine.mineNum = null;
        }
    }


}

// 游戏等级的按钮的事件函数

var game = {
    init: function() {
        mine.init(9, 9, 10);
        this.mineLevel();
        this.start();
    },
    mineLevel: function() {
        var wrap = document.getElementsByClassName("button")[0],
            level = wrap.getElementsByTagName("ul")[0];
        level.addEventListener("click", event, false);

    },
    start: function() {
        var oUl = document.getElementById("start");
        oUl.addEventListener("click", begin, false);
    }

}

function begin(e) {
    var active = document.getElementsByClassName("active")[0];
    switch (active.id) {
        case "easy":
            mine.init(9, 9, 10);
            break;
        case "middle":
            mine.init(16, 16, 40);
            break;
        case "hard":
            mine.init(30, 16, 99);
            break;
    }
    var star = document.getElementById("start");
    star.className = "";
}

function event(e) {
    var event = e || window.event,
        target = event.target || event.srcElement,
        active = document.getElementsByClassName("active")[0];
    switch (target.id) {
        case "easy":
            mine.init(9, 9, 10);
            active.className = "";
            target.className = "active";
            break;
        case 'middle':
            mine.init(16, 16, 40);
            active.className = "";
            target.className = "active";
            break;
        case "hard":
            mine.init(30, 16, 99);
            active.className = "";
            target.className = "active";
            break;

    }
}
game.init();