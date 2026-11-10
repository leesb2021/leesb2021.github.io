// Average daily temperature in Seoul by month (°C)
// Source: Korea Meteorological Administration, 1991–2020 climate normals
const data = [
  { month: "Jan", temp: -2.0 },
  { month: "Feb", temp: 0.7 },
  { month: "Mar", temp: 6.1 },
  { month: "Apr", temp: 12.6 },
  { month: "May", temp: 18.2 },
  { month: "Jun", temp: 22.7 },
  { month: "Jul", temp: 25.3 },
  { month: "Aug", temp: 26.1 },
  { month: "Sep", temp: 21.7 },
  { month: "Oct", temp: 15.0 },
  { month: "Nov", temp: 7.5 },
  { month: "Dec", temp: 0.2 }
];

const width = 640;
const height = 360;
const margin = { top: 20, right: 20, bottom: 50, left: 60 };

const svg = d3.select("#temp-chart")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("role", "img")
  .attr("aria-label", "Bar chart of Seoul's average temperature by month");

// Scales
const x = d3.scaleBand()
  .domain(data.map(d => d.month))
  .range([margin.left, width - margin.right])
  .padding(0.2);

const y = d3.scaleLinear()
  .domain([-5, 30])
  .range([height - margin.bottom, margin.top]);

// Cold months in blue, hot months in red
const color = d3.scaleSequential()
  .domain([30, -5])
  .interpolator(d3.interpolateRdYlBu);

// Horizontal gridlines
svg.append("g")
  .attr("class", "grid")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y).ticks(7).tickSize(-(width - margin.left - margin.right)).tickFormat(""));

// Bars (start at 0 so below-freezing months go downward)
const tooltip = d3.select("#temp-chart")
  .append("div")
  .attr("class", "tooltip");

svg.selectAll("rect")
  .data(data)
  .join("rect")
  .attr("x", d => x(d.month))
  .attr("y", d => y(Math.max(0, d.temp)))
  .attr("width", x.bandwidth())
  .attr("height", d => Math.abs(y(d.temp) - y(0)))
  .attr("fill", d => color(d.temp))
  .attr("rx", 3)
  .on("mouseover", (event, d) => {
    tooltip.style("opacity", 1).html(`<strong>${d.month}</strong>: ${d.temp} °C`);
  })
  .on("mousemove", (event) => {
    const box = document.getElementById("temp-chart").getBoundingClientRect();
    tooltip
      .style("left", `${event.clientX - box.left + 12}px`)
      .style("top", `${event.clientY - box.top - 28}px`);
  })
  .on("mouseout", () => tooltip.style("opacity", 0));

// Zero line (freezing point)
svg.append("line")
  .attr("class", "zero-line")
  .attr("x1", margin.left)
  .attr("x2", width - margin.right)
  .attr("y1", y(0))
  .attr("y2", y(0));

// Axes
svg.append("g")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x));

svg.append("g")
  .attr("transform", `translate(${margin.left},0)`)
  .call(d3.axisLeft(y).ticks(7));

// Axis labels
svg.append("text")
  .attr("class", "axis-label")
  .attr("x", (width + margin.left - margin.right) / 2)
  .attr("y", height - 10)
  .attr("text-anchor", "middle")
  .text("Month");

svg.append("text")
  .attr("class", "axis-label")
  .attr("transform", "rotate(-90)")
  .attr("x", -(height - margin.bottom + margin.top) / 2)
  .attr("y", 18)
  .attr("text-anchor", "middle")
  .text("Average temperature (°C)");
