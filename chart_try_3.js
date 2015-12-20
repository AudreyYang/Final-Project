/**
 * Created by audreyyang on 12/19/15.
 */




    function chart(){
        d3.csv('./data/bos.csv',function(lists){

            var Lists = [];

            var rates = [];

            var reviewsArr = [];

            var townLists= [];

            var colors = [];

            var minPrice = 0;
            var maxPrice = 0;
            var midPrice = 0;



            lists.filter(function(list){

                if(list.reviews != 0){



                    Lists.push(list);

                    rates.push(list.overall_sa);

                    reviewsArr.push(parseInt(list.reviews));

                    var exist = false;

                    if(list.town == '')
                    {
                        list.town = 'undified';
                    }
                    townLists.filter(function(town){
                        if( town == list.town ){
                            exist = true;
                        }
                    })

                    if(!exist){
                        townLists.push( list.town );
                    }
                }

            });





            midRate = d3.median(rates, function(d){
                return parseInt(d);
            });

            for(var i = 0; i < rates.length; i++){

                var colorRange = (parseInt(rates[i]) / midRate) * 40;
                if(colorRange > 100){
                    colorRange = 100;
                }
                var color = 'hsl(330, 100%,' + (colorRange / 1.5) + '%)';
                colors.push(color);

            }


            var data = Lists;

            var margin = {top: 50, right: 25, bottom: 150, left: 25},
                width = 1200 - margin.left - margin.right,
                height = 600 - margin.top - margin.bottom;

            var x = d3.scale.ordinal()
                .domain(townLists)
                .rangeRoundBands([0, width], 1);

            var y = d3.scale.linear()
                .domain([0,d3.max( reviewsArr )])
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            var tip2 = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return "accommodation: <span style='color:red'>" + d.accommodat + "</span><br>bedrooms: <span style='color:red'>" + d.bedrooms + "</span><br>price: <span style='color:red'>" + d.price + "</span>";
                })

            var svg = d3.select("#chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(tip2);

            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis)
                .selectAll("text")
                .attr("y", 0)
                .attr("x", 9)
                .attr("dy", "2em")
//                .attr("transform", "rotate(90)")
//                .style("text-anchor", "start")
                .attr("font-size", "10px");

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .attr("font-size", "10px");


            svg.selectAll(".dot")
                .data(Lists)
                .enter().
                append("circle")
                .attr("class", "dot")
                .attr("cx", function(d,i){
                    return x(Lists[i].town == '' ? 'undified' : Lists[i].town);
                })
                .attr("cy", function(d,i){
                    return y( reviewsArr[i] );
                })
                .attr("r", 3)
                .attr( "fill", function(d,i){
                    return d3.hsl(colors[i]);
                })
                .on('mouseover', function(d,i){
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('r',6);
                    tip2.show(d);
                })
                .on('mouseout', function(d,i){
                    d3.select(this)
                        .transition()
                        .duration(200)
                        .attr('r',3);
                    tip2.hide();
                });


        }

        )
    }