function drawHistogram(g, data, metric, title, size, speed){
  const margin = {left:40, right:15, top:15, bottom:40};
  const {width, height} = size;

// to be completed
}

function Clean_Data(dataset) {
  dataset.forEach(d =>{
    if (d["PUB_AGENCY_UNIT"] == null){
      d["PUB_AGENCY_UNIT"] = "Unknown"
    }

    if (d["OFFENDER_ETHNICITY"] == null){
      d["OFFENDER_ETHNICITY"] = "Unknown"
    }

    if (d["ADULT_VICTIM_COUNT"] == null){
      d["ADULT_VICTIM_COUNT"] = "Unknown"
    }
    
    if (d["JUVENILE_VICTIM_COUNT"] == null){
      d["JUVENILE_VICTIM_COUNT"] = "Unknown"
    }

    if (d["ADULT_OFFENDER_COUNT"] == null){
      d["ADULT_OFFENDER_COUNT"] = "Unknown"
    }
    
    if (d["JUVENILE_OFFENDER_COUNT"] == null){
      d["JUVENILE_OFFENDER_COUNT"] = "Unknown"
    }
    
    
    
                     })
  return dataset
  
}

function get_data_by_year(data_set) {
  const new_array = []

  data_set.forEach((d) => {
    var found = Boolean(false)
    new_array.forEach((i)=>{
      if (d.DATA_YEAR == i.DATA_YEAR){
        i.total = i.total+1
        found = true
        }
      
    })

    if (found ==false){
      new_array.push({DATA_YEAR: d.DATA_YEAR, total:1})
    }
    
  })

  return new_array
  
}

function get_bias_data(dataset) {
  const new_data = []

    dataset.forEach(d => {
      

      if(['Anti-Black or African American','Anti-Jewish','Anti-White','Anti-Gay (Male)','Anti-Hispanic or Latino','Anti-Other Race/Ethnicity/Ancestry','Anti-Lesbian, Gay, Bisexual, or Transgender (Mixed Group)','Anti-Asian','Anti-Lesbian (Female)','Anti-Islamic (Muslim)','Anti-American Indian/Alaska Native'].includes(d.BIAS_DESC)){
        
        new_data.push(d)

      }

      else{
        const element = d
        element["BIAS_DESC"] = "Other"
        new_data.push(element)
      }
    
    })

  return new_data
}

function get_contiguos_states(data){
  
  
  data.objects.states.geometries =
    data.objects.states.geometries.filter(
      (o) => o.properties.STUSPS != "DC"
    );
  data = topojson.feature(
    data,
    data.objects.states
  );

  return data;
}

function state_demo(data){
  const new_data = {}
  data.forEach(state => {
    new_data[state["state"]] = state["total"]
  })
  return new_data
}

function draw_Map(g, data_state, contig_states, races,size ){
  race_by_state = data_state.filter(d => d.race ==races)
  console.log(race_by_state)
  console.log(race_by_state)
  const {width, height} = size;
  

  const projection = d3.geoMercator().fitSize([width,height],contig_states)
  const path = d3.geoPath().projection(projection)

  const lines = g.append("g")
    .attr("fill","white")
    .attr("stroke","lightgrey")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.25);

  const color = d3.scaleQuantize(d3.schemeBlues[7])
  .domain([0,d3.max(race_by_state, d=>d["total"])])

  const state_demographics = state_demo(race_by_state)

  console.log(state_demographics)

  lines.selectAll("path")
    .data(contig_states.features)
    .join("path")
    .attr("d",path)
    .attr("fill", d=> color(state_demographics[d["properties"]["NAME"]]))
    .on("pointerenter", function (d) {
        console.log(d)
        d3.select(this).attr("stroke", "white").attr("stroke-width", 3).raise().append("title").text(d=>d["properties"]["NAME"]).style("font-size","20px");
      })
      .on("pointerleave", function () {
        d3.select(this).attr("stroke", "lightgrey").attr("stroke-width", 1);
      })
      ;

  


}

function draw_Map2(g, data_state, contig_states, races,size ){
  race_by_state = data_state.filter(d => d.race ==races)
  console.log(race_by_state)
  console.log(race_by_state)
  const {width, height} = size;
  

  const projection = d3.geoMercator().fitSize([width,height],contig_states)
  const path = d3.geoPath().projection(projection)

  const lines = g.append("g")
    .attr("fill","white")
    .attr("stroke","lightgrey")
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-width", 1.25);

  const color = d3.scaleQuantize(d3.schemeReds[6])
  .domain([0,d3.max(race_by_state, d=>d["total"])])

  const state_demographics = state_demo(race_by_state)

  console.log(state_demographics)

  lines.selectAll("path")
    .data(contig_states.features)
    .join("path")
    .attr("d",path)
    .attr("fill", d=> color(state_demographics[d["properties"]["NAME"]]))
    .on("pointerenter", function (d) {
        console.log(d)
        d3.select(this).attr("stroke", "white").attr("stroke-width", 3).raise().append("title").text(d=>d["properties"]["NAME"]).style("font-size","20px");
      })
      .on("pointerleave", function () {
        d3.select(this).attr("stroke", "lightgrey").attr("stroke-width", 1);
      })
      ;

  


}
       


function get_counts(data_set) {
  const new_array = []

  data_set.forEach((d) => {
    var found = Boolean(false)
    new_array.forEach((i)=>{
      if (d.BIAS_DESC === i.race & d.DATA_YEAR == i.DATA_YEAR){
        i.total = i.total+1
        found = true
        }
    })

    if (found ==false){
      new_array.push({race:d.BIAS_DESC, DATA_YEAR: d.DATA_YEAR, total:1})

    }
    
  })

  return new_array
  
}





function draw_total_US_HateCrimes(g, data, size){
  const margin = {left:165, right:15, top:15, bottom:40};
  const {width, height} = size;

  const data_by_year = get_data_by_year(data)



  const X = d3.scaleLinear()
    .domain(d3.extent(data_by_year, d=>d.DATA_YEAR))
    .range([margin.left, width - margin.right])
    .nice();

  const Y = d3.scaleLinear()
    .domain([0,d3.max(data_by_year,d=>d.total)])
    .range([height - margin.bottom, margin.top]);

  const total_line = d3.line()
    .x(d=> X(d.DATA_YEAR))
    .y(d=> Y(d.total))
  
  const xAxis = (g) =>
    g.attr("transform", `translate(0,${height - margin.bottom})`).call(
    d3
      .axisBottom(X)
      .ticks(width / 80)
      .tickFormat(d3.format("d"))
      .tickSizeOuter(0)
  )
  const yAxis = (g) =>
    g
      .attr("transform", `translate(${margin.left - 5},0)`)
      .attr('stroke', "aliceblue")
      .call(d3.axisLeft(Y).ticks(height / 70))
      .call(g => g.select(".domain").remove())
      .style('font-size', '0.8em')
      .style("font-color","aliceblue")

  g.append("path")
    .datum(data_by_year)
    .attr("fill","none")
    .attr("stroke","#57ACDC")
    .attr("stroke-width",3)
    .attr("stroke-linecap","round")
    .attr("d",total_line)
  
  g.append("g")
      .call(xAxis)

  g.append("g")
      .call(yAxis)
  
  g.append("text")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(${width/2 +30}, ${height - 5})`)
    .style("font-weight", "bold")
    .text("Year");

  g.append("text")
    .attr("text-anchor","middle")
    .attr("x",width/2)
    .attr("y",height/2)
    .attr("transform", "rotate(-90)")
    .style("font-weight", "bold")
    .text("Number of Hate Crimes");



  g.selectAll("text")
    .style("font-size","12px")
    .style("fill", "currentColor")

}


function draw_racing_line_chart(g,data,size){
  const margin = {left:70, right:70, top:15, bottom:40};
  const {width, height} = size;

  const Anti_Muslim_data = data.filter(d => d.race=="Anti-Islamic (Muslim)")
  const Combination = data.filter(d=>d.race =="Anti-Islamic (Muslim)" || d.race =="Anti-Hispanic or Latino")
  const X_scale = d3.scaleLinear()
    .domain(d3.extent(Anti_Muslim_data,d=>d.DATA_YEAR))
    .range([margin.left,width-margin.right])

  const Y_Scale = d3.scaleLinear()
    .domain([0,d3.max(Combination, d=> d.total)])
    .range([height-margin.bottom, margin.top])
    
  const Line = d3.line()
    .x(d=> X_scale(d.DATA_YEAR))
    .y(d=> Y_Scale(d.total))
  
  const Anti_Hispanic_data = data.filter(d => d.race == "Anti-Hispanic or Latino")




  
  const xAxis = (g) =>
    g.attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3
        .axisBottom(X_scale)
        .ticks(width / 80)
        .tickFormat(d3.format("d"))
        .tickSizeOuter(0)
      
    )
    .selectAll("text")
      .style("font-size","0.8em")

  const yAxis = (g) => 
    g
      .attr("transform", `translate(${margin.left - 5},0)`)
      .attr('stroke', "white")
      .call(d3.axisLeft( Y_Scale).ticks(height / 70))
      .call(g => g.select(".domain").remove())
      .style('font-size', '0.8em')
      .style("font-color","white")
      
  
 
  
  g.append('g')
    .call(xAxis)
  
  g.append("g")
    .call(yAxis)
    
  Anti_Muslim_data_part1 = Anti_Muslim_data.filter(d=> d.DATA_YEAR <=2001)
  Anti_Muslim_data_part2 = Anti_Muslim_data.filter(d=> d.DATA_YEAR >=2001 & d.DATA_YEAR<=2015)
  Anti_Muslim_data_part3 = Anti_Muslim_data.filter(d=>d.DATA_YEAR >=2015)

  Anti_Hispanic_data_part1 = Anti_Hispanic_data.filter(d=>d.DATA_YEAR <=2001)
  Anti_Hispanic_data_part2 = Anti_Hispanic_data.filter(d=>d.DATA_YEAR>=2001 & d.DATA_YEAR<=2015)
  Anti_Hispanic_data_part3 = Anti_Hispanic_data.filter(d=>d.DATA_YEAR>=2015)

  g.append("path")
    .datum(Anti_Muslim_data_part1)
    .attr("fill", "none")
    .attr("stroke", "#E91E63")
    .attr("stroke-width", 2.25)
    .attr("stroke-linecap","round")
    .attr("stroke-miterlimit",1)
    .attr("d",Line)
    .transition()
    .duration(5000)
    .attrTween("stroke-dasharray",(d,i,nodes)=>{
      const length = nodes[i].getTotalLength()
      return (t) => `${length*t},${length}`
    });

    g.append("path")
    .datum(Anti_Hispanic_data_part1)
    .attr("fill", "none")
    .attr("stroke", "#57ACDC")
    .attr("stroke-width", 2.25)
    .attr("stroke-linecap","round")
    .attr("stroke-miterlimit",1)
    .attr("d",Line)
    .transition()
    .duration(5000)
    .attrTween("stroke-dasharray",(d,i,nodes)=>{
      const length = nodes[i].getTotalLength()
      return (t) => `${length*t},${length}`
    });

    const dots = g.append("g")
      g.selectAll("dots")
      .data(Anti_Hispanic_data_part1)
      .join("circle")
      .attr("cx", d=> X_scale(d.DATA_YEAR))
      .attr("cy",d => Y_Scale(d.total))
      .attr("r",6)
      .attr("fill","#57ACDC")
      .attr("opacity",0)
      .transition()
      .duration(4000)
      .attr("opacity",1)
    
    const dots2 = g.append("g")
      g.selectAll("dots")
      .data(Anti_Muslim_data_part1)
      .join("circle")
      .attr("cx", d=> X_scale(d.DATA_YEAR))
      .attr("cy",d => Y_Scale(d.total))
      .attr("r",6)
      .attr("fill","#E91E63")
      .attr("opacity",0)
      .transition()
      .duration(4000)
      .attr("opacity",1)
      

  g.append("line")
    .attr("x1",X_scale(2001))
    .attr("y1",0)
    .attr("x2",X_scale(2001))
    .attr("y2",height -margin.top-26)
    .attr("opacity",0)
    .style("stroke-width",1.6)
    .style("stroke","white")
    .style("fill","none")
    .transition()
    .delay(5000)
    .duration(200)
    .ease(d3.easeLinear)
    .attr("opacity",.5)

  g.append("rect")
    .attr("x",X_scale(2001)+20)
    .attr("y", 3*height/4 )
    .attr("width", 120)
    .attr("height",60)
    .attr("opacity",0)
    .transition()
    .ease(d3.easeLinear)
    .delay(5500)
    .duration(200)
    .style("fill","white")
    .attr("opacity",1);
   
    g.append("rect")
    .attr("x",X_scale(2001)+40)
    .attr("y", 2.8*height/4 )
    .attr("width", 30)
    .attr("height",30)
    .style("fill","white")
    .attr("opacity",0)
    .attr("transform", "rotate(45,"+X_scale(2001)+40+","+2.8*height/4 +")")
    .transition()
    .ease(d3.easeLinear)
    .delay(5500)
    .duration(200)
    .style("fill","white")
    .attr("opacity",1);

    g.append("text")
    .attr("text-anchor","middle")
    .attr("x",X_scale(2001)+60)
    .attr("y",3*height/4 + 40)
    .style("font-weight", "bold")
    .attr("opacity",0)
    .style("font-color","black")
    .style("font-size",".8em")
    .text("2001:" +"\n"+" 9/11")
    .transition()
    .delay(5500)
    .duration(200)
    .style("fill","black")
    .attr("opacity",1);

    g.append("path")
    .datum(Anti_Muslim_data_part2)
    .attr("fill", "none")
    .attr("stroke", "#E91E63")
    .attr("stroke-width", 2.25)
    .attr("stroke-linecap","round")
    .attr("stroke-miterlimit",1)
    .attr("d",Line)
    .attr("opacity",0)
    .transition()
    .attr("opacity",1)
    .delay(5700)
    .duration(5000)
    .attrTween("stroke-dasharray",(d,i,nodes)=>{
      const length = nodes[i].getTotalLength()
      return (t) => `${length*t},${length}`
    });


    const dots3 = g.append("g")
      g.selectAll("dots")
      .data(Anti_Muslim_data_part2)
      .join("circle")
      .attr("cx", d=> X_scale(d.DATA_YEAR))
      .attr("cy",d => Y_Scale(d.total))
      .attr("r",6)
      .attr("fill","#E91E63")
      .attr("opacity",0)
      .transition()
      .delay(5700)
      .duration(4000)
      .attr("opacity",1)

      const dots4 = g.append("g")
      g.selectAll("dots")
      .data(Anti_Hispanic_data_part2)
      .join("circle")
      .attr("cx", d=> X_scale(d.DATA_YEAR))
      .attr("cy",d => Y_Scale(d.total))
      .attr("r",6)
      .attr("fill","#57ACDC")
      .attr("opacity",0)
      .transition()
      .delay(5700)
      .duration(4000)
      .attr("opacity",1)

    g.append("path")
    .datum(Anti_Hispanic_data_part2)
    .attr("fill", "none")
    .attr("stroke", "#57ACDC")
    .attr("stroke-width", 2.25)
    .attr("stroke-linecap","round")
    .attr("stroke-miterlimit",1)
    .attr("d",Line)
    .attr("opacity",0)
    .transition()
    .attr("opacity",1)
    .delay(5700)
    .duration(5000)
    .attrTween("stroke-dasharray",(d,i,nodes)=>{
      const length = nodes[i].getTotalLength()
      return (t) => `${length*t},${length}`
    });

    g.append("line")
    .attr("x1",X_scale(2015))
    .attr("y1",0)
    .attr("x2",X_scale(2015))
    .attr("y2",height -margin.top-26)
    .attr("opacity",0)
    .style("stroke-width",1.6)
    .style("stroke","white")
    .style("fill","none")
    .transition()
    .delay(10700)
    .duration(200)
    .ease(d3.easeLinear)
    .attr("opacity",.5);
   
    g.append("rect")
    .attr("x",X_scale(2013)+40)
    .attr("y", 2.8*height/4 )
    .attr("width", 30)
    .attr("height",30)
    .style("fill","white")
    .attr("opacity",0)
    .attr("transform", "rotate(45,"+X_scale(2013)+40+","+2.8*height/4 +")")
    .transition()
    .ease(d3.easeLinear)
    .delay(12700)
    .duration(200)
    .style("fill","white")
    .attr("opacity",1);

    g.append("rect")
    .attr("x",X_scale(2013)-85)
    .attr("y", 2.9*height/4 )
    .attr("width", 120)
    .attr("height",60)
    .attr("opacity",0)
    .transition()
    .ease(d3.easeLinear)
    .delay(12700)
    .duration(200)
    .style("fill","white")
    .attr("opacity",1);

    g.append("text")
    .attr("text-anchor","middle")
    .attr("x",X_scale(2014)-80)
    .attr("y",3*height/4+ 5 )
    .style("font-weight", "bold")
    .attr("opacity",0)
    .style("font-color","black")
    .style("font-size",".8em")
    .text("2015:")
    .transition()
    .delay(12700)
    .duration(200)
    .style("fill","black")
    .attr("opacity",1);

    g.append("text")
    .attr("text-anchor","middle")
    .attr("x",X_scale(2014)-45)
    .attr("y",3*height/4 +25)
    .style("font-weight", "bold")
    .attr("opacity",0)
    .style("font-color","black")
    .style("font-size",".8em")
    .text("Trump's Campaign")
    .transition()
    .delay(12700)
    .duration(200)
    .style("fill","black")
    .attr("opacity",1);

    const dots5 = g.append("g")
      g.selectAll("dots")
      .data(Anti_Hispanic_data_part3)
      .join("circle")
      .attr("cx", d=> X_scale(d.DATA_YEAR))
      .attr("cy",d => Y_Scale(d.total))
      .attr("r",6)
      .attr("fill","#57ACDC")
      .attr("opacity",0)
      .transition()
      .delay(11900)
      .duration(4000)
      .attr("opacity",1)
    
      const dots6 = g.append("g")
      g.selectAll("dots")
      .data(Anti_Muslim_data_part3)
      .join("circle")
      .attr("cx", d=> X_scale(d.DATA_YEAR))
      .attr("cy",d => Y_Scale(d.total))
      .attr("r",6)
      .attr("fill","#E91E63")
      .attr("opacity",0)
      .transition()
      .delay(11900)
      .duration(4000)
      .attr("opacity",1)
    

    g.append("path")
    .datum(Anti_Muslim_data_part3)
    .attr("fill", "none")
    .attr("stroke", "#E91E63")
    .attr("stroke-width", 2.25)
    .attr("stroke-linecap","round")
    .attr("stroke-miterlimit",1)
    .attr("d",Line)
    .attr("opacity",0)
    .transition()
    .attr("opacity",1)
    .delay(12700)
    .duration(2000)
    .attrTween("stroke-dasharray",(d,i,nodes)=>{
      const length = nodes[i].getTotalLength()
      return (t) => `${length*t},${length}`
    });

    g.append("path")
    .datum(Anti_Hispanic_data_part3)
    .attr("fill", "none")
    .attr("stroke", "#57ACDC")
    .attr("stroke-width", 2.25)
    .attr("stroke-linecap","round")
    .attr("stroke-miterlimit",1)
    .attr("d",Line)
    .attr("opacity",0)
    .transition()
    .attr("opacity",1)
    .delay(12700)
    .duration(2000)
    .attrTween("stroke-dasharray",(d,i,nodes)=>{
      const length = nodes[i].getTotalLength()
      return (t) => `${length*t},${length}`
    });


  g.append("image")
  .attr("xlink:href","https://pbs.twimg.com/media/DQjq67pVoAAEV3x.jpg")
  .attr("x",width/2 - 20)
  .attr("y",height/3+75)
  .attr("width",200)
  .attr("height",100)
  .attr("opacity",0)
  .transition()
  .delay(14700)
  .duration(200)
  .ease(d3.easeLinear)
  .attr("opacity",1);
  
  g.append("image")
  .attr("xlink:href","  https://ichef.bbci.co.uk/news/976/cpsprodpb/4880/production/_94006581_tweet.gif.webp")
  .attr("x",width/2 - 50)
  .attr("y",height/5+50 )
  .attr("width",200)
  .attr("height",100)
  .attr("opacity",0)
  .transition()
  .delay(14900)
  .duration(200)
  .ease(d3.easeLinear)
  .attr("opacity",1);

  g.append("text")
  .attr("text-anchor","middle")
  .attr("x",20)
  .attr("y",height/2)
  .style("font-weight", "bold")
  .attr("opacity",0)
  .style("font-color","white")
    .style("font-size",".8em")
    .text("Total Number of Hate Crimes")
    .style("fill","white")
    .attr("opacity",1)
    .attr("transform", "rotate(270,"+20+","+height/2 +")")
  
  g.append("circle")
    .attr("cx", margin.left+30)
    .attr("cy",height-150)
    .attr("r",4)
    .style("fill","#57ACDC")
  
    g.append("text")
    .attr("x", margin.left+95)
    .attr("y", height-143)
    .attr("font-color","#57ACDC")
    .text("Anti-Hispanic")
    .style("font-size","1em")
    .attr("text-anchor","middle")
    .style("fill","#57ACDC")
    .attr("opacity",1);

    g.append("circle")
    .attr("cx", margin.left+30)
    .attr("cy",height-130)
    .attr("r",4)
    .style("fill","#E91E63")
  
    g.append("text")
    .attr("x", margin.left+115)
    .attr("y", height-123)
    .attr("font-color","#E91E63")
    .text("Anti-Islamic (Muslim)")
    .style("font-size","1em")
    .attr("text-anchor","middle")
    .style("fill","#E91E63")
    .attr("opacity",1);
    


 

}









async function manageVisualizations(){
  

  const size = {
    width: 800,
    height:500
  }

  const speed = 1000;

  //importing data
  const imported_data = await d3.csv("data/hate_crime.csv");

  const hate_crimes = Clean_Data(imported_data);

  const biased_data = get_bias_data(hate_crimes)

  const racing_line_data = get_counts(biased_data)
  const contig_states_data = await d3.json("data/contiguous_states_tigerline.json")

  const contig_state_data_1 = get_contiguos_states(contig_states_data)
  console.log(contig_state_data_1)

  const state_norm_data = await d3.csv("data/state_norm.csv")




  const scroll = scroller();
  scroll(d3.selectAll("section"));

  const svg = d3.select("#vis")
  .append("svg")
  .attr("viewBox", [0, 0, size.width, size.height])
  .style("height", `${size.height}px`)
  .style("width", `${size.width}px`);

  const total_us_graph = svg.append("g");
    total_us_graph.call(draw_total_US_HateCrimes,hate_crimes,size)
    .attr("opacity",1)

  const Muslim_map = svg.append("g")
    .attr("opacity",0)

  const Hispanic_map = svg.append("g")
    .attr("opacity",0)
    

  const racing_line_chart = svg.append("g")
    .attr("opacity",0)

  scroll.on("section-change", (section)=>{
    console.log(section)
    switch(section){
      case 0:
        total_us_graph.transition()
        .ease(d3.easeLinear)
        .attr("opacity",1)
        .duration(speed)

        racing_line_chart
          .transition()
          .ease(d3.easeLinear)
          .attr("opacity",0)
          .duration(200)

          Muslim_map
          .transition()
          .ease(d3.easeLinear)
          .attr("opacity",0)
          .duration(200)

        break;
      
      case 1:
        total_us_graph.transition()
        .ease(d3.easeLinear)
        .attr("opacity",0)
        .duration(200)

        Muslim_map.transition()
        .ease(d3.easeLinear)
        .attr("opacity",0)
        .duration(200)

        draw_racing_line_chart(racing_line_chart,racing_line_data,size)
        racing_line_chart.transition()
        .delay(900)
        .ease(d3.easeLinear)
        .attr("opacity",1)
        .duration(1200)



        
        break;

      case 2:
        console.log("2")
        total_us_graph.transition()
          .ease(d3.easeLinear)
          .attr("opacity",0)
          .duration(speed)
        
          racing_line_chart.transition()
          .ease(d3.easeLinear)
          .attr("opacity",0)
          .duration(speed)

          draw_Map(Muslim_map, state_norm_data, contig_state_data_1, "Anti-Islamic (Muslim)",size)
          Muslim_map.transition()
          .duration(800)
          .ease(d3.easeLinear)
          .attr("opacity",1)

          Hispanic_map.transition()
            .duration(100)
            .ease(d3.easeLinear)
            .attr("opacity",0)


          
        break;
      
        case 3:
          Muslim_map.transition()
          .duration(200)
          .ease(d3.easeLinear)
          .attr("opacity",0)

          total_us_graph.transition()
        .ease(d3.easeLinear)
        .attr("opacity",0)
        .duration(200)

          draw_Map2(Hispanic_map,state_norm_data,contig_state_data_1,"Anti-Hispanic or Latino",size)
          Hispanic_map.transition()
          .duration(600)
          .ease(d3.easeLinear)
          .attr("opacity",1)
        break;
        
    }

  });

}




manageVisualizations();