
console.log("Airbnb");

var margin = {t:50,r:100,b:50,l:50};
var width = document.getElementById('map').clientWidth - margin.r - margin.l,
    height = document.getElementById('map').clientHeight - margin.t - margin.b;

var canvas = d3.select('.canvas')
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

//Scales
var scaleX = d3.scale.linear().domain([20,1000]).range([0,width]),
    scaleY = d3.scale.linear().domain([5,0]).range([height*0.713,height*0.9]);

//Axis
var axisX = d3.svg.axis()
    .orient('bottom')
    .scale(scaleX)
    .tickFormat( d3.format('d') );

var axisY = d3.svg.axis()
    .orient('right')
    .tickSize(width)
    .scale(scaleY);

//Draw axes
canvas.append('g').attr('class','axis axis-x')
    .attr('transform','translate(0,'+height*0.9+')')
    .call(axisX);
canvas.append('g').attr('class','axis axis-y')
    .call(axisY);

//path generator
var path = d3.geo.path().projection(projection);

var shape = d3.map()

//scales
var scaleColor = d3.scale.linear().domain([40,500]).range(['hsl(210,55%,60%)','hsl(10,100%,60%)'])

queue()
    //.defer(d3.json, "data/bos_neighborhoods.geojson")
    .defer(d3.json, "data/ma_towns.json")
    .defer(d3.csv,"data/boston_listings_cleaned.csv")
    .defer(d3.csv,"data/boston_listings_cleaned2.csv",parseData)
    .await(function(err, neighbors,room_id,chart) {
        draw(neighbors,room_id,chart);
        //draw(chart);
        // console.log(neighbor)
    })

function draw(neighbors,room_id,chart) {
//draw the map
    var shape = canvas.append('g')
        .append('path')
        .datum(neighbors)
        .attr('d',path)
        .attr('fill','hsl(0,0%,80%)')
        .style('stroke-width','2px')
        .style('stroke','white')
        .attr('transform','translate('+(-100)+','+(-100)+')')

    //draw the rooms
    var dots = canvas.append('g')
        .selectAll('.room')
        .data(room_id)
        .enter()

    dots
        .append('circle')
        .attr('class','room')
        .attr('r',3)
        .attr('cx',function(d){
            //console.log(projection([d.x, d.y])[0]);
            return projection([d.X, d.Y])[0]
        })
        .attr('cy',function(d){
            //console.log('room_id')
            return projection([d.X, d.Y])[1]
        })
        .style('fill',function(d){
            var colorByprice = d.price;
            //console.log(colorByprice) works finally!
            return scaleColor(colorByprice);})
        .style('fill-opacity',.5)
        .attr('transform','translate('+(-100)+','+(-100)+')')
        .call(attachTooltip);

//draw the chart
    var chart = canvas.append('g')
        .selectAll('.room')
        .data(chart)
        .enter()

    chart
        .append('circle')
        .attr('class','room')
        .attr('r',3)
        .attr("cx", function(d){
            return d.price;
        })
        .attr("cy", function(d){
            return -d.rating*30 ;
        })
        .style('fill',function(d){
            var colorByprice = d.price;
            return scaleColor(colorByprice);})
        .style('fill-opacity',.5)
        .attr('transform','translate('+(0)+','+(720)+')')
        .call(attachTooltip);
}


function attachTooltip(selection){
    selection
        .on('mouseenter',function(d){
            var tooltip = d3.select('.custom-tooltip');
            tooltip
                .transition()
                .style('opacity',1);

            // tooltip.select('#city').html(d.city);
            tooltip.select('#review').html(d.reviews);
            tooltip.select('#price').html(d.price);
            tooltip.select('#rating').html(d.rating);
            tooltip.select('#bedrooms').html(d.bedrooms);
            tooltip.select('#roomtype').html(d.roomtype);
            tooltip.select('#accommodation').html(d.accommodation);
        })
        .on('mousemove',function(){
            var xy = d3.mouse(canvas.node());
            //console.log(xy);

            var tooltip = d3.select('.custom-tooltip');

            tooltip
                .style('left',xy[0]+100+'px')
                .style('top',(xy[1]+100)+'px');

        })
        .on("mouseover",function(d,i){
            var tooltip = d3.select(this);
            var dotIndex = i;
            tooltip
                //.show(d)

                .transition()
                .duration(200)
                .style('opacity',1)
                .style('fill','yellow')
                .attr('r',8)
        } )

        .on('mouseleave',function(){
            var tooltip = d3.select(this)
                .transition()
                .duration(200)
                .style('opacity',.3)
                .style('fill','white')
                .attr('r',3)
        })
}



//paraData

function parseData(d){

    return{
        x:+d.X,
        y:+d.Y,
        // city:+d.city,
        //neighborhood:+d.neighborho,
        reviews:+d['reviews'],
        price:+d['price'],
        rating:+d['overall_sa']!=''? +d['overall_sa']:'NA',
        accommodation:+d['accommodat'],
        bedrooms:+d['bedrooms'],
        roomtype:d['room_type']
    }
    //console.log(bedrooms)//comes objects
}
