window.addEventListener('load', setup);

async function setup() {
    Number.prototype.m_formatter = function() {
        return this > 999999 ? (this / 1000000).toFixed(1) + 'M' : this
    };
    const ctx = document.getElementById('chart').getContext('2d');
    const globalTemps = await getData();

    const chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: globalTemps.years,
            datasets: [
                {
                    label: '',
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    borderColor: "rgba(255, 255, 255, 1)",
                    pointBackgroundColor: "rgba(255, 255, 255, 1)",
                    data: globalTemps.temps,
                },
            ],
        },
        layout: {
            padding: {
                right: 10
            }
        },
        options: {
            legend: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "rgba(255, 255, 255, 1)",
                    },
                    gridLines: {
                        display: false,
                    },
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "rgba(255, 255, 255, 1)",
                    },
                    gridLines: {
                        color: "rgba(255, 255, 255, .2)",
                        borderDash: [5, 5],
                        zeroLineColor: "rgba(255, 255, 255, .2)",
                        zeroLineBorderDash: [5, 5]
                    },
                }]
            }
        }
    });
  }

  async function getData() {
    // const response = await fetch('testdata.csv');
    const response = await fetch('/datas/company/nifra-data.json');
    const data = await response.json();
    const years = [];
    const temps = [];
    var labels = data.map(function(e) {
        years.push(e.businessDate);
     });
     var labels2 = data.map(function(e) {
        temps.push(e.closePrice)
     });

    return { years, temps };
  }

  function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }