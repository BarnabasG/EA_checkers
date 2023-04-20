//import Chart, { LinearScale, CategoryScale } from 'chart.js';
//import { LineWithErrorBarsChart, LineWithErrorBars, LineWithErrorBarsController } from 'chartjs-chart-error-bars';
//import { LineWithErrorBarsChart } from 'chartjs-chart-error-bars';

//const {LineWithErrorBarsChart} = require('chartjs-chart-error-bars');

//Chart.register(LineWithErrorBarsController, LineWithErrorBars, LinearScale, CategoryScale);
//Chart.register(lineWithErrorBars);

/*new LineWithErrorBarsChart(document.getElementById('chart3').getContext('2d'), {
    data: {
        labels: ['A', 'B'],
        datasets: [
            {
            data: [
                {
                    y: 4,
                    yMin: 1,
                    yMax: 6,
                },
                {
                    y: 2,
                    yMin: 1,
                    yMax: 4,
                },
            ],
            },
        ],
    },
});*/

//let chart = document.getElementById('canvas')
//console.log(chart)

//console.log(document)
//console.log(document.getElementById('canvas'))
//console.log(document.getElementById('chart1'))


/*new Chart('canvas', {
    type: 'barWithErrorBars',
    data: {
      labels: ['A', 'B'],
      datasets: [
        {
          data: [
            {
              y: 4,
              yMin: 1,
              yMax: 6,
            },
            {
              y: 2,
              yMin: 1,
              yMax: 4,
            },
          ],
        },
      ],
    },
    options: {
      scales: {
        y: {
          ticks: {
            beginAtZero: true,
          },
        },
      },
    },
  });*/

/*new Chart('chart3', {
    type: 'lineWithErrorBars',
        data: {
            labels: ['A', 'B'],
            datasets: [
                {
                data: [
                    {
                        y: 4,
                        yMin: 1,
                        yMax: 6,
                    },
                    {
                        y: 2,
                        yMin: 1,
                        yMax: 4,
                    },
                ],
                },
            ],
        },
    options: {
        // animation: false
    },
});*/


var boardStats = ['pieces','kings','avrDist','backline','corners','edges','centre2','centre4','centre8','defended','attacks'];
var barColors = "blue";

var yValues = [1,1,0,0,0,0,0,0,0,0,0];
new Chart("chart1", {
    type: "bar",
    data: {
        labels: boardStats,
        datasets: [{
            backgroundColor: barColors,
            data: yValues
        }]
    },
    options: {
        legend: { display: false },
        indexAxis: 'y',
        scales: {
            y: {
                ticks: {
                    min: -1,
                    max: 1,
                    beginatZero: false
                },
            }
        }
    }
});


var yValues = [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5];
new Chart("chart2", {
    type: "bar",
    data: {
        labels: boardStats,
        datasets: [{
            backgroundColor: barColors,
            data: yValues
        }]
    },
    options: {
        legend: { display: false },
    }
});
/**/



var x = [...Array(20).keys()].map(i => i+1);
var barColors = "blue";

var score1 = [
    //0.48, 0.455, 0.515, 0.47, 0.495, 0.55, 0.55, 0.55, 0.467, 0.45, 0.517, 0.567, 0.6, 0.683, 0.683, 0.783, 0.783, 0.717, 0.717, 0.7
    0.48, 0.455, 0.515, 0.47, 0.495, 0.55, 0.55, 0.55, 0.467, 0.45, 0.517, 0.567, 0.6, 0.683, 0.683, 0.783, 0.783, 0.717, 0.717, 0.85
];
var score2 = [
    0.35, 0.325, 0.37, 0.405, 0.47, 0.47, 0.56, 0.583, 0.5, 0.467, 0.433, 0.65, 0.7, 0.617, 0.683, 0.65, 0.667, 0.55, 0.583, 0.7
];
var winloss1 = [
    0.455, 0.378, 0.543, 0.421, 0.486, 0.609, 0.615, 0.444, 0.385, 0.529, 0.517, 0.667, 0.75, 1, 1, 1, 1, 1, 1, 1
];
var winloss2 = [
    0.188, 0.093, 0.19, 0.279, 0.435, 0.446, 0.625, 0.619, 0.5, 0.438, 0.357, 0.765, 0.833, 0.667, 0.824, 0.714, 0.727, 0.565, 0.619, 0.8
];

let data = {
    labels: x,
    datasets: [
        {
            data: score1,
            borderColor: "rgb(50, 120, 255)",
            fill: false
        },
        {
            data: score2,
            borderColor: "red",
            fill: false
        },
        {
            data: winloss1,
            borderColor: "rgb(158, 195, 255)",
            fill: false
        },
        {
            data: winloss2,
            borderColor: "rgb(255, 110, 110)",
            fill: false
        }
    ]
}

new Chart("chart3", {
    type: "line",
    data: data,
    options: {
        //legend: { display: false },
        scales: {
            y: {
                //ticks: {
                //    min: -1,
                //    max: 1,
                //    beginatZero: false
                //},
                //text: "Score"
            }
        }
    }
});




let pltdata = [
    {x: x, y: score1, mode:"lines+markers",
        text: ['tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object'], 
        line: {shape: 'spline'}},
    {x: x, y: score2, mode:"lines+markers",
        text: ['tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object'], 
        line: {shape: 'spline'}},
    {x: x, y: winloss1, mode:"lines+markers",
        text: ['tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object'], 
        line: {shape: 'spline'}},
    {x: x, y: winloss2, mode:"lines+markers",
        text: ['tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object'], 
        line: {shape: 'spline'}},
]

// Define Layout
const layout = {
    //xaxis: {range: [40, 160], title: "Square Meters"},
    //yaxis: {range: [5, 16], title: "Price in Millions"},
    title: "plot",
};

Plotly.newPlot("myPlot", pltdata, layout);




var trace1 = {
    x: [1, 2, 3, 4, 5], 
    y: [1, 3, 2, 3, 1], 
    mode: 'lines+markers', 
    name: 'linear', 
    line: {shape: 'linear'}, 
    type: 'scatter'
};

var trace2 = {
    x: [1, 2, 3, 4, 5], 
    y: [6, 8, 7, 8, 6], 
    mode: 'lines+markers', 
    name: 'spline', 
    text: ['tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object', 'tweak line smoothness<br>with "smoothing" in line object'], 
    line: {shape: 'spline'}, 
    type: 'scatter'
};
  
var trace3 = {
    x: [1, 2, 3, 4, 5], 
    y: [11, 13, 12, 13, 11], 
    mode: 'lines+markers', 
    name: 'vhv', 
    line: {shape: 'vhv'}, 
    type: 'scatter'
};
  
var trace4 = {
    x: [1, 2, 3, 4, 5], 
    y: [16, 18, 17, 18, 16], 
    mode: 'lines+markers', 
    name: 'hvh', 
    line: {shape: 'hvh'}, 
    type: 'scatter'
};
  
var trace5 = {
    x: [1, 2, 3, 4, 5], 
    y: [21, 23, 22, 23, 21], 
    mode: 'lines+markers', 
    name: 'vh', 
    line: {shape: 'vh'}, 
    type: 'scatter'
};
  
var trace6 = {
    x: [1, 2, 3, 4, 5], 
    y: [26, 28, 27, 28, 26], 
    mode: 'lines+markers', 
    name: 'hv', 
    line: {shape: 'hv'}, 
    type: 'scatter'
};

var data1 = [trace1, trace2, trace3, trace4, trace5, trace6];
  
var layout1 = {legend: {
    y: 0.5, 
    traceorder: 'reversed', 
    font: {size: 16}, 
    yref: 'paper'
}};
  
Plotly.newPlot('myPlot2', data1, layout1, {showSendToCloud: true});





let pltdata1 = [
    {x: x, y: score1, mode:"lines+markers",
        line: {shape: 'spline'}},
    {x: x, y: score2, mode:"lines+markers",
        line: {shape: 'spline'}},
]

// Define Layout
const pltlayout = {
    xaxis: {title: "Generation"},
    //yaxis: {range: [5, 16], title: "Price in Millions"},
    yaxis: {range: [0, 1], title: "Score"},
    title: "score plot",
};

Plotly.newPlot("plotly1", pltdata1, pltlayout);



let pltdata2 = [
    {x: x, y: winloss1, mode:"lines+markers",
        line: {shape: 'spline'}},
    {x: x, y: winloss2, mode:"lines+markers",
        line: {shape: 'spline'}},
]

// Define Layout
const pltlayout2 = {
    xaxis: {title: "Generation"},
    yaxis: {range: [0], title: "Winloss"},
    title: "winloss plot",
};

Plotly.newPlot("plotly2", pltdata2, pltlayout2);



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

Plotly.newPlot("chart4", point5, layout3);


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

Plotly.newPlot("chart5", one, layout4);