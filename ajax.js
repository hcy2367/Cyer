/*
 * ajx
 * @class $.IO or Cyer.IO
 * @requires Cyer.js
 */

//全局方法IO(构造函数)
$.IO = function() {
	//do something
};

//合并对象到IO的原型中，即IO的原型继承第二个对象的所有方法和属性，此时IO的实例对象就可以共享这些方法了。
$.extend($.IO.prototype, {
	/**
	 * ajax
	 * @param {Object} config
	 * @param {String} config.url
	 * @param {Object} [config.params] {key:value}格式
	 * @param {Stirng} [config.method] get或者post或者delete或者...，默认get
	 * @param {Boolean} [config.async] 是否异步，默认true，异步
	 * @param {Object} [config.head] requestHead {key:value}格式
	 * @param {Obejct} [config.body] {key:value}格式
	 * @param {Function} [config.onProgress] 处理中回调，bigpipe
	 * @param {Function} [config.onSuccess] 成功回调
	 * @param {Function} [config.onError] 错误回调
	 * @param {Function} [config.onOvertime] 超时回调
	 * @param {Number} [config.overtime] 默认3000，单位毫秒
	 * @param {Function} [config.readyStateChangeFn] ready状态回调
	 */
	 ajax: function(config) {
	 	var me = this,
	 		//创建XMLHttpRequest对象
	 		xhr	= XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"),
	 		//默认参数
	 		defaultConfig = {
	 			url: undefined,
	 			params: undefined,
	 			method: "GET",
	 			async: true,
	 			head: undefined,
	 			body: null,
	 			onProgress: undefined,
	 			onSuccess: undefined,
	 			onError: undefined,
	 			onOvertime: undefined,
	 			overtime: 3000,
	 			readyStateChangeFn: function() {
	 				//接收到服务器响应成功后返回的部分数据
	 				if (xhr.readyState === 3) {
	 					clearTimeout(xhr.timeoutOvertime);
	 					config.onProgress && config.onProgress(xhr, xhr.responseText, xhr);

	 					//超时调用
	 					if ($.isFn(config.onError)) {
	 						xhr.timeoutOvertime = setTimeout(function() {
	 							config.onError.call(xhr, xhr.responseText, xhr);
	 						}, config.overtime);
	 					}
	 				//全部数据已接收到，此时可对服务器返回的数据进行处理。
	 				} else if (xhr.readyState === 4) {
	 					clearTimeout(xhr.timeoutOvertime);
	 					if (xhr.status === 200) {
	 						config.onSuccess && config.onSuccess.call(xhr, xhr.responseText, xhr);
	 					} else if (/^\d{3}$/.test(xhr.status)) {
	 						if (/^[45]\d{2}$/.test(xhr.status)) {
	 							config.onError && config.onError.call(xhr, xhr.responseText, xhr);
	 						}
	 					}

	 					var methodName = "onHTTP" + xhr.status;
	 					config[methodName] && config[methodName].call(xhr, xhr.responseText, xhr);
	 				}
	 			}
	 		};

 		//合并参数对象(自定义参数)
 		$.extend(defaultConfig, config);

 		//设置请求头信息
 		if (defaultConfig.head) {
 			for (var k in defaultConfig.head) {
 				var v = defaultConfig.head[k];
 				xhr.setRequestHeader(k, v);
 			}
 		}

 		//设置url信息
 		var url = defaultConfig.url;
 		if (!$.isEmpty(defaultConfig.params)) {
 			//如果url存在"?"字符，则直接合并查询字符串到url后面
 			if (defaultConfig.url.indexOf("?") === defaultConfig.url.length - 1) {
 				url += $.concat(defaultConfig.params, "&", "=");
 			//如果url不存在"?"字符，则要添加"?"符号后再添加查询字符串
 			} else {
 				url += "?" + $.concat(defaultConfig.params);
 			}
 		}

 		//发送的主体数据(post方法提交时)
 		var body = $.concat(defaultConfig.body, "&", "=");
 		//开启或创建一个请求
 		xhr.open(defaultConfig.method, url, defaultConfig.async);
 		//响应readyState状态的事件处理程序
 		xhr.onreadystatechange = defaultConfig.readyStateChangeFn;
 		//发送请求
 		xhr.send(body);

 		if ($.isFn(defaultConfig.onOvertime)) {
 			xhr.timeoutOvertime = setTimeout(function() {
 				defaultConfig.onOvertime.call(xhr, xhr);
 			}, defaultConfig.overtime);
 		}
	}
});

/*
 * $.IO的实例对象，通过该实例可以访问$.IO原型的所有方法
 * @global
 * @name $.io
 * @type $.IO
 */
 $.io = new $.IO();