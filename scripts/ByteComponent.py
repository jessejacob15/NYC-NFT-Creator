from ctypes.wintypes import PSMALL_RECT
from multiprocessing import BoundedSemaphore


class ByteComponent:
    bounds = []
    length = 0
    color = 0
    end = False

    def __init__(self, topY, rightX, bottomY, leftX):
        self.bounds = [topY, rightX, bottomY, leftX]

    def setLength(self, length):
        self.length = length
    
    def setColor(self, color):
        self.color = color

    def setBottomY(self,coord):
        self.bounds[2] = coord
    
    def setTopY(self,coord):
        self.bounds[0] = coord

    def setLeftX(self,coord):
        self.bounds[3] = coord
    
    def setRightX(self,coord):
        self.bounds[1] = coord
    
    def getBottomY(self):
        return self.bounds[2]

    def getTopY(self):
        return self.bounds[0]

    def getRightX(self):
        return self.bounds[1]


    def getLeftX(self):
        return self.bounds[3]
    
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
        return '<rect width="'+ str(width)+'" height= "' + str(height) +'"  x="' + str(xval)+ '" y="'+ str(yval)+ '" fill="'+ str(hexcolor) +'" />'