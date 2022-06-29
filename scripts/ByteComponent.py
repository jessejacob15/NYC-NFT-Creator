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
    
    def toSVG(self, hexColors):
        width = abs(self.bounds[1]-self.bounds[3]) 
        height = abs(self.bounds[0] - self.bounds[2])
        xval = self.bounds[3]
        yval = self.bounds[0]
        hexcolor = hexColors[self.color]
        return '<rect width="'+ str(width)+'" height= "' + str(height) +'"  x="' + str(yval)+ '" y="'+ str(xval)+ '" fill="'+ str(hexcolor) +'" />'