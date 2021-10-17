/*
@author Winry
@date 2021-10-16

Coding plan:
    EasyCam so that I can actually work with spheres. Bugs: no reference!
    Convert into WEBGL and draw axes
    HUD for X, Y, and Z axes with Blender view
    Explain 3D polar coordinates at the top of the program (need more knowledge)
    Draw points with X and Y, like latitude and longitude
    Create 2D array and stuff points into it, then show every point
    Try to make the triangle strips
    Make a rainbow! Also add code for random points, if wanted. Makes sound!
    Maybe try a quadrilateral approach? That would satisfy Adam.
*/

let font
const DARK_BRIGHTNESS = 60
const LIGHT_BRIGHTNESS = 100

function drawAxes() {
    strokeWeight(2)
    // positive x-axis
    stroke(0, 100, LIGHT_BRIGHTNESS)
    line(0, 0, 4000, 0)
    // negative x-axis
    stroke(0, 100, DARK_BRIGHTNESS)
    line(-4000, 0, 0, 0)

    // positive y-axis
    stroke(90, 100, LIGHT_BRIGHTNESS)
    line(0, 0, 0, 4000)
    // negative y-axis
    stroke(90, 100, DARK_BRIGHTNESS)
    line(0, -4000, 0, 0)

    // positive z-axis
    stroke(220, 100, LIGHT_BRIGHTNESS)
    line(0, 0, 0, 0, 0, 4000)
    // negative z-axis
    stroke(220, 100, DARK_BRIGHTNESS)
    line(0, 0, -4000, 0, 0, 0)
}

function preload() {
    font = loadFont('fonts/Meiryo-01.ttf')
}

function setup() {
    createCanvas(640, 360, WEBGL)
    colorMode(HSB, 360, 100, 100, 100)
    new Dw.EasyCam(this._renderer, {distance:500});
}

function draw() {
    background(209, 80, 30)
    noFill()
    // turn this to 0.01 for a scary spiderweb globe effect!
    strokeWeight(0.1)
    // you need 100 brightness or else the spiderweb won't be visible
    stroke(0, 0, 50)
    sphere(100)

    drawAxes()
}