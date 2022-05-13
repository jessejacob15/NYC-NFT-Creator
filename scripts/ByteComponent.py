from ctypes.wintypes import PSMALL_RECT
from multiprocessing import BoundedSemaphore


class ByteComponent:
    bounds = []
    length = 0
    color = 0

    def __init__(self, topY, rightX, bottomY, leftX):
        self.bounds = [topY, rightX, bottomY, leftX]

    def setLength(self, length):
        self.length = length
    
    def setColor(self, color):
        self.color = color
    
    def toString(self):
        print("+++++++++++")
        print(self.bounds)
        print(self.length)
        print(self.color)
        print("+++++++++++")
