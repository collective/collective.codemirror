from App.special_dtml import DTMLFile
try:
    import simplejson as json
except ImportError:
    import json
import re

def initialize(context):
    patch_pythonscripts()
    patch_pagetemplates()

def _cursor_position(request):
    cursor_position = request.get('codemirror-cursor-position', None)
    if cursor_position:
        return {
            'cursor_position': True,
            'line': int(cursor_position.split('-')[0]),
            'ch': int(cursor_position.split('-')[1]),
        }
    else:
        return {
            'cursor_position': False,
        }

def patch_pythonscripts():
    import Products.PythonScripts
    PythonScript = Products.PythonScripts.PythonScript.PythonScript
    ZPythonScriptHTML_editForm = DTMLFile('pyScriptEdit', globals())
    PythonScript.manage = PythonScript.manage_main = ZPythonScriptHTML_editForm
    PythonScript.ZPythonScriptHTML_editForm =ZPythonScriptHTML_editForm
    original_compile = PythonScript._compile
    def get_codemirror_json(self, request):
        error_lines = [int(re.sub(r'.*line ([0-9]+)\).*',r'\1',error))
                       for error in self.errors
                       if re.match(r'.*line ([0-9]+)\).*', error)]
        data = {
            'error_lines': error_lines,
        }
        data.update(_cursor_position(request))
        return json.dumps(data)
    PythonScript.get_codemirror_json = get_codemirror_json

def patch_pagetemplates():
    from Products.PageTemplates.PageTemplateFile import PageTemplateFile
    from Products.PageTemplates.ZopePageTemplate import ZopePageTemplate
    from zope.pagetemplate.pagetemplate import _error_start
    # customize `pt_editForm` of ZopePageTemplate
    tmpl = PageTemplateFile('ptEdit', globals(), __name__='pt_editForm')
    tmpl._owner = None
    ZopePageTemplate.pt_editForm = tmpl
    ZopePageTemplate.manage = tmpl
    ZopePageTemplate.manage_main = tmpl
    def get_codemirror_json(self, request):
        error_lines = [int(re.sub(r'.*line ([0-9]+),.*',r'\1',error))
                       for error in getattr(self, '_v_errors', [])
                       if re.match(r'.*line ([0-9]+),.*', error)]
        data = {
            'error_lines': error_lines,
        }
        data.update(_cursor_position(request))
        return json.dumps(data)
    ZopePageTemplate.get_codemirror_json = get_codemirror_json
    original_read = ZopePageTemplate.read
    def read(self, *args, **kwargs):
        text = original_read(self, *args, **kwargs)
        if text.startswith(_error_start):
            errend = text.find('-->')
            if errend >= 0:
                text = text[errend + 3:]
                if text[:1] == "\n":
                    text = text[1:]
        return text
    ZopePageTemplate.read = read
