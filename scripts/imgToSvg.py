from copy import copy
from fileinput import filename
from pickle import FALSE, TRUE
import image as image
import matplotlib
from ByteComponent import ByteComponent
from PaletteGenerator import PaletteGenerator

class imgToSvg:
    byteComponents = []
    colors = []
    colorsRGB = []
    bounds = [0,0,0,0] # TopY, RightX, BottomY, LeftX
    redPixel = image.Pixel(255, 0, 0)
    endY=[]

    def parseImg(self,img):
        """ (Image object) -> Image object
        Returns a copy of img where the blue and green have been filtered
        out and only red remains.
        """
        myImg = img.copy() # create copy to manipulate
        for x in range(self.bounds[3],(self.bounds[1] - 20),20): # iterate through all (x, y) pixel pairs
            imgStart=False
            endY = self.getEndY(img, x)
            for y in range(self.bounds[0],(self.bounds[2] - 20),20):
                pixel = img.getPixel(x, y)
                red = pixel.getRed()
                green = pixel.getGreen()
                blue = pixel.getBlue()
                pixelRGB = [red, green, blue]
                finalRGB = self.colorGrouping(pixelRGB)
                color = '#%02x%02x%02x' % (finalRGB[0], finalRGB[1], finalRGB[2])
                if (color != '#000000' and not imgStart) or (imgStart and y <= endY):
                    print("Image Start: "+str(x)+","+str(y)+" "+color)
                    if color not in self.colors:
                        self.colors.append(color)
                    newByte = ByteComponent(x, y, x+20, y+20)
                    newByte.setColor(self.colors.index(color))
                    newByte.setLength(1)
                    self.byteComponents.append(newByte)
                    newPixel = image.Pixel(finalRGB[0], finalRGB[1], finalRGB[2])
                    for i in range(x, x+20):
                            for j in range(y, y + 20):
                                myImg.setPixel(i, j, newPixel)
                    imgStart = True

        myImg.save("generatedImages/smooth")          

    def colorGrouping(self,pixelRGB):
        pixelRed = pixelRGB[0]
        pixelGreen = pixelRGB[1]
        pixelBlue = pixelRGB[2]
        if len(self.colorsRGB) == 0:
            self.colorsRGB.append(pixelRGB)
            return pixelRGB
        
        for RGB in self.colorsRGB:
            if abs(pixelRed - RGB[0]) <= 10 and abs(pixelGreen - RGB[1]) <= 10 and abs(pixelBlue - RGB[2]) <= 10:
                return RGB
            
        self.colorsRGB.append(pixelRGB)
        return pixelRGB
            
    def getBoundary(self, img, copyImg):
        self.bounds[0] = self.getTopY(img, copyImg)
        self.bounds[1] = self.getRightX(img, copyImg)
        self.bounds[2] = self.getBottomY(img, copyImg)
        self.bounds[3] = self.getLeftX(img, copyImg)

    def getTopY(self, img, copyImg):
        w = img.getWidth()
        h = img.getHeight()
        for y in range(h):
            for x in range(w):
                pixel = img.getPixel(x, y)
                red = pixel.getRed()
                green = pixel.getGreen()
                blue = pixel.getBlue()
                color = '#%02x%02x%02x' % (red, green, blue)
                if color != '#000000':
                    for i in range(x, x+20):
                        for j in range(y, y + 20):
                            copyImg.setPixel(i, j, self.redPixel)
                    copyImg.save("generatedImages/withred")
                    return y

    def getLeftX(self, img, copyImg):
        w = img.getWidth()
        h = img.getHeight()
        for x in range(w):
            for y in range(h):
                pixel = img.getPixel(x, y)
                red = pixel.getRed()
                green = pixel.getGreen()
                blue = pixel.getBlue()
                color = '#%02x%02x%02x' % (red, green, blue)
                if color != '#000000':
                    for i in range(x, x+20):
                        for j in range(y, y + 20):
                            copyImg.setPixel(i, j, self.redPixel)
                    copyImg.save("generatedImages/withred")            
                    return x

    def getBottomY(self, img, copyImg):
        w = img.getWidth()
        h = img.getHeight()
        for y in range(h-1,0,-1):
            for x in range(w):
                pixel = img.getPixel(x, y)
                red = pixel.getRed()
                green = pixel.getGreen()
                blue = pixel.getBlue()
                color = '#%02x%02x%02x' % (red, green, blue)
                if color != '#000000':
                    for i in range(x, x+20):
                        for j in range(y, y -20,-1):
                            copyImg.setPixel(i, j, self.redPixel)
                    copyImg.save("generatedImages/withred")
                    return y     
    
    def getEndY(self, img, x):
        w = img.getWidth()
        h = img.getHeight()
        for y in range(h-1,0,-1):
            pixel = img.getPixel(x, y)
            red = pixel.getRed()
            green = pixel.getGreen()
            blue = pixel.getBlue()
            color = '#%02x%02x%02x' % (red, green, blue)
            if color != '#000000':
                return y       

    def getRightX(self, img, copyImg):
        w = img.getWidth()
        h = img.getHeight()
        for x in range(w-1,0,-1):
            for y in range(h):
                pixel = img.getPixel(x, y)
                red = pixel.getRed()
                green = pixel.getGreen()
                blue = pixel.getBlue()
                color = '#%02x%02x%02x' % (red, green, blue)
                if color != '#000000':
                    for i in range(x, x-20, -1):
                        for j in range(y, y + 20):
                            copyImg.setPixel(i, j, self.redPixel)
                    copyImg.save("generatedImages/withred")
                    return x      

    def buildBytes(self):
        componentsToBytes = bytearray()
        for component in self.byteComponents:
            componentsToBytes.append(component.length)
            componentsToBytes.append(component.color)
        return bytes(componentsToBytes)

    def printBytes(self):
        for byte in self.byteComponents:
            byte.toString()

    def bytesToSvg(self, bytes, palette, name):
        filename = str(name) + ".svg"
        svgFile = open(filename, "w")
        height = abs(self.bounds[0]-self.bounds[2])
        width = abs(self.bounds[3]-self.bounds[1])
        header = '<svg width="'+str(width)+'" height="'+str(height)+'" viewbox ="'+str(bounds[3])+' '+str(bounds[0])+' '+str(width)+' ' +str(height)+'" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">'
        svgFile.write(header)
        for byte in bytes:
            svgFile.write(byte.toSVG(palette))
        svgFile.write('</svg>')

    def convertImageToSVG(self,filename):
        self.reset()
        myImg = image.FileImage(filename)
        copyImg = myImg.copy()
        self.getBoundary(myImg, copyImg)
        self.parseImg(myImg)
        # printBytes()
        print("bounds: ", self.bounds)
        print("ammmount of rects: ", len(self.byteComponents))
        print("ammount of colorsHEX:", len(self.colors))
        # print(self.buildBytes())
    
    def reset(self):
        self.byteComponents.clear()
        self.colors.clear()
        self.colorsRGB.clear()
        self.bounds = [0,0,0,0]