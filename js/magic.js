// I be the leader, teh controller of the controllers. I also a messy noodle fudge.
// I aspire to grow up into a more professional looking code one day.

function fetchCSVhk() {
        var myObject = new Object();
        myObject.start = $('#begin_time').val();
        myObject.end = $('#end_time').val();
        var baseURL = 	"/csv/housekeeping";
        var ux = moment(myObject.start).valueOf();
        var uy = moment(myObject.end).valueOf();
        uxs = moment(ux).unix();
        uys = moment(uy).unix();
        var url = baseURL + '?' + 'begin=' + uxs + '&' + 'end=' + uys;
            console.log(url);

        window.location.assign(url);
        $('.alertMessage').append("<div class='alert alert-success alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Success! your CSV should be downloading right now.</div>")
    }
    
    
function fetchCSVph() {
        var myObject = new Object();
        myObject.start = $('#begin_time').val();
        myObject.end = $('#end_time').val();
        var baseURL = 	"/csv/pulseheight";
        var ux = moment(myObject.start).valueOf();
        var uy = moment(myObject.end).valueOf();
        uxs = moment(ux).unix();
        uys = moment(uy).unix();
        var url = baseURL + '?' + 'begin=' + uxs + '&' + 'end=' + uys;
            console.log(url);

        window.location.assign(url);
         $('.alertMessage').append("<div class='alert alert-success alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Success! your CSV should be downloading right now.<br>If not, please check the console for the error message.</div>")
    }

    
function fetchCSVhit() {
        var myObject = new Object();
        myObject.start = $('#begin_time').val();
        myObject.end = $('#end_time').val();
        var baseURL = 	"/csv/hitcount";
        var ux = moment(myObject.start).valueOf();
        var uy = moment(myObject.end).valueOf();
        uxs = moment(ux).unix();
        uys = moment(uy).unix();
        var url = baseURL + '?' + 'begin=' + uxs + '&' + 'end=' + uys;
            console.log(url);

        window.location.assign(url);
         $('.alertMessage').html("<div class='alert alert-success alert-dismissable'><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>Success! your CSV should be downloading right now.</div>")
    }

/*function psuStatusRefresh(){
    var psuinfo = [];
    $.getJSON("/api/psu", function(data) {  
        $.each(data.data, function(key, value) {
            psuinfo.push(key, value);
        });
    });
  console.log(psuinfo);
  console.log(psuinfo.3, psuinfo.5);
  $('#currentLimit1').text( $psuinfo[3] );
        $('#voltageLimit1').text(  psuinfo[5] );
   // $('.psuStatus').empty();
    $('.psuStatus').html("PSU Status<br> <b>Current Limit: </b> 0.5565mA &emsp; <b>Voltage Level:</b> 5v <br> <b>Measured Current: </b> 0.5mA &emsp; <b>Measured Voltage:</b> 5v ")
} */


function psuStatusRefresh()
{
    $.ajax({
    url: "/api/psu",
    dataType: 'json',
    success: function( data )
    {
        var psuinfo = data.data;
        $('#currentLimit1').text( psuinfo.current_limit );
        $('#voltageLimit1').text( psuinfo.voltage_setting );
        $('#measuredCurrent1').text( (psuinfo.measured_current).toFixed(3) );
        $('#measuredVoltage1').text( (psuinfo.measured_voltage).toFixed(3) );
        $('#psuStatus1').text( psuinfo.state );
        $('#psuPowerState1').text( psuinfo.power );
     
    }
});

}


function loadLimits()
{
    $.ajax({
    url: "/api/psu",
    dataType: 'json',
    success: function( data )
    {
       var psuinfo = data.data;
       var x = psuinfo.voltage_setting;
       var y = psuinfo.current_limit;
       $('#voltageLimit').val(x);
       $('#currentLimit').val(y);
    }
});

}


function createJSON() {
        var myObject = new Object();
            myObject.start = $('#begin_time').val();
            myObject.end = $('#end_time').val();
           // myObject.pets = ["cat", "dog"];
            var myString = JSON.stringify(myObject);
            console.log(myString);
}

//The Code that handles the PSU ON/OFF Button
var PSU_S = new Boolean(false);
function PSU_Status()
{
    if(PSU_S === true)
    {
        psuOFF();
        console.log("PSU OFF");
        PSU_S = false;
        $('#psuPowerOFF').addClass('btn btn-success').removeClass('btn btn-danger');
        $('#psuPowerOFF').html("PSU ON");
    }
    else {
        psuON();
        console.log("PSU ON");
        PSU_S = true;
        $('#psuPowerOFF').addClass('btn-danger').removeClass('btn btn-success');
        $('#psuPowerOFF').html("PSU OFF");
    }
}

//Sends ON to the middleware.
function psuON() {
    setTimeout(psuStatusRefresh, 1000);
    refreshCurrentChart();
    refreshVoltageChart();
    var myObject = new Object();
    myObject.power = 'ON';
    var mystring = JSON.stringify(myObject);
    $.ajax({
        type: "POST",
        url: "/api/psu/power",
        data: JSON.stringify(myObject),
        contentType: 'application/json',
        dataType: "json",
        success: function(data){console.log(mystring);},
    });
   
}

//Sends OFF to the middleware.
function psuOFF() {
    setTimeout(psuStatusRefresh, 1000);
    var myObject = new Object();
    myObject.power = 'OFF';
    var mystring = JSON.stringify(myObject);
    $.ajax({
        type: "POST",
        url: "/api/psu/power",
        data: JSON.stringify(myObject),
        contentType: 'application/json',
        dataType: "json",
        success: function(data){console.log(mystring);},
    });
}

//Does nothing at the moment but refreshes the Monitor Mode Chart.
function startStopMonitoring()
{
    refreshMonitorChart();
}

//Set PSU Voltage
function setVoltage() {
    var myObject = new Object();
        myObject.voltage = $('#voltageLimit').val();
    $.ajax({
        type: "POST",
        url: "/api/psu/voltage",
        data: JSON.stringify(myObject),
        contentType: 'application/json',
        dataType: "json",
        success: function(data){console.log(data);},
        failure: function(data){console.log(data);},
    });
    console.log(myObject);
    setTimeout(psuStatusRefresh, 1000);
}

//Set PSU Current Level
function setCurrent() {
    var myObject = new Object();
        myObject.current_limit = $('#currentLimit').val();
    $.ajax({
        type: "POST",
        url: "/api/psu/current/limit",
        data: JSON.stringify(myObject),
        contentType: 'application/json',
        dataType: "json",
        success: function(data){console.log(data);},
    });
    console.log(myObject);
    setTimeout(psuStatusRefresh, 500);
}

//Just a Dummy function for my test.
function bootstrap1() {
        var x = $('#begin_time').val();
        var y = $('#end_time').val();
        console.log(x,y)
        var ux = moment(x).valueOf();
        var uy = moment(y).valueOf();
        uxs = moment(ux).unix();
        uys = moment(uy).unix();
        console.log(uxs,uys)
    }

//Another dummy test function
function createURL() {
        var myObject = new Object();
            myObject.start = $('#begin_time').val();
            myObject.end = $('#end_time').val();

        var baseURL = 	"/csv/hitcount";
        var ux = moment(myObject.start).valueOf();
        var uy = moment(myObject.end).valueOf();
        uxs = moment(ux).unix();
        uys = moment(uy).unix();
         
        var url = baseURL + '?' + 'begin=' + uxs + '&' + 'end=' + uys;
            console.log(url);
}

//And one more dummy function.
var toType = function(obj)
{
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

//
// Pulseheight chart load data and rendering
//
function refreshPHChart(){
    var x_s=$('#x').val(); //Variable for the X Coordinate
    var y_s=$('#y').val(); //Variable for the Y Coordinate
   // console.log(x,y);
    var myObject = new Object();
        myObject.start = $('#begin_time').val(); //Get data from this date and time .....
        myObject.end = $('#end_time').val();     //to this date and time
        var baseURL = 	"/api/pulseheight";
        var ux = moment(myObject.start).valueOf();
        var uy = moment(myObject.end).valueOf();
        uxs = moment(ux).unix();
        uys = moment(uy).unix();
        var url = baseURL + '?' + 'begin=' + uxs + '&' + 'end=' + uys + '&fields='+ x_s + ',' + y_s;
            console.log(url);
         
    var phDataPoints = [];
    var type_val1 = $('#chartType').val();  //How would you like the data to be plotted? Select Chart Type.
   // console.log(type_val1);
    var data = [{
        type: type_val1,
        // xValueType: "dateTime",
        // valueFormatString: "hh mm ss",
        dataPoints : phDataPoints
    }];
    var phChart = new CanvasJS.Chart("chartContainer",{
        theme: "light2",    // "light1", "dark1", "dark2"
        title:{
            text:"Scatter Plot of Pulse Height Data"
        },
        axisY:{
		//title: "Log (Base 10) Scale",
		//logarithmic: true //change it to false
	    },
        exportEnabled: true,
        zoomEnabled: true,
        data
    });

    //Now fetch the data and populate the Object, that'll be used by the chart library to process/display it. (phDataPoints)
    $.getJSON(url, function(data) {    
       $.each(data.data, function(index, obj){
           phDataPoints.push({"x": eval('obj.'+x_s) , "y": eval('obj.'+y_s)});
       });
       phChart.render();
       //console.log(phDataPoints);
   });

 $('#LoadChart').html("Refresh Chart");
 $('#LoadChart').prop('title', 'Reloads the chart with new data (if available).');
}



//
// Kill A Rendering Function
//

var closeFunction = new Boolean(false);
    function stopDisplay()
    {
        closeFunction = true;
        //console.log(closeFunction.toString());
    }


//
// PSU CURRENT  load and rendering ------- Old and Depracated ------- 
//

/* function refreshCurrentChart(){
        closeFunction = false;
        var dataPoints = [];
        var chart = new CanvasJS.Chart("PSUchartContainer",{
            theme: "light2",    // "light1", "dark1", "dark2"
            title:{
                text:"PSU Current Load"
            },
            exportEnabled: true,
            zoomEnabled: true,
            data: [{
                type: "line",
                xValueType: "dateTime",
                dataPoints : dataPoints,
                valueFormatString: "hh mm ss", 
                labelAngle: -20
            }]
        });
        $.getJSON("/api/psu", function(data) {  
            $.each(data.data, function(key, value){
            var xxtime = new Date(data.data.modified);
                var x = xxtime.getTime();
                console.log(x);
                dataPoints.push({"x": x , "y": data.data.measured_current});
            });
            chart.render();
            updateChart();
        });

        function updateChart() {
            $.getJSON("/api/psu", function(data) {  
            $.each(data.data, function(key, value){
                var xxtime = new Date(data.data.modified);
                var x = xxtime.getTime();
                dataPoints.push({"x": x , "y": data.data.measured_current});
                console.log(dataPoints);
            });
            chart.render();
            if (closeFunction) {
                                return true;
                            }
            setTimeout(function(){updateChart()}, 1000);
        });
            }
} */


//
// PSU  VOLTAGE load and rendering
//

function refreshVoltageChart(){
        closeFunction = false;
        var destroyInterval = 60000; //How often do you want to refresh the chart (destroy and create new)? Value in milliseconds.
            var dataPoints = [];
            var type_val = $('#PSUchartContainerVType').val();
            var data =  [{
                type: type_val,
                xValueType: "dateTime",
                dataPoints : dataPoints,
                valueFormatString: "hh mm ss", 
                labelAngle: -20
            }];
            var chart = new CanvasJS.Chart("PSUchartContainerV",{
            theme: "light2",    // "light1", "dark1", "dark2"
                    title:{
                        text:"PSU Voltage Load"
                    },
                    /*        toolTip:{
                        content:"x: {x}, y: {y}" ,
                        }, */
                    exportEnabled: true,
                    zoomEnabled: true,
                    data
                    });

            $.getJSON("/api/psu", function(data) {  
                    $.each(data.data, function(key, value){
                          var xxtime = new Date(data.data.modified); //Create a new JS Date object.
                          var x = xxtime.getTime();                  //Convert to Unix Epoch format.
                        dataPoints.push({"x": x , "y": data.data.measured_voltage});
                    });
                chart.render();
                updateChart();
            });

            function updateChart() {
                    $.getJSON("/api/psu", function(data) {  
                    $.each(data.data, function(key, value){
                        var xxtime = new Date(data.data.modified);
                        var x = xxtime.getTime();
                        dataPoints.push({"x": x , "y": data.data.measured_voltage});
                    });

                chart.render(); //Render the chart with the new DataPoints.

                if (closeFunction) { //Check if someone has decided to stop rendering? If yes, exit this function.
                        return true;
                        }

                setTimeout(function(){updateChart()}, 1000); //Refresh this function after 1000ms, in case the user hasn't decided to stop this function.
                
                });
            }

        intervalVar = setInterval(destroyChart, destroyInterval); //To save memeory, destroy this chart after every "destroyInterval" and recreate with new data.
                function destroyChart() { //This is the kill function.
                    chart.set("backgroundColor", "#F5DEB3"); //Chnage the BG Colour of the Chart to show that it's about to be destroyed. This is so fast you won't see it though.
                    chart.destroy();
                    chart = null;
                    refreshVoltageChart();
                };
}


//
// PSU CURRENT load and rendering
// For what each line does, refer to the comments above.
//

function refreshCurrentChart(){
    closeFunction = false;
    var dataPoints = [];
    var type_val = $('#PSUchartContainerType').val();
    var data =  [{
        type: type_val,
        xValueType: "dateTime",
        dataPoints : dataPoints,
        valueFormatString: "hh mm ss", 
        labelAngle: -20
    }];

    var chart = new CanvasJS.Chart("PSUchartContainer",{
        theme: "light2",    // "light1", "dark1", "dark2"
        title:{
            text:"PSU Current Load"
        },
    /*        toolTip:{
            content:"x: {x}, y: {y}" ,
            }, */
        exportEnabled: true,
        zoomEnabled: true,
        data
    });


    $.getJSON("/api/psu", function(data) {  
        $.each(data.data, function(key, value){
        var xxtime = new Date(data.data.modified);
            var x = xxtime.getTime();
            dataPoints.push({"x": x , "y": data.data.measured_current});
        });
        chart.render();
        updateChart();
    });


    var updateInterval = 1000;
    var destroyInterval = 60000;
      

    function updateChart() {
        $.getJSON("/api/psu", function(data) {  
        $.each(data.data, function(key, value){
            var xxtime = new Date(data.data.modified);
            var x = xxtime.getTime();
            dataPoints.push({"x": x , "y": data.data.measured_current});
            //console.log(dataPoints);
          });
          
        });
    
        if (closeFunction) {return true;};

        chart.render();
 
    setTimeout(function(){updateChart()}, updateInterval); 
    };

    intervalVar = setInterval(destroyChart, destroyInterval);
    function destroyChart() {
        chart.set("backgroundColor", "#F5DEB3");
       // console.log("I was executed.");
        chart.destroy();
        chart = null;
        refreshCurrentChart();
    };
    
}

//
//  Monitor MODE CHART
//

 function refreshMonitorChart(){
    closeFunction = false;
    var dataPoints = [];
    var type_val = $('#monitorChartType').val();
    var y_s=$('#monitorVariable').val();
    var baseURL = 	"/api/pulseheight";
    var url = baseURL + '?' + 'begin=1541026800' + '&' + 'end=1548716400' + '&fields=' + y_s;
    var data =  [{
        type: type_val,
        xValueType: "dateTime",
        dataPoints : dataPoints,
        valueFormatString: "hh mm ss", 
        labelAngle: -20
    }];
var chartTitle = "Plotting: " + y_s;
    var chart = new CanvasJS.Chart("monitorModeChart",{
        theme: "light2",    // "light1", "dark1", "dark2"
        title:{
            text: chartTitle
        },
            toolTip:{
            content:"x: {x}, y: {y}" ,
            }, 
         exportEnabled: true,
        zoomEnabled: true,
        data
    });


    $.getJSON(url, function(data) { 
        console.log(data); 
        $.each(data.data, function(key, obj){
        var xxtime = new Date(obj.timestamp);
       // console.log(xxtime);
            var x = xxtime.getTime();
           // console.log(x);
            dataPoints.push({"x": x , "y": eval('obj.'+y_s)});
        });
        chart.render();
        updateChart();
    });


    var updateInterval = 1000;
    var destroyInterval = 60000;
      

    function updateChart() {
        $.getJSON(url, function(data) {  
        $.each(data.data, function(key, obj){
            var xxtime = new Date(obj.timestamp);
            var x = xxtime.getTime();
            dataPoints.push({"x": x , "y": eval('obj.'+y_s)});
            //console.log(dataPoints);
          });
          
        });
    
        if (closeFunction) {return true;};

        chart.render();
 
   // setTimeout(function(){updateChart()}, updateInterval); 
    };

    intervalVar = setInterval(destroyChart, destroyInterval);
    function destroyChart() {
        chart.set("backgroundColor", "#F5DEB3");
       // console.log("I was executed.");
        chart.destroy();
        chart = null;
        refreshMonitorChart();
    };
    
}

// Random number generator as Session ID.
function generateID(){
    let random_number = Math.random() * (100000-1) + 1;
     random_number = Math.floor(random_number);
     $("#session_ID").val(random_number);   
}

// Generate a new Session ID per page Refresh.
window.onload = function() {
    generateID();
};
   