if (document.getElementsByClassName == undefined) {
  // IE compatibility
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
  var get_cookie_status = function() {
    return getCookie('ccm_enabled');
  };
  var set_cookie_status = function(status) {
    setCookie('ccm_enabled', status, 10, '/');
  };
  var convert_textarea = function(area){
    // Create a form element that will submit the current cursor position
    // This is useful to show the cursor in the same position after save
    var cursor_form_element = document.createElement('input');
    cursor_form_element.type = 'hidden';
    cursor_form_element.name = 'codemirror-cursor-position';
    area.form.appendChild(cursor_form_element);

    var toggle_span = document.createElement('span');
    toggle_span.class = "codemirror_toggle";
    var toggle_id = '' + Math.floor(Math.random()*111111111);
    var toggle_checkbox = document.createElement('input');
    toggle_checkbox.type = 'checkbox';
    toggle_checkbox.id = toggle_id;
    toggle_checkbox.checked = get_cookie_status();
    toggle_checkbox.onchange = function() {
      if (this.checked) {
        set_cookie_status('true');
        enable();
      } else {
        set_cookie_status('');
        disable();
      }
    };
    var toggle_label = document.createElement('label');
    toggle_label.htmlFor = toggle_id;
    toggle_label.innerHTML = 'CodeMirror';
    toggle_span.appendChild(toggle_checkbox);
    toggle_span.appendChild(toggle_label);

    area.parentNode.insertBefore(toggle_span, area)
    var cm; // enable and disable both need to access this var
    var mode = area.getAttribute("data-codemirror-mode") || {name: 'xml', htmlMode: true};
    var enable = function() {
      cm = CodeMirror.fromTextArea(area, {
        value: area.value,
        mode: mode,
        lineNumbers: true,
        matchBrackets: true,
        lineWrapping: true,
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
    var disable = function() {
      cm.toTextArea();
    };
    if (get_cookie_status()) {enable();}
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
    if (window.jQuery) {
      // check if some textareas are good to be converted
      jQuery("#plominoagent-base-edit #archetypes-fieldname-Content textarea").addClass('codemirror-python');
    }
    cssOnload('CodeMirrorLoadedFlag', convert_textareas);
  });
})();

function getCookie( name ) {
  var start = document.cookie.indexOf( name + "=" );
  var len = start + name.length + 1;
  if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) {
    return null;
  }
  if ( start == -1 ) return null;
  var end = document.cookie.indexOf( ';', len );
  if ( end == -1 ) end = document.cookie.length;
  return unescape( document.cookie.substring( len, end ) );
}

function setCookie( name, value, expires, path, domain, secure ) {
  var today = new Date();
  today.setTime( today.getTime() );
  if ( expires ) {
    expires = expires * 1000 * 60 * 60 * 24;
  }
  var expires_date = new Date( today.getTime() + (expires) );
  document.cookie = name+'='+escape( value ) +
    ( ( expires ) ? ';expires='+expires_date.toGMTString() : '' ) + //expires.toGMTString()
    ( ( path ) ? ';path=' + path : '' ) +
    ( ( domain ) ? ';domain=' + domain : '' ) +
    ( ( secure ) ? ';secure' : '' );
}
