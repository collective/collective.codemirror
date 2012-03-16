from App.special_dtml import DTMLFile
from Products.PageTemplates.PageTemplateFile import PageTemplateFile
import json
import re

def initialize(context):
    patch_pythonscripts()
    patch_zpt()

def patch_pythonscripts():
    import Products.PythonScripts
    PythonScript = Products.PythonScripts.PythonScript.PythonScript
    ZPythonScriptHTML_editForm = DTMLFile('pyScriptEdit', globals())
    PythonScript.manage = PythonScript.manage_main = ZPythonScriptHTML_editForm
    PythonScript.ZPythonScriptHTML_editForm =ZPythonScriptHTML_editForm
    original_compile = PythonScript._compile
    def _compile (self):
        "Patch to provide an error_lines json string to codemirror"
        res = original_compile(self)
        error_numbers = [int(re.sub(r'.*line ([0-9]+)\).*',r'\1',error)) for error in self.errors
                         if re.match(r'.*line ([0-9]+)\).*', error)]
        self.error_lines = json.dumps(error_numbers)
        return res
    PythonScript._compile = _compile

def patch_zpt():
    import Products.PageTemplates
    ZPT = Products.PageTemplates.ZopePageTemplate.ZopePageTemplate
    pt = PageTemplateFile('ptEdit', globals(), __name__='pt_editForm')
    pt._owner = None
    ZPT.pt_editForm = ZPT.manage_main = ZPT.manage = ZPT.pt_editForm = pt
