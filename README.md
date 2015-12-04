# Assignment-5

In this assignment, you will use the suite of tools under `d3.geo` to draw a choropleth of median household income by census block group in the City of Boston.

## Available data ##
Under the data folder are three files:
-A GeoJSON file of Boston census block groups, with a unique ID for each;
-a .csv file of median household income by block group (the "B19013001" column), with each block group again identified by the same ID;
-A GeoJSON file of Boston neighborhoods. This contains neighborhood boundaries and names, and is meant to help add context to the map.

The first two files will allow you to draw the choropleth; the neighborhood GeoJSON file lets you add additional context, such as neighborhood boundaries and labels.

For a brief overview of the census and its various levels of geographies, visit this link: https://en.wikipedia.org/wiki/Census_block_group

## Projection and `d3.geo.path()` generator ##
Use the Mercator projection for this assignment, and center the projection at the lngLat point provided. One thing to consider is the scale: since the mercator projection is usually used to project the entire world.

## Draw the map ##
Draw a choropleth, based on the census block group data and a color scale of your choice.

Also draw neighborhood boundaries, and label each neighborhood with its name. Hint: you'll have to use the `path.centroid` function.

The recommended DOM layout is as follows:
```
<g class="block-groups">
  <path class="block-group" ...>
</g>
<g class="neighborhoods">
  <g class="neighborhood">
    <path class="boundary" ...>
    <text class="label" ...>
  </g>
</g>
```
