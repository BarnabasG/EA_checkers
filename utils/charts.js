var configWeights = {
    toImageButtonOptions: {
        format: 'png', // one of png, svg, jpeg, webp
        filename: 'weights_image',
        height: 400,
        width: 400,
        scale: 7, // Multiply title/legend/axis/canvas sizes by this factor
    }
}

var configGraph = {
    toImageButtonOptions: {
        format: 'png', // one of png, svg, jpeg, webp
        filename: 'graph_image',
        scale: 7, // Multiply title/legend/axis/canvas sizes by this factor
    }
}


//////////////////////

// Experiment 1
var score1_1 = [  
    0.43, 0.46, 0.49, 0.51, 0.495, 0.485, 0.486, 0.617, 0.57, 0.58, 0.43, 0.55, 0.62, 0.65, 0.47, 0.683, 0.55, 0.533, 0.617, 0.683, 0.617, 0.83, 0.58, 0.65, 0.683
];
var winloss1_1 = [
    0.316, 0.389, 0.472, 0.531, 0.478, 0.44, 0.417, 0.563, 0.556, 0.833, 0.538, 0.778, 0.6, 0.647, 0.4, 0.727, 1, 0.167, 0.556, 0.857, 0.727, 0.857, 0.556, 0.778, 0.857
];
var score1_2 = [
    0.39, 0.33, 0.405, 0.495, 0.47, 0.4, 0.473, 0.492, 0.51, 0.5, 0.5, 0.54, 0.49, 0.46, 0.48, 0.517, 0.585, 0.633, 0.617, 0.65, 0.617, 0.685, 0.633, 0.617, 0.617
];
var winloss1_2 = [
    0.296, 0.207, 0.327, 0.49, 0.429, 0.315, 0.447, 0.478, 0.524, 0.5, 0.5, 0.571, 0.48, 0.417, 0.429, 0.526, 0.154, 0.81, 0.667, 0.941, 1, 0.81, 0.81, 0.667, 0.941
];


// Experiment 2
var score2_1 = [  
    0.445, 0.39, 0.53, 0.535, 0.52, 0.575, 0.48, 0.508, 0.67, 0.68, 0.69, 0.62, 0.52, 0.52, 0.53, 0.583, 0.5, 0.475, 0.515, 0.463, 0.55, 0.6, 0.525, 0.588, 0.625
];
var winloss2_1 = [
    0.296, 0.176, 0.568, 0.59, 0.556, 0.714, 0.421, 0.522, 0.96, 0.875, 0.806, 0.75, 0.563, 0.625, 0.5, 0.8, 0.5, 0.375, 0.45, 0.1, 0.667, 0.75, 0.75, 0.889, 0.857
];
var score2_2 = [
    0.445, 0.405, 0.41, 0.44, 0.425, 0.4, 0.412, 0.342, 0.39, 0.38, 0.3, 0.31, 0.25, 0.31, 0.26, 0.513, 0.388, 0.538, 0.5, 0.513, 0.475, 0.538, 0.45, 0.425, 0.575
];
var winloss2_2 = [
    0.351, 0.306, 0.286, 0.364, 0.297, 0.292, 0.29, 0.12, 0.176, 0.125, 0.045, 0.12, 0.069, 0.048, 0.038, 0.529, 0.154, 0.714, 0.5, 0.545, 0.4, 0.667, 0.415, 0.35, 0.443
];


// Experiment 3
var score3_1 = [
    //0.48, 0.455, 0.515, 0.47, 0.495, 0.55, 0.55, 0.55, 0.467, 0.45, 0.517, 0.567, 0.6, 0.683, 0.683, 0.783, 0.783, 0.717, 0.717, 0.7
    0.48, 0.455, 0.515, 0.47, 0.495, 0.55, 0.55, 0.55, 0.467, 0.45, 0.517, 0.567, 0.6, 0.683, 0.683, 0.783, 0.783, 0.717, 0.717, 0.85, 0.783, 0.85, 0.85, 0.783, 0.85
];
var winloss3_1 = [
    0.455, 0.378, 0.543, 0.421, 0.486, 0.609, 0.615, 0.444, 0.385, 0.529, 0.517, 0.667, 0.75, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];
var score3_2 = [
    0.35, 0.325, 0.37, 0.405, 0.47, 0.47, 0.56, 0.583, 0.5, 0.467, 0.433, 0.65, 0.7, 0.617, 0.683, 0.65, 0.667, 0.55, 0.583, 0.7, 0.783, 0.783, 0.75, 0.8, 0.783
];
var winloss3_2 = [
    0.188, 0.093, 0.19, 0.279, 0.435, 0.446, 0.625, 0.619, 0.5, 0.438, 0.357, 0.765, 0.833, 0.667, 0.824, 0.714, 0.727, 0.565, 0.619, 0.8, 0.8, 0.765, 0.889, 0.941, 0.889
];


let gens = [...Array(score3_1.length).keys()]

// Experiment 1
let naivedata1 = [
    {
        x: gens,
        y: score1_1,
        mode:"lines+markers",
        line: {shape: 'spline'},
        name: "score"
    },
    {
        x: gens,
        y: winloss1_1,
        mode:"lines+markers",
        line: {shape: 'spline'},
        name: "winloss"
    },
]

const naivelayout1 = {
    xaxis: {title: "Generation"},
    yaxis: {range: [0,1.03], title: "Score"},
};

Plotly.newPlot("naive1", naivedata1, naivelayout1, configGraph);


let guidedData1 = [
    {x: gens, y: score1_2, mode:"lines+markers",
        line: {shape: 'spline'},
        name: "score"
    },
    {x: gens, y: winloss1_2, mode:"lines+markers",
        line: {shape: 'spline'},
        name: "winloss"
    },
]

const guidedLayout1 = {
    xaxis: {title: "Generation"},
    yaxis: {range: [0, 1.03], title: "Score"},
};

Plotly.newPlot("guided1", guidedData1, guidedLayout1, configGraph);


// Experiment 2
let naivedata2 = [
    {
        x: gens,
        y: score2_1,
        mode:"lines+markers",
        line: {shape: 'spline'},
        name: "score"
    },
    {
        x: gens,
        y: winloss2_1,
        mode:"lines+markers",
        line: {shape: 'spline'},
        name: "winloss"
    },
]

const naivelayout2 = {
    xaxis: {title: "Generation"},
    yaxis: {range: [0,1.03], title: "Score"},
};

Plotly.newPlot("naive2", naivedata2, naivelayout2, configGraph);


let guidedData2 = [
    {x: gens, y: score2_2, mode:"lines+markers",
        line: {shape: 'spline'},
        name: "score"
    },
    {x: gens, y: winloss2_2, mode:"lines+markers",
        line: {shape: 'spline'},
        name: "winloss"
    },
]

const guidedLayout2 = {
    xaxis: {title: "Generation"},
    yaxis: {range: [0, 1.03], title: "Score"},
};

Plotly.newPlot("guided2", guidedData2, guidedLayout2, configGraph);


// Experiment 3
let naivedata3 = [
    {
        x: gens,
        y: score3_1,
        mode:"lines+markers",
        line: {shape: 'spline'},
        name: "score"
    },
    {
        x: gens,
        y: winloss3_1,
        mode:"lines+markers",
        line: {shape: 'spline'},
        name: "winloss"
    },
]

const naivelayout3 = {
    xaxis: {title: "Generation"},
    yaxis: {range: [0,1.03], title: "Score"},
};

Plotly.newPlot("naive3", naivedata3, naivelayout3, configGraph);


let guidedData3 = [
    {x: gens, y: score3_2, mode:"lines+markers",
        line: {shape: 'spline'},
        name: "score"
    },
    {x: gens, y: winloss3_2, mode:"lines+markers",
        line: {shape: 'spline'},
        name: "winloss"
    },
]

const guidedLayout3 = {
    xaxis: {title: "Generation"},
    yaxis: {range: [0, 1], title: "Score"},
};

Plotly.newPlot("guided3", guidedData3, guidedLayout3, configGraph);




var generations = [...Array(25).keys()]


const experiment3Data = {'pieces': {'mean': [0.758, 0.8281, 1.1769, 1.3142, 1.3733, 1.2807, 1.262, 1.3947, 1.1751, 1.3599, 1.0985, 1.3829, 1.5219, 1.7306, 1.7755, 1.8734, 1.9097, 1.9023, 1.8379, 1.8257,    1.8831, 1.9097, 1.9223, 1.9379, 1.9567], 'stdDev': [1.03, 0.8947, 0.6627, 0.7089, 0.7005, 0.7356, 0.8555, 0.7135, 0.8089, 0.4686, 0.3747, 0.7905, 0.4525, 0.2768, 0.231, 0.106, 0.1125, 0.1472, 0.136, 0.1467,    0.131, 0.1125, 0.105, 0.0981, 0.0975]}, 'kings': {'mean': [0.457, 0.5739, 0.6302, 0.5954, 0.5521, 0.3089, 0.5255, 0.2545, 0.6781, 0.8243, 0.8623, 0.4643, 1.1592, 1.4436, 1.5568, 1.6858, 1.642, 1.6271, 1.6743, 1.6651,      1.6748, 1.6852, 1.6975, 1.6743, 1.6984], 'stdDev': [0.9108, 0.8609, 0.7107, 0.7307, 0.79, 0.7416, 0.7605, 0.9332, 0.6884, 0.6078, 0.4024, 1.1656, 0.785, 0.544, 0.3236, 0.0548, 0.2529, 0.2851, 0.103, 0.0993,    0.0742, 0.0684, 0.066, 0.0621, 0.0587]}, 'avrDist': {'mean': [0.6596, 0.8186, 0.608, 1.0892, 1.043, 0.4501, 0.7609, 0.2433, -0.3137, -0.1981, -0.2368, 0.0271, -0.9764, -1.443, -1.4701, -1.6743, -1.6248, -1.5961, -1.7209, -1.757,     -1.7489, -1.784, -1.6847, -1.727, -1.764], 'stdDev': [1.1308, 1.0096, 1.2215, 1.0446, 1.1199, 1.268, 1.1772, 1.5266, 1.1315, 1.1769, 0.7357, 1.3866, 0.8385, 0.5295, 0.5108, 0.0626, 0.2574, 0.2814, 0.1055, 0.084,    0.0626, 0.2574, 0.2814, 0.1055, 0.084]}, 'backline': {'mean': [0.4721, 0.4905, 0.388, 0.2209, 0.1732, 0.9563, 0.6036, 0.7297, 0.5271, 0.8377, 0.9327, 0.7082, 0.9177, 0.849, 0.77, 0.701, 0.6018, 0.6018, 0.7306, 0.8162,    0.801, 0.7818, 0.879, 0.8497, 0.887], 'stdDev': [1.1426, 1.0448, 1.162, 1.2021, 1.2241, 0.6028, 0.6025, 0.7351, 0.8389, 0.3049, 0.1368, 0.5983, 0.2884, 0.2805, 0.1713, 0.0782, 0.3981, 0.3967, 0.1594, 0.1351,    0.077, 0.391, 0.297, 0.154, 0.1471]}, 'corners': {'mean': [0.3751, 0.2125, 0.3616, 0.2021, 0.2546, 0.5528, 0.295, 0.3774, 0.4308, 0.4911, 0.1248, 0.3656, 0.6171, 0.976, 0.9625, 1.0972, 1.1143, 1.1395, 0.9949, 1.018,    0.9785, 0.9573, 1.05, 0.984, 0.918], 'stdDev': [0.9634, 0.9564, 0.901, 0.7434, 0.6169, 0.7997, 0.5144, 0.7744, 0.4472, 0.4306, 0.4424, 0.6763, 0.607, 0.4496, 0.3881, 0.0969, 0.2568, 0.2516, 0.1635, 0.1177,   0.1459, 0.21, 0.156, 0.143, 0.127]}, 'edges': {'mean': [0.7741, 0.7359, 1.0652, 1.175, 1.1361, 1.1068, 1.0583, 1.1991, 0.7701, 0.405, -0.1176, 0.7693, 0.5732, 0.8531, 0.9644, 1.1306, 1.1068, 1.1502, 1.0949, 1.0587,    1.206, 1.11, 1.15, 1.023, 1.055], 'stdDev': [0.9597, 0.9173, 0.7196, 0.6889, 0.7308, 1.0494, 1.0371, 0.8926, 1.0671, 1.0658, 0.7488, 0.8389, 0.7674, 0.6764, 0.5368, 0.1122, 0.1111, 0.1076, 0.1287, 0.1528,     0.1178, 0.1141, 0.1176, 0.128, 0.138]}, 'centre2': {'mean': [0.3809, 0.4364, 0.543, -0.0619, 0.0246, 0.4296, 0.4173, 0.1898, 0.6589, 0.5205, 0.9609, -0.2202, 0.1962, -0.3035, -0.3136, -0.5557, -0.4214, -0.4315, -0.5696, -0.5536,      -0.5457, -0.5214, -0.5315, -0.3696, -0.4836], 'stdDev': [0.9194, 0.9499, 1.0929, 0.9042, 0.8214, 0.7844, 0.7174, 0.8718, 0.8825, 0.7989, 0.6489, 1.0081, 0.9314, 0.5716, 0.587, 0.0653, 0.5322, 0.5129, 0.1128, 0.1258,   0.0853, 0.322, 0.4129, 0.8128, 0.2258]}, 'centre4': {'mean': [0.1008, 0.014, 0.2589, 0.0985, 0.1483, 0.9331, 0.5905, 0.529, 0.6686, 0.8327, 0.7613, 0.93, 0.8856, 1.2871, 1.2572, 1.3846, 1.2536, 1.2856, 1.3943, 1.4262,    1.346, 1.236, 1.289, 1.389, 1.416], 'stdDev': [1.1356, 1.0083, 1.0655, 1.109, 1.0827, 0.5935, 0.7399, 0.9326, 0.4609, 0.4095, 0.2451, 0.3672, 0.8037, 0.2739, 0.2658, 0.0567, 0.3651, 0.3877, 0.0927, 0.1066,     0.1467, 0.361, 0.367, 0.0827, 0.1166]}, 'centre8': {'mean': [0.433, 0.3546, 0.6173, 0.6931, 1.08, 0.8492, 1.333, 1.1381, 1.3465, 1.3467, 1.6386, 0.9636, 0.9479, 0.7593, 0.8056, 0.6149, 0.6194, 0.592, 0.5832, 0.5245,     0.5149, 0.5294, 0.552, 0.543, 0.5351], 'stdDev': [1.0488, 1.01, 1.0425, 1.0579, 0.7592, 1.0332, 0.6799, 0.6092, 0.4562, 0.4637, 0.4265, 0.8751, 0.8238, 0.4428, 0.4276, 0.0999, 0.1364, 0.1313, 0.1419, 0.1284,    0.122, 0.1464, 0.1213, 0.118, 0.114]}, 'defended': {'mean': [0.2455, 0.2356, -0.0061, -0.1612, -0.3351, -0.4963, -0.3653, -0.0374, -0.4538, -0.7552, -1.0388, -0.5164, -0.7026, -0.4437, -0.6515, -0.5943, -0.4638, -0.435, -0.6241, -0.7243,    -0.6943, -0.6638, -0.635, -0.6841, -0.715], 'stdDev': [1.1979, 1.2576, 1.1954, 0.872, 0.7446, 0.8956, 0.6763, 0.7259, 0.7626, 0.5766, 0.4119, 0.7103, 0.4686, 0.6684, 0.2678, 0.1038, 0.526, 0.5178, 0.1554, 0.151,     0.168, 0.226, 0.2178, 0.157, 0.181]}, 'attacks': {'mean': [0.311, 0.2362, 0.4838, 0.5656, 0.3479, -0.2311, 0.2011, 0.0563, 0.4497, 0.2599, 0.7295, 0.1185, 0.447, 0.0682, 0.1895, 0.0394, 0.1025, 0.0988, 0.0072, 0.0428,    0.0494, 0.02, 0.098, 0.0072, 0.0118], 'stdDev': [1.158, 1.2427, 1.2348, 1.1399, 1.1381, 0.9379, 1.0199, 0.8367, 0.7467, 0.8869, 0.5687, 0.7082, 0.4841, 0.524, 0.3515, 0.1038, 0.4253, 0.429, 0.0632, 0.0763,   0.0838, 0.225, 0.529, 0.163, 0.0834]}}


var plotAllData = [
    {
        name: "Pieces",
        x: generations,
        //y: goodRunData.piecesMean,
        y: experiment3Data.pieces.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Kings",
        x: generations,
        y: experiment3Data.kings.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Average Distance",
        x: generations,
        y: experiment3Data.avrDist.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Backline",
        x: generations,
        y: experiment3Data.backline.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Corners",
        x: generations,
        y: experiment3Data.corners.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Edges",
        x: generations,
        y: experiment3Data.edges.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Centre 2",
        x: generations,
        y: experiment3Data.centre2.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Centre 4",
        x: generations,
        y: experiment3Data.centre4.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Centre 8",
        x: generations,
        y: experiment3Data.centre8.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Defended",
        x: generations,
        y: experiment3Data.defended.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Attacks",
        x: generations,
        y: experiment3Data.attacks.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline', color: 'black'}
    }
];

const weightsLayout3 = {
    xaxis: {title: "Generation"},
    yaxis: {title: "Weight"},
};

Plotly.newPlot('chartAll', plotAllData, weightsLayout3, configGraph);



var plotPiecesKingsData = [
    {
        name: "Pieces",
        x: generations,
        y: experiment3Data.pieces.mean,
        error_y: {
            type: 'data',
            array: experiment3Data.pieces.stdDev,
            //arrayminus: stdDev
            opacity: 0.7,
        },
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'},
    },
    {
        name: "Kings",
        x: generations,
        y: experiment3Data.kings.mean,
        error_y: {
            type: 'data',
            array: experiment3Data.kings.stdDev,
            opacity: 0.7,
        },
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'},
    },
];

Plotly.newPlot('chartPiecesKings', plotPiecesKingsData, weightsLayout3, configGraph);



const experiment1Data = {'pieces': {'mean': [0.8719, 0.9845, 0.8247, 1.0074, 1.0399, 1.0888, 0.9714, 0.7919, 0.8483, 1.1488, 1.1016, 1.0509, 1.2301, 1.2513, 1.2901, 1.2509, 1.4288, 1.419, 1.3184, 1.3638], 'stdDev': [0.8317, 0.7818, 0.7245, 0.6292, 0.3636, 0.4409, 0.4214, 0.4149, 0.3884, 0.3465, 0.4606, 0.5056, 0.4604, 0.2665, 0.1715, 0.3007, 0.0535, 0.0442, 0.2317, 0.1688]}, 'kings': {'mean': [0.2483, 0.3255, 0.2892, 0.6095, 0.699, 0.7396, 0.8127, 0.7983, 0.7642, 0.8252, 0.8283, 0.8044, 0.9532, 0.8807, 0.8419, 1.007, 1.0813, 1.0879, 1.0647, 1.1093], 'stdDev': [1.0158, 0.9747, 0.9696, 0.8056, 0.6579, 0.5241, 0.4659, 0.2336, 0.2106, 0.2143, 0.2472, 0.2612, 0.2874, 0.1754, 0.4426, 0.1324, 0.0635, 0.0692, 0.0817, 0.0733]}, 'avrDist': {'mean': [0.2471, 0.5079, 0.5163, 0.7553, 0.5824, 0.3987, 0.4405, 0.2482, 0.4906, 0.4045, 0.42, 0.4139, 0.3902, 0.3967, 0.3119, 0.4149, 0.2173, 0.261, 0.3841, 0.3674], 'stdDev': [1.1647, 1.1385, 1.0391, 0.7417, 0.567, 0.5673, 0.4374, 0.4799, 0.1441, 0.1952, 0.1609, 0.1666, 0.2458, 0.1797, 0.4125, 0.2681, 0.0852, 0.0893, 0.2228, 0.1362]}, 'backline': {'mean': [0.3105, -0.1396, 0.087, 0.3192, 0.5734, 0.6667, 0.7616, 1.143, 0.9695, 1.1706, 1.0834, 0.9952, 1.1985, 1.3186, 1.416, 1.5185, 1.4644, 1.4337, 1.4635, 1.4075], 'stdDev': [1.1959, 1.0988, 1.2227, 1.0918, 1.126, 1.1565, 0.9637, 0.6717, 0.594, 0.57, 0.5892, 0.5571, 0.579, 0.3409, 0.1605, 0.1754, 0.0574, 0.0816, 0.1645, 0.1281]}, 'corners': {'mean': [0.17, 0.3764, 0.3357, 0.1294, 0.0855, 0.2959, 0.25, 0.242, 0.0931, 0.0933, 0.0673, 0.0339, 0.091, -0.0479, -0.0499, 0.1839, 0.0789, 0.0758, 0.1802, 0.1095], 'stdDev': [0.9578, 1.0265, 0.9528, 0.8464, 0.4534, 0.4461, 0.3512, 0.3112, 0.3106, 0.4241, 0.2528, 0.3146, 0.2607, 0.1828, 0.3304, 0.3002, 0.0639, 0.0716, 0.2086, 0.1645]}, 'edges': {'mean': [0.6598, 0.3353, 0.4558, -0.2703, -0.1763, 0.0328, 0.0733, -0.0094, -0.0117, -0.6287, -0.4218, -0.1823, -0.864, -0.7833, -0.8592, -1.3174, -1.3057, -1.3048, -1.309, -1.2579], 'stdDev': [0.8516, 1.0675, 0.8718, 0.9628, 1.0862, 1.2029, 1.2724, 1.3894, 1.2981, 0.9931, 1.1545, 1.256, 0.8226, 0.7338, 0.6346, 0.3153, 0.0779, 0.0667, 0.1355, 0.1256]}, 'centre2': {'mean': [0.1359, -0.1465, -0.0017, -0.0433, -0.1602, 0.0316, 0.0332, 0.0395, -0.0595, -0.2376, -0.2969, -0.3576, -0.3575, -0.4044, -0.3592, -0.0536, -0.4713, -0.448, -0.2364, -0.3485], 'stdDev': [1.064, 0.9674, 0.9453, 0.7778, 0.769, 0.9616, 0.7299, 0.4499, 0.3613, 0.3554, 0.2696, 0.2397, 0.3018, 0.3309, 0.3965, 0.7001, 0.0382, 0.0256, 0.5189, 0.3815]}, 'centre4': {'mean': [0.1359, 0.2803, 0.4867, 0.7444, 0.5511, 0.5001, 0.5515, 0.7805, 0.3058, 0.8813, 0.4718, 0.2456, 0.7598, 0.701, 0.7566, 0.8918, 1.0304, 1.0564, 0.9864, 1.0291], 'stdDev': [1.067, 1.2194, 1.0978, 0.8292, 0.8411, 1.0702, 1.2443, 1.3306, 1.294, 0.8635, 1.0011, 1.0541, 0.7081, 0.5161, 0.41, 0.2289, 0.1089, 0.1013, 0.1571, 0.1178]}, 'centre8': {'mean': [0.2638, -0.0359, 0.2329, 0.4316, 0.4395, 0.5136, 0.5924, 0.7669, 0.7864, 0.4781, 0.601, 0.6492, 0.4429, 0.4205, 0.4072, 0.1875, 0.2113, 0.238, 0.1818, 0.1959], 'stdDev': [1.0371, 1.2018, 0.9392, 0.8014, 0.735, 0.8067, 0.7542, 0.5373, 0.5348, 0.4448, 0.4966, 0.59, 0.435, 0.2953, 0.3471, 0.1975, 0.1274, 0.1194, 0.1181, 0.0765]}, 'defended': {'mean': [0.5397, 0.5165, 0.4439, 0.8185, 0.7575, 0.6831, 0.8748, 0.9145, 1.256, 1.0204, 1.2727, 1.2874, 1.1261, 1.0133, 0.9253, 1.2259, 1.0025, 1.0196, 1.143, 1.1182], 'stdDev': [1.052, 1.0091, 0.9061, 0.8622, 0.7327, 0.7406, 0.7619, 0.8666, 0.64, 0.3989, 0.5094, 0.8138, 0.3564, 0.3096, 0.241, 0.3885, 0.0457, 0.0446, 0.2556, 0.1798]}, 'attacks': {'mean': [0.2285, 0.3191, 0.6038, 0.9274, 1.3418, 1.0321, 1.0304, 1.0401, 0.9459, 1.3487, 1.1284, 0.9896, 1.4011, 1.3297, 1.3934, 1.2089, 1.5174, 1.5085, 1.3576, 1.4329], 'stdDev': [1.1155, 1.0601, 1.0183, 1.1638, 0.9228, 1.0772, 1.0355, 1.0192, 0.9866, 0.8331, 0.929, 0.8807, 0.6296, 0.5576, 0.3002, 0.4864, 0.0511, 0.0406, 0.3983, 0.2914]}}


var plotAllData1 = [
    {
        name: "Pieces",
        x: generations,
        //y: goodRunData.piecesMean,
        y: experiment1Data.pieces.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Kings",
        x: generations,
        y: experiment1Data.kings.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Average Distance",
        x: generations,
        y: experiment1Data.avrDist.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Backline",
        x: generations,
        y: experiment1Data.backline.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Corners",
        x: generations,
        y: experiment1Data.corners.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Edges",
        x: generations,
        y: experiment1Data.edges.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Centre 2",
        x: generations,
        y: experiment1Data.centre2.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Centre 4",
        x: generations,
        y: experiment1Data.centre4.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Centre 8",
        x: generations,
        y: experiment1Data.centre8.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Defended",
        x: generations,
        y: experiment1Data.defended.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'}
    },
    {
        name: "Attacks",
        x: generations,
        y: experiment1Data.attacks.mean,
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline', color: 'black'}
    }
];

const weightsLayout1 = {
    xaxis: {title: "Generation"},
    yaxis: {title: "Weight"},
};

Plotly.newPlot('chartAll2', plotAllData1, weightsLayout1, configGraph);



var plotPiecesKingsData1 = [
    {
        name: "Pieces",
        x: generations,
        y: experiment1Data.pieces.mean,
        error_y: {
            type: 'data',
            array: experiment1Data.pieces.stdDev,
            //arrayminus: stdDev
            opacity: 0.7,
        },
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'},
    },
    {
        name: "Kings",
        x: generations,
        y: experiment1Data.kings.mean,
        error_y: {
            type: 'data',
            array: experiment1Data.kings.stdDev,
            opacity: 0.7,
        },
        type: 'scatter',
        mode:"lines+markers",
        line: {shape: 'spline'},
    },
];

Plotly.newPlot('chartPiecesKings2', plotPiecesKingsData1, weightsLayout1, configGraph);











let boardStats = ["Pieces", "Kings", "Average Distance", "Backline", "Corners", "Edges", "Centre 2", "Centre 4", "Centre 8", "Defended", "Attacks"];



let point5 = [
    {
        x: boardStats,
        y: [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5],
        type: 'bar'
    }
]

const layout3 = {
    yaxis: {range: [-1, 1], title: "Weight"},
    
}

var config = {
    toImageButtonOptions: {
        format: 'png', // one of png, svg, jpeg, webp
        filename: 'custom_image',
        height: 400,
        width: 400,
        scale: 10, // Multiply title/legend/axis/canvas sizes by this factor
    }
}

Plotly.newPlot("chart4", point5, layout3, config);


let one = [
    {
        x: boardStats,
        y: [1,1,0,0,0,0,0,0,0,0,0],
        type: 'bar'
    }
]

const layout4 = {
    yaxis: {range: [-1, 1], title: "Weight"},
}

Plotly.newPlot("chart5", one, layout4, config);









