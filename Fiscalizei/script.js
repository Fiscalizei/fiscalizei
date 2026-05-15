// script.js

const options = {
    chart: {
        type: 'bar',
        height: 320,
        stacked: true,
        toolbar: {
            show: false
        }
    },

    series: [
        {
            name: 'Feitos',
            data: [10, 20, 25, 22, 30, 26]
        },

        {
            name: 'Pendentes',
            data: [20, 10, 5, 7, 0, 4]
        }
    ],

    colors: ['#7A6FF0', '#FFA94D'],

    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '40%',
            borderRadius: 10,
            borderRadiusApplication: 'around',
            borderRadiusWhenStacked: 'last'
        }
    },

    dataLabels: {
        enabled: false
    },

    tooltip: {
        enabled: true
    },

    xaxis: {
        categories: [
            'Segunda',
            'Terça',
            'Quarta',
            'Quinta',
            'Sexta',
            'Sábado'
        ],

        labels: {
            style: {
                colors: '#777'
            }
        }
    },

    yaxis: {
        labels: {
            style: {
                colors: '#777'
            }
        }
    },

    legend: {
        position: 'top',
        horizontalAlign: 'right',

        markers: {
            size: 6,
            offsetX: -3,
            shape: 'circle',
            strokeWidth: 0
        },

        itemMargin: {
            horizontal: 10,
            vertical: 2
        },

        fontSize: '13px'
    },

    stroke: {
        width: 5,
        colors: ['#fff']
    },

    grid: {
        show: false
    }
};

const chart = new ApexCharts(
    document.querySelector("#bar-chart"),
    options
);

chart.render();