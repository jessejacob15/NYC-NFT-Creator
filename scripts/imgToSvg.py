from copy import copy
import image
import ByteComponent

byteComponents = []
colors = []
bounds = []
redPixel = image.Pixel(255, 0, 0)
#[length, colorIndex]



# def recieveImg(img):
#     """ (Image object) -> Image object
#     Returns a copy of img where the blue and green have been filtered
#     out and only red remains.
#     """
#     myImg = img.copy() # create copy to manipulate
#     w = img.getWidth()
#     h = img.getHeight()
#     for x in range(w): # iterate through all (x, y) pixel pairs
#         for y in range(h):
#             pixel = img.getPixel(x, y)
#             red = pixel.getRed()
#             green = pixel.getGreen()
#             blue = pixel.getBlue()
#             color = '#%02x%02x%02x' % (red, green, blue)
#             if color not in colors:
#                 colors.apped(color)
#             newByte = ByteComponent(x, y, x-29, y-29)
#             newByte.setColor = colors.index(color)

#             newByte.setLength = 1
#             x += 29
#             y += 29
#             byteComponents.append(newByte)
#     print(byteComponents)
    
def getBoundary(img, copyImg):
    bounds[0] = getTopY(img, copyImg)
    bounds[1] = getBottomY(img, copyImg)
    

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
                bounds[2] = y
                return y      


def display_image(original_img, transformed_img):
    ''' (Image object, Image object) -> NoneType
    Display an original and transformed image.
    '''
    
    w = original_img.getWidth()
    h = original_img.getHeight()

    win = image.ImageWin("Original and transformed image", w, h*2)
    original_img.draw(win)
    transformed_img.setPosition(0, h)
    transformed_img.draw(win)
    win.exitonclick()
    return None



def main():
    """ () -> NoneType
    Main Program that load image(s) from file(s) and performs
    transformations to those images as required for HW 04. The images
    are then displayed.
    """
    myImg = image.FileImage('head.png')
    copyImg = myImg.copy()
    getBoundary(myImg, copyImg)

if __name__ == "__main__":
    main()