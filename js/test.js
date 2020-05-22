var nav = document.getElementById("nav").getElementsByTagName("a");
var imgs = document.getElementById("imglist").getElementsByTagName("a");
var icons = document.getElementById("iconlist").getElementsByTagName("li");
var banner = document.getElementById("banner");
var prev = document.getElementById("prev");
var next = document.getElementById("next");

//循环变量
var index = -1;

//设置定时器
var timer = setInterval(startAutoPlay, 1000);

function startAutoPlay() {
    index ++;
    if(index >= imgs.length) {
        index = 0;
    }
    controlImg(index);
    controlIcon(index);

}

function controlImg(index) {
    for(var i = 0; i < imgs.length; i++) {
        imgs[i].style.display="none";
    }
    imgs[index].style.display="block";
}

function controlIcon(index) {
    for(var i = 0; i < icons.length; i++) {
        icons[i].style.backgroundColor="#c0c2c5";
        icons[i].style.height="8px";
    }
    icons[index].style.backgroundColor="#ffffff";
    icons[index].style.height="12px";
}

//封装事件绑定方法
function addHandler(element, type, handler) {
    if(element.addEventListener) {
        element.addEventListener(type, handler, true);
    }else if(element.attachEvent) {
        //IE支持DOM2
        element.attachEvent("on"+type, handler);
    }else {
        //IE不支持DOM2
        element["on"+type] = handler;
    }
}

//导航条点击事件
for(var i = 0; i < nav.length; i++) {
    (function (i) {
        addHandler(nav[i], "click", function () {
            for(var j = 0; j < nav.length; j++) {
                nav[j].className="nav-item";
            }
            this.className="nav-item active";
        });
    })(i)
}

//鼠标移入事件
addHandler(banner, "mouseover", function () {
    //停止定时器
    clearInterval(timer);
});


//鼠标移出事件
addHandler(banner, "mouseout", function () {
    timer = setInterval(startAutoPlay, 1000);
});

//给小图标绑定点击事件
for(var i = 0; i < icons.length; i++) {
    (function (i) {
        addHandler(icons[i], "click", function () {
            controlImg(i);
            controlIcon(i);
        });
    })(i)
}

//给左按钮绑定事件
addHandler(prev, "click", function () {
    --index;
    if(index < 0) {
        index = imgs.length - 1;
    }
    controlImg(index);
    controlIcon(index);
});

//给右按钮绑定事件
addHandler(next, "click", function () {
    index++;
    if(index >= imgs.length) {
        index = 0;
    }
    controlImg(index);
    controlIcon(index);
});

//折线图渲染
function showLine() {
    var xhr = null;
    if(window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }else if(window.ActiveXObject) {
        xhr = new ActiveXObject();
    }else {
        xhr = null;
    }
    if(xhr) {
        xhr.open('GET', 'https://edu.telking.com/api/?type=month');
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status ===200) {
                var info = JSON.parse(xhr.responseText);

                // 基于准备好的dom，初始化echarts图表
                var myChart = echarts.init(document.getElementById('line'));

                var option = {
                    title: {
                        show: true,
                        text: '曲线图数据展示',
                        textStyle: {
                            fontWeight: 'normal',
                            fontFamily: 'STHeitiSC-Medium',
                            fontSize: '18'
                        },
                        x: 'center',
                        y: '30'
                    },
                    xAxis: {
                        type: 'category',
                        //去掉垂直网格线
                        splitLine: {
                            show: false,
                        },
                        //设置x轴样式
                        axisLine: {
                            lineStyle: {
                                color: '#d8d8d8',
                                type: 'dashed',
                            }
                        },
                        //去掉x轴刻度
                        axisTick: {
                            show: false
                        },
                        data: info.data.xAxis
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter:'{value}' + ' 人'
                        },
                        //隐藏y轴
                        axisLine:{
                            lineStyle:{
                                color:'transparent'
                            }
                        },
                        //将横网格线设置为虚线
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    //去掉两边的外框线
                    grid: {
                        borderWidth: 0
                    },
                    series: [{
                        type: 'line',
                        symbol:'circle',
                        symbolSize:2,
                        itemStyle:{
                            normal:{
                                color:'#4586ef',
                                borderColor:'#4586ef',  //拐点边框颜色
                                label: {
                                    show: true
                                },
                                areaStyle: {
                                    color: '#f3f6fe'
                                }
                            }
                        },
                        smooth: true,
                        data: info.data.series
                    }]
                };

                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        }
    }
    xhr.send(null);
}
showLine();

//饼状图渲染
function showPie() {
    var xhr = null;
    if(window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }else if(window.ActiveXObject) {
        xhr = new ActiveXObject();
    }else {
        xhr = null;
    }
    if(xhr) {
        xhr.open('GET', 'https://edu.telking.com/api/?type=week');
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status ===200) {
                var info = JSON.parse(xhr.responseText);
                var data1=[];
                var xAxis = info.data.xAxis;
                var series = info.data.series;
                for(var i = 0; i <= xAxis.length-1; i++) {
                        data1.push({value : series[i], name : xAxis[i]});
                }

                // 基于准备好的dom，初始化echarts图表
                var myChart = echarts.init(document.getElementById('pie'));

                var option = {
                    title: {
                        show: true,
                        text: '饼状图数据展示',
                        textStyle: {
                            fontWeight: 'normal',
                            fontFamily: 'STHeitiSC-Medium',
                            fontSize: '18'
                        },
                        x: 'center',
                        y: '30'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b} : {c} ({d}%)"
                    },
                    series: [{
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: data1,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };

                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        }
    }
    xhr.send(null);
}
showPie();

//柱状图渲染
function showBar() {
    var xhr = null;
    if(window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    }else if(window.ActiveXObject) {
        xhr = new ActiveXObject();
    }else {
        xhr = null;
    }
    if(xhr) {
        xhr.open('GET', 'https://edu.telking.com/api/?type=week');
        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status ===200) {
                var info = JSON.parse(xhr.responseText);

                // 基于准备好的dom，初始化echarts图表
                var myChart = echarts.init(document.getElementById('bar'));

                var option = {
                    title: {
                        show: true,
                        text: '柱状图数据展示',
                        textStyle: {
                            fontWeight: 'normal',
                            fontFamily: 'STHeitiSC-Medium',
                            fontSize: '18'

                        },
                        x: 'center',
                        y: '30'
                    },
                    legend: {
                        data: ["商品数"],
                        icon: "none",  
                        itemWidth: 1,  // 设置宽度
                        itemHeight: 1, // 设置高度
                        itemGap: 50, // 设置间距
                        x: '50',
                        y: '40',
                        textStyle:{
                            fontSize: '12',
                            color: '#000'
                        }
                    },
                    xAxis: {
                        //去掉垂直网格线
                        splitLine: {
                            show: false,
                        },
                        //设置x轴样式
                        axisLine: {
                            lineStyle: {
                                color: '#d8d8d8',
                                type: 'dashed',
                            }
                        },
                        //去掉x轴刻度
                        axisTick: {
                            show: false
                        },
                        data: info.data.xAxis
                    },
                    yAxis: {
                        axisLine: {
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        //将横网格线设置为虚线
                        splitLine: {
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    //去掉两边的外框线
                    grid: {
                        borderWidth: 0
                    },
                    series: [{
                        type: 'bar',
                        //柱图宽度
                        barWidth : 15,
                        itemStyle: {
                            normal: {
                                color: '#4586ef'
                            }
                        },
                        data: info.data.series,
                    }]
                };

                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        }
    }
    xhr.send(null);
}
showBar();