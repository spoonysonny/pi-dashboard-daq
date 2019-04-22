/*!
 * Pi Dashboard (http://www.nxez.com)
 * Copyright 2017 NXEZ.com.
 * Licensed under the GPL v3.0 license.
 */
$(document).ready(function() {
    var SENSOR_API_URL = 'http://192.168.1.42:8080/?ajax=true';
    Highcharts.setOptions({
        global: {
            useUTC: false
        },
        credits: {
            enabled: false
        },
        navigation: {
            buttonOptions: {
                enabled: false
            }
        }
    });

    var gaugeOptions = {

        chart: {
            type: 'solidgauge'
        },

        title: null,

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#FFFFFF',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        tooltip: {
            enabled: false
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'],
                [0.5, '#DDDF0D'],
                [0.9, '#DF5353']
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },

        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };


    var chartCPU = Highcharts.chart('container-cpu', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 100,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'CPU',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:28px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}</span>' +
                    '<span style="font-size:12px;color:silver">%</span></div>'
            },
            tooltip: {
                valueSuffix: ' %'
            }
        }]

    }));

    var chartRAM = Highcharts.chart('container-mem', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: init_vals.mem.total,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'MEMORY',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    '<span style="font-size:12px;color:silver">MB</span></div>'
            },
            tooltip: {
                valueSuffix: ' MB'
            }
        }]

    }));

    var chartCache = Highcharts.chart('container-cache', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: init_vals.mem.total,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'CACHE',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:12px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    '<span style="font-size:10px;color:silver">MB</span></div>'
            },
            tooltip: {
                valueSuffix: ' MB'
            }
        }]

    }));

    var chartRAM_real = Highcharts.chart('container-mem-real', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: init_vals.mem.total,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'REAL MEMORY',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:12px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    '<span style="font-size:10px;color:silver">MB</span></div>'
            },
            tooltip: {
                valueSuffix: ' MB'
            }
        }]

    }));

    var chartSWAP = Highcharts.chart('container-swap', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: init_vals.mem.swap.total,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'SWAP',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:12px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    '<span style="font-size:10px;color:silver">MB</span></div>'
            },
            tooltip: {
                valueSuffix: ' MB'
            }
        }]

    }));

    var chartDisk = Highcharts.chart('container-disk', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: init_vals.disk.total,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'DISK',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:12px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    '<span style="font-size:10px;color:silver">GB</span></div>'
            },
            tooltip: {
                valueSuffix: ' GB'
            }
        }]

    }));

    var chartNetInterfaces = new Array();
    var net_In = new Array();
    var net_Out = new Array();
    for(i=0;i<init_vals.net.count;i++)
    {
        var chartNetInterface = Highcharts.chart('container-net-interface-'+(i+1), {
            title: {
                text: ''
            },
            legend: {
                enabled: false
            },
            xAxis: {
                categories: [],
                title: {
                    text: ''
                }
            },
            yAxis: {
                title: {
                    text: '',
                    style: {
                        fontWeight: 'normal'
                    }
                }
            },
            series: [
                {
                    name: 'IN',
                    data: [0],
                    color: '#093AC9',
                    marker: {
                        enabled: false
                    }
                },
                {
                    name: 'OUT',
                    data: [0],
                    color: '#3CCB3E',
                    marker: {
                        enabled: false
                    }
                }
            ]
        });
        chartNetInterfaces[i] = chartNetInterface;
        net_In[i] = [0,0,0,0,0,0,0,0,0,0];
        net_Out[i] = [0,0,0,0,0,0,0,0,0,0];
    }


    //sensor
    var chartSensorSoilHumidity = Highcharts.chart('container-sensor-soil-humidity', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 330,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'SOILHUMIDITY',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:12px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    '<span style="font-size:10px;color:silver">UN</span></div>'
            },
            tooltip: {
                valueSuffix: ' UN'
            }
        }]

    }));

    var chartSensorRain = Highcharts.chart('container-sensor-rain', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 330,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'RAIN',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:12px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    '<span style="font-size:10px;color:silver">UN</span></div>'
            },
            tooltip: {
                valueSuffix: ' UN'
            }
        }]

    }));

    var chartSensorFire = Highcharts.chart('container-sensor-fire', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 330,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'FIRE',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:12px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    '<span style="font-size:10px;color:silver">UN</span></div>'
            },
            tooltip: {
                valueSuffix: ' UN'
            }
        }]

    }));

    var chartSensorHall = Highcharts.chart('container-sensor-hall', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 330,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'HALL',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:12px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    '<span style="font-size:10px;color:silver">UN</span></div>'
            },
            tooltip: {
                valueSuffix: ' UN'
            }
        }]

    }));

    var chartSensorLight = Highcharts.chart('container-sensor-light', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 330,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'LIGHT',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:12px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    '<span style="font-size:10px;color:silver">UN</span></div>'
            },
            tooltip: {
                valueSuffix: ' UN'
            }
        }]

    }));

    var chartSensorTemp = Highcharts.chart('container-sensor-temp', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 330,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'TEMP',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:12px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    '<span style="font-size:10px;color:silver">UN</span></div>'
            },
            tooltip: {
                valueSuffix: ' UN'
            }
        }]

    }));

    var chartSensorSound = Highcharts.chart('container-sensor-sound', Highcharts.merge(gaugeOptions, {
        yAxis: {
            min: 0,
            max: 330,
            title: {
                text: ''
            }
        },

        series: [{
            name: 'SOUND',
            data: [0],
            dataLabels: {
                format: '<div style="text-align:center"><span style="font-size:12px;color:' +
                    ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.1f}</span><br/>' +
                    '<span style="font-size:10px;color:silver">UN</span></div>'
            },
            tooltip: {
                valueSuffix: ' UN'
            }
        }]

    }));

    var chartSensorTempLine = Highcharts.chart('container-sensor-temp-line', {
        title: {
            text: ''
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: [],
            title: {
                text: ''
            }
        },
        yAxis: {
            title: {
                text: '',
                style: {
                    fontWeight: 'normal'
                }
            }
        },
        series: [
            {
                name: 'UN',
                data: [0],
                color: '#093AC9',
                marker: {
                    enabled: false
                }
            }
        ]
    });

    var chartSensorSoundLine = Highcharts.chart('container-sensor-sound-line', {
        title: {
            text: ''
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: [],
            title: {
                text: ''
            }
        },
        yAxis: {
            title: {
                text: '',
                style: {
                    fontWeight: 'normal'
                }
            }
        },
        series: [
            {
                name: 'UN',
                data: [0],
                color: '#093AC9',
                marker: {
                    enabled: false
                }
            }
        ]
    });

    var chartSensorLightLine = Highcharts.chart('container-sensor-light-line', {
        title: {
            text: ''
        },
        legend: {
            enabled: false
        },
        xAxis: {
            categories: [],
            title: {
                text: ''
            }
        },
        yAxis: {
            title: {
                text: '',
                style: {
                    fontWeight: 'normal'
                }
            }
        },
        series: [
            {
                name: 'UN',
                data: [0],
                color: '#093AC9',
                marker: {
                    enabled: false
                }
            }
        ]
    });
    //Sensor_Temp_Line = [0,0,0,0,0,0,0,0,0,0];
    //Sensor_Sound_Line = [0,0,0,0,0,0,0,0,0,0];
    //Sensor_Light_Line = [0,0,0,0,0,0,0,0,0,0];

    setInterval(function() {

        $.getJSON('?ajax=true', function(data){

            //console.log(data);
            var newDate = new Date();
            newDate.setTime(parseInt(data.time) * 1000);

            $("#time").text(newDate.format('hh:mm:ss'));
            $("#date").text(newDate.format('yyyy-MM-dd'));
            $("#uptime").text(uptimeFormat(data.uptime));
            $("#cpu-temp").text(Math.round(data.cpu.temp/1000 * Math.pow(10,1))/Math.pow(10,1));
            $("#mem-percent").text(data.mem.percent);
            $("#mem-free").text(data.mem.free);
            $("#mem-cached").text(data.mem.cached);
            $("#mem-swap-total").text(data.mem.swap.total);
            $("#mem-cache-percent").text(data.mem.cached_percent);
            $("#mem-buffers").text(data.mem.buffers);
            $("#mem-real-percent").text(data.mem.real.percent);
            $("#mem-real-free").text(data.mem.real.free);
            $("#mem-swap-percent").text(data.mem.swap.percent);
            $("#mem-swap-free").text(data.mem.swap.free);
            $("#disk-percent").text(data.disk.percent);
            $("#disk-free").text(data.disk.free);
            $("#loadavg-1m").text(data.load_avg[0]);
            $("#loadavg-5m").text(data.load_avg[1]);
            $("#loadavg-10m").text(data.load_avg[2]);
            $("#loadavg-running").text(data.load_avg[3].split("/")[0]);
            $("#loadavg-threads").text(data.load_avg[3].split("/")[1]);


            for(i=0;i<data.net.count;i++)
            {
                $("#net-interface-"+(i+1)+"-total-in").text(bytesRound(parseInt(data.net.interfaces[i].total_in), 2));
                $("#net-interface-"+(i+1)+"-total-out").text(bytesRound(parseInt(data.net.interfaces[i].total_out), 2));
            }


            if(window.dashboard != null)
            {
                window.dashboard_old = window.dashboard;
            }

            window.dashboard = data;

        });

        if(window.dashboard != null){
            //console.log(window.dashboard);

            // Speed
            var point;
            //        newVal,
            //        inc;

            if (chartRAM) {
                point = chartRAM.series[0].points[0];
                point.update(window.dashboard.mem.used);
            }
            if (chartCache) {
                point = chartCache.series[0].points[0];
                point.update(window.dashboard.mem.cached);
            }
            if (chartRAM_real) {
                point = chartRAM_real.series[0].points[0];
                point.update(window.dashboard.mem.real.used);
            }
            if (chartSWAP) {
                point = chartSWAP.series[0].points[0];
                point.update(window.dashboard.mem.swap.used);
            }
            if (chartDisk) {
                point = chartDisk.series[0].points[0];
                point.update(window.dashboard.disk.used);
                /*
                 inc = Math.random() - 0.5;
                 newVal = point.y + inc;

                 if (newVal < 0 || newVal > 5) {
                 newVal = point.y - inc;
                 }

                 point.update(newVal);
                 */
            }

            if(window.dashboard_old != null)
            {
                //console.log(window.dashboard_old.net.count);
                if(window.dashboard_old.net.count > 0)
                {
                    for(i=0;i<window.dashboard_old.net.count;i++)
                    {
                        if(chartNetInterfaces[i].series[0].data.length >=30){
                            chartNetInterfaces[i].series[0].addPoint(parseInt(window.dashboard.net.interfaces[i].total_in) - parseInt(window.dashboard_old.net.interfaces[i].total_in), true, true);
                        }
                        else{
                            chartNetInterfaces[i].series[0].addPoint(parseInt(window.dashboard.net.interfaces[i].total_in) - parseInt(window.dashboard_old.net.interfaces[i].total_in));
                        }

                        if(chartNetInterfaces[i].series[1].data.length >=30){
                            chartNetInterfaces[i].series[1].addPoint(parseInt(window.dashboard.net.interfaces[i].total_out) - parseInt(window.dashboard_old.net.interfaces[i].total_out), true, true);
                        }
                        else{
                            chartNetInterfaces[i].series[1].addPoint(parseInt(window.dashboard.net.interfaces[i].total_out) - parseInt(window.dashboard_old.net.interfaces[i].total_out));
                        }
                    }
                }

                idle_diff = parseInt(window.dashboard.cpu.stat.idle) - parseInt(window.dashboard_old.cpu.stat.idle);
                used_total = parseInt(window.dashboard.cpu.stat.idle) +
                    parseInt(window.dashboard.cpu.stat.user) +
                    parseInt(window.dashboard.cpu.stat.sys) +
                    parseInt(window.dashboard.cpu.stat.nice) +
                    parseInt(window.dashboard.cpu.stat.iowait) +
                    parseInt(window.dashboard.cpu.stat.irq) +
                    parseInt(window.dashboard.cpu.stat.softirq) -
                    parseInt(window.dashboard_old.cpu.stat.idle) -
                    parseInt(window.dashboard_old.cpu.stat.user) -
                    parseInt(window.dashboard_old.cpu.stat.sys) -
                    parseInt(window.dashboard_old.cpu.stat.nice) -
                    parseInt(window.dashboard_old.cpu.stat.iowait) -
                    parseInt(window.dashboard_old.cpu.stat.irq) -
                    parseInt(window.dashboard_old.cpu.stat.softirq);

                if (chartCPU) {
                    point = chartCPU.series[0].points[0];
                    point.update(Math.round((1.0 - (idle_diff / used_total)) * 100 * Math.pow(10,1))/Math.pow(10,1));
                }


                $("#cpu-stat-idl").text(Math.round(((parseInt(window.dashboard.cpu.stat.idle) - parseInt(window.dashboard_old.cpu.stat.idle)) / used_total) * 100 * Math.pow(10,1))/Math.pow(10,1));
                $("#cpu-stat-use").text(Math.round(((parseInt(window.dashboard.cpu.stat.user) - parseInt(window.dashboard_old.cpu.stat.user)) / used_total) * 100 * Math.pow(10,1))/Math.pow(10,1));
                $("#cpu-stat-sys").text(Math.round(((parseInt(window.dashboard.cpu.stat.sys) - parseInt(window.dashboard_old.cpu.stat.sys)) / used_total) * 100 * Math.pow(10,1))/Math.pow(10,1));
                $("#cpu-stat-nic").text(Math.round(((parseInt(window.dashboard.cpu.stat.nice) - parseInt(window.dashboard_old.cpu.stat.nice)) / used_total) * 100 * Math.pow(10,1))/Math.pow(10,1));
                $("#cpu-stat-iow").text(Math.round(((parseInt(window.dashboard.cpu.stat.iowait) - parseInt(window.dashboard_old.cpu.stat.iowait)) / used_total) * 100 * Math.pow(10,1))/Math.pow(10,1));
                $("#cpu-stat-irq").text(Math.round(((parseInt(window.dashboard.cpu.stat.irq) - parseInt(window.dashboard_old.cpu.stat.irq)) / used_total) * 100 * Math.pow(10,1))/Math.pow(10,1));
                $("#cpu-stat-sirq").text(Math.round(((parseInt(window.dashboard.cpu.stat.softirq) - parseInt(window.dashboard_old.cpu.stat.softirq)) / used_total) * 100 * Math.pow(10,1))/Math.pow(10,1));
            }
        }




        $.getJSON(SENSOR_API_URL, function(data){

            //console.log(data);
            var newDate = new Date();
            newDate.setTime(parseInt(data.time) * 1000);

            for(i=0;i<8;i++){
                data[i] = Math.round(330-(data[i])*100,0);
            }

            /*
            $("#time").text(newDate.format('hh:mm:ss'));
            $("#date").text(newDate.format('yyyy-MM-dd'));
            $("#uptime").text(uptimeFormat(data.uptime));
            $("#cpu-temp").text(Math.round(data.cpu.temp/1000 * Math.pow(10,1))/Math.pow(10,1));
            $("#mem-percent").text(data.mem.percent);
            $("#mem-free").text(data.mem.free);
            $("#mem-cached").text(data.mem.cached);
            $("#mem-swap-total").text(data.mem.swap.total);
            $("#mem-cache-percent").text(data.mem.cached_percent);
            $("#mem-buffers").text(data.mem.buffers);
            $("#mem-real-percent").text(data.mem.real.percent);
            $("#mem-real-free").text(data.mem.real.free);
            $("#mem-swap-percent").text(data.mem.swap.percent);
            $("#mem-swap-free").text(data.mem.swap.free);
            $("#disk-percent").text(data.disk.percent);
            $("#disk-free").text(data.disk.free);
            $("#loadavg-1m").text(data.load_avg[0]);
            $("#loadavg-5m").text(data.load_avg[1]);
            $("#loadavg-10m").text(data.load_avg[2]);
            $("#loadavg-running").text(data.load_avg[3].split("/")[0]);
            $("#loadavg-threads").text(data.load_avg[3].split("/")[1]);


            for(i=0;i<data.net.count;i++)
            {
                $("#net-interface-"+(i+1)+"-total-in").text(bytesRound(parseInt(data.net.interfaces[i].total_in), 2));
                $("#net-interface-"+(i+1)+"-total-out").text(bytesRound(parseInt(data.net.interfaces[i].total_out), 2));
            }
             */


            if(window.dashboard_sensor != null)
            {
                window.dashboard_old_sensor = window.dashboard_sensor;
            }

            window.dashboard_sensor = data;

        });

        if(window.dashboard_sensor != null){
            //console.log(window.dashboard);

            /*
            $("#sensor-sound").text(Math.round(330-(window.dashboard_sensor[6])*100,0));
            $("#sensor-temp").text(Math.round(330-(window.dashboard_sensor[5])*100,0));
            $("#sensor-light").text(Math.round(330-(window.dashboard_sensor[4])*100,0));
            $("#sensor-hall").text(Math.round(330-(window.dashboard_sensor[3])*100,0));
            $("#sensor-fire").text(Math.round(330-(window.dashboard_sensor[2])*100,0));
            $("#sensor-rain").text(Math.round(330-(window.dashboard_sensor[1])*100,0));
            $("#sensor-soil-humidity").text(Math.round(330-(window.dashboard_sensor[0])*100,0));
            */

            $("#sensor-sound").text(window.dashboard_sensor[6]);
            $("#sensor-temp").text(window.dashboard_sensor[5]);
            $("#sensor-light").text(window.dashboard_sensor[4]);
            $("#sensor-hall").text(window.dashboard_sensor[3]);
            $("#sensor-fire").text(window.dashboard_sensor[2]);
            $("#sensor-rain").text(window.dashboard_sensor[1]);
            $("#sensor-soil-humidity").text(window.dashboard_sensor[0]);

            if(window.dashboard_sensor[6] < 30)
                $("#sensor-sound").text('静谧');
            if(window.dashboard_sensor[6] > 30)
                $("#sensor-sound").text('安静');
            if(window.dashboard_sensor[6] > 100)
                $("#sensor-sound").text('噪声');
            if(window.dashboard_sensor[6] > 200)
                $("#sensor-sound").text('极吵');

            if(window.dashboard_sensor[5] < 0)
                $("#sensor-temp").text('冻');
            if(window.dashboard_sensor[5] > 0)
                $("#sensor-temp").text('冷');
            if(window.dashboard_sensor[5] > 15)
                $("#sensor-temp").text('舒适');
            if(window.dashboard_sensor[5] > 25)
                $("#sensor-temp").text('炎热');

            if(window.dashboard_sensor[4] < 30)
                $("#sensor-light").text('黑暗');
            if(window.dashboard_sensor[4] > 30)
                $("#sensor-light").text('偏暗');
            if(window.dashboard_sensor[4] > 100)
                $("#sensor-light").text('明亮');
            if(window.dashboard_sensor[4] > 200)
                $("#sensor-light").text('强光');

            if(window.dashboard_sensor[3] < 30)
                $("#sensor-hall").text('无磁');
            if(window.dashboard_sensor[3] > 30)
                $("#sensor-hall").text('微弱');
            if(window.dashboard_sensor[3] > 100)
                $("#sensor-hall").text('较强');
            if(window.dashboard_sensor[3] > 200)
                $("#sensor-hall").text('极强');

            if(window.dashboard_sensor[2] < 30)
                $("#sensor-fire").text('安全');
            if(window.dashboard_sensor[2] > 30)
                $("#sensor-fire").text('较强');
            if(window.dashboard_sensor[2] > 100)
                $("#sensor-fire").text('危险');
            if(window.dashboard_sensor[2] > 200)
                $("#sensor-fire").text('极度危险');

            if(window.dashboard_sensor[1] < 30)
                $("#sensor-rain").text('晴');
            if(window.dashboard_sensor[1] > 30)
                $("#sensor-rain").text('潮湿');
            if(window.dashboard_sensor[1] > 100)
                $("#sensor-rain").text('中雨');
            if(window.dashboard_sensor[1] > 200)
                $("#sensor-rain").text('大雨');

            if(window.dashboard_sensor[0] < 30)
                $("#sensor-soil-humidity").text('干燥');
            if(window.dashboard_sensor[0] > 30)
                $("#sensor-soil-humidity").text('微湿');
            if(window.dashboard_sensor[0] > 100)
                $("#sensor-soil-humidity").text('潮湿');
            if(window.dashboard_sensor[0] > 200)
                $("#sensor-soil-humidity").text('极湿');



            // Speed
            var point;

            if (chartSensorFire) {
                point = chartSensorFire.series[0].points[0];
                point.update(window.dashboard_sensor[2]);
            }
            if (chartSensorHall) {
                point = chartSensorHall.series[0].points[0];
                point.update(window.dashboard_sensor[3]);
            }
            if (chartSensorLight) {
                point = chartSensorLight.series[0].points[0];
                point.update(window.dashboard_sensor[4]);
            }
            if (chartSensorRain) {
                point = chartSensorRain.series[0].points[0];
                point.update(window.dashboard_sensor[1]);
            }
            if (chartSensorSoilHumidity) {
                point = chartSensorSoilHumidity.series[0].points[0];
                point.update(window.dashboard_sensor[0]);
            }
            if (chartSensorSound) {
                point = chartSensorSound.series[0].points[0];
                point.update(window.dashboard_sensor[6]);
            }
            if (chartSensorTemp) {
                point = chartSensorTemp.series[0].points[0];
                point.update(window.dashboard_sensor[5]);
            }


            if(window.dashboard_old_sensor != null)
            {
                //console.log(window.dashboard_old.net.count);
                //console.log(chartSensorLightLine);

                if(chartSensorLightLine.series[0].data.length >=30){
                    chartSensorLightLine.series[0].addPoint(parseInt(window.dashboard_sensor[4]), true, true);
                }
                else{
                    chartSensorLightLine.series[0].addPoint(parseInt(window.dashboard_sensor[4]));
                }

                if(chartSensorTempLine.series[0].data.length >=30){
                    chartSensorTempLine.series[0].addPoint(parseInt(window.dashboard_sensor[5]), true, true);
                }
                else{
                    chartSensorTempLine.series[0].addPoint(parseInt(window.dashboard_sensor[5]));
                }

                if(chartSensorSoundLine.series[0].data.length >=30){
                    chartSensorSoundLine.series[0].addPoint(parseInt(window.dashboard_sensor[6]), true, true);
                }
                else{
                    chartSensorSoundLine.series[0].addPoint(parseInt(window.dashboard_sensor[6]));
                }

            }

        }



    }, 1000);



});


function bytesRound(number, round)
{
    if (number<0){
        var last=0+"B";
    }else if (number<1024){
        //var last=Math.round(number*Math.pow(10,round))/Math.pow(10,round)+"B";
        var last=number+"B";
    }else if (number<1048576){
        number=number/1024;
        var last=Math.round(number*Math.pow(10,round))/Math.pow(10,round)+"K";
    }else if (number<1048576000){
        number=number/1048576;
        var last=Math.round(number*Math.pow(10,round))/Math.pow(10,round)+"M";
    }else{
        number=number/1048576000;
        var last=Math.round(number*Math.pow(10,round))/Math.pow(10,round)+"G";
    }
    return last;
}



Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

function uptimeFormat(str){
    var uptime = "";
    var min = parseInt(str) / 60;
    var hours = min / 60;
    var days = Math.floor(hours / 24);
    var hours = Math.floor(hours - (days * 24));
    min = Math.floor(min - (days * 60 * 24) - (hours * 60));

    if (days !== 0){
        if(days == 1){
            uptime = days+" day ";
        }
        else{
            uptime = days+" days ";
        }
    }
    if (hours !== 0){
        uptime = uptime+hours+":";
    }

    return uptime=uptime+min;
}