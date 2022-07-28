<<<<<<< HEAD
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
=======