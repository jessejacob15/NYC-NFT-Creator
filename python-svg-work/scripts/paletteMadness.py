from PaletteGenerator import PaletteGenerator
from imgToSvg import imgToSvg
import random

def main():

    compTypes = ["head", "skin", "body"]

    validCompInput = False
    compType = ""
    while validCompInput == False:
        inputComponent = input("Please provide a component type [head, skin, body]: ")
        if inputComponent in compTypes:
            validCompInput = True
            compType = inputComponent
        else:
            print("not a valid component type")

    validFileInput = False
    imageFile = ""
    while validFileInput == False:
        imageInputFile = input("Component Image File: ")
        try: 
            imageInputFile = "../" + compType + "s/" + imageInputFile
            open(imageInputFile)
            validFileInput = True
            imageFile = imageInputFile
        except FileNotFoundError:
            print("Cannot find file, try again")


    imgToSVG = imgToSvg(str(compType))
    imgToSVG.convertImageToSVG(imageFile)



    compBytes = imgToSVG.byteComponents

    defaultColors = imgToSVG.colors

    paletteGenerator = PaletteGenerator(compBytes)
    paletteGenerator.parsePalette()

    newPalettes = []

    for i in range(0,100):
        color = []
        numCols = random.randint(1,2)
        for j in range (0,numCols):
            randomColor = "%06x" % random.randint(0, 0xFFFFFF)
            randomColor = "#"+randomColor
            color.append(randomColor)
            print("Random Color: "+randomColor)
        newPalettes.append(color)


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