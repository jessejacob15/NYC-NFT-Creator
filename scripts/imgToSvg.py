from copy import copy
from fileinput import filename
import image
from ByteComponent import ByteComponent
from PaletteGenerator import PaletteGenerator

<<<<<<< Updated upstream
byteComponents = []
colors = []
colorsRGB = []
bounds = [0,0,0,0] # TopY, RightX, BottomY, LeftX
redPixel = image.Pixel(255, 0, 0)
=======
class imgToSvg:
    byteComponents = []
    colors = ['#00000000']
    colorsRGB = []
    bounds = [0,0,0,0] # TopY, RightX, BottomY, LeftX
    redPixel = image.Pixel(255, 0, 0)
    endY=[]
    pixelMult = 20
    compType = "head"

    def __init__(self, cType):
        self.compType = cType

    #Reposition bytes to be at the same bottom right coordinates as the original template mask
    def repositionBytes(self):
        repositionedByteComps = []
        if(self.compType == "head"):
            ###Get the bounds for the template head
            tempBounds = [120,614,818,139]

            ###Get the bottom Y for the bound
            tempBottomY = tempBounds[2]

            ### Get current bottom Y
            currBottomY = self.bounds[2]

            for byte in self.byteComponents:
                ###Get Difference from Bottom Y Boundd
                currDiffY = currBottomY - byte.getBottomY()
                adjustBottomY = tempBottomY - currDiffY
                byte.setTopY(adjustBottomY-self.pixelMult)
                byte.setBottomY(adjustBottomY)


        

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
                pixel = img.getPixel(x, y)
                red = pixel.getRed()
                green = pixel.getGreen()
                blue = pixel.getBlue()
                pixelRGB = [red, green, blue]
                color = '#%02x%02x%02x' % (red, green, blue)
                if (color != '#000000' and not imgStart) or (imgStart and x <= endX):
                # if(color != '#000000'):
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
        self.repositionBytes()        
        
>>>>>>> Stashed changes

def parseImg(img):
    """ (Image object) -> Image object
    Returns a copy of img where the blue and green have been filtered
    out and only red remains.
    """
    myImg = img.copy() # create copy to manipulate
    for x in range(bounds[3],(bounds[1] - 20),20): # iterate through all (x, y) pixel pairs
        for y in range(bounds[0],(bounds[2] - 20),20):
            pixel = img.getPixel(x, y)
            red = pixel.getRed()
            green = pixel.getGreen()
            blue = pixel.getBlue()
            pixelRGB = [red, green, blue]
            finalRGB = colorGrouping(pixelRGB)
            color = '#%02x%02x%02x' % (finalRGB[0], finalRGB[1], finalRGB[2])
            if color != '#000000':
                if color not in colors:
                    colors.append(color)
                newByte = ByteComponent(x, y, x+20, y+20)
                newByte.setColor(colors.index(color))
                newByte.setLength(1)
                byteComponents.append(newByte)
                newPixel = image.Pixel(finalRGB[0], finalRGB[1], finalRGB[2])
                for i in range(x, x+20):
                        for j in range(y, y + 20):
                            myImg.setPixel(i, j, newPixel)
    myImg.save("generatedImages/smooth")          

def colorGrouping(pixelRGB):
    pixelRed = pixelRGB[0]
    pixelGreen = pixelRGB[1]
    pixelBlue = pixelRGB[2]
    if len(colorsRGB) == 0:
        colorsRGB.append(pixelRGB)
        return pixelRGB
    
    for RGB in colorsRGB:
        if abs(pixelRed - RGB[0]) <= 10 and abs(pixelGreen - RGB[1]) <= 10 and abs(pixelBlue - RGB[2]) <= 10:
            return RGB
        
    colorsRGB.append(pixelRGB)
    return pixelRGB
        
def getBoundary(img, copyImg):
    bounds[0] = getTopY(img, copyImg)
    bounds[1] = getRightX(img, copyImg)
    bounds[2] = getBottomY(img, copyImg)
    bounds[3] = getLeftX(img, copyImg)

def getTopY(img, copyImg):
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
                        copyImg.setPixel(i, j, redPixel)
                copyImg.save("generatedImages/withred")
                return y

def getLeftX(img, copyImg):
    w = img.getWidth()
    h = img.getHeight()
    for x in range(w):
        for y in range(h):
<<<<<<< Updated upstream
            pixel = img.getPixel(x, y)
            red = pixel.getRed()
            green = pixel.getGreen()
            blue = pixel.getBlue()
            color = '#%02x%02x%02x' % (red, green, blue)
            if color != '#000000':
                for i in range(x, x+20):
                    for j in range(y, y + 20):
                        copyImg.setPixel(i, j, redPixel)
                copyImg.save("generatedImages/withred")            
                return x
=======
            for x in range(w):
                pixel = img.getPixel(x, y)
                red = pixel.getRed()
                green = pixel.getGreen()
                blue = pixel.getBlue()
                color = '#%02x%02x%02x' % (red, green, blue)
                if color != '#000000':
                    # for i in range(x, x+20):
                    #     for j in range(y, y + 20):
                            # copyImg.setPixel(i, j, self.redPixel)
                    # copyImg.save("generatedImages/withred")
                    return y
>>>>>>> Stashed changes

def getBottomY(img, copyImg):
    w = img.getWidth()
    h = img.getHeight()
    for y in range(h-1,0,-1):
        for x in range(w):
<<<<<<< Updated upstream
=======
            for y in range(h):
                pixel = img.getPixel(x, y)
                red = pixel.getRed()
                green = pixel.getGreen()
                blue = pixel.getBlue()
                color = '#%02x%02x%02x' % (red, green, blue)
                if color != '#000000':
                    # for i in range(x, x+20):
                    #     for j in range(y, y + 20):
                    #         copyImg.setPixel(i, j, self.redPixel)
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
>>>>>>> Stashed changes
            pixel = img.getPixel(x, y)
            red = pixel.getRed()
            green = pixel.getGreen()
            blue = pixel.getBlue()
            color = '#%02x%02x%02x' % (red, green, blue)
            if color != '#000000':
<<<<<<< Updated upstream
                for i in range(x, x+20):
                    for j in range(y, y -20,-1):
                        copyImg.setPixel(i, j, redPixel)
                copyImg.save("generatedImages/withred")
                return y     

def getRightX(img, copyImg):
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
                        copyImg.setPixel(i, j, redPixel)
                copyImg.save("generatedImages/withred")
                return x      

def buildBytes():
    componentsToBytes = bytearray()
    for component in byteComponents:
        componentsToBytes.append(component.length)
        componentsToBytes.append(component.color)
    return bytes(componentsToBytes)

def printBytes():
    for byte in byteComponents:
        byte.toString()

def bytesToSvg(bytes, palette, name):
    filename = str(name) + ".svg"
    svgFile = open(filename, "w")
    height = abs(bounds[0]-bounds[2])
    width = abs(bounds[3]-bounds[1])
    header = '<svg width="'+str(width)+'" height="'+str(height)+'" viewbox ="'+str(bounds[3])+' '+str(bounds[0])+' '+str(width)+' ' +str(height)+'" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">'
    svgFile.write(header)
    for byte in bytes:
        svgFile.write(byte.toSVG(palette))
    svgFile.write('</svg>')



def main():
    """ () -> NoneType
    Main Program that load image(s) from file(s) and performs
    transformations to those images as required for HW 04. The images
    are then displayed.
    """
    fileName = input("enter image filename: ")
    myImg = image.FileImage(fileName)
    copyImg = myImg.copy()
    getBoundary(myImg, copyImg)
    parseImg(myImg)
    # printBytes()
    print("bounds: ", bounds)
    print("ammmount of rects: ", len(byteComponents))
    print("ammount of colorsHEX:", len(colors))
    print(buildBytes())

    ## Create a Palette Generator using the newly created bytes
    paletteGen = PaletteGenerator(byteComponents)

    ##Call Parse palette to map the bytes to colors
    paletteGen.parsePalette()

    ##Decode the gradient using the colors from this ImgToSVG and the number of colors you want the palette to be based on
    paletteGen.decodeGradient(colors, 1)

    ##Pass a new array of colors to change color of original component (must be the same size as the number passed in above)
    generatedPalette = paletteGen.generateNewPalette(["#E6067B"])

    ##Convert the new bytes to an svg file called bytes to svg
    bytesToSvg(byteComponents, generatedPalette, "bytestosyg")

if __name__ == "__main__":
    main()
=======
                return x   

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
                    # for i in range(x, x-20, -1):
                    #     for j in range(y, y + 20):
                            # copyImg.setPixel(i, j, self.redPixel)
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
        return rows
    
    def toRLE(self):
        strRLE = ""
        fileRLE = ""
        rows = self.colorsInRows()
        for row in rows:
            prev = row[0]
            currLen = 1
            for i in range(1, len(row)):
                curr = row[i]
                if prev == curr:
                    currLen += 1
                else:
                    fileRLE += str(currLen) + "|" + str(prev) + " "
                    strRLE += str(currLen) + str(prev)
                    currLen = 1             
                if (i == len(row) - 1):
                    fileRLE += str(currLen) + "|" + str(curr) + '\n'
                    strRLE += str(currLen) +  str(curr)
                prev = curr
            
        f = open("RLE-rows.txt", "w")
        f.write(fileRLE)
        f.close()
        return strRLE
            



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
        
        self.toRLE()
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
>>>>>>> Stashed changes
