from copy import copy
import image
import ByteComponent

byteComponents = []
colors = []
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
    
def getBoundary(img):
    bounds = []
    w = img.getWidth()
    h = img.getHeight()
    copyImg = img.copy()
    redPixel = image.Pixel(100, 0, 0)
    #GET TOP Y
    for y in range(h):
        for x in range(w):
            pixel = img.getPixel(x, y)
            red = pixel.getRed()
            green = pixel.getGreen()
            blue = pixel.getBlue()
            color = '#%02x%02x%02x' % (red, green, blue)
            if color != '#000000':
                copyImg.setPixel(x, y, redPixel)
                win = image.ImageWin(copyImg.getWidth(), copyImg.getHeight(), "Image Processing")
                copyImg.draw(win)
                print(y)
                bounds.append(y)
                copyImg.draw(win)
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
    original_img = image.FileImage('head.PNG')
    getBoundary(original_img)

if __name__ == "__main__":
    main()