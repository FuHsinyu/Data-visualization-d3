
class Timeline
{
    constructor(donut, height = 70)
    {
		let self = this;
		
        self.margin = 100;
		
        self.donut = donut;
        self.donut.timeline = self;
        
		self.svg = d3.select('#timeline')
			.append('svg')
			.attr('transform', 'translate(' + xmargin + ', ' + ymargin + ')')
			.attr('width', width + xmargin)
            .attr('height', height + ymargin)
            .style('opacity', default_opacity);

        let min = d3.min(self.donut.data, function (d) { return +Date.parse(d.released); });
        let max = d3.max(self.donut.data, function (d) { return +Date.parse(d.released); });
        
		self.selection = [min, max];
		self.filter();

        let scale = d3.scaleTime().range([self.margin, width - self.margin]).domain([min, max]);
        let scale_reversed = d3.scaleLinear().range([min, max]).domain([self.margin, width - self.margin]);

        let time_axis = d3.axisBottom(scale)
			.ticks(d3.timeMonth.every(3))    
			.tickFormat(date);

        let brush = d3.brushX()
            .on("end", brushed)
            .extent([[0, 0], [width, height]]);

        let g = self.svg.append("g")
			.attr("class", "brush");
			
		g.append('rect')
			.attr('width', width - 2)
			.attr('height', height - 2)
			.attr('fill', 'none')
			.attr('stroke', '#000')
			.attr('stroke-width','1px');
		
		g.append('text')
			.attr('x', width / 2)
			.attr('y', height / 3)
			.attr('text-anchor', 'middle')
			.attr('font-size', font_size + 'px')
			.attr('fill', '#000')
			.attr('xml:space', 'preserve')
			.text('Release    date    selection');
		
		g.append("g")
            .attr("transform", "translate(0, " + height / 2 + ")")
			.attr('xml:space', 'preserve')
            .call(time_axis);
            
        g.call(brush);

        function brushed()
		{
			let selection = d3.brushSelection(d3.select('.brush').node());
			let selection_min = selection ? scale_reversed(selection[0]) : min;
			let selection_max = selection ? scale_reversed(selection[1]) : max;
			self.selection = [selection_min, selection_max];
			self.donut.update();
		}
		
		self.donut.update();
    }
    
    filter()
    {
		let self = this;
		
		let min = self.selection[0];
		let max = self.selection[1];

		self.filtered = self.donut.current.filter(function (d)
		{
			let date = +Date.parse(d.released);
			return date >= min && date <= max;
		})
		
		return self.filtered;
	}
}

function date(d)
{
    let result = new Date(d);
    result = result.toDateString().split(' ');
    return result[1] === 'Jan' ? result[3] : '';
}
