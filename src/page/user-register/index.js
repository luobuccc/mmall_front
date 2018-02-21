'use strict';

require('./index.css');
require('page/common/nav-simple/index.js');
var _mm = require('util/mm.js');
var _user = require('service/user-service.js');

var formError = {
    show: function (errMsg) {
        $('.error-item').show().find('.err-msg').text(errMsg);
    },
    hide: function (errMsg) {
        $('.error-item').show().find('.err-msg').text('');
    }
};

// page 逻辑部分
var page = {
    init: function () {
        this.bindEvent();
    },
    bindEvent: function () {
        var _this = this;
        //验证username
        $('#username').blur(function () {
            var username = $.trim($(this.val()));
            //用户名为空
            if(!username){
                return;
            }
            //异步验证
            _user.checkUsername(username, function (res) {
                formError.hide();
            }, function (errMsg) {
                formError.show(errMsg);
            });
        });
        $('#submit').click(function () {
            _this.submit();
        });
        //回车同步
        $('.user-content').keyup(function (e) {
            if (e.keycode === 13) {
                _this.submit();
            }
        });
    },
    submit: function () {
        var formData = {
                username: $.trim($('#username').val()),
                password: $.trim($('#password').val()),
                passwordConfirm: $.trim($('#password-confirm').val()),
                phone: $.trim($('#phone').val()),
                email: $.trim($('#email').val()),
                question: $.trim($('#question').val()),
                answer: $.trim($('#answer').val()),
            },
            //表单验证结果
            validateResult = this.formValidate(formData);
        if (validateResult.status) {
            //提交
            _user.register(formData, function (res) {
                window.location.href = './result.html?type=register';
            }, function (errMsg) {
                formError.show(errMsg);
            });
        } else {
            //错误提示
            formError.show(validateResult.msg);
        }
    },
    formValidate: function (formData) {
        var result = {
            status: false,
            msg: ''
        };
        if (!_mm.validate(formData.username, 'require')) {
            result.msg = '用户名不能为空';
            return result;
        }
        if (!_mm.validate(formData.password, 'require')) {
            result.msg = '密码不能为空';
            return result;
        }
        if (formData.password.length < 6) {
            result.msg = '密码长度不能少于6位';
            return result;
        }
        if (formData.password !== formData.passwordConfirm) {
            result.msg = '两次输入的密码不一致';
            return result;
        }
        if (!_mm.validate(formData.phone, 'phone')) {
            result.msg = '手机号格式不正确';
            return result;
        }
        if (!_mm.validate(formData.email, 'email')) {
            result.msg = '邮箱格式不正确';
            return result;
        }
        if (!_mm.validate(formData.question, 'require')) {
            result.msg = '密码提示问题不能为空';
            return result;
        }
        if (!_mm.validate(formData.answer, 'require')) {
            result.msg = '答案不能为空';
            return result;
        }
        //通过验证
        result.status = true;
        result.msg = '验证通过';
        return result;
    }
};

$(function () {
    page.init();
});