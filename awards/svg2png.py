import sys
import base64
from cairosvg import svg2png
# import cairosvg

# variables
variables = sys.argv
inputFile = variables[1]
pngWidth = variables[2]
pngHeight = variables[3]

# convert svg to png of certain size and save to file
png = svg2png(bytestring=inputFile, parent_width=int(
    pngWidth), parent_height=int(pngHeight))
pngString = base64.b64encode(png)
print(pngString)
