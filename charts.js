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

console.log(document)
console.log(document.getElementById('canvas'))
console.log(document.getElementById('chart1'))


new Chart('canvas', {
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
  });/**/

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

/*var yValues = [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5];
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
*/



