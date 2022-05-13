from copy import copy
import image
from ByteComponent import ByteComponent

byteComponents = []
colors = []
bounds = [] # TopY, RightX, BottomY, LeftX
redPixel = image.Pixel(255, 0, 0)
#[length, colorIndex]

def parseImg(img):
    """ (Image object) -> Image object
    Returns a copy of img where the blue and green have been filtered
    out and only red remains.
    """
    myImg = img.copy() # create copy to manipulate
    
    h = img.getHeight()
    for x in range(bounds[3],(bounds[1] + 20),20): # iterate through all (x, y) pixel pairs
        for y in range(bounds[0],(bounds[2] - 20),20):
            pixel = img.getPixel(x, y)
            red = pixel.getRed()
            green = pixel.getGreen()
            blue = pixel.getBlue()
            color = '#%02x%02x%02x' % (red, green, blue)
            if color not in colors:
                colors.append(color)
            newByte = ByteComponent(x, y, x+20, y+20)
            newByte.setColor(colors.index(color))
            newByte.setLength(1)
            byteComponents.append(newByte)

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
                copyImg.save("withred")
                print(y)
                bounds.append(y)
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
                copyImg.save("withred")
                print(x)
                bounds.append(y)
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
                copyImg.save("withred")
                print(y)
                bounds.append(y)
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
                for i in range(x, x+20):
                    for j in range(y, y -20,-1):
                        copyImg.setPixel(i, j, redPixel)
                copyImg.save("withred")
                print(x)
                bounds.append(y)
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

def main():
    """ () -> NoneType
    Main Program that load image(s) from file(s) and performs
    transformations to those images as required for HW 04. The images
    are then displayed.
    """
    myImg = image.FileImage('head.png')
    copyImg = myImg.copy()
    getBoundary(myImg, copyImg)
    parseImg(myImg)
    # printBytes()
    print(len(byteComponents))
    print(len(colors))
    print(buildBytes())


if __name__ == "__main__":
    main()