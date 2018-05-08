function init(widths, heights, mines) {
    var mineA = {},
        mineEmpty = {},
        mineTag = {},
        mineTemp = {},
        mineNumber = {},
        mineNum = widths * heights - mines,
        time = 0;
    mineA["length"] = 0;
    mineEmpty["length"] = 0;
    mineTag["length"] = 0;
    mineTemp["length"] = 0;
    mineNumber["length"] = 0;
    initialize();
    eventPool();
    setNum("n", mines);
    setNum("t", "000");

    function initialize() {
        // 创建扫雷区域  
        var turned = true,
            mineX = [],
            mineY = [],
            w = widths,
            h = heights,
            x,
            y,
            count = 0,
            mineM = mines;
        creatMine(mineX, h);
        creatMine(mineY, w)
        scort(mineY);
        scort(mineX);
        var minearea = document.getElementsByClassName("show")[0];
        minearea.innerHTML = "";
        minearea.setAttribute('style', 'width:' + 20 * w + "px;");
        var ul = document.createElement("ul");

        while (turned) {
            var g = random(h);
            x = g;
            g = random(w);
            y = g;
            if (count < mineM) {
                if (!mineA[mineX[x] + "-" + mineY[y]]) {
                    mineA[mineX[x] + "-" + mineY[y]] = -1;
                    count++;
                    mineA["length"] = count;
                }
            } else {
                turned = false;
            }
        }

        for (var i = 0; i < h; i++) {
            for (var j = 0; j < w; j++) {
                var li = document.createElement('li');
                var str = i + "-" + j;
                li.setAttribute('id', str);
                ul.appendChild(li);
            }
        }
        minearea.appendChild(ul);

        //生成雷位置坐标随机数组
        function creatMine(arr, leng) {
            for (var j = 0; j < leng; j++) {
                arr.push(j);
            }
        }

        // 将坐标的位置进行随机排序
        function scort(elem) {
            elem.sort(function() {
                return Math.random(1) - 0.5;
            });
            return elem;
        }

        //生成规定雷数的坐标存储一下
        function random(num) {
            return Math.floor(Math.random(1) * num);

        }


        for (var i = 0; i < h; i++) {
            for (var j = 0; j < w; j++) {
                var st = i + "-" + j;
                if (!mineA[st]) {
                    traverse(st);
                }
                var li = document.getElementById(st);
                li.className = "cs";
                // else{
                //        var li = document.getElementById(st);
                //        li.className = "cm";
                // }

            }
        }

    }

    function timing() {
        setNum("t", ++time);
    }
    document.oncontextmenu = function(e) {
        var event = e || window.event;
        cancelHandler(event);
    }

    function eventPool() {
        var mineN = mines,
            start,
            choose = true,
            T1,
            T2,
            T3,
            T4;
        var show = document.getElementsByClassName('show')[0];
        addEvent(show, 'mousedown', claer);

        function claer(e) {
            var event = e || window.event,
                target = event.target || event.srcElement,
                count = 0,
                id = target.id,
                bt = event.button;
            if (!event) {
                return false;
            }
            //双击单击事件的区分代码开始

            if (bt == 2 || bt == 0) {
                if (bt == 0) {
                    T1 = Date.now();
                } else if (bt == 2) {
                    T2 = Date.now();
                }
                //区分单双击事件函数
                judge();
            }

            //双击单击事件的区分代码开始
            function judge() {
                var setOut = setTimeout(function() {
                    if (Math.abs(T1 - T2) < 60) {
                        if (bt == 0) {
                            doubleClick(id);
                        }
                        clearTimeout(setOut);
                    } else {
                        singleClick();
                    }
                }, 60);
            }

            //单击事件处理函数

            function singleClick() {

                if (bt == 2 && !mineTag[id]) {
                    if (!mineTemp[id]) {
                        target.className = "ctag";
                        mineTemp[id] = 1;
                        mineTemp["length"]++;
                        console.log(mineTemp["length"]);
                        console.log(mineTag["length"]);
                    } else if (mineTemp[id] == 1) {
                        target.className = "cun";
                        mineTemp[id] = 2;
                        mineTemp["length"]--;
                    } else {
                        target.className = "";
                        mineTemp[id] = 0;
                    }
                    var num = mineN - mineTemp["length"];
                    setNum("n", num);
                    if (!(mineNum - mineTag["length"])) {
                        start && clearInterval(start);
                        setNum("n", "000");
                        traverseTag();
                    }
                } else if (bt == 0 && !mineTag[id]) {
                    // if(choose){
                    // 	     !start || clearInterval(start);
                    //     	start = setInterval(function(){
                    //     		timing();
                    //     	},1000);
                    //     	choose = false;
                    //     }
                    mineTag[id] = 1;
                    mineTag["length"]++;
                    if (mineNumber[id]) {
                        count = mineNumber[id];
                        target.className = "c" + count;
                    } else if (mineEmpty[id]) {
                        target.className = "ce";
                        spread(id);
                    } else {
                        console.log(mineA[id]);
                        target.className = "cerr"
                        start && clearInterval(start);
                        console.log(start);
                        traverseMine();
                    }
                    if (!(mineNum - mineTag["length"])) {
                        start && clearInterval(start);
                        setNum("n", "000");
                        traverseTag();
                    }

                }
            }

        }
        addEvent(show, 'mouseup', prompt);

        function prompt(e) {
            var event = e || window.event,
                target = event.target || event.srcElement,
                id = target.id,
                bt = event.button;

            if (bt == 2 || bt == 0) {
                if (bt == 0) {
                    T3 = Date.now();
                } else if (bt == 2) {
                    T4 = Date.now();
                }
                //区分单双击事件函
                var setOut = setTimeout(function() {
                    if (Math.abs(T3 - T4) < 60) {
                        if (bt == 0) {
                            doubleClick(id);
                        }
                        clearTimeout(setOut);
                    }
                }, 60);
            }
            //分辨是否双击或单击

        }

        function doubleClick(str) {
            var arr = str.split("-"),
                i = parseInt(arr[0]),
                j = parseInt(arr[1]),
                max = widths - 1,
                maxY = heights - 1,
                minenum = widths * heights,
                temp,
                tempY,
                string,
                li = document.getElementById(str);
            flg = li.className,
                tagNum = traverseNumber(str, "ctag"),
                ctnum = mineNumber[str];
            if (tagNum > ctnum) {
                return false;
            }
            if (!mineTag[str]) {
                flg == "cs" ? li.className = "ce" : li.className = "cs";
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
                            string = temp + "-" + tempy;
                            li = document.getElementById(string);
                            flg = li.className;
                            if (!mineTag[string]) {
                                if (!mineTemp[string]) {
                                    if (tagNum < ctnum) {
                                        flg == "cs" ? li.className = "ce" : li.className = "cs";
                                    } else {
                                        if (flg == "ctag") {
                                            if (!mineA[string]) {
                                                li.className = "cno";
                                                start && clearInterval(start);
                                                traverseMine();
                                            } else {
                                                continue;
                                            }
                                        } else if (mineA[string]) {
                                            li.className = "cerr";
                                            start && clearInterval(start);
                                            traverseMine();
                                        } else if (mineEmpty[string]) {
                                            li.className = "ce";
                                            mineTag[string] = 1;
                                            mineTag["length"]++;
                                            spread(string);
                                        } else {
                                            li.className = "c" + mineNumber[string];
                                            mineTag[string] = 1;
                                            mineTag["length"]++;
                                        }
                                    }

                                }
                            }
                        }

                    }
                }
            }
            if (!(mineNum - mineTag["length"])) {
                start && clearInterval(start);
                setNum("n", "000");
                traverseTag();
            }

        }

    }

    function traverse(str) {
        var arr = str.split("-"),
            i = parseInt(arr[0]),
            j = parseInt(arr[1]),
            max = widths - 1,
            maxY = heights - 1,
            temp,
            tempY,
            string,
            count = 0;
        // var goal = document.getElementById(str);

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
        if (count > 0) {
            // goal.className = "c" + count;
            if (!mineNumber[str]) {
                mineNumber[str] = count;
                mineNumber["length"]++;
            }
        } else {
            if (!mineEmpty[str]) {
                // goal.className = "ce";
                mineEmpty[str] = "E";
                mineEmpty["length"]++;
            }
        }
    }
    //遍历样式的数量
    function traverseNumber(str, styleName) {
        var arr = str.split("-"),
            i = parseInt(arr[0]),
            j = parseInt(arr[1]),
            max = widths - 1,
            maxY = heights - 1,
            temp,
            tempY,
            count = 0,
            string;

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
                        li = document.getElementById(string);
                        flg = li.className;
                        if (flg == styleName || flg == "cno") {
                            count++;
                        }

                    }

                }
            }
        }

        return count;
    }

    //扩散函数
    function spread(str) {
        var arr = str.split("-"),
            i = parseInt(arr[0]),
            j = parseInt(arr[1]),
            max = widths - 1,
            maxY = heights - 1,
            temp,
            tempY,
            strl,
            count = 0;
        if (i - maxY == 1 || j - max == 1 || mineTag[str] == 2) {
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
                        if (!mineTag[strl]) {
                            var tag = document.getElementById(strl);
                            mineTag["length"]++;
                            mineTag[strl] = 1;
                            if (mineEmpty[strl]) {
                                spread(strl);
                                tag.className = "ce";
                            } else if (mineNumber[strl]) {
                                count = mineNumber[strl];
                                tag.className = "c" + count;
                            }

                        } else {
                            if (mineEmpty[strl] && mineTag[strl] != 2) {
                                mineTag[strl] = 2;
                                spread(strl);
                            }

                        }

                    }

                }
            }
        }

    }

    //遍历雷的对象并显示在雷盘上
    function traverseMine() {
        var li,
            str;
        for (var key in mineA) {
            if (key != "length") {
                li = document.getElementById(key);
                str = li.className;
                if (str != "cerr" && str != "ctag") {
                    li.className = "cm";
                }
            }
        }
        for (var pope in mineTemp) {
            if (pope != "length") {
                li = document.getElementById(pope);
                str = li.className;
                if (!mineA[pope] && str == "ctag") {
                    li.className = "cno";
                }
            }

        }

    }

    //遍历雷并加上标志
    function traverseTag() {
        var li;
        for (var key in mineA) {
            if (key != "length") {
                li = document.getElementById(key);
                li.className = "ctag";
            }
        }
    }
    //初始化雷数数字
    function setNum(str, num) {
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
    }
    //函数结束	
}
// 取消默认事件
function cancelHandler(event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }

}
//增加事件监听
function addEvent(elem, type, handle) {
    if (elem.addEventListener) {
        elem.addEventListener(type, handle, false);
    } else if (elem.attchEvent) {
        elem.attchEvent('on' + type, function() {
            handle.call(elem);
        });
    } else {
        elem['on' + type] = handle;
    }
}
//设置电子数字变化
function setNumber(elem, num) {
    var target = document.getElementsByClassName(elem)[0];
    target.className = elem + " c" + num;

}

function clearObj(obj) {
    for (var key in obj) {
        delete obj[key];
    }
}