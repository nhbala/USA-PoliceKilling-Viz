
let weightedScale = 1;
let killingData = [];
let overallCount = 0;
let previousCount = 0;
let totalthing = 3594;


d3.csv("datasets/datum.csv").then(function (data) {

  /*Creating the representations of people */
  killingData = data

  let x = 1


  //divider above 1st visualization
  let divider = d3.select("#svgDivide").append("svg");
  divider.attr("width", 1400 * weightedScale)
    .attr("height", 3 * weightedScale);
  let dWidth = divider.attr("width");
  let dHeight = divider.attr("height");
  divider.append("rect")
    .attr("x", 20)
    .attr("y", 0)
    .attr("width", dWidth)
    .attr("height", dHeight)
    .style("fill", "gray");

  //Creating the rectangles for viz
  let svg = d3.select("#killingSVG").append("svg");
  svg.attr("width", 1000 * weightedScale).attr("height", 700 * weightedScale).attr("id", "peopleSvg");
  let width = svg.attr("width");
  let height = svg.attr("height");
  let peopleSvg = svg.append('g');
  let currX = 7 * weightedScale;
  let currY = 50 * weightedScale;
  let i = 0;
  killingData.forEach(function (data, index) {
    if (i % 1 === 0) {
      currSvg = svg.append("svg").attr("id", "per" + i).attr("transform", "translate(" + (currX) + "," + (currY) + ")");
      currSvg.append("rect")
        .attr("x", currX - 2)
        .attr("y", currY + 2)
        .attr("width", 3)
        .attr("height", 8)
        .attr("id", "person" + i)
        .attr("value", currY + 2)
        .style("fill", "grey")
      if (currX > 970 * weightedScale) {
        currY = currY + 10 * weightedScale
        currX = 7 * weightedScale
      } else {
        currX = currX + 7 * weightedScale;
      }
    }
    i = i + 1
  });

  /* Drawing legend */
  currSvg.append("rect")
    .attr("x", width - 240 * weightedScale)
    .attr("y", 25 * weightedScale)
    .attr("width", 10 * weightedScale)
    .attr("height", 10 * weightedScale)
    .attr("id", "legendrect")
    .style("fill", "red");
  currSvg.append("text").attr("x", width - 220 * weightedScale)
    .attr("y", 35 * weightedScale).attr('id', "legendText")
    .attr('font-size', 13).attr("class", "useful").text("= 1 Person that Fits Filter");

  currSvg.append("rect")
    .attr("x", width - 240 * weightedScale)
    .attr("y", 5 * weightedScale)
    .attr("width", 10 * weightedScale)
    .attr("height", 10 * weightedScale)
    .attr("id", "legendrect")
    .style("fill", "grey");
  currSvg.append("text").attr("x", width - 220 * weightedScale)
    .attr("y", 15 * weightedScale).attr('id', "legendText")
    .attr('font-size', 13).attr("class", "useful").text("= 1 Person that Doesn't Fit FIlter");

  /*Create a divider for people to pass through*/
  currSvg.append("rect")
    .attr("x", 25 * weightedScale)
    .attr("y", 350 * weightedScale)
    .attr("width", width - 40 * weightedScale)
    .attr("height", 2 * weightedScale)
    .attr("id", "liftRect")
    .style("fill", "gray");

  /* filter function */
  function filter(filterIdInitial, specificVal, key, grouping) {
    let posText = document.getElementById("curPosText");
    let negText = document.getElementById("currNegText");
    if (posText) {
      posText.parentNode.removeChild(posText);
      negText.parentNode.removeChild(negText);
    }
    $('input[name^=' + grouping + ']').not(document.getElementById(filterIdInitial)).prop('checked', false);
    let total_lst = []
    let checkedBoxes = document.querySelectorAll('[name^=filterbox]');
    checkedBoxes.forEach(function (data, index) {
      let filterId = (data.id)
      var box = document.getElementById(filterId);
      if (box.checked == true) {
        let currInfo = data.value;
        let splitter = currInfo.split("_");
        total_lst.push(splitter)
      }
    });

    total_lst1 = []
    killingData.forEach(function (data, index) {
      let flag = true;
      if (total_lst.length !== 0) {
        total_lst.forEach(function (data1, index) {
          let specificVal = data1[0]
          let key = data1[1]
          if (data[key] !== specificVal) {
            flag = false;
            // break;
          }
        });
        if (flag === true) {
          total_lst1.push(data);
        }
      }
    });
    curr_length = total_lst1.length;


    //logic to control movement of rectangles/placement of % text
    let textSize = 12;
    if (curr_length === previousCount) {
      diff = curr_length - previousCount
      previousCount = curr_length
      let unrounded_percentage = (((curr_length * 1.0) / totalthing) * 100);
      let curr_textbottom = "";
      let curr_texttop = "";
      if (unrounded_percentage < 1 && unrounded_percentage > 0) {
        curr_textbottom = "Less than 1% of people fit this filter"
      } else if (unrounded_percentage < 100 && unrounded_percentage > 99) {
        curr_texttop = ">99% of people fit the selected filter"
      } else {
        curr_textbottom = Math.round(unrounded_percentage) + "% of people fit the selected filter";
      }
      if (100 - unrounded_percentage < 1 && 100 - unrounded_percentage > 0) {
        curr_texttop = "Less than 1% of people fit this filter"
      } else if (100 - unrounded_percentage < 100 && 100 - unrounded_percentage > 99) {
        curr_texttop = ">99% of people do not fit the selected filter"
      } else {
        curr_texttop = 100 - Math.round(unrounded_percentage) + "% of people do not fit the selected filter";
      }
      let svg1 = d3.select("#peopleSVG");
      let thisSvg = svg1.append("text")
        .attr("x", 20 * weightedScale)
        .attr("y", 30 * weightedScale)
        .attr('id', "curPosText")
        .attr('font-size', 15)
        .attr("class", "useful")
        .text(curr_texttop);

      let thisSvg1 = svg1.append("text")
        .attr("x", 20 * weightedScale)
        .attr("y", 720 * weightedScale)
        .attr('id', "currNegText")
        .attr('font-size', 15)
        .style('padding-top', 10)
        .attr("class", "useful")
        .text(curr_textbottom)
    }
    if (curr_length > previousCount) {
      diff = curr_length - previousCount;
      let selectedList = []
      for (i = totalthing - previousCount; i > totalthing - previousCount - diff; i = i - 1) {
        let currPerson = d3.select('#person' + i)
        let y = d3.select('#person' + i).attr('value')
        selectedList.push([currPerson, y])
      }
      selectedList.forEach(function (data) {
        let y = data[1]
        data[0].transition().duration(1000)
          .attr("y", parseInt(y) + 350 * weightedScale)
          .style("fill", "red")
        data[0].attr('value', parseInt(y) + 350 * weightedScale);
      });

      previousCount = curr_length
      let unrounded_percentage = (((curr_length * 1.0) / totalthing) * 100);
      let curr_textbottom = "";
      let curr_texttop = "";
      if (unrounded_percentage < 1 && unrounded_percentage > 0) {
        curr_textbottom = "Less than 1% of people fit this filter"
      } else if (unrounded_percentage < 100 && unrounded_percentage > 99) {
        curr_texttop = ">99% of people fit the selected filter"
      } else {
        curr_textbottom = Math.round(unrounded_percentage) + "% of people fit the selected filter";
      }
      if (100 - unrounded_percentage < 1 && 100 - unrounded_percentage > 0) {
        curr_texttop = "Less than 1% of people fit this filter"
      } else if (100 - unrounded_percentage < 100 && 100 - unrounded_percentage > 99) {
        curr_texttop = ">99% of people do not fit the selected filter"
      } else {
        curr_texttop = 100 - Math.round(unrounded_percentage) + "% of people do not fit the selected filter";
      }
      let svg1 = d3.select("#peopleSVG");
      let thisSvg = svg1.append("text").attr("x", 30 * weightedScale)
        .attr("y", 30 * weightedScale).attr('id', "curPosText")
        .attr('font-size', 15).attr("class", "useful").text(curr_texttop);

      let thisSvg1 = svg1.append("text").attr("x", 30 * weightedScale)
        .attr("y", 680 * weightedScale).attr('id', "currNegText")
        .attr('font-size', 15).attr("class", "useful").text(curr_textbottom)
    }
    if (curr_length < previousCount) {
      let diff = previousCount - curr_length
      selectedList1 = []
      for (i = totalthing - previousCount + 1; i <= totalthing - previousCount + diff; i = i + 1) {
        let currPerson = d3.select('#person' + i)
        let y = d3.select('#person' + i).attr('value')
        selectedList1.push([currPerson, y])
      }
      selectedList1.forEach(function (data) {
        let y = data[1]
        data[0].transition().duration(1000)
          .attr("y", parseInt(y) - 350 * weightedScale)
          .style("fill", "grey")
        data[0].attr('value', parseInt(y) - 350 * weightedScale);
      });

      previousCount = curr_length
      let unrounded_percentage = (((curr_length * 1.0) / totalthing) * 100);
      let curr_textbottom = "";
      let curr_texttop = "";
      if (unrounded_percentage < 1 && unrounded_percentage > 0) {
        curr_textbottom = "Less than 1% of people fit this filter"
      } else if (unrounded_percentage < 100 && unrounded_percentage > 99) {
        curr_texttop = ">99% of people fit the selected filter"
      } else {
        curr_textbottom = Math.round(unrounded_percentage) + "% of people fit the selected filter";
      }
      if (100 - unrounded_percentage < 1 && 100 - unrounded_percentage > 0) {
        curr_texttop = "Less than 1% of people fit this filter"
      } else if (100 - unrounded_percentage < 100 && 100 - unrounded_percentage > 99) {
        curr_texttop = ">99% of people do not fit the selected filter"
      } else {
        curr_texttop = 100 - Math.round(unrounded_percentage) + "% of people do not fit the selected filter";
      }
      let svg1 = d3.select("#peopleSVG");
      let thisSvg = svg1.append("text").attr("x", 30 * weightedScale)
        .attr("y", 30 * weightedScale).attr('id', "curPosText")
        .attr('font-size', 15).attr("class", "useful").text(curr_texttop);

      let thisSvg1 = svg1.append("text").attr("x", 30 * weightedScale)
        .attr("y", 680 * weightedScale).attr('id', "currNegText")
        .attr('font-size', 15).attr("class", "useful").text(curr_textbottom);


    }
  };





  /*filter gun*/
  d3.select("#carfleeFilter").on("click", () => {
    filter("carfleeFilter", 'Car', 'flee', 'filterbox7');
  });
  /*filter gun*/
  d3.select("#footfleeFilter").on("click", () => {
    filter("footfleeFilter", 'Foot', 'flee', 'filterbox7');
  });
  /*filter gun*/
  d3.select("#notfleeFilter").on("click", () => {
    filter("notfleeFilter", 'Not fleeing', 'flee', 'filterbox7');
  });
  //filter flee
  d3.select("#otherfleeFilter").on("click", () => {
    filter("otherfleeFilter", 'Other', 'flee', 'filterbox7');
  });
  //filter undetermined
  d3.select("#undeterminedfleeFilter").on("click", () => {
    filter("undeterminedfleeFilter", 'undetermined', 'flee', 'filterbox7');
  });
  /*filter gun*/
  d3.select("#armedgunFilter").on("click", () => {
    filter("armedgunFilter", 'gun', 'armed', 'filterbox3');
  });
  /*filter gun and knife*/
  d3.select("#armedgunknifeFilter").on("click", () => {
    filter("armedgunknifeFilter", 'gun and knife', 'armed', 'filterbox3');
  });
  /*filter knife*/
  d3.select("#knifeFilter").on("click", () => {
    filter("knifeFilter", 'knife', 'armed', 'filterbox3');
  });
  /*filter other*/
  d3.select("#armedOtherFilter").on("click", () => {
    filter("armedOtherFilter", 'Other', 'armed', 'filterbox3');
  });
  /*filter vehicle*/
  d3.select("#vehicleArmedFilter").on("click", () => {
    filter("vehicleArmedFilter", 'vehicle', 'armed', 'filterbox3');
  });
  /*filter unknown*/
  d3.select("#unknownarmedFilter").on("click", () => {
    filter("unknownarmedFilter", 'unknown weapon', 'armed', 'filterbox3');
  });
  /*filter unarmed*/
  d3.select("#noFilter").on("click", () => {
    filter("noFilter", 'unarmed', 'armed', 'filterbox3');
  });
  /*filter Taser*/
  d3.select("#armedTaserFilter").on("click", () => {
    filter("armedTaserFilter", 'Taser', 'armed', 'filterbox3');
  });
  /*filter ax*/
  d3.select("#armedaxFilter").on("click", () => {
    filter("armedaxFilter", 'ax', 'armed', 'filterbox3');
  });
  /*filter machete*/
  d3.select("#armedmacheteFilter").on("click", () => {
    filter("armedmacheteFilter", 'machete', 'armed', 'filterbox3');
  });
  /*filter sword*/
  d3.select("#armedswordFilter").on("click", () => {
    filter("armedswordFilter", 'sword', 'armed', 'filterbox3');
  });
  /*filter toy weapon*/
  d3.select("#armedtoyFilter").on("click", () => {
    filter("armedtoyFilter", 'toy weapon', 'armed', 'filterbox3');
  });
  /*filter undetermined*/
  d3.select("#armedundeterminedFilter").on("click", () => {
    filter("armedundeterminedFilter", 'undetermined', 'armed', 'filterbox3');
  });

  /*filtering for African American*/
  d3.select("#blackFilter").on("click", () => {
    filter("blackFilter", 'B', 'raceethnicity', 'filterbox1');
  });
  /*filtering for White*/
  d3.select("#whiteFilter").on("click", () => {
    filter("whiteFilter", 'W', 'raceethnicity', 'filterbox1');
  });
  /*filtering for Hispanic/Latino*/
  d3.select("#latinoFilter").on("click", () => {
    filter("latinoFilter", 'H', 'raceethnicity', 'filterbox1');
  });
  /*filtering for Asian/Pacific Islander*/
  d3.select("#asianFilter").on("click", () => {
    filter("asianFilter", 'A', 'raceethnicity', 'filterbox1');
  });
  /*filtering for unknown*/
  d3.select("#unknownFilter").on("click", () => {
    filter("unknownFilter", 'undetermined', 'raceethnicity', 'filterbox1');
  });
  /*filtering for native american*/
  d3.select("#nativeAmericanFilter").on("click", () => {
    filter("nativeAmericanFilter", 'N', 'raceethnicity', 'filterbox1');
  });
  /*filtering for other*/
  d3.select("#otherFilterrace").on("click", () => {
    filter("otherFilterrace", 'O', 'raceethnicity', 'filterbox1');
  });
  /*filtering for white majority*/
  d3.select("#whitemajorityFilter").on("click", () => {
    filter("whitemajorityFilter", 'white', 'majorityethn', 'filterbox4');
  });
  d3.select("#blackmajorityFilter").on("click", () => {
    filter("blackmajorityFilter", 'black', 'majorityethn', 'filterbox4');
  });
  d3.select("#hispanicmajorityFilter").on("click", () => {
    filter("hispanicmajorityFilter", 'hispanic', 'majorityethn', 'filterbox4');
  });
  //filter for median incomes
  d3.select("#m50000MedianincomeFilter").on("click", () => {
    filter("m50000MedianincomeFilter", '< 50,000', 'Medianincome', 'filterbox5');
  });
  d3.select("#m5000065000MedianincomeFilter").on("click", () => {
    filter("m5000065000MedianincomeFilter", '50,000 - 65,000', 'Medianincome', 'filterbox5');
  });
  d3.select("#m6500080000MedianincomeFilter").on("click", () => {
    filter("m6500080000MedianincomeFilter", '65,000 - 80,000', 'Medianincome', 'filterbox5');
  });
  d3.select("#m8000095000MedianincomeFilter").on("click", () => {
    filter("m8000095000MedianincomeFilter", '80,000 - 95,000', 'Medianincome', 'filterbox5');
  });
  d3.select("#m95000MedianincomeFilter").on("click", () => {
    filter("m95000MedianincomeFilter", '> 95,000', 'Medianincome', 'filterbox5');
  });
  //filter for poverty percentages
  d3.select("#m5povertyFilter").on("click", () => {
    filter("m5povertyFilter", '< 5.0%', 'Povertypercentage', 'filterbox6');
  });

  d3.select("#m510povertyFilter").on("click", () => {
    filter("m510povertyFilter", '5.0% - 10.0%', 'Povertypercentage', 'filterbox6');
  });

  d3.select("#m1020povertyFilter").on("click", () => {
    filter("m1020povertyFilter", '10.0% - 20.0%', 'Povertypercentage', 'filterbox6');
  });

  d3.select("#m2030povertyFilter").on("click", () => {
    filter("m2030povertyFilter", '20.0% - 30.0%', 'Povertypercentage', 'filterbox6');
  });

  d3.select("#m3035povertyFilter").on("click", () => {
    filter("m3035povertyFilter", '30.0% - 35.0%', 'Povertypercentage', 'filterbox6');
  });

  d3.select("#m35povertyFilter").on("click", () => {
    filter("m35povertyFilter", '> 35.0%', 'Povertypercentage', 'filterbox6');
  });

})
  .catch(error => {
    console.log("Your Error is this:" + error.message);
  });
