if (document.getElementsByClassName == undefined) {
  // IE compatibility (to be honest this whole product was never tested in IE)
  document.getElementsByClassName = function(className)
  {
    var hasClassName = new RegExp("(?:^|\\s)" + className + "(?:$|\\s)");
    var allElements = document.getElementsByTagName("*");
    var results = [];

    var element;
    for (var i = 0; (element = allElements[i]) != null; i++) {
      var elementClass = element.className;
      if (elementClass && elementClass.indexOf(className) != -1 && hasClassName.test(elementClass))
        results.push(element);
    }

    return results;
  }
}

(function() {
  var convert_textarea = function(area){
    var cursor_form_element = document.createElement('input');
    cursor_form_element.type = 'hidden';
    cursor_form_element.name = 'codemirror-cursor-position';
    area.form.appendChild(cursor_form_element);

    var cm = CodeMirror.fromTextArea(area, {
      value: area.value,
      mode: 'python',
      lineNumbers: true,
      matchBrackets: true,
      extraKeys: {
        "Ctrl-S": area.onCodeMirrorSave || function() {}
      },
      onCursorActivity: function() {
        var pos = cm.getCursor();
        cursor_form_element.value = '' + pos.line + '-' + pos.ch;
      }
    });
    if (area.onCodeMirrorLoad) {
      area.onCodeMirrorLoad(cm);
    }
  };

  function inject_css(uri, onload) {
    var head = document.getElementsByTagName('head')[0],
      style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/css';
    style.href = uri;
    style.onload = style.onreadystatechange = onload;
    head.appendChild(style);
  }

  function cssOnload(id, callback) {
    setTimeout(function listener(){
      var el = document.getElementById(id),
          comp = el.currentStyle || getComputedStyle(el, null);
      if ( comp.height === "1px" )
        callback();
      else
        setTimeout(listener, 50);
    }, 50)
  }

  function bodyOnLoad(callback) {
    setTimeout(function listener(){
      if ( document.body )
        callback();
      else
        setTimeout(listener, 50);
    }, 50)
  }

  function convert_textareas() {
    var areas = document.getElementsByClassName("codemirror-python");
    for (var i = areas.length - 1; i >= 0; i--) {
      convert_textarea(areas[i]);
    };
  }
  bodyOnLoad(function() {
    if (!window.CodeMirror) {
      var sc = document.createElement('script');
      sc.src = "/++resource++codemirror/codemirror-compressed.js";
      document.body.appendChild(sc);
    }
    // Inject codemirror stylesheet in HEAD
    var marker = document.createElement('div');
    marker.id = 'CodeMirrorLoadedFlag';
    document.body.appendChild(marker);
    var base_codemirror_uri = "/++resource++codemirror";
    inject_css(base_codemirror_uri + "/lib/codemirror.css");
    inject_css(base_codemirror_uri + "/theme/elegant.css");
    if (window.jQuery) {
      // check if some textareas are good to be converted
      jQuery("#plominoagent-base-edit #archetypes-fieldname-Content textarea").addClass('codemirror-python');
    }
    cssOnload('CodeMirrorLoadedFlag', convert_textareas);
  });
})();
