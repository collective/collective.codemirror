.. contents::

Introduction
============

Monkey patch Zope PythonScript ZMI edit form to use CodeMirror.


Extending
=========

Including the file ++resource++codemirror/convertTextAreas.js all textareas with
class codemirror-python will be converted.
If an attribute called onCodeMirrorLoad is found on the textarea DOM element,
it will be called with the codeMirror object as parameter.
