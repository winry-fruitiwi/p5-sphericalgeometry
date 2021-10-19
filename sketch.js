// noinspection NonAsciiCharacters

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
const DISTANCE = 4000

const SPHERE_DETAIL = 40
let globe
let r = 100


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
    new Dw.EasyCam(this._renderer, {distance:500})
}

function draw() {
    background(209, 80, 30)

    createGlobe()
    populateGlobe()
    showGlobe()

    noFill()
    // turn this to 0.01 for a scary spiderweb globe effect!
    strokeWeight(1)
    // you need 100 brightness or else the spiderweb won't be visible enough
    stroke(0, 0, 50)
    // sphere(100)

    drawAxes()
}

// makes the globe a 2D array
function createGlobe() {
    /*
        we can trick the computer into thinking it's dealing with just 1D
        arrays when it's actually only doing 2D ones by stuffing an array into
        only each index. Also, JavaScript does not support initialized 2D
        arrays, which Zz looked into for me.
     */
    globe = Array(SPHERE_DETAIL + 1)
    for (let i = 0; i < globe.length; i++) {
        globe[i] = Array(SPHERE_DETAIL + 1)
    }
}

// fills the globe with points
function populateGlobe() {
    strokeWeight(0.5)
    stroke(0, 0, 60)
    // fill(0, 0, 100)
    let θ, φ, x, y, z
    // I'll think about consolidating the for loops later
    for (let i = 0; i < globe.length; i++) {
        // change this to 0, TAU for a meridian view
        θ = map(i, 0, globe.length - 1, 0, PI)
        for (let j = 0; j < globe[0].length; j++) {
            /*
                we're converting from (x, y, z) coordinates to spherical
                coordinates, or (r, θ, φ) coordinates. I did a proof of it!
                For each latitude, we circle around the entire globe. To avoid
                overlap we can only go through the latitude at π radians and
                the longitude τ radians. (τ = 2π even though stands for torque)
             */

            /*
                instead of the standard (x, y, z) coordinates, we're working in
                spherical coordinates or (r, θ, φ) coordinate space. I have a
                proof of this conversion. r is just the radius of our sphere.
                θ is the clockwise angle from the positive x-axis onto the xy
                plane, while φ is the clockwise angle from the positive z-axis
                onto our location vector (x, y, z).
             */

            // change this to 0, PI for a meridian view
            φ = map(j, 0, globe[0].length - 1, -PI, PI)

            // I proved the values below using trigonometry and 3D coordinates
            x = r * sin(φ) * cos(θ)
            y = r * sin(φ) * sin(θ)
            z = r * cos(φ)

            globe[i][j] = new p5.Vector(x, y, z)
        }
    }
}

// shows all the points in the globe
function showGlobe() {
    let v
    stroke("lightgray")
    strokeWeight(1)
    for (let i = 0; i < globe.length; i++) {
        for (let j = 0; j < globe[0].length; j++) {
            // the point we're drawing
            v = globe[i][j]
            point(v.x, v.y, v.z)
        }
    }
}
