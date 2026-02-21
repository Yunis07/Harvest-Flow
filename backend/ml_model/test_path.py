import os

print("TEST PATH SCRIPT IS RUNNING")
print("Current working directory:")
print(os.getcwd())

print("\nContents of parent directory:")
print(os.listdir(".."))
