from App.special_dtml import DTMLFile


def initialize(context):
    patch_pythonscripts()

def patch_pythonscripts():
    import Products.PythonScripts
    PythonScript = Products.PythonScripts.PythonScript.PythonScript
    ZPythonScriptHTML_editForm = DTMLFile('pyScriptEdit', globals())
    PythonScript.manage = PythonScript.manage_main = ZPythonScriptHTML_editForm
    PythonScript.ZPythonScriptHTML_editForm =ZPythonScriptHTML_editForm
