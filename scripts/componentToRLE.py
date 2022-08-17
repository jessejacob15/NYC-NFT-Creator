from copy import copy
from fileinput import filename
from turtle import color

from numpy import append
import image as image
import random
import sys
from ByteComponent import ByteComponent
from PaletteGenerator import PaletteGenerator
from NFTSeeder import NFTSeeder
from imgToSvg import imgToSvg




def main():

    compTypes = ["head", "skin", "body"]

    compType = sys.argv[1]

    if compType not in compTypes:
        print("Please provide component type [head, skin, body]")
        return

    imageFile = input("Component Image File: ")

    imgToSVG = imgToSvg(str(compType))
    
    imgToSVG.convertImageToSVG(imageFile)
    imgToSVG.convertImageToRLE()

    compBytes = imgToSVG.byteComponents

    defaultColors = imgToSVG.colors


    paletteGenerator = PaletteGenerator(compBytes)
    paletteGenerator.parsePalette()

    newPalettes = []

    if compType == "head":
        newPalettes = [["#E6067B"], ["#008000"], ["#FFD700"]]

    if compType == "skin":
        newPalettes = [["#964B00"], ["#BF40BF"]]

    if compType == "body":
        newPalettes = [["#880808"], ["#a9a9a9"], ["#FBCEB1"]]

    
    filename = "RLE_Colors_" + compType+".txt"
    colorFile = open(filename, "w")
    
    for palette in newPalettes:
        paletteGenerator.decodeGradient(defaultColors, len(palette))
        genPalette = paletteGenerator.generateNewPalette(palette)
        colorFile.write(str(genPalette))
        colorFile.write("\n")
        colorFile.write("\n")
    
    colorFile.close()




if __name__ == "__main__":
    main()