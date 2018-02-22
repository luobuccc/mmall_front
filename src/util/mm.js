'use strict'

var Hogan = require('hogan.js');

var conf = {
    serverHost: ''
}

var _mm = {
    request: function (param) {
        var _this = this;
        $.ajax({
            type: param.method || 'get',
            url: param.url || '',
            dataType: param.type || 'json',
            data: param.data || '',
            success: function (res) {
                //请求成功
                if (0 === res.status) {
                    typeof param.success === 'function' && param.success(res.data, res.msg);
                }
                //强制登陆
                else if (10 === res.status) {
                    _this.doLogin();
                }
                //请求数据错误
                else if (1 === res.status) {
                    typeof param.error === 'function' && param.error(res.msg);
                }
            },
            error: function (res) {
                typeof param.error === 'function' && param.error(res.status);
            }
        });
    },
    //获取服务器地址
    getServerUrl: function (path) {
        return conf.serverHost + path;

    },
    //获取url参数
    getUrlParam: function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        var result = window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : null;
    },
    //渲染html模板
    renderHtml: function (htmlTemplate, data) {
        var template = Hogan.compile(htmlTemplate),
            result = template.render(data);
        return result;
    },
    //成功提示
    successTips: function (msg) {
        alert(msg || '操作成功!');
    },
    //失败提示
    errorTips: function (msg) {
        alert(msg || '操作失败!');
    },
    //字段验证，支持是否为空、手机、邮箱
    validate: function (value, type) {
        var value = $.trim(value);
        //非空验证
        if ('require' === type) {
            return !!value;
        }
        //手机验证
        if ('phone' === type) {
            return /^[1][3,4,5,7,8][0-9]{9}$/.test(value);
        }
        //邮箱验证
        if ('email' === type) {
            return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
        }
    },
    //统一登录处理
    doLogin: function () {
        window.location.href = './user-login.html?redirect=' + encodeURIComponent(window.location.href);
    },
    //返回主页
    goHome: function () {
        window.location.href = './index.html';
    }
};

module.exports = _mm;