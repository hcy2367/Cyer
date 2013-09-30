//Tab构造器
var Tab = function(options) {
	//默认参数
	var defaults = {
		tabTitle: "tab-title",//选项卡标题容器
		tabTitles: "tab-title-item",//选项卡标题集合
		tabContent: "tab-content",//选项卡内容容器
		tabContents: "tab-content-item", //选项卡内容集合
		activeName: "current",//当前元素活动样式
		delay: 0,//延迟时间
		eventType: "mouseover"//事件类型
	};
	//自定义参数
	$.extend(defaults, options);//返回合并后的对象defaults

	this.opts = defaults;
	this.tabTitle = this.opts.tabTitle;
	this.tabTitles = this.opts.tabTitles;
	this.tabContent = this.opts.tabContent;
	this.tabContents = this.opts.tabContents;
	this.activeName = this.opts.activeName;
	this.delay = this.opts.delay;
	this.eventType = this.opts.eventType;

	//初始化数据
	this.init();
	return this;//返回实例对象,方便链式调用
};
//原型对象
Tab.prototype = {
	init: function() {
		//获取标题集合和内容集合
		this.titles = $("." + this.tabTitles)[0];	
		this.contents = $("." + this.tabContents)[0];
		//调用show函数
		//this.show();
	},

	show: function() {
		var i,
			j,
			timer = null,//定时器
			len = this.titles.length;
		for (i = 0; i < len; i++) {
			//设置选项卡按钮的索引，并赋值于相应的i，以便在闭包中使用
			this.titles[i].index = i;//等价于var index = i;
			var that = this;//把Tab对象赋给一个that变量，以便在闭包中能访问到，即在闭包里使用Tab对象
			
			$.event.add(this.titles[i], this.eventType, function() {

				if (timer) {
					clearTimeout(timer);
				}
				
				var _this = this;//_this引用当前元素
				timer = setTimeout(function() {

					//先去掉所有的选项卡标题的样式和把所有选项卡内容隐藏
					$(that.titles).removeClass();
					$(that.contents).removeClass().addClass("tab-content-pane");
					

					//再给当前的选项卡标题添加样式和显示当前的选项卡内容
					$(_this).addClass(that.activeName);
					$(that.contents[_this.index]).addClass("current");
					
				}, that.delay);

			});
		} 

	}

};