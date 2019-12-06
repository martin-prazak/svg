import sys
import base64
from cairosvg import svg2png
# import cairosvg

# variables
variables = sys.argv
inputFile = variables[1]
outputFile = variables[2]
pngWidth = variables[3]
pngHeight = variables[4]

# convert svg to png of certain size and save to file
png = svg2png(url=inputFile, write_to=outputFile,
              parent_width=int(pngWidth), parent_height=int(pngHeight))
