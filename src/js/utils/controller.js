class Controller {

  constructor() {}

  // 提示框
  static showMessage(val, iserr = 0) {
    let icon = iserr ? 'ok color-success' : 'remove color-error';
    $("#messagesTxt").html(`<span class="glyphicon glyphicon-${icon}"></span>${val}`);
    $("#messagesBox").modal('show');
  }

  // 显示加载
  static showLoading() {
    $("#loadingBox").modal('show');
  }

  // 隐藏加载
  static hideLoading() {
    $("#loadingBox").modal('hide');
  }

  // 获取表单值
  static getFormData(selector) {
    selector = selector || 'input, select, textarea';
    let data = {};
    $(selector).each((index, el) => {
      if (el.value.trim().length) data[el.name] = el.value;
    });
    return data;
  }

  // ajax封装
  static ajax(options, success) {
    Controller.showLoading();
    options.success = options.success || function(data) {
      Controller.hideLoading();
      if (data.code == 0) {
        success(data);
      } else {
        if (data.code == 100008) {
          // Controller.showMessage('登录超时，请重新登录！');
          window.location.href = '/login.html';
        } else {
          Controller.showMessage(data.msg);
        }
      }
    }
    options.error = options.error || function(data) {
      Controller.hideLoading();
      Controller.showMessage('网络异常，请稍后重试');
    }
    options.url = 'http://devapi.nfangbian.com' + options.url;

    $.ajax(options);
  }

  // 获取cookie
  static getCookie(name) {
    let r = new RegExp("(^|;|\\s+)" + name + "=([^;]*)(;|$)");
    let m = document.cookie.match(r);
    return (!m ? "" : decodeURIComponent(m[2]));
  }

  // 设置cookie
  static setCookie(name, v, path, expire, domain) {
    let s = name + "=" + encodeURIComponent(v) + "; path=" + (path || '/') + (domain ? ("; domain=" + domain) : '');
    if (expire > 0) {
      let d = new Date();
      d.setTime(d.getTime() + expire * 1000);
      s += ";expires=" + d.toGMTString();
    }
    document.cookie = s;
  }

  // 删除cookie
  static delCookie(name, path, domain) {
    if (arguments.length == 2) {
      domain = path;
      path = "/";
    }
    document.cookie = name + "=;path=" + path + ";" + (domain ? ("domain=" + domain + ";") : '') + "expires=Thu, 01-Jan-70 00:00:01 GMT";
  }

  // 登录用户调用
  static isLogin(success) {
    const Token = this.getCookie('token');
    this.ajax({
      url: `/admin/index/checktoken?token=${Token}`,
      type: 'GET',
    }, (res) => {
      if (res.data.islogin == 1) {
        window.Token = Token;
        success && success();
      } else {
        window.location.href = '/login.html';
      }
    });
  }

  // 格式化金额(分转元)
  static formatMoney(val) {
    let rVal = parseInt(val);
    if (!rVal || rVal <= 0) return '0.00';
    let sVal = String(rVal);
    if (sVal.length == 1) sVal = '00'+ sVal;
    if (sVal.length == 2) sVal = '0'+ sVal;
    return sVal.replace(/(\d+)(\d{2})$/, '$1.$2');
  }

  // 获取url指定参数的值
  static getQuery(key) {
    return this.getQueryParams()[key];
  }

  // 获取url参数对象
  static getQueryParams() {
    let params = {};

    if(location.search.length == 0) return params;

    let keyValPairs = location.search.substr(1).split('&'),
      tempArr;

    for (let i = 0; i < keyValPairs.length; i++) {
      tempArr = keyValPairs[i].split('=');
      params[tempArr[0]] = decodeURIComponent(tempArr[1] || '');
    }

    return params;
  }

}

export default Controller;
