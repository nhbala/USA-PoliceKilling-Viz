//*****Based on Prof Jeff's code March 1st,March 11th, and march 20th Lectures*******//

const svg = d3.select("#us_map");
const width = svg.attr("width");
const height = svg.attr("height");
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const mapWidth = width - margin.left - margin.right;
const mapHeight = height - margin.top - margin.bottom;
const map = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//async func
const requestData = async () => {

   //divider above the 2nd visualization
   let twoDivider = d3.select("#twoDivide").append("svg");
   twoDivider.attr("width", 1400)
      .attr("height", 3);
   let mWidth = twoDivider.attr("width");
   let mHeight = twoDivider.attr("height");
   twoDivider.append("rect")
      .attr("x", 20)
      .attr("y", 0)
      .attr("width", mWidth)
      .attr("height", mHeight)
      .style("fill", "gray");


   // get dataset
   const us = await d3.json("../datasets/us.json");
  //  console.log(us);

   const stateIDs = await d3.tsv("../datasets/us-state-names.tsv");
   console.log(stateIDs);

   let idToState = {};
   stateIDs.forEach(d => {
      idToState[d.id] = d.name;
   });

   //get county information and create counties and states meshes

   const counties = topojson.feature(us, us.objects.counties);
   const countiesMesh = topojson.mesh(us, us.objects.counties);
   var states = topojson.feature(us, us.objects.states);
   const statesMesh = topojson.mesh(us, us.objects.states);

   //create projection for map using geoAlbersUsa
   var projection = d3.geoAlbersUsa().fitSize([mapWidth, mapHeight], states);
   var path = d3.geoPath().projection(projection);

   //layer is used for laying the appended location circles
   var layer = map.append("g");

   layer.append("path")
      .attr("class", "graticule")
      .attr("d", path(d3.geoGraticule10()));

   layer.selectAll(".state").data(states.features)
      .enter()
      .append("path")
      .attr("class", "state")
      .attr("d", path)
      .attr("note", d => d.id)
      .on("mouseover", function (d) {
         d3.select(this).style("stroke", "black").style("stroke-width", 3);

      }
      )
      .on("mouseout", function (d) {
         d3.select(this).style("stroke", "none").style("stroke-width", 0);
      }
      )


      ;
   layer.selectAll(".county").data(counties.features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("visibility", "hidden")
      .attr("d", path);

   layer.append("path")
      .datum(countiesMesh)
      .attr("class", "county-line")
      .attr("visibility", "hidden")
      .attr("d", path);
   layer.append("path")
      .datum(statesMesh)
      .attr("class", "state_line")
      .attr("d", path)


   //hover to show state data
   var stateInfo = d3.select("body").append("div")
      .attr("id", "stateInfo")
      .attr("class", "stateInfo")
      .style("opacity", 0);
   var stateInfoWidth = parseFloat(stateInfo.style("width"));
   var stateInfoHeight = parseFloat(stateInfo.style("height"));

   d3.selectAll(".state").on("mousemove", mouseOnState);
   d3.selectAll(".state").on("mouseout", mouseLeavesState);

   function mouseOnState(d) {
      // console.log(event);
      stateInfo.style("left", event.pageX - (stateInfoWidth / 2.0));
      stateInfo.style("top", event.pageY - stateInfoHeight - 24);
      stateInfo.html("");

      let state = d3.select(this);
      // console.log(d);
      stateInfo.append("div").text(idToState[d.id]);

      state.style("stroke", "black").style("stroke-width", 3);
      stateInfo.style("opacity", 1);
   }
   function mouseLeavesState() {
      let state = d3.select(this);
      stateInfo.style("opacity", 0);
      state.style("stroke", "none").style("stroke-width", 0);
   }


   //hover to show person data
   var humanInfo = d3.select("body").append("div")
      .attr("id", "humanInfo")
      .attr("class", "humanInfo")
      .style("opacity", 0);
   let infoWidth = parseFloat(humanInfo.style("width"));
   let infoHeight = parseFloat(humanInfo.style("height"));
   // console.log(i);

   layer.selectAll("circle").on("mousemove", mouseOn);
   layer.selectAll("circle").on("mouseout", mouseLeaves);

   function mouseOn() {
      // console.log(event);
      // console.log(d3.select(this));
      // console.log(killingData);

      /* accounting for margins of svg*/
      humanInfo.style("left", event.pageX - (infoWidth / 2.0));
      humanInfo.style("top", event.pageY - infoHeight - 24);
      humanInfo.html("");
      var victimInfo = event.path[0].id.split("+");
      // console.log(victimInfo);
      humanInfo.append("div").attr("class", "name").text(victimInfo[0]);
      let gender = victimInfo[4] == "F" ? "female" : "male";
      // console.log(gender);
      humanInfo.append("div").attr("class", "details").text("Died at age " + victimInfo[1] + " in " + victimInfo[2] +
         ". A " + gender + " " + victimInfo[5]) + ". ";

      // let victim = d3.select(this);
      // victim.append("div").style("opacity", 1);
      // humanInfo.append("div").text([victim.attr("name")]);
      humanInfo.style("opacity", 1);
   }
   function mouseLeaves() {
      humanInfo.style("opacity", 0);
   }



   //Import data set on
   const shooting_data = await d3.csv("../datasets/police_shootings_full.csv");
   console.log(shooting_data);


   //slider stuff

   // dates in shooting_data parsed to be split up by year, month, and day columns 
   shooting_data.forEach((d, i) => {
      date_array = d['date'].split("/");
      d['year'] = Number(date_array[2]);
      d['month'] = Number(date_array[0]);
      d['day'] = Number(date_array[1]);
   });

   const min_year = d3.min(shooting_data, d => d['year']);
   const max_year = d3.max(shooting_data, d => d['year']);


   // Slider for year
   year_slider = d3.select("#year");
   year_slider.on("input", function input() {
      silder_year_color();
      silder_year_label();
      update();
      var label = d3.select("#slider_val");
      label.text("20" + document.getElementById("year").value).attr("x", 200);
   });


   let sliderWidth = parseFloat(d3.select("#year").style("width"));
  //  let sliderHeight = 60;
   let xScale = d3.scaleLinear().domain([min_year, max_year]).range([0, sliderWidth]);

   //the slider should update based on year
   function update() {
     //some debugging code commented out!
    //console.log("we in function update");
    //console.log(shooting_data);

      var slider_year = document.getElementById("year").value;
      // console.log("this is the slider slider_year", slider_year);
      let filtered = shooting_data.filter(function filter_by_year(d) { if (d["year"] == slider_year) { return true; } });
      // console.log("this is the filtered data", filtered);
      let circles = layer.selectAll("circle").data(filtered);
      // console.log("these are the circles pre exit: " , circles);

      // acts as clearing
      circles.exit().remove();

      console.log("these are the circles post exit: ", circles);

      var circles_entered = circles.enter().append("circle")

         //    .attr("cx", function (d) { return projection([Number(d["lon"]), Number(d["lat"])])[0]; })
         //    .attr("cy", function (d) { return projection([Number(d["lon"]), Number(d["lat"])])[1]; })
         .attr("r", 2)
         .style("opacity", .5);

      circles = circles_entered.merge(circles);

      circles.attr("fill", silder_year_color())
         .attr("id", function (d) { return d["name"] + "+" + d["age"] + "+" + d["city"] + "+" + d["state"] + "+" + d["gender"] + "+" + d["manner_of_death"]; })
         .attr("cx", function (d) { return projection([Number(d["lon"]), Number(d["lat"])])[0]; })
         .attr("cy", function (d) { return projection([Number(d["lon"]), Number(d["lat"])])[1]; });
    

      circles.on("mousemove", mouseOn);
      circles.on("mouseout", mouseLeaves);
   }

   update();


   //colors the location circles based on slider year
   function silder_year_color() {
      var slider_year = document.getElementById("year").value;
      console.log("this is slider year within slider_year_color", slider_year);
      if (slider_year == 15) {
         return "black";
      }
      else if (slider_year == 16) {
         return "purple";
      }
      else if (slider_year == 17) {
         return "blue";
      }
      else if (slider_year == 18) {
         return "red";
      }
      else {
         return "green";
      }
   }
   silder_year_color();


   function silder_year_label() {
      var slider_year = document.getElementById("year").value;
      map_lab = d3.select("#us_map");



   }
   silder_year_label();


   var zoom = d3.zoom()

      .scaleExtent([1, 10])
      .on("zoom", zoomed);

   map.call(zoom);
   map.call(zoom.transform, d3.zoomIdentity);


   // func zoom and make sure strokes stay consistent
   function zoomed() {

      layer.attr("transform", d3.event.transform.toString());
      //make line widths stay uniform and get smaller when zoom in
      layer.select(".state_line").style("stroke-width", 1.5 / d3.event.transform.k);
      layer.select(".county-line").style("stroke-width", 1 / d3.event.transform.k);

      //county line gets visible after 1.7 zoom, else hidden
      layer.select(".county-line").attr("visibility", (d3.event.transform.k > 1.7) ? "visible" : "hidden");
      layer.selectAll(".county").attr("visibility", (d3.event.transform.k > 1.7) ? "visible" : "hidden");
      d3.selectAll(".stateInfo").style("opacity", (d3.event.transform.k > 1.7) ? 0 : 1);
      // console.log(d3.event.transform.k);

   }

   //clickable to zoom in to either state of county
   layer.selectAll(".state").on("click", clicked);
   layer.selectAll(".county").on("click", clicked);


// based on Jeff's code, but also based on zoom functionality from https://bl.ocks.org/mbostock/4699541
   function clicked(d) {
      // get bounds of the map so that we know how much to zoom in and where to cut off 
      var bounds = path.bounds(d.geometry);
      dx = bounds[1][0] - bounds[0][0];
      dy = bounds[1][1] - bounds[0][1];
      x = (bounds[0][0] + bounds[1][0]) / 2;
      y = (bounds[0][1] + bounds[1][1]) / 2;

      scale = Math.max(1, Math.min(10, 0.9 / Math.max(dx/mapWidth, dy/mapHeight)));
      translate = [mapWidth/2 - x * scale, mapHeight/2 - y * scale];
      let new_tran = d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale);

      map.transition().duration(700).call(zoom.transform, new_tran);


   }





};



requestData();

// end of U.S. map code
