##Cyer
   Cyer是一个轻量、小巧的js框架，精简易懂的API设计，支持链式调用，有点jQuery的味道。核心部分为选择器<strong>(selector)、dom操作、event机制。</strong>

   从大二下半学期到现在，接触js也有一段时间了，以前一直使用jQuery处理页面的交互效果，在赞叹jQuery简洁的API以及其实现技巧如此强大的同时逐渐发现js的重要性。

   于是就有了构建一个适合自己的js框架的想法，参考jQuery的架构，API应该简洁易懂，且兼容主流浏览器<strong>Firefox、chrome、IE以及IE6+</strong>。
全局对象使用美元符号$，在$(Cyer的简写)里调用一个初始化init构造函数并返回一个实例对象，而不是使用new操作符直接调用$构造器生成实例，并且每个原型方法都返回$实例对象，以便实现链式调用。$对象包含<strong>原型方法</strong>(实例对象共享的方法)和<strong>全局函数</strong>(挂在$全局对象上的函数，也可称做静态方法)。

   核心部分主要为<strong>selector(用于获取和遍历页面上的元素)</strong>、<strong>dom操作</strong>、<strong>event机制</strong>，暂不支持<strong>animate</strong>功能。具体实现请看源码，里面有详细的注释和说明。
  
<hr>
<h4>Cyer-v1.0.1版本增加的API：</h4>
<ul>
<li>
一：对匹配元素追加或前置节点或HTML内容的方法；
</li>
<li>
二：对匹配元素进行移动和替换的方法；
</li>
<li>
三：插入一段HTML内容到匹配的元素或元素集合之前或之后；
</li>
</ul>
主要API有：
<h5>（1）append</h5>
向匹配的元素内部追加节点或HTML内容(注意：追加的HTML内容或节点还是在该匹配元素内部，只不过是成为其最后一个子节点(当存在子节点时))。
<h5>（2）prepend</h5>
向匹配的元素内部前置节点或HTML内容(注意：前置的HTML内容或节点还是在该匹配元素内部，只不过是成为其第一个子节点(当存在子节点时))。
<h5>（3）before</h5>
把一个元素或HTML内容移动到匹配的元素之前。
<h5>（4）after</h5>
把一个元素或HTML内容移动到匹配的元素之后。

<strong>注：</strong>该四个API都返回实例对象，以便实现链式调用。

<hr>
<h4>v1.0.2版本增加的API：</h4>
<p>新增全局函数：<strong>$.IO</strong></p>
<p>新增实例对象：<strong>$.io = new $.IO()</strong></p>
<p>新增API：<strong>$.io.ajax()</strong></p>

修改的API：<strong>$.each()</strong>

<strong>introduction：</strong>
该API主要封装了一个浏览器与服务器端进行通讯的简单ajax实现，该方法接收一个对象参数，支持服务器响应成功后返回的数据格式有：text、html、xml。

<strong>usage：</strong>
因为该模块独立出来，使用前请先引入Cyer-1.0.2.js文件，再引入该ajax.js文件即可。

注意，测试时请在服务器端进行测试。

<hr>
<h4>v1.0.3版本增加的API：</h4>

增加domReady事件，只要DOM结构加载完毕，脚本就可以尽快运行，而不用等页面元素全部加载完毕(触发load事件)后才执行相应代码，使页面加载速度更快。使用时类似于jQuery简写的dom就绪事件。
<strong>usage：</strong>
<pre>
$(function() {
  // do something
});
</pre>

##
在线API文档：http://hcy2367.github.io/Cyer
