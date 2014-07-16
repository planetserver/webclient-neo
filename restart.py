'''
Small script for restarting the server
'''
import subprocess

subprocess.call(["grunt", "build"])
subprocess.call(["grunt", "copy:dep"])
subprocess.call(["python", "manage.py", "collectstatic"])
subprocess.call(["python", "manage.py", "runserver"])
