.. contents::

Introduction
============

CodeMirror is a JavaScript library that provides features commonly found in IDEs
(like syntax highlighting and smart indent) to browser-based editors.
This product monkey patches Zope PythonScript ZMI edit form to use CodeMirror.
It was tested in Chrome, Firefox and IE 9.

Aim
===

This product exists as a proposal of a feature addition to Zope itself: the author
thinks textareas are too uncomfortable for developers to edit their code.

Extending
=========

Including the file ++resource++codemirror/convertTextAreas.js all textareas with
class codemirror-python will be converted.
If an attribute called onCodeMirrorLoad is found on the textarea DOM element,
it will be called with the codeMirror object as parameter.
