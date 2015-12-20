/**
 * Created by audreyyang on 12/15/15.
 */
console.log("Airbnb");

var margin = {t:50,r:100,b:50,l:50};
var width = document.getElementById('map').clientWidth - margin.r - margin.l,
    height = document.getElementById('map').clientHeight - margin.t - margin.b;

var canvas = d3.select('.canvas');
var map = canvas
    .append('svg')
    .attr('width',width+margin.r+margin.l)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','canvas')
    .attr('transform','translate('+margin.l+','+margin.t+')');


var bostonLngLat = [-71.088066,42.315520];
var projection = d3.geo.mercator()
    .translate([width/2,height/2])
    .center(bostonLngLat)
    .scale(100000);

//path generator
var path = d3.geo.path().projection(projection);

var ShapeOfBoston = d3.map()

//scales
var scaleColor = d3.scale.linear().domain([40,500]).range(['white','red']);
var colorByprice = ShapeOfBoston.get(d.price);

queue()
    //.defer(d3.json, "data/bos_neighborhoods.geojson")
    .defer(d3.json, "data/ma_towns.json")
    .defer(d3.csv,"data/boston_listings_cleaned.csv",parseData)
    .await(function(err, neighbors,room_id) {
        draw(room_id,neighbors);
        // console.log(neighbor)
    })

//paraData
function parseData(d){
    return{x:+d.X,
        y:+d.Y,
        neighborhood:+d.neighborho,
        reviews:+d.reviews,
        price:+d.price,
        rating:+d.overall_sa,
        accommodation:+d.accommodat,
        bedrooms:+d.bedrooms


    }


    //console.log(ShapeOfBoston)//comes objects
}

//draw the map
function draw(room_id, neighbors) {

    var shape = map.append('g')
        .append('path')
        .datum(neighbors)
        .attr('d',path)
        .attr('fill','hsl(200,40%,' + '80%)')
        .style('stroke-width','2px')
        .style('stroke','white')

    var dots = map.append('g')
        .selectAll('.room')
        .data(room_id)
        .enter()
    dots
        .append('circle')
        .attr('class','room')
        .attr('r',2)
        .attr('cx',function(d){
            //console.log(projection([d.x, d.y])[0]);
            return projection([d.x, d.y])[0]
        })
        .attr('cy',function(d){
            //console.log('room_id')
            return projection([d.x, d.y])[1]
        })
        /*.style('fill',function(d){
          //  var colorByprice = ShapeOfBoston.get(d.price);
            console.log(colorByprice)
            return scaleColor(colorByprice)})
        console.log(colorByprice)
    console.log(ShapeOfBoston)
    console.log(d.price)*/
        .style('fill',scaleColor(colorByprice))
        .style('fill-opacity',.2)

}


