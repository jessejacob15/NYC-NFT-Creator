from copy import copy
from fileinput import filename
from os import system
from select import select
from turtle import right
from xxlimited import new

from sklearn.feature_selection import SelectFdr
import image as image
import matplotlib
import sys
from pyparsing import col
from ByteComponent import ByteComponent
from PaletteGenerator import PaletteGenerator

class imgToSvg:
    byteComponents = []
    colors = ['#00000000']
    columnStartRows = {}
    colorsRGB = []
    bounds = [0,0,0,0] # TopY, RightX, BottomY, LeftX
    redPixel = image.Pixel(255, 0, 0)
    endY=[]
    pixelMult = 20
    compType = "head"

    def __init__(self, cType):
            self.compType = cType
            
    def repositionBytes(self):
        print("Repositioning Head")
        print(str(self.byteComponents[len(self.byteComponents)-1].getRightX()))
        print(str(self.byteComponents[len(self.byteComponents)-1].getBottomY()))

        if(self.compType == "head"):
            ###Get the bounds for the template head
            print(self.bounds)
            tempBounds = [120,614,818,139]

            ###Get the Middle Coord
            tempMiddleY = tempBounds[2] - tempBounds[0]
            tempMiddleX = tempBounds[1] - tempBounds[3]

            tempBottomRight = 619

            print("Temp Middle: "+ str(tempMiddleX))

            ###Get the bottom Y for the bound
            tempBottomY = tempBounds[2]

            tempLeftX = tempBounds[3]

            ### Get current bottom Y
            currBottomY = self.bounds[2]

            ###Get current Middle Coord
            currMiddleY = self.bounds[2] - self.bounds[0]
            currMiddleX = self.bounds[1] - self.bounds[3]

            currLeftX = self.bounds[3]

            currBottomRight = self.byteComponents[len(self.byteComponents)-1].getRightX()

            print("Curr Bottom Right: "+ str(currBottomRight))


            ###Get difference in middle coord
            
            diffX = tempBottomRight - currBottomRight
            diffY = tempBottomY - currBottomY

            print("Diff: "+str(diffX))

            topY = sys.maxsize
            rightX = 0
            bottomY = 0
            leftX = sys.maxsize
            
            for byte in self.byteComponents:
                ###Get Difference from Bottom Y Bound
                # print("Before:" + str(byte.bounds))
                currDiffY = currBottomY - byte.getBottomY()

                ##Get the difference between the template Bottom and the current bottom
                # adjustBottomY = tempBottomY - currBottomY

                # newBottomY = adjustBottomY - currDiffY

                ###Get the new X and Y
                newX = byte.bounds[3] + diffX
                newY = byte.bounds[0] + diffY

                byte.setBottomY(newY+self.pixelMult)
                byte.setTopY(newY)
                byte.setLeftX(newX)
                byte.setRightX(newX + self.pixelMult)  

                if byte.getBottomY()>= bottomY:
                    bottomY = byte.getBottomY()
                
                if byte.getLeftX() <= leftX:
                    leftX = byte.getLeftX()

                if byte.getTopY() <= topY:
                    topY = byte.getTopY()

                if byte.getRightX() >= rightX:
                    rightX = byte.getRightX()

            self.bounds = [topY,rightX,bottomY,leftX]
            print("New Bounds: "+str(self.bounds))


    def parseImg(self,img):
        """ (Image object) -> Image object
        Returns a copy of img where the blue and green have been filtered
        out and only red remains.
        """
        myImg = img.copy() # create copy to manipulate
        for y in range(self.bounds[0],(self.bounds[2]),20): # iterate through all (x, y) pixel pairs
            imgStart = False
            endX = self.getEndX(img, y)
            for x in range(self.bounds[3],(self.bounds[1]),20):
                startY = self.getStartY(img, x)
                pixel = img.getPixel(x, y)
                red = pixel.getRed()
                green = pixel.getGreen()
                blue = pixel.getBlue()
                pixelRGB = [red, green, blue]
                color = '#%02x%02x%02x' % (red, green, blue)
                if (color != '#000000' and not imgStart) or (imgStart and x <= endX and y >= startY):
                    finalRGB = self.colorGrouping(pixelRGB)
                    color = '#%02x%02x%02x' % (finalRGB[0], finalRGB[1], finalRGB[2])
                    if color not in self.colors:
                        self.colors.append(color)
                    newByte = ByteComponent(y, x+20, y+20, x)
                    newByte.setColor(self.colors.index(color))
                    newByte.setLength(1)
                    self.byteComponents.append(newByte)
                    newPixel = image.Pixel(finalRGB[0], finalRGB[1], finalRGB[2])
                    imgStart = True
                else:
                    newByte = ByteComponent(y,x+20,y+20,x)
                    color = '#00000000'
                    if color not in self.colors:
                        self.colors.append(color)
                    newByte.setColor(self.colors.index(color))
                    newByte.setLength(1)
                    self.byteComponents.append(newByte)
            lastByte = self.byteComponents[len(self.byteComponents)-1]
            lastByte.end = True
        self.repositionBytes()

                    
    

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
    

    def getStartY(self,img,x):
        for y in range(self.bounds[0],self.bounds[2]):
            pixel = img.getPixel(x, y)
            red = pixel.getRed()
            green = pixel.getGreen()
            blue = pixel.getBlue()
            color = '#%02x%02x%02x' % (red, green, blue)
            if color != '#000000':
                return y
        
        return self.bounds[2]


            
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
                    # copyImg.save("generatedImages/withred")
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
                    # copyImg.save("generatedImages/withred")            
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
                    # copyImg.save("generatedImages/withred")
                    return y     
    
    def getEndX(self, img, y):
        w = img.getWidth()
        h = img.getHeight()
        for x in range(w-1,0,-1):
            pixel = img.getPixel(x, y)
            red = pixel.getRed()
            green = pixel.getGreen()
            blue = pixel.getBlue()
            color = '#%02x%02x%02x' % (red, green, blue)
            if color != '#000000':
                return x 
        return self.bounds[1]  

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
                    # copyImg.save("generatedImages/withred")
                    return x      

    def buildBytes(self):
        componentsToBytes = bytearray()
        for component in self.byteComponents:
            componentsToBytes.append(component.length)
            componentsToBytes.append(component.color)
        return bytes(componentsToBytes)


    def printBytes(self):
        colorsByBytes = ""
        for byte in self.byteComponents:
            #byte.toString()
            strColor = str(byte.color)
            if (len(strColor) == 1):
                strColor = "0" + strColor
            colorsByBytes += strColor + "|"
            if (byte.end):
                colorsByBytes += '\n'
        #print(colorsByBytes)
    
    def colorsInRows(self):
        rows = []
        currRow = []
        for byte in self.byteComponents:
            currRow.append(byte.color)
            if (byte.end):
                rows.append(currRow)
                currRow = []
        print("Rows: "+str(len(rows)))
        return rows
    
    def convertImageToRLE(self):
        filename = "RLEnft" + self.compType+".svg"
        svgFile = open(filename, "w")
        height = abs(self.bounds[0]-self.bounds[2])
        width = abs(self.bounds[3]-self.bounds[1])
        header = '<svg width="'+str(width)+'" height="'+str(height)+'" viewbox ="'+str(self.bounds[3])+' '+str(self.bounds[0])+' '+str(width)+' ' +str(height)+'" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">'
        svgFile.write(header)

        strRLE = ""
        fileRLE = ""
        rows = self.colorsInRows()
        yval = self.bounds[0]

        finalRLE = [self.bounds[0], self.bounds[1], self.bounds[2], self.bounds[3]]

        for row in rows:
            # print(row)
            xval = self.bounds[3]
            prev = row[0]
            currLen = 1
            for i in range(0, len(row)):
                curr = row[i]
                if prev == curr:
                    currLen += 1
                else:
                    fileRLE += str(currLen) + "|" + str(prev) + " "
                    strRLE += str(currLen) + str(prev)
                    newRect = '<rect width="'+ str(20* currLen)+'" height= "' + str(20) +'" x="' + str(xval)+ '" y="'+ str(yval)+ '" fill="'+ str(self.colors[prev]) +'"/>'
                    svgFile.write(newRect)
                    
                    finalRLE.append(currLen)
                    finalRLE.append(prev)
                    xval += 20*currLen
                    currLen = 1     

                if (i == len(row) - 1):
                    fileRLE += str(currLen) + "|" + str(curr) + '\n'
                    strRLE += str(currLen) +  str(curr)
                prev = curr
            yval += 20

        svgFile.write('</svg>') 
        f = open("RLE"+self.compType+"-rows.txt", "w")
        f.write(fileRLE)
        f.close()
        print(finalRLE)
        print("___________")
        return strRLE


    def bytesToRects(self):
        rects = []
        currLen = 1
        prevColor = -1
        for byte in self.byteComponents:
            #rects.append(byte.toSVG(palette))
            rects.append(byte.toSVGDict())
            
            # currColor = byte.color
            # currX = byte.bounds[3]
            # currY = byte.bounds[0]
            # if (currColor == prevColor):
            #     print("same color")
            #     currLen += 1
            # else:
            #     rects.append('<rect width="'+ str(20 * currLen)+'" height= "' + str(20) +'"  x="' + str(currX - ((currLen - 1) * 20))+ '" y="'+ str(currY)+ '" fill="'+ str(palette[byte.color]) +'" />')
            #     currLen = 1
            # prevColor = currColor

        rects = self.toRLE(rects)
        print("numRects = ", str(len(rects)))
        return rects

    def toRLERects(self,rects):
        currColor = ""
        currLen = 1
        startX = self.bounds[3]
        currX = startX
        currY = rects[0]["yval"]
        arrayItems = [self.bounds[0], self.bounds[1], self.bounds[2], self.bounds[3]]       
        finalRects = []
        for rect in rects:
            currY = rect["yval"]

            if (rect["end"] == True):
                arrayItems.append(currLen + 1)
                arrayItems.append(currColor)
                currLen = 0
                currColor = rect["hexColor"]
                currX = startX

            
            elif rect["hexColor"] == currColor and rect["yval"] == currY:
                currLen += 1
            
            else:
                if currColor != '':
                    arrayItems.append(currLen)
                    arrayItems.append(currColor)

                currColor = rect["hexColor"]
                currX = 20* currLen
                currLen = 1
        f = open("RLE"+self.compType+"-rows.txt", "w")
        f.write(arrayItems)
        f.close()
        return finalRects[1:]
            

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

        # print("bounds: ", self.bounds)
        # print("ammmount of rects: ", len(self.byteComponents))
        # print("ammount of colorsHEX:", len(self.colors))
        # print('--------')
        # print(self.printBytes())
        # print('--------')
    
    def reset(self):
        self.byteComponents.clear()
        self.colors.clear()
        self.colorsRGB.clear()
        self.bounds = [0,0,0,0]
