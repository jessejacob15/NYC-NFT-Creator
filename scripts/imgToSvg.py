from copy import copy
import image
from ByteComponent import ByteComponent

byteComponents = []
colors = []
colorsRGB = []
bounds = [0,0,0,0] # TopY, RightX, BottomY, LeftX
blockbounds = [0,0,0,0]
redPixel = image.Pixel(255, 0, 0)

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
                blockbounds[0] = y//20
                return y

def getLeftX(img, copyImg):
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
                        copyImg.setPixel(i, j, redPixel)
                copyImg.save("generatedImages/withred")   
                blockbounds[1] = x//20
                return x

def getBottomY(img, copyImg):
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
                        copyImg.setPixel(i, j, redPixel)
                copyImg.save("generatedImages/withred")
                blockbounds[2] = y//20
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
                blockbounds[3] = x//20
                return x    

def buildBytes():
    componentsToBytes = bytearray()
    componentsToBytes.append(blockbounds[0])
    componentsToBytes.append(blockbounds[1])
    componentsToBytes.append(blockbounds[2])
    componentsToBytes.append(blockbounds[2])
    for component in byteComponents:
        componentsToBytes.append(component.length)
        componentsToBytes.append(component.color)
    print(componentsToBytes)
    f = open("bytes.txt", "wb")
    f.write(bytes(componentsToBytes))
    f.close()
    return bytes(componentsToBytes)

def printBytes():
    for byte in byteComponents:
        byte.toString()

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
    print("bounds: ", blockbounds)
    print("ammmount of rects: ", len(byteComponents))
    print("ammount of colorsHEX:", len(colors))
    print(buildBytes())
    print()
    print(colors)


if __name__ == "__main__":
    main()