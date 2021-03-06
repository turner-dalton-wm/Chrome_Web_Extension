var CVDMatrix = { // Color Vision Deficiency
    Protanope: [ // reds are greatly reduced (1% men)
        0.0, 2.02344, -2.52581,
        0.0, 1.0,      0.0,
        0.0, 0.0,      1.0
    ],
    Deuteranope: [ // greens are greatly reduced (1% men)
        1.0,      0.0, 0.0,
        0.494207, 0.0, 1.24827,
        0.0,      0.0, 1.0
    ],
    Tritanope: [ // blues are greatly reduced (0.003% population)
        1.0,       0.0,      0.0,
        0.0,       1.0,      0.0,
        -0.395913, 0.801109, 0.0
    ]
};

function filter(color) {
    var cvd = CVDMatrix.Protanope,
        cvd_a = cvd[0],
        cvd_b = cvd[1],
        cvd_c = cvd[2],
        cvd_d = cvd[3],
        cvd_e = cvd[4],
        cvd_f = cvd[5],
        cvd_g = cvd[6],
        cvd_h = cvd[7],
        cvd_i = cvd[8];
    var L, M, S, l, m, s, R, G, B, RR, GG, BB;
    var rgb = color.substring(4, color.length-1).replace(/ /g, '').split(',');
    var r = parseInt(rgb[0]),
        g = parseInt(rgb[1]),
        b = parseInt(rgb[2]);
    // RGB to LMS matrix conversion
    L = (17.8824 * r) + (43.5161 * g) + (4.11935 * b);
    M = (3.45565 * r) + (27.1554 * g) + (3.86714 * b);
    S = (0.0299566 * r) + (0.184309 * g) + (1.46709 * b);
    // Simulate color blindness
    l = (cvd_a * L) + (cvd_b * M) + (cvd_c * S);
    m = (cvd_d * L) + (cvd_e * M) + (cvd_f * S);
    s = (cvd_g * L) + (cvd_h * M) + (cvd_i * S);
    // LMS to RGB matrix conversion
    R = (0.0809444479 * l) + (-0.130504409 * m) + (0.116721066 * s);
    G = (-0.0102485335 * l) + (0.0540193266 * m) + (-0.113614708 * s);
    B = (-0.000365296938 * l) + (-0.00412161469 * m) + (0.693511405 * s);
    // Isolate invisible colors to color vision deficiency (calculate error matrix)
    R = r - R;
    G = g - G;
    B = b - B;
    // Shift colors towards visible spectrum (apply error modifications)
    RR = (0.0 * R) + (0.0 * G) + (0.0 * B);
    GG = (0.7 * R) + (1.0 * G) + (0.0 * B);
    BB = (0.7 * R) + (0.0 * G) + (1.0 * B);
    // Add compensation to original values
    R = RR + r;
    G = GG + g;
    B = BB + b;
    // Clamp values
    if(R < 0) R = 0;
    if(R > 255) R = 255;
    if(G < 0) G = 0;
    if(G > 255) G = 255;
    if(B < 0) B = 0;
    if(B > 255) B = 255;
    // Record color
    R = R >> 0;
    G = G >> 0;
    B = B >> 0;
    return "rgb(" + R + "," + G + "," + B + ")";
}

function filterElements() {
    var elements = document.body.getElementsByTagName("*");
    for(var i = 0; i < elements.length; i++) {
        var color = elements[i].style.backgroundColor;
        if(color.length != 0 && color.indexOf("rgb") != -1) elements[i].style.backgroundColor = filter(color);
    }
}

filterElements();
