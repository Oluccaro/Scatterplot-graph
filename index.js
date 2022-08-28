const projectName = 'scatterplot-Graph';

/*Here we're going to get the dataset to use on our datachart */
//Here is our data URL;

const dataURL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

// This will fetch the data as soon as the the document load;

async function getData(url){
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

async function main(){
  // Getting data
  
  let data = await getData(dataURL)
  
  // setting up width, height and padding
  
  const w = 1000;
  const h = 560;
  const p = 35;
  
  // setting x and y scales
  // in the x-axis we're plotting the years
  
  let startYear = d3.min(data, (d)=>d.Year);
  let lastYear = d3.max(data, (d)=>d.Year);

  const xScale = d3.scaleLinear()
                   .domain([startYear-1,lastYear])
                   .range([p,w-p]);
  // in the y-axis we're plotting the time
  
  let firstTime = d3.min(data, (d)=> d.Seconds);
  let lastTime = d3.max(data, (d)=> d.Seconds);
  console.log(firstTime)
  console.log(lastTime)
  const yScale = d3.scaleLinear()
                   .domain([lastTime+5, firstTime])
                   .range([h-p,p]);
  
  //Starting the SVG canvas and tooltip
  
  const svg = d3.select("#scatterPlot")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("id", "svgPlotArea");
  
  const tooltip = d3.select("#scatterPlot")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0);
  
  
  
//Here we're going to make the dots with data.
  
 svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d)=> xScale(d.Year)+20)
    .attr("cy",(d)=> yScale(d.Seconds))
    .attr("r", 7)
    .attr("stroke", "black")
    .attr("stroke-width", "1px")
    .style("opacity", 0.8)
    .attr("id",(d,i)=>{`dot-${i}`})
    .attr("fill", (d)=>{
    if(d.Doping!="") return "orangered";
    if(d.Doping=="") return "steelblue";
 })
    .attr("class","dot")
    .attr("data-xvalue", (d)=>d.Year)
    .attr("data-yvalue",function(d){
    let min = new Date(d.Seconds*1000)
    return min})
    .on("mouseover", (event,d,i)=>{
    svg.select(`#dot-${i}`).style("opacity", 0);
    tooltip.attr("data-year", d.Year);
    tooltip.style("opacity", 0.9)
           .style("left", event.pageX +15+ "px")
           .style("top", event.pageY+ "px")
   tooltip.html(
     "<p> #" + d.Place + " " + d.Name + " | " + d.Nationality + "</p>" +
     "<p>Year: " + d.Year + ", Time: " + d.Time + "</p>"+
     (d.Doping!=""? "<br/><p>" + d.Doping + "</p>": "" )
   )
           
 })
  .on("mouseout",()=>{
   tooltip.style("opacity", 0)
 })
  

  // calling the x-axis and y-axis
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  svg.append("g")
     .attr("id", "x-axis")
     .attr("transform","translate(20,"+(h-p)+")")
     .call(xAxis);
  
  const yAxis = d3.axisLeft(yScale).tickFormat(function(d){
    let minutes = ~~(d/60);
    let seconds = d%60;
    return (minutes + ":" + (seconds<10? "0" + seconds: seconds))
  });
  svg.append("g")
     .attr("id","y-axis")
     .attr("transform", "translate("+(p+20)+",0)")
     .call(yAxis.ticks(11));
  } 

main();