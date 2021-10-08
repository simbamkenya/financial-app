async function drawChart(){
    const data = await fetch('https://cloud.iexapis.com/stable/stock/BAC/intraday-prices?token=pk_a1f08a9c3a4b4527aeb4fa8b80c9b58f&chartLast=20')
    .then(res => res.json())
    .then(data => {
        return data.slice(0, 18)
    })

    console.log(data)

    // const dateParse = d3.timeParse("%Y-%m-%d")
    const dateParse = d3.timeParse("%H:%M")
    
    //Data accessor 
    const timeAccessor = d => dateParse(d.minute)
    console.log(timeAccessor(data[0]))
    
    // .replace(":","");

    const lowPriceAccessor = d => d.low;
    const highPriceAccessor = d => d.high;

    const openPriceAccessor = d => d.open
    const closePriceAccessor = d => d.close
    // console.log(d3.extent(data, closePriceAccessor))

    //
    const margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = window.innerWidth * 0.95 - margin.left - margin.right,
    height = window.innerHeight * 0.95 - margin.top - margin.bottom;

    const svg = d3.select('#chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    //scales 

    // console.log(d3.max(data, Math.max(d => d.low, d => d.high)))
    const yExtent = [d3.max(data, highPriceAccessor), d3.min(data, lowPriceAccessor)]
    
    // console.log(yExtent)
    const yScale = d3.scaleLinear()
                    .domain(yExtent)
                    .range([height, 0])
    

    const xScale = d3.scaleTime()
                    .domain(d3.extent(data, timeAccessor))
                    .range([0, width])
    
    //axes
    const xAxisGenerator = d3.axisBottom().scale(xScale)
    const yAxisGenerator = d3.axisLeft().scale(yScale)

    const xAxis = svg.append('g')
                .call(xAxisGenerator)
                .attr('transform', `translate(0, ${height})`)
    const yAxis = svg.append('g')
                .call(yAxisGenerator)

//     const lineGenerator = d3.line()
//                             .x(d => xScale(timeAccessor(d)))
//                             .y(d => yScale(highPriceAccessor(d)))

//    //drawing data
//     svg.append('path')
//             .attr('d', lineGenerator(data))
//             .style('fill', 'none')
//             .attr('stroke', 'red')
//             .attr('stroke-width', '1.5')


    //line 2
    // const lineHighLowGenerator = d3.line()
    //                         .style("stroke", "lightgreen")
    //                         .style("stroke-width", 10)
    //                         .x1(d => xScale(PriceAccessor(d)))
    //                         .y1(d => yScale(highPriceAccessor(d)))
    //                         .x2(d => xScale(PriceAccessor(d)))
    //                         .y(d => yScale(highPriceAccessor(d)))
    
    
    //LINES
    const lines = svg.append('g')
                    .selectAll('g')
                    .data(data)
                    .join('g')
                    .attr('transform', d => `translate(${xScale(timeAccessor(d))}, 0)`)
        
        
    lines.append('line')
                .attr("stroke-linecap", "square")
                .attr("stroke", "black")
                .attr('stroke-width', 2)
                .attr("y1", d => yScale(highPriceAccessor(d)))
                .attr("y2", d => yScale(lowPriceAccessor(d)));


                
                // .attr('transform', d => `translate(${xScale(timeAccessor)})`)
    //CANDLE STICKS
    const candle = lines.append('line')
                .attr("stroke-linecap", "square")
                .attr("stroke",  d => d.open > d.close ? "green" : "red")
                .attr('stroke-width', 10)
                    .attr('y1', d => yScale(closePriceAccessor(d)))
                    .attr('y2', d => yScale(openPriceAccessor(d)))
                    // .attr('stroke-width', 10)


                    // attr("stroke", (d => closePriceAccessor(d)) >  (d => closePriceAccessor(d) ? "green" : "red"));




    
    
}
drawChart()