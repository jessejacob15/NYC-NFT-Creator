from PaletteGenerator import PaletteGenerator
from imgToSvg import imgToSvg

def main():

    compTypes = ["head", "skin", "body"]

    validCompInput = False
    compType = ""
    while validCompInput == False:
        inputComponent = input("Please provide a component type [head, skin, body]: ")
        if inputComponent in compTypes:
            validCompInput = True
            compType = inputComponent

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
            print("Wrong file or file path")


    imgToSVG = imgToSvg(str(compType))
    imgToSVG.convertImageToSVG(imageFile)
    strRLE = imgToSVG.convertImageToRLE()
    strRLE = "0" +  str(imgToSVG.bounds[0]) +str(imgToSVG.bounds[1]) + str(imgToSVG.bounds[2]) + str(imgToSVG.bounds[3]) + strRLE
    intRLE = strRLE.encode('utf-8')

    filename = "RLE_" + compType+"_Encoded.txt"
    compEncode = open(filename, "w")
    compEncode.write(intRLE.hex())
    compEncode.close()

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