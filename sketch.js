// noinspection NonAsciiCharacters

/*
@author Winry
@date 2021-10-16

Coding plan:
.   EasyCam so that I can actually work with spheres. Bugs: no reference!
.   Convert into WEBGL and draw axes
    HUD for X, Y, and Z axes with Blender view (forgot about this, add it in)
.   Explain 3D polar coordinates at the top of the program (need more knowledge)
.   Draw points with X and Y, like latitude and longitude
.   Create 2D array and stuff points into it, then show every point
.   Try to make the triangle strips
.   Create pyramid!
    Create oscillations of pyramids
    Only draw pyramid faces within drawing radius
        Add background to make up for lack of extra pyramid faces
    Lighting
*/

let font

// variables for the drawAxes function
const DARK_BRIGHTNESS = 60
const LIGHT_BRIGHTNESS = 100
const DISTANCE = 40000

// variables used for the globe functions
const SPHERE_DETAIL = 32
let globe, cam, voice, p5amp
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
    voice = loadSound('adam.mp3')
}

function setup() {
    createCanvas(640, 360, WEBGL)
    colorMode(HSB, 360, 100, 100, 100)
    cam = new Dw.EasyCam(this._renderer, {distance:300})

    initializeGlobeArray()
    populateGlobe()

    // voice = new p5.AudioIn(); voice.start()
    voice.play()
    p5amp = new p5.Amplitude()
}

function draw() {
    background(209, 80, 40)
    ambientLight(250)
    directionalLight(0, 0, 10, .5, 0, 1) // z axis seems inverted

    showGlobe()
    // drawAxes()
}

// makes the globe a 2D array
function initializeGlobeArray() {
    /*
        we can trick the computer into thinking it's dealing with just 1D
        arrays when it's actually handling 2D ones by stuffing an array into
        each index. Also, JavaScript does not support initialized 2D
        arrays, which Zz looked into for me.
     */
    globe = Array(SPHERE_DETAIL + 1)
    for (let i = 0; i < globe.length; i++) {
        globe[i] = Array(SPHERE_DETAIL + 1)
    }
}



// fills the globe with points
function populateGlobe() {
    strokeWeight(0.01)
    stroke(0, 0, 60)
    let ??, ??, x, y, z
    // I'll think about consolidating the for loops later
    for (let i = 0; i < globe.length; i++) {
        // change this to 0, TAU for a meridian view
        ?? = map(i, 0, globe.length - 1, 0, PI)
        for (let j = 0; j < globe[i].length; j++) {
            /*
                we're converting from (x, y, z) coordinates to spherical
                coordinates, or (r, ??, ??) coordinates. I did a proof of it!
                For each latitude, we circle around the entire globe. To avoid
                overlap we can only go through the latitude at ?? radians and
                the longitude ?? radians. (?? = 2?? even though stands for torque)
             */

            /*
                instead of the standard (x, y, z) coordinates, we're working in
                spherical coordinates or (r, ??, ??) coordinate space. I have a
                proof of this conversion. r is just the radius of our sphere.
                ?? is the clockwise angle from the positive x-axis onto the xy
                plane, while ?? is the clockwise angle from the positive z-axis
                onto our location vector (x, y, z).
             */

            // change this to 0, PI for a meridian view
            ?? = map(j, 0, globe[i].length - 1, 0, PI)

            // I proved the values below using trigonometry and 3D coordinates
            x = r * sin(??) * cos(??)
            y = r * sin(??) * sin(??)
            z = r * cos(??)
            globe[i][j] = new p5.Vector(x, y, z)
        }
    }
}

// shows all the points in the globe
function showGlobe() {
    push()
    rotateX(PI/2)
    let pyramidPoints, distance
    // code for pyramid
    let currentVoiceAmp
    let lastVoiceAmp = 0
    for (let i = 0; i < globe.length - 1; i++) {
        for (let j = 0; j < globe[0].length - 1; j++) {
            pyramidPoints = [
                globe[i][j],
                globe[i + 1][j],
                globe[i + 1][j + 1],
                globe[i][j + 1],
                globe[i][j]
            ]

            noStroke()
            fill(210, 100, 15)

            // Instead of finding the distance from each individual point, we
            // get the average of each point.
            let avg = new p5.Vector(0, 0, 0)
            for (let p of pyramidPoints) {
                avg.add(p)
            }
            avg.div(4)

            /*  average out the current voice amp with the previous value to
    prevent large skips. similar to FFT.smooth()
    TODO average out the last 10 values, maybe. use array pop0
*/

// currentVoiceAmp = (voice.getLevel() + lastVoiceAmp) / 2
            currentVoiceAmp = (p5amp.getLevel() + lastVoiceAmp) / 2
            lastVoiceAmp = currentVoiceAmp

            /*  we want the voice amp to have the greatest effect in the center
                and then drop off somewhat quickly
            */
            distance = sqrt(avg.x ** 2 + avg.z ** 2)
            currentVoiceAmp = 50 * map(currentVoiceAmp, 0, 0.25, 0, 1)
                / (distance ** (1.9))

            let sine = sin(distance / 10 - frameCount / 30)

            let oscillationOffset = (r + 2.5 * sine + 2.5) / r

            oscillationOffset -= currentVoiceAmp

            specularMaterial(210, 100, 22)
            // fill(210, 100, 22)
            shininess(100)
            // scales the base radius so that the distance will render the
            // same amount of blocks for a bigger pyramid
            let PYRAMID_DRAW_RADIUS = 68/100*r
            beginShape()
            // start on the pyramid base quad
            for (let p of pyramidPoints) {
                // we need the distance from the y-axis.
                // the general sine formula is asin(b(x+c))+d. We want the
                // amplitude, phase shift, and period to be different.
                // if we're close enough to the y-axis, scale the vertex.
                // Otherwise, just create the vertex.
                if (distance < PYRAMID_DRAW_RADIUS) {
                    vertex(
                        p.x * oscillationOffset,
                        p.y * oscillationOffset,
                        p.z * oscillationOffset
                    )
                } else {
                    vertex(p.x, p.y, p.z)
                }
            }
            endShape()

            // Now we can draw the blue pyramids.

            let fromColor = color(185, 1, 98)
            let toColor = color(184, 57, 95)
            let c = lerpColor(fromColor, toColor, distance / r)



            noStroke()
            fill(c)
            if (distance < PYRAMID_DRAW_RADIUS) {
                beginShape(TRIANGLE_STRIP)
                for (let p of pyramidPoints) {
                    // we follow the steps we took on the pyramid base quad,
                    // except we only draw if our distance is sufficient.
                    vertex(
                        p.x * oscillationOffset,
                        p.y * oscillationOffset,
                        p.z * oscillationOffset
                    )
                    vertex(0, 0, 0)
                }
                endShape()
            }

        }
    }

    renderCover()
    renderWires()

    pop()
}

function renderCover() {
    push()
    bezierDetail(30)
    rotateX(PI/2)
    fill(184, 57, 95)
    circle(0, 0, r*2-1)

    fill(0, 0, 100); noStroke()

    translate(0, 0, -5)
    torus(r+1, 1, 100, 100)

    translate(0, 0, 5)
    fill(210, 100, 20)
    torus(r+10, 10, 100, 100)

    translate(0, 0, 1)
    circle(0, 0, r*2-1)
    pop()
}

// makes the donuts (donut = torus) on the outside of Adam
function renderWires() {
    // iterate through a total of 12 rings, and create an angle out of it
    // compute the x and y using sine and cosine, respectively
    // rotate around the z-axis by angle

    push()
    rotateX(PI/2)


    for (let i = 0; i < 12; i++) {
        let angle = map(i, 0, 12, 0, TAU)
        let R = r+10

        let x = R * cos(angle)
        let y = R * sin(angle)

        push()
        translate(x, y)
        rotateZ(angle)
        // rotateX(angle)
        rotateX(PI/2)

        fill(210, 100, 20)
        torus(20, 10, 4, 100)

        pop()
    }
    pop()
}

function touchStarted() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume().then(r => {});
    }
}
