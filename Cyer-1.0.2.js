/*
* Cyer v1.0.2
* Date: 2013-03-18
* https://github.com/hcy2367/Cyer
* (copyright) 2012-2013 hcy, https://github.com/hcy2367
*
* This is licensed under the GNU LGPL, version 3.0.
* For details, see: http://www.gnu.org/licenses/lgpl-3.0.html
*/

;(function(window, undefined) {

	//调用$或Cyer构造器时,返回的实例对象共享(拥有)$原型对象的方法(因为:$.fn.init.prototype = $.fn = $.prototype;)
	var $ = window.Cyer = function(selector, context) {
		return new $.fn.init(selector, context);
	};

	if (window.$ === undefined) {
		window.$ = $;
	}

	//实例对象共享的方法(原型方法)
	$.fn = $.prototype = {
		//确保constructor指针(属性)引用$
		constructor: '$',

		//初始化构造器
		init: function(selector, root) {
			/**
			 * 简单css选择器 支持#id，.className，@formName，还有tagName.className，node节点五种格式
			 * @param {String ||　Object}
			 * @param {Element} [root] 可选,从哪个根节点查找
			 * @return {object} 实例对象(实现链式调用)
			 */
			//重用变量
			var	i,
				elems,
				elemsLen,
				matchAry = [];

			//如果选择器selector为空,则返回该实例对象
			if ($.isEmpty(selector)) {
				return this; 
			//如果选择器为节点或者为节点列表,则把该selector赋给该实例对象的第一个属性,并返回该实例对象
			} else if ($.isNode(selector) || $.isNodeList(selector)) {
				this[0] = selector;
				return this;
			//如果选择器为window对象,则把window对象作为该实例对象的第一个属性.
			} else if ($.isWindow(selector)) {
				this[0] = selector;
				return this;
			}

			var selector = selector.toString();
			
			//匹配"#id"的情况
			if (selector.indexOf('#') === 0) { 
				this[0] =  $.getElemByID(selector.substring(1), root);
				return this; //实现链式调用

			//匹配".className"的情况
			} else if (selector.indexOf('.') === 0) {
				elems = $.getElemsByClassName(selector.substring(1), root);
				
				if (elems.constructor && elems.constructor.toString().indexOf('Array') > -1) {
					matchAry = elems;
				} else {
					for (i = 0, elemsLen = elems.length; i < elemsLen; i++) {
						matchAry.push(elems[i]);
					}
				}

				this[0] = matchAry; //把匹配的数组赋给实例对象的第一个属性
				return this;

			//匹配"@name"的情况
			} else if (selector.indexOf('@') === 0) {
				elems = $.getElemsByName(selector.substring(1), root);
				
				for (i = 0, elemsLen = elems.length; i < elemsLen; i++) {
					matchAry.push(elems[i]);
				}
				this[0] = matchAry; //把匹配的数组赋给实例对象的第一个属性
				return this;

			//匹配"tagName.className"的情况
			} else {
				if (selector.indexOf('.') > 0 && selector.indexOf('.') < selector.length) {
					//根据tagName获取元素集合(节点列表)
					elems = $.getElemsByTagName(selector.substring(0, selector.indexOf('.')), root);
					var	className = selector.substr(selector.indexOf('.') + 1);
					
					for (i = 0, elemsLen = elems.length; !$.isEmpty(elems) && i < elemsLen; i++) {
						// 如果元素匹配到className,则把该元素添加到数组matchAry中
						if ($(elems[i]).hasClass(className)) {
							matchAry.push(elems[i]);
						}
					}		
				} else {//否者如果没有查找到".",则调用getElemsByTagName方法
					matchAry = $.getElemsByTagName(selector, root);
				}

				this[0] = matchAry; //把匹配的数组赋给实例对象的第一个属性
				return this;
			}
		},

		/**
	    * 判断样式类是否存在
	    * @param	{String}	名称
	    * @return	{Boolean}
	    */
	    hasClass: function(name) {
	    	var i,
	    		len,
	    		selector = this[0],
	    		className = ' ' + name + ' ',
	    		rclass = /[\n\t]/g,
	    		hasClass = false;

	    	//当selector为元素集合时，则遍历该HTMLCollection
	    	if ($.isNodeList(selector) && $.isAry(selector)) {

		    	$.each(selector, function() {
		    		if ((' ' + this.className + ' ').replace(rclass, ' ').indexOf(className) > -1) {
			    		hasClass = true;
			    	}	
		    	});
		    //当selector为单个元素时
	    	} else if ($.isNode(selector)) {
	    		if ((' ' + selector.className + ' ').replace(rclass, ' ').indexOf(className) > -1) {
		    		hasClass = true;
		    	}
	    	}
	    	
	    	return hasClass;
	    },

	    /**
	    * 添加样式类--添加多个样式时用空格隔开
	    * @param	{String}	名称
	    */
	    addClass: function(name) {
	    	var i,
	    		len,
	    		selector = this[0];

	    	//当selector为元素集合时，则遍历该HTMLCollection
	    	if ($.isNodeList(selector) && $.isAry(selector)) {

		    	$.each(selector, function() {
		    		//如果不存在给定的className，则添加到元素中
		    		if (!$(this).hasClass(name)) {
			    		this.className += ' ' + name;
			    	}
		    	});
		    //当selector为单个元素时
	    	} else if ($.isNode(selector)) {
	    		if (!this.hasClass(name)) {//this指向实例对象
		    		selector.className += ' ' + name;
		    	}
	    	}

	    	return this;
	    },

	    /**
	    * 移除样式类
	    * @param	{String}	名称
	    */
	    removeClass: function(name) {
	    	var i,
	    		len,
	    		selector = this[0];

	    	//当selector为元素集合时，则遍历该HTMLCollection
	    	if ($.isNodeList(selector) && $.isAry(selector)) {
	    		
		    	$.each(selector, function() {
		    		//如果不传入参数，则清除元素所有的className
		    		if (!name) {
		    			this.className = '';
		    		//否者移除传入并匹配的className
		    		} else if ($(this).hasClass(name)) {
		    			this.className = this.className.replace(name, '');
		    		}
		    	});
		    //当selector为单个元素时
	    	} else if ($.isNode(selector)) {
	    		if (!name) {
		    		selector.className = '';
		    	} else if (this.hasClass(name)) {
		    			selector.className = selector.className.replace(name, '');
		    	}
	    	}
	   
	    	return this;
	    },

	    /**
	    * 读写应用到元素的最终样式
	    * css(name) 访问第一个匹配元素的样式属性
	    * css(properties) 把一个"名/值对"对象设置为所有匹配元素的样式属性
	    * css(name, value) 在所有匹配的元素中，设置一个样式属性的值
	    */
	    css: function(name, value) {
	    	var i,
	    		elem = this[0],
	    		obj = arguments[0];

	    	//如果name为字符串
	    	if (typeof name === 'string') {
	    		//不传入value参数时，为读取样式值
	    		if (value === undefined) {

	    			if ($.isNode(elem)) {
	    				return $.css(elem, name);//css(name)读取元素最终样式
	    			} else if ($.isNodeList(elem) && $.isAry(elem)) {
	    				$.each(elem, function() {
	    					return $.css(this, name);
	    				});
	    			}

	    		//否则为设置样式值
	    		} else {

	    			if ($.isNode(elem)) {
	    				elem.style[name] = value;//css(name, value)设置样式--注意样式名称是驼峰式
	    			} else if ($.isNodeList(elem) && $.isAry(elem)) {
	    				$.each(elem, function() {
	    					this.style[name] = value;
	    				});
	    			}
	    			
	    		}
	    	//名值对对象参数设置样式值
	    	} else {
	    		for (i in obj) {

	    			if ($.isNode(elem)) {
	    				elem.style[i] = obj[i];//css(properties)设置样式
	    			} else if ($.isNodeList(elem) && $.isAry(elem)) {
	    				$.each(elem, function() {
	    					this.style[i] = obj[i];//css(properties)为元素集合设置样式
	    				});
	    			}

	    		}
	    	}

	    	return this;
	    },

	    /** 显示元素 */
	    show: function() {
	    	return this.css('display', 'block');
	    },

	    /** 隐藏元素 */
	    hide: function() {
	    	return this.css('display', 'none');
	    },

	    /**
	    * 获取元素相对文档(document)的坐标--IE6、7、8会计算边框的宽度(有bug)
	    * @return	{Object}	返回一个包含left、right、top、bottom属性的对象
	    */
	    offset: function(element) {
	    	//获取元素
	    	element = this[0];
	 		
	 		//获取左偏移量和上偏移量，沿着父元素一直取得偏移量，直至根元素
            var  actualLeft = $.getElementLeft(element),
                actualTop = $.getElementTop(element);

            return {
                left:  	actualLeft,
                right: 	actualLeft + element.offsetWidth,
                top: 	actualTop,
                bottom: actualTop + element.offsetHeight
            };
        },

        /**
	    * 获取元素相对于浏览器视口(window)的坐标位置：即元素相对于文档的坐标减去滚动距离(如果存在)。
	    * @return	{Object}	返回一个包含left、right、top、bottom属性的对象
	    */
      	position: function(element) {
      		//获取元素
      		element = this[0];

      		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
      			scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
      			actualLeft = $.getElementLeft(element),
                actualTop = $.getElementTop(element);

  			return {
                left: 	actualLeft - scrollLeft,
                right: 	actualLeft - scrollLeft + element.offsetWidth,
                top: 	actualTop - scrollTop,
                bottom: actualTop - scrollTop + element.offsetHeight
        	};
       	},
       

       	/**
	    * 获取文档区域(document)或元素节点(node)或浏览器视口(window)的高度
	    * @return	{Number}
	    */
        height: function() {
        	var selector = this[0];

        	//获取文档(document)高度
        	if ($.isNode(selector) && selector === document) {
        		return Math.max(document.body.scrollHeight, document.body.clientHeight) 
        			|| Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight);
        	//获取元素高度
        	} else if ($.isNode(selector)) {
        		return selector.offsetHeight;
        	//获取浏览器视口(window)高度
        	} else if ($.isWindow(selector)) {
        		return document.compatMode === 'BackCompat' ? document.body.clientHeight : document.documentElement.clientHeight;
        	}

        },


        /**
	    * 获取文档区域(document)或元素节点(node)或浏览器视口(window)的宽度
	    * @return	{Number}
	    */
        width: function() {
        	var selector = this[0];

        	//获取文档(document)宽度
        	if ($.isNode(selector) && selector === document) {
        		return Math.max(document.body.scrollWidth, document.body.clientWidth)
        			|| Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth);
        	//获取元素宽度
        	} else if ($.isNode(selector)) {
        		return selector.offsetWidth;
        	//获取浏览器视口(window)宽度
        	} else if ($.isWindow(selector)) {
        		return document.compatMode === 'BackCompat' ? document.body.clientWidth : document.documentElement.clientWidth;
        	}
        },

	    /**
	    * 读写HTML格式内容 - (不支持文本框)
	    * @param	{String}	内容
	    */
	    html: function(content) {
	    	var elem = this[0];

	    	//不传入content参数时为读取html内容
	    	if (content === undefined) {
	    		return elem.innerHTML;
	    	}

	    	//传入content参数时为设置html格式内容
	    	//为单个元素设置html内容
	    	if ($.isNode(elem)) {
	    		$.cleanData(elem.getElementsByTagName('*'));//清除缓存
	    		elem.innerHTML = content;
	    	//为元素集合设置html内容
	    	} else if ($.isNodeList(elem) && $.isAry(elem)) {
	    		$.each(elem, function() {
	    			$.cleanData(this.getElementsByTagName('*'));
	    			this.innerHTML = content;
	    		});
	    	}

	    	return this;
	    },

	    /**
	    * 移除节点(支持单个节点或节点列表)
	    */
	    remove: function() {
	    	var elem = this[0];

	    	//移除单个节点
	    	if ($.isNode(elem)) {
	    		$.cleanData(elem.getElementsByTagName('*'));//清除元素集的事件和缓存
		    	$.cleanData([elem]);
		    	elem.parentNode.removeChild(elem);
	    	//移除节点列表
	    	} else if ($.isNodeList(elem) && $.isAry(elem)) {
	    		$.each(elem, function() {
	    			$.cleanData(this.getElementsByTagName('*'));//清除元素集的事件和缓存
			    	$.cleanData([this]);
			    	this.parentNode.removeChild(this);
	    		});
	    	}

	    	return this;
	    },

	    /**
	    * 事件绑定
	    * @param	{String}	类型
	    * @param	{Function}	要绑定的函数
	    */
	    bind: function(type, callback) {
	    	$.event.add(this[0], type, callback);
	    	return this;
	    },

	    /**
	    * 移除事件
	    * @param	{String}	类型
	    * @param	{Function}	要卸载的函数
	    */
	    unbind: function(type, callback) {
	    	$.event.remove(this[0], type, callback);
	    	return this;
	    },

	    /*
	    * 向匹配的元素内部追加节点或HTML内容(注意：追加的HTML内容或节点还是在该匹配元素内部，只不过是成为其最后一个子节点(当存在子节点时))
	    * @param 	{Elemet || String}
	    * @return 	{this} 实现链式调用
	    */
	    append: function(elem) {
	    	var selector = this[0],//取得匹配的元素
	    		_this = this;//以便在闭包里能访问到Cyer实例对象
	    	//匹配单个元素
	    	if (!$.isEmpty(selector) && $.isNode(selector)) {
		    	$.isNode(elem) ? this.insertNode(selector, "beforeEnd", elem) : this.insertHTML(selector, "beforeEnd", elem);
	    		return this;
	    	//匹配元素集合
	    	} else if ($.isNodeList(selector) && $.isAry(selector)) {
	 			//遍历HTMLCollection
	    		$.each(selector, function() {
	    			$.isNode(elem) ? _this.insertNode(this, "beforeEnd", elem) : _this.insertHTML(this, "beforeEnd", elem);
	    		});
	    		return this;
	    	}
	    	
	    },

	    /*
	    * 向匹配的元素内部前置节点或HTML内容(注意：前置的HTML内容或节点还是在该匹配元素内部，只不过是成为其第一个子节点(当存在子节点时))
	    * @param 	{Elemet || String}
	    * @return 	{this} 实现链式调用
	    */
	    prepend: function(elem) {
	    	var selector = this[0],
	    		_this = this;
	    	//匹配单个元素
	    	if (!$.isEmpty(selector) && $.isNode(selector)) {
		    	//使用条件表达式
		    	$.isNode(elem) ? this.insertNode(selector, "afterBegin", elem) : this.insertHTML(selector, "afterBegin", elem);
	    		return this;
	    	//匹配元素集合
	    	} else if ($.isNodeList(selector) && $.isAry(selector)) {
	 			//遍历HTMLCollection
	    		$.each(selector, function() {
	    			$.isNode(elem) ? _this.insertNode(this, "afterBegin", elem) : _this.insertHTML(this, "afterBegin", elem);
	    		});
	    		return this;
	    	}
	    },

	    /*
	    * 移动节点方法：把一个元素或HTML内容移动到匹配的元素之前
	    * @param	{ELement}
	    * @return 	{this}
	    */
	    before: function(elem) {
	    	var selector = this[0],
	    		_this = this;
	    	//匹配单个元素
	    	if (!$.isEmpty(selector) && $.isNode(selector)) {
		    	//使用条件表达式
		    	$.isNode(elem) ? this.insertNode(selector, "beforeBegin", elem) : this.insertHTML(selector, "beforeBegin", elem);
	    		return this;
	    	//匹配元素集合
	    	} else if ($.isNodeList(selector) && $.isAry(selector)) {
	 			//遍历HTMLCollection
	    		$.each(selector, function() {
	    			$.isNode(elem) ? _this.insertNode(this, "beforeBegin", elem) : _this.insertHTML(this, "beforeBegin", elem);
	    		});
	    		return this;
	    	}
	    },

	    /*
	    * 移动节点方法：把一个元素或HTML内容移动到匹配的元素之后
	    * @param	{ELement}
	    * @return 	{this}
	    */
	    after: function(elem) {
	    	var selector = this[0],
	    		_this = this;
	    	//匹配单个元素
	    	if (!$.isEmpty(selector) && $.isNode(selector)) {
		    	//使用条件表达式
		    	$.isNode(elem) ? this.insertNode(selector, "afterEnd", elem) : this.insertHTML(selector, "afterEnd", elem);
	    		return this;
	    	//匹配元素集合
	    	} else if ($.isNodeList(selector) && $.isAry(selector)) {
	 			//遍历HTMLCollection
	    		$.each(selector, function() {
	    			$.isNode(elem) ? _this.insertNode(this, "afterEnd", elem) : _this.insertHTML(this, "afterEnd", elem);
	    		});
	    		return this;
	    	}
	    },

		/**
		* 插入节点(四种情况如下：)
		* beforeBegin(brfore||previous)、afterBegin(first)、beforeEnd(last)、afterEnd(after||nextSibling)
		* 1.beforeBegin: 插入到标签开始前
		* 2.afterBegin:  插入到标签开始标记之后
		* 3.beforeEnd:   插入到标签结束前
		* 4.afterEnd:    插入到标签结束标记之后
		* @oaran{Element} elem
		* @param{String} where
		* @param{ELement} parseNode
		*/
		insertNode: function(elem, where, parsedNode) {
			//匹配位置where
			switch (where) {
				//匹配beforeBegin情况(把第三个参数节点插入到第一个参数节点的前面)
				case "beforeBegin":
					elem.parentNode.insertBefore(parsedNode, elem);
					break;

				//匹配afterBegin情况(插入到父元素的第一个位置)
				case "afterBegin":
					elem.insertBefore(parsedNode, elem.firstChild);
					break;

				//匹配beforeEnd情况(插入到父元素的最后一个位置)
				case "beforeEnd":
					elem.appendChild(parsedNode);
					break;

				//匹配afterEnd情况(把第三个参数节点插入到第一个参数节点的后面)
				case "afterEnd":
					if (elem.nextSibling) {
						elem.parentNode.insertBefore(parsedNode, elem.nextSibling);
					} else {
						elem.parentNode.appendChild(parsedNode);
					}
					break;

				//默认匹配
				default:
					throw new Error("it dot not match anything");
			}
		},

		/**	
		* 插入HTML格式内容(四种情况如下：)
		* beforeBegin(brfore||previous)、afterBegin(first)、beforeEnd(last)、afterEnd(after||nextSibling)
		* @oaran{Element} elem
		* @param{String} where
		* @param{String} html
		*/
		insertHTML: function(elem, where, html) {
			where = where.toLowerCase();//先把位置参数变成小写

			if (elem.insertAdjacentHTML) {//IE有效
				//匹配位置where
				switch (where) {
					case "beforebegin":
						elem.insertAdjacentHTML("beforeBegin", html);
						return elem.previousSibling; //返回该节点相邻的上一个节点(插入html内容后的节点)

					case "afterbegin":
						elem.insertAdjacentHTML("afterBegin", html);
						return elem.firstChild;//返回该节点(父节点)的第一个子节点(修改后)

					case "beforeend":
						elem.insertAdjacentHTML("beforeEnd", html);
						return elem.lastChild;//返回该节点(父节点)的最后一个子节点(修改后)

					case "afterend":
						elem.insertAdjacentHTML("afterEnd", html);
						return elem.nextSibling;//返回该节点相邻的下一个节点

					default:
						throw "illegal insertion point ->'" + where + "'";			
				}
			}

			//w3c方法
			var range = elem.ownerDocument.createRange(),
				frag = null;//文档碎片(保存html内容)
			switch (where) {
				case "beforebegin":
					range.setStartBefore(elem);
					frag = range.createContextualFragment(html);
					elem.parentNode.insertBefore(frag, elem);//把文档碎片插入到elem节点之前
					return elem.previousSibling;//返回该节点相邻的上一个节点

				case "afterbegin":
					if (elem.firstChild) {
						range = setStartBefore(elem.firstChild);
						frag = range.createContextualFragment(html);
						elem.insertBefore(frag, elem.firstChild);
						return elem.firstChild;//返回该节点(父节点)的第一个子节点
					} else {
						elem.innerHTML = html;
						return elem.firstChild;
					}

				case "beforeend":
					if (elem.lastChild) {
						range.setStartAfter(elem.lastChild);
						frag = range.createContextualFragment(html);
						elem.appendChild(frag);
						return elem.lastChild;//返回该节点(父节点)的最后一个子节点
					} else {
						elem.innerHTML = html;
						return elem.lastChild;
					}

				case "afterend":
					range.setStartAfter(elem);
					frag = range.createContextualFragment(html);
					elem.parentNode.insertBefore(frag, elem.nextSibling);
					return elem.nextSibling;//返回该节点相邻的下一个节点

				default:
					throw "illegal insertion point ->'" + where + "'";	
			}

		}

	};


	//因为$.prototype = $.fn，所以使用new操作符调用init构造函数后返回的实例对象共享$原型的方法
	$.fn.init.prototype = $.fn;

	/**
	* 搜索子元素:find (暂时支持返回第一个子元素)
	* 注意：支持nodeName或.className或nodeName.className的形式，并且只返回第一个元素
	* @param	{String}
	* @return {element}
	*/
	$.fn.find = function(expr) {
		var value,
			arr = [],
			elem = this[0],
			className = expr.split('.')[1];//把字符串基于"."分隔为一个数组，返回数组的第二项

		if (className) {
			//原生的getElementsByClassName方法
			if (document.getElementsByClassName) {
				//单个元素
				if ($.isNode(elem)) {
					value = elem.getElementsByClassName(className);
					arr.push(value);

				//元素集合
				} else if ($.isNodeList(elem) && $.isAry(elem)) {
					$.each(elem, function() {
						value = this.getElementsByClassName(className);
						arr.push(value);
					});	
					
				}
			//不支持原生getElementsByClassName方法的浏览器使用getElemsByClassName方法获取元素||集合
			} else {
				//单个元素
				if ($.isNode(elem)) {
					value = $.getElemsByClassName(className, elem);
				//元素集合
				} else if ($.isNodeList(elem) && $.isAry(elem)) {
					$.each(elem, function() {
						value =  $.getElemsByClassName(className, this);
						arr.push(value);
					});	
				}
				
			}
		//如果不存在"."(className)，即expr为nodeName，则使用getElementsByTagName获取元素集合
		} else {
			value = elem.getElementsByTagName(expr);
			arr.push(value);
		}

		return $(arr[0]);//返回第一个匹配的元素
	
	};

	

	//全局函数(即挂在$对象上的函数)
	/** 
	 * 检测window 
	 * @return {Boolean}
	 */
	$.isWindow = function(obj) {
		return obj && typeof obj === 'object' && 'setInterval' in obj;
	};

	/**
	 * 判断是否IE
	 * @return {Boolean}
	 */
	$.isIE = function() {
		return /MSIE/i.test(navigator.userAgent);
	};

	/**
	 * 判断是否是chrome
	 * @return {Boolean}
	 */
	$.isChrome = function() {
		return /Chrome/i.test(navigator.userAgent);
	};
	$.isWebKit = function() {
		return /WebKit/i.test(navigator.userAgent);
	};

	/**
	 * 判断是否是火狐
	 * @return {Boolean}
	 */
	$.isFirefox = function() {
		return /Firefox/i.test(navigator.userAgent);
	};

	/**
	 * 是否已定义
	 * @param {Object}
	 * @return {Boolean}
	 */
	$.isDefined = function(obj) {
	 	return typeof obj !== 'undefined';
	};

	 /**
	 * 是否是字符串
	 * @param {Object}
	 * @return {Boolean}
	 */
	$.isStr = function(obj) {
		return typeof obj === 'string';
	};

	 /**
	 * 是否数字
	 * @param {Object}
	 * @return {Boolean}
	 */
	$.isNum = function(obj) {
		return isFinite(obj);
	};

	 /**
	 * 是否是日期
	 * @param {Object}
	 * @return {Boolean}
	 */
	$.isDate = function(obj) {
	 	return (obj !== null) && !isNaN(obj) && (typeof obj.getDate !== 'undefined');
	};

	/**
	 * 是否是对象类型
	 * @param {Object}
	 * @return {Boolean}
	 */
	$.isObj = function(obj) {
		return !!(obj && typeof obj === 'object');
	};

	/**
	 * 是否是方法类型
	 * @param {Object}
	 * @return {Boolean}
	 */
	$.isFn = function(obj) {
		return !!(obj && typeof obj === 'function');
	};

	/**
	 * 是否是可以迭代(数组和类数组对象返回true)
	 * @param {Object}
	 * @return {Boolean}
	 */
	$.isAry = function(obj) {
		return !!(obj && (obj.constructor && obj.constructor.toString().indexOf('Array') > -1 || $.isNodeList(obj)));
	};

	/**
	 * 是否是节点列表
	 * @param {Object}
	 * @return {Boolean}
	 */
	$.isNodeList = function(obj) {
		// xxx类型调用toString()方法返回[object xxx];
		return !!(obj && (obj.toString() === '[object NodeList]' || obj.toString() === '[object HTMLCollection]' || (obj.length && $.isNode(obj[0]))));
	};

	/**
	 * 是否是节点
	 * @param {Object}
	 * @return {Boolean}
	 */
	$.isNode = function(obj) {
		return !!(obj && obj.nodeType);
	};

	/**
	 * 一个字符串能否根据空格拆分成一个数组，数组内元素个数大于1
	 * @param {String}
	 * @return {Boolean}
	 */
	$.isCanSplit2Ary = function(obj, sign) {
		return $.isStr(obj) && obj.split(sign || /\s+/g).length > 1; 
	};

	/**
	 * 是否为空
	 * @param {Object}
	 * @return {Boolean}
	 */
	$.isEmpty = function(obj) {
		// 依次判断是否为undefined、null、节点、可迭代(长度为0)、字符串(为空)
		return typeof obj === 'undefined' || obj === null || (!$.isNode(obj) && $.isAry(obj) && obj.length === 0 || ($.isStr(obj) && obj == ''));
	};

	/**
	 * 比较element位置 如果a包含b返回true，否则返回false
	 * @param {Element}
	 * @param {Element}
	 * @reutn {Boolean}
	 */
	$.contains = function(a, b) {
		return a.contains ? a !== b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16);
	};
	
	/**
	 * 根据id获取元素(==document.getElementById)
	 * @param {String}
	 * @param {Element} [root] 可选,从哪个根节点查找
	 * @return {Element}
	 */
	$.getElemByID = function(id, root) {
		var elem = document.getElementById(id);

		// 如果存在根节点
		if (root) {
			if ($.contains(root, elem)) { //且根节点包含elem节点
				return elem;
			}
			return null;
		}

		return elem; //否则直接返回
	};

	/**
	 * 根据tagName获取元素集合(==document.getElementsByTagName)
	 * @param {String}
	 * @param {Element} [root] 可选,从哪个根节点查找
	 * @return {[Element]|Null}
	 */
	$.getElemsByTagName = function(tagName, root) {
		var elems = (root || document).getElementsByTagName(tagName);
		return elems !== null && elems.length ? elems : null;
	};

	/**
	 * 根据className(类名)获取元素(返回的是一个HTMLCollection)
	 * @param {String}
	 * @param {Element} [root] 可选,从哪个根节点查找
	 * @return {[Element]|Null}
	 */
	$.getElemsByClassName = function(className, root, tagName) {
		root = root || document; //没有传入根节点，则默认为document
		tagName = tagName || '*'; //没有传入标签，则默认获得所有标签
		var i = 0,
			classElements = [],
			elements = root.getElementsByTagName(tagName),
			elementsLen = elements.length;
			pattern = new RegExp('(^|\\s)' + className + '(\\s|$)');//className为传入的参数
		//遍历所有的元素，如果匹配到传入元素的className，则把对应的元素添加到数组中并返回
		for (; i < elementsLen; i++) {
			if (pattern.test(elements[i].className)) {
				classElements.push(elements[i]);
			}
		}
		return classElements;
	};

	/**
	 * 根据name获取元素集合(==document.getElementsByName)
	 * @param {String}
	 * @param {Element} [root] 可选,从哪个根节点查找
	 * @return {[Element]|Null}
	 */
	$.getElemsByName = function(name, root) {
		var i, 
			elems = document.getElementsByName(name),//原生方法
			elemsLen,
			arr = [];
		//如果存在根节点,则遍历获取的元素集合,并返回根节点下的匹配的元素集合
		if (root) {
			for (i = 0, elemsLen = elems.length; i < elemsLen; i++) {
				if ($.contains(root, elems[i])) {
					arr.push(elems[i]);
				}
			}
			return arr;
		}

		return elems !== null && elems.length ? elems : null;//返回HTMLCollection
	};


    /**
    * 获取元素的左偏移量
    * @param {Object}
    * @return {Number}
    */
    $.getElementLeft = function(element) {
        var actualLeft = element.offsetLeft,
            current = element.offsetParent;//获取该元素当前的包含元素
        while (current !== null) {
            //将该元素的offsetLeft和其offsetParent的相同属性相加，直到循环至根元素
            actualLeft += current.offsetLeft;
            current = current.offsetParent;//循环每一个包含元素，直至为null
        }
        return actualLeft;
    };
    
    /**
    * 获取元素的上偏移量
    * @param {Object}
    * @return {Number}
    */
    $.getElementTop = function(element) {
        var actualTop = element.offsetTop,
            current = element.offsetParent;//获取该元素当前的包含元素
        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;//循环每一个包含元素，直至为null
        }
        return actualTop;
    };

    /**
    * 扩展对象,override参数的作用是是否覆盖第一个对象中的已有属性,true时覆盖，false时不覆盖.
    * @param {Object}
    * @param {Boolean}
    * @return {Object}
    */
    $.extend = function (destination, source, override) {
        if (override === undefined) {
            override = true;
        }
        for (var property in source) {
        	//如果override为true时(不提供此参数时也为true)，则覆盖第一个对象的已有属性
        	//如果override为false时且第一个对象destination的属性不存在source对象中，则不覆盖第一个对象的已有属性
            if (override || !(property in destination)) {
                destination[property] = source[property];
            }
        }
        //返回合并后的对象
        return destination;
    };

    /**
    * 深度扩展对象--适用于对象的属性也是对象的情况
    * @param {Object}
    * @return {Object}
    */
    $.deepextend = function (destination, source) {
        for (var property in source) {
            var copy = source[property];//获取source属性值

            if (destination === copy) {
                continue;
            }

            //如果copy是一个对象，则递归调用(并传入copy参数)，直到copy不是一个对象为止
            if (typeof copy === 'object') {//$.isObj(copy)
                destination[property] = arguments.callee(destination[property] || {}, copy); //递归调用
            //否则直接把copy赋值给destination对象的属性(此时与$.extend方法等价)
            } else {
                destination[property] = copy;
            }
        }
        return destination;
    };

	/**
	* 遍历(对象或数组)--(callback函数有两个参数，依次为属性名name,属性值value)
	* @param {Object}
	* @param {Function}
	* @return {Object}
	*/
	$.each = function(object, callback) {
		if (object === null) {
			return;//终止执行
		}
		//遍历数组,在每一项上调用回调函数
		if (Object.prototype.toString.call(object) === "[object Array]") {
			var i,
				len;
			for (i = 0, len = object.length; i < len; i++) {
				if(typeof callback === "function") {
					if (callback.call(object[i], i, object[i]) === false) {
						break;//or return;
					}
				}
			}
		//遍历对象,在每个属性上调用回调函数
		} else if (Object.prototype.toString.call(object) === "[object Object]") {
			if (typeof callback === "function") {
				for (var k in object) {
					if (callback.call(object[k], k, object[k]) === false) {
						break;//or return;
					}
				}		
			}
		}
	};

	/**
	 * 合并字符串
	 * @param {Array|Map}
	 * @param {String} connectStr 链接每个属性的字符
	 * @param {String} 遍历Map的时候，链接key与value的字符
	 * @return {String}
	 */
	$.concat = function(obj, connectStr, connectOper) {
		//原生方法验证字符串
		if (Object.prototype.toString.call(obj) === "[object String]") { //或者typeof obj === "string"
			return obj;
		}
		var connectStr = "&" || connectStr,//名值对之间的分隔符
			connectOper = "=" || connectOper,//名值之间的分隔符
			reStr = [];

		//如果是数组，则直接返回数组基于相应分隔符的字符串表示
		if (Object.prototype.toString.call(obj) === "[object Array]") {
			return obj.join(connectStr);
		}

		//遍历数组或对象
		$.each(obj, function(index, value) {
			reStr.push(index + connectOper + value);
		})
		//返回数组或对象基于相应分隔符的字符串表示
		return reStr.join(connectStr);
	};



	/**
	* 获取元素的最终样式值
	* @param {Object}
	* @param {String}
	* @return {String}
	*/
	$.css = 'defaultView' in document && 'getComputedStyle' in document.defaultView
			? function(elem, name) {
				return document.defaultView.getComputedStyle(elem, false)[name];
			} : function(elem, name) {
				return elem.currentStyle[name] || '';
			};

	/**
	* 读写缓存
	* @param	{HTMLElement}	元素
	* @param	{String}		缓存名称
	* @param	{Any}			数据
	* @return	{Any}			如果无参数data则返回缓存数据
	*/
	$.data = function(elem, name, data) {
		var cache = $.cache,//cache变量引用一个空对象
			id = uuid(elem);//获取元素的唯一身份

		if (name === undefined) {
			return cache[id];//没有缓存名称(name)参数时，为读取缓存数据(根据元素所标记的id)
		}

		if (!cache[id]) {
			cache[id] = {};
		}

		if (data !== undefined) {
			cache[id][name] = data;//有data参数时，为写入缓存数据(根据元素所标记的id和缓存名称)
		}

		return cache[id][name];
	};

	/**
	* 删除缓存
	* @param	{HTMLElement}	元素
	* @param	{String}		缓存名称
	*/
	$.removeData = function(elem, name) {
		var empty = true,
			expando = $.expando,
			cache = $.cache,//cache变量引用一个空对象
			id = uuid(elem),//获取元素的唯一身份
			thisCache = id && cache[id];

		if (!thisCache) {
			return;//终止执行
		}

		if (name) {//如果存在缓存名称时，则删除该名称对应的值(缓存数据)
			delete thisCache[name];
			for (var n in thisCache) {
				empty = false;
			}

			if (empty) {
				delete $.cache[id];//删除缓存名称
			}
		} else {//如果不存在缓存名称
			delete cache[id];

			if (elem.removeAttribute) {//删除元素的属性
				elem.removeAttribute(expando);
			} else {
				elem[expando] = null;
			}
		}
	};

	$.uuid = 0;
	$.cache = {};
	$.expando = '@cache' + + new Date;

	//标记元素唯一身份(当元素对象引用为window时，id为0)
	function uuid(elem) {
		var expando = $.expando,
			id = elem === window ? 0 : elem[expando];
		if (id === undefined) {
			elem[expando] = id = ++$.uuid;
		}
		return id;
	}

	/**
	* 事件机制
	* @namespace
	* @requires	[$.data, $.removeData]
	*/
	$.event = {
	    /**
	    * 添加事件(暂不支持为多个元素同时绑定事件)
	    * @param	{HTMLElement}	元素
	    * @param	{String}		事件类型
	    * @param	{Function}		要添加的函数
	    */
	    add: function (elem, type, callback) {
	        var cache, 
	        	listeners,
	            that = $.event,
	            me = $.isSomthing,
	            data;

	        //data是一个对象，保存添加到元素的事件类型type(即type是data的一个属性，且为一个对象)
	        data = $.data(elem, '@events') || $.data(elem, '@events', {});//获取元素事件缓存的数据
	            
	        //取得元素的数据缓存cache(该cache是一个对象，保存着elem、listeners、handler属性，默认为一个空对象)
	        cache = data[type] = data[type] || {};
	       	
	        //listeners是一个保存事件处理函数(handler)的数组
	        listeners = cache.listeners = cache.listeners || [];
	        listeners.push(callback);//把事件处理函数添加到listeners数组中(即保存着注册在一个元素的同一事件类型的多个事件处理函数)
	        
	        //如果不存在cache对象的handler属性,则通过$.event.handler方法获取cache对象的handler属性
	        if (!cache.handler) {
	            cache.elem = elem;
	            cache.handler = that.handler(cache);
	            
	            elem.addEventListener
	            ? elem.addEventListener(type, cache.handler, false)
	            : elem.attachEvent('on' + type, cache.handler);
	        }
	    },
	    
	    /**
	    * 卸载事件
	    * @param	{HTMLElement}	元素
	    * @param	{String}		事件类型
	    * @param	{Function}		要卸载的函数
	    */
	    remove: function (elem, type, callback) {
	        var i, 
	        	cache, 
	        	listeners,
	            that = $.event,
	            empty = true,
	            data = $.data(elem, '@events');
	        
	        //如果元素不存在缓存的数据,则终止执行，返回undefined。
	        if (!data) {
	            return;
	        }
	        
	        //如果不存在缓存的事件类型，则直接删除元素。
	        if (!type) {
	            for (i in data) {
	            	that.remove(elem, i);
	            }
	            return;
	        }
	        
	        cache = data[type];
	        
	        if (!cache) {
	            return;
	        }
	        
	        listeners = cache.listeners;

	        //如果存在callback，则删除listeners数组中的callback，否则直接重置listeners为一个空数组
	        if (callback) {
	            for (i = 0; i < listeners.length; i ++) {
	                listeners[i] === callback && listeners.splice(i--, 1);
	            }
	        } else {
	            cache.listeners = [];
	        }
	        
	        if (cache.listeners.length === 0) {
	            elem.removeEventListener
	            ? elem.removeEventListener(type, cache.handler, false)
	            : elem.detachEvent('on' + type, cache.handler);
	            
	            delete data[type];
	            cache = $.data(elem, '@events');
	            
	            for (var n in cache) {
	                empty = false;
	            }
	            
	            //删除元素缓存的事件
	            if (empty) {
	                $.removeData(elem, '@events');
	            }
	        }
	    },
	    
	    /** @inner 事件句柄(事件处理函数) */
	    handler: function (cache) {
	        return function (event) {
	            event = $.event.fix(event || window.event);//取得eventObj对象(包括target、preventDefault、stopPropagation属性)
	            for (var i = 0, list = cache.listeners, fn; fn = list[i++];) {
	                if (fn.call(cache.elem, event) === false) {
	                    event.preventDefault();
	                    event.stopPropagation();
	                }
	            }
	        }
	    },
	    
	    /** @inner Event对象兼容处理 */
	    fix: function (event) {
	        if (event.target) {
	            return event;
	        }
	        
	        var eventObj = {
	            target: event.srcElement || document,
	            preventDefault: function () {event.returnValue = false},
	            stopPropagation: function () {event.cancelBubble = true}
	        };
	        
	        // IE6/7/8 在原生window.event对象写入数据会导致内存无法回收，应当采用拷贝
	        for (var i in event) {
	            eventObj[i] = event[i];
	        }
	        
	        return eventObj;
	    }
	    
	};

	/**
	* 清理元素集的事件与缓存
	* @requires	[$.removeData, $.event]
	* @param	{HTMLCollection}	元素集
	*/
	$.cleanData = function(elems) {
		var i = 0,
			elem,
			len = elems.length,
			removeEvent = $.event.remove,
			removeData = $.removeData;

		for (; i < len; i++) {
			elem = elems[i];
			removeEvent(elem);
			removeData(elem);
		}
	};

	/**
	* 获取(垂直和水平)滚动条位置 - [不支持写入]
	* @example	获取文档垂直滚动条：$(document).scrollTop()
	* @return	{Number}	返回滚动条位置
	*/
	$.each(['Left', 'Top'], function(i, name) {
		var method = 'scroll' + name;

		$.fn[method] = function() {
			var elem = this[0],
				win;

			win = getWindow(elem);
			return win 
				? ('pageXOffset' in win) 
					? win[i ? 'pageYOffset' : 'pageXOffset'] 
					: win.document.documentElement[method] || win.document.body[method]
				: elem[method];
		};
	});
	function getWindow(elem) {
		return $.isWindow(elem)
			? elem
			: elem.nodeType === 9
				? elem.defaultView || elem.parentWindow
				: false;
	}


	//返回$
	return $;//$===Cyer

})(window);



