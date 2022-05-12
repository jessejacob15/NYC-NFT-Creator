import cImage as image
import ByteComponent



byteComponents = []
colors = []
#[length, colorIndex]


def recieveImg(img):
    """ (Image object) -> Image object
    Returns a copy of img where the blue and green have been filtered
    out and only red remains.
    """
    myImg = img.copy() # create copy to manipulate
    w = img.getWidth()
    h = img.getHeight()
    for x in range(w): # iterate through all (x, y) pixel pairs
        for y in range(h):
            pixel = img.getPixel(x, y)
            red = pixel.getRed()
            green = pixel.getGreen()
            blue = pixel.getBlue()
            color = '#%02x%02x%02x' % (red, green, blue)
            colors.apped(color)
            newByte = ByteComponent(x, y, x-29, y-29)
            newByte.setColor = color
            newByte.setLength = 1
            x += 29
            y += 29
            byteComponents.append(newByte)
    
    print(byteComponents)



            

            
    return red_only_img # return filtered image



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
    original_img = image.Image('kanga.JPG')
    red_img = blur(original_img)
    display_image(original_img, red_img)