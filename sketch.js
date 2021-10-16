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
    sphere(100)
}