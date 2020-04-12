//
// Cote UI de l'application "lucioles"
//
// Auteur : G.MENEZ
// RMQ : Manipulation naive (debutant) de Javascript
//
// SE CONNECTER A http://localhost:3000
// http://localhost:3000/led/on
// http://localhost:3000/led/off
const TOPIC_LED  = 'sensors/led'

function pingEsp(etat){
    const request = new Request('http://localhost:3000/led/' + etat);
    fetch(request);
}

function pingSpecificEsp(button, macAdress){
    button.disabled = true;
    const request = new Request('http://localhost:3000/ping/' + macAdress);
    fetch(request);
}

window.onload = function init() {

    //=== Initialisation des traces/charts de la page html

    // Apply time settings globally
    Highcharts.setOptions({
	global: { // https://stackoverflow.com/questions/13077518/highstock-chart-offsets-dates-for-no-reason
            useUTC: false,
            type: 'spline'
	},
	time: {
	    timezone: 'Europe/Paris'
	}
    });

    // cf https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/spline-irregular-time/
    var chart1 = new Highcharts.Chart({
        title: {
            text: 'Temperatures'
        },
	subtitle: {
            text: 'Irregular time data in Highcharts JS'
	},
        legend: {
            //title: {
            //    text: 'Temperatures'
            //},
            enabled: true
        },
        credits: false,
        chart: {renderTo: 'container1'},
        xAxis: {
            title: {
                text: 'Heure'
            },
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Temperature (Deg C)'
            }
        },
        series: [{name: 'Thierry', data: []},
		 {name: 'Yasmin', data: []},
         {name: 'Hugo', data: []},
         {name: 'Thomas', data: []},
         {name: 'Rémi', data: []},
         {name: 'Yannick', data: []},
         {name: 'Benoît', data: []},
         {name: 'Alexis', data: []},
         {name: 'Salomé', data: []},
         {name: 'Julian', data: []},
         {name: 'Chiesa', data: []}
		],

	colors: ['#6CF', '#3e2723', '#06C', '#036', '#ff6d00', '#c51162', '#6200ea', '#00c853', '#757575', '#f48fb1', '#1b5e20'],
	//colors: ['red', 'green', 'blue'],
	
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                //color: "red",
                enableMouseTracking: true
            }
        }
    });

    var chart2 = new Highcharts.Chart({
        title: { text: 'Lights' },
        legend: {
            //title: {
            //    text: 'Lights'
            //},
            enabled: true
        },
        credits: false,
        chart: {renderTo: 'container2'},
        xAxis: {
            title: {
                text: 'Heure'
            },
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Lumen (Lum)'
            }
        },
	series: [{name: 'Thierry', data: []},
    {name: 'Yasmin', data: []},
    {name: 'Hugo', data: []},
    {name: 'Thomas', data: []},
    {name: 'Rémi', data: []},
    {name: 'Yannick', data: []},
    {name: 'Benoît', data: []},
    {name: 'Alexis', data: []},
    {name: 'Salomé', data: []},
    {name: 'Julian', data: []},
    {name: 'Chiesa', data: []}],

	//colors: ['#6CF', '#39F', '#06C', '#036', '#000'],
	colors: ['#6CF', '#3e2723', '#06C', '#036', '#ff6d00', '#c51162', '#6200ea', '#00c853', '#757575', '#f48fb1', '#1b5e20'],
	
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        }
    });

    
    //=== Recuperation dans le Node JS server des samples de l'ESP et 
    //=== Alimentation des charts ====================================

    function get_samples(path_on_node, serie, wh){
	// path_on_node => help to compose url to get on Js node
	// serie => for choosing chart/serie on the page
	// wh => which esp do we want to query data
	
	node_url = 'http://localhost:3000'
	//node_url = 'http://10.9.128.189:3000'
	//node_url = 'http://192.168.1.102:3000'

	//https://openclassrooms.com/fr/courses/1567926-un-site-web-dynamique-avec-jquery/1569648-le-fonctionnement-de-ajax
        $.ajax({
            url: node_url.concat(path_on_node), // URL to "GET" : /esp/temp ou /esp/light
            type: 'GET',
            headers: { Accept: "application/json", },
	    data: {"who": wh}, // parameter of the GET request
            success: function (resultat, statut) { // Anonymous function on success
                let listeData = [];
                resultat.forEach(function (element) {
		    listeData.push([Date.parse(element.date),element.value]);
		    //listeData.push([Date.now(),element.value]);
                });
                serie.setData(listeData); //serie.redraw();
            },
            error: function (resultat, statut, erreur) {
            },
            complete: function (resultat, statut) {
            }
        });
    }

    //=== Installation de la periodicite des requetes GET=============
    
    function process_esp(which_esps,i){
	const refreshT = 100000 // Refresh period for chart
	esp = which_esps[i];    // L'ESP "a dessiner"
	//console.log(esp) // cf console du navigateur
	
	// Gestion de la temperature
	// premier appel pour eviter de devoir attendre RefreshT
	get_samples('/esp/temp', chart1.series[i], esp);
	//calls a function or evaluates an expression at specified
	//intervals (in milliseconds).
	window.setInterval(get_samples,
			   refreshT,
			   '/esp/temp',     // param 1 for get_samples()
			   chart1.series[i],// param 2 for get_samples()
			   esp);            // param 3 for get_samples()

	// Gestion de la lumiere
	get_samples('/esp/light', chart2.series[i], esp);
	window.setInterval(get_samples,
			   refreshT,
			   '/esp/light',     // URL to GET
			   chart2.series[i], // Serie to fill
			   esp);             // ESP targeted
    }
    

    //=== Gestion de la flotte d'ESP =================================

    //Thierry : 80:7D:3A:FD:C3:7C
    //Yasmin : 30:AE:A4:86:C4:84
    //Hugo : 80:7D:3A:FD:C7:68
    //Thomas : 30:AE:A4:8F:3D:20
    //Rémi : 80:7D:3A:FD:C2:F8
    //Yannick : B4:E6:2D:AC:C0:C1
    //Benoît : 80:7D:3A:FD:C6:98
    //Alexis : 80:7D:3A:FD:C5:A4
    //Salomé : D2:AB:D5:7C:3B:1B
    //Julian : 80:7D:3A:FD:C5:98
    //Chiesa : 80:7D:3A:FD:C7:1C

    var forenames = ["Thierry", "Yasmin", "Hugo", "Thomas", "Rémi", "Yannick", "Benoît", "Alexis", "Salomé", "Julian", "Chiesa"];
    var which_esps = ["80:7D:3A:FD:C3:7C", "30:AE:A4:86:C4:84", "80:7D:3A:FD:C7:68", "30:AE:A4:8F:3D:20", "80:7D:3A:FD:C2:F8", 
    "B4:E6:2D:AC:C0:C1", "80:7D:3A:FD:C6:98", "80:7D:3A:FD:C5:A4", "D2:AB:D5:7C:3B:1B", "80:7D:3A:FD:C5:98", "80:7D:3A:FD:C7:1C"];
    for (var i = 0; i < which_esps.length; i++) {
	    process_esp(which_esps, i);
    }

    var ping = this.document.getElementById("ping");
    for(i=0; i<forenames.length; i++){
        ping.innerHTML += "<button class='pingButton' id=" + which_esps[i] +" onclick=\"pingSpecificEsp(this,'" + which_esps[i] + "');\">" + forenames[i] + "</button>";
    }

    var socket = io.connect('http://localhost:3000');

    socket.on('pingOff', (data) => {
        alert("La lampe de l'arduino avec l'adresse MAC " + data.who + " s'est éteinte.")
        this.document.getElementById(data.who).disabled = false;
    });
};