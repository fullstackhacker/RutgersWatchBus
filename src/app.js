/**
 * Rutgers Watch Bus
 * 
 * A Rutgers Next Bus Applicationf of the Pebble
 *
 * Developer: Mushaheed Kapadia
 */

var UI = require('ui');
var ajax = require('ajax');

//main menu
var main = new UI.Menu({
  title: 'RU Watch Bus',
	sections: [{
		items: [
			{
				title: 'Routes'
			}, 
			{
				title: 'Stops'
			}
		]
	}]
});

//click on one of the two 
main.on('select', function(e){ 
		if(e.itemIndex === 0) routesList();
		if(e.itemIndex === 1) stopsList();
});

main.show();

//load all the active routes
function routesList(){ 
	//get active routes
	ajax( //request object
		{ //request link
			url: 'http://runextbus.herokuapp.com/active',
			type: 'json'	
		},
		function(data){ //success
			var droutes = data.routes;
			var activeRoutes = [];
			for(var route in droutes){
				activeRoutes.push({
					title : droutes[route].title,
					tag: droutes[route].tag
				});
			}
			
			//create menu of active routes
			var routesListMenu = new UI.Menu({
				title: 'Routes',
				sections: [{
					items: activeRoutes
				}]
			});
			
			//select listener
			routesListMenu.on('select', function(e){
				routeTime(e.item);
			});
			
			//show menu
			routesListMenu.show();
		},
		function(error){ //error
			console.log("Request failed.");
		}
	);
}

//gets all active stops
function stopsList(){
	console.log("stops");
	
}

//gets the times for the route
function routeTime(router){	
	//get the times for the object
	
	console.log(router.tag);
	ajax(
		{ //request
			url: 'http://runextbus.herokuapp.com/route/' + router.tag,
			type: 'json'
		},
		function(data){ //request success
			console.log(router.tag);
			console.log(data[0].title);
			var times = [];
			var subtitle = "";
			for(var x in data){ 
				var seconds = data[x].predictions[0].seconds % 60; 
				subtitle = data[x].predictions[0].minutes + " minutes " + seconds + " seconds";
				times.push({
					title: data[x].title,
					subtitle: subtitle,
					predictions: data[x].predictions
				});
			}
			var stopListMenu = new UI.Menu({
				title: 'Stop List Menu',
				sections: [
					{
						items: times
					}
				]
			});
			
			//select listener
			stopListMenu.on('select', function(e){
				stopTimes(times[e.itemIndex]);
			});
			
			//show list
			stopListMenu.show();
		},
		function(error){ //request failed
			
		}
	);
}

//gets all the times at the stop
function stopTimes(stop){ 
	var predictions = [];
	
	for(var prediction in stop.predictions){
		predictions.push({
			title: stop.predictions[prediction].minutes + " minutes " + Number(stop.predictions[prediction].seconds) % 60 + " seconds" 
		});
	}
	
	//times the stop
	var stopList = new UI.Menu({
		title: stop.title,
		sections: [
			{
				items: predictions
			}
		]
	});
	
	//show menu
	stopList.show(); 
}
/*
main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window();
  var textfield = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
*/