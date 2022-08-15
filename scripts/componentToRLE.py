from copy import copy
from fileinput import filename

from numpy import append
import image as image
import random
import sys
from ByteComponent import ByteComponent
from PaletteGenerator import PaletteGenerator
from NFTSeeder import NFTSeeder
from imgToSvg import imgToSvg




def main():

    compType = sys.argv[1]
    imageFile = input("Component Image File: ")

    imgToSVG = imgToSvg(str(compType))

    imgToSVG.convertImageToSVG(imageFile)
    imgToSVG.toRLE()
    



if __name__ == "__main__":
    main()