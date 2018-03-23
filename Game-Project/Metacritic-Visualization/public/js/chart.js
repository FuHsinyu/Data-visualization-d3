let pointer_precision = 20;
let reasonable_amount = 50;
let tip_offset = {
	x: -30,
	y: 50
}

let max_position = Number.MAX_VALUE;

class Chart
{
    constructor(height = 600)
    {
		let self = this;
		
        self.width = width;
		self.height = height;
		let range = [self.height - 100, font_size]
		self.scales = {
			'title': d3.scalePoint()
						.range(range),
				
			'metascore': d3.scaleLinear()
						.range(range)
						.domain([0, 100]),

			'userscore': d3.scaleLinear()
						.range(range)
						.domain([0, 100]),

			'critic_reviews_count': d3.scaleLinear()
						.range(range),
		
			'user_reviews_count': d3.scaleLinear()
						.range(range),
									
			'sales': d3.scaleLog()
						.range(range),
			
			'developer': d3.scalePoint()
						.range(range),
			
			'publisher': d3.scalePoint()
						.range(range)}
		
		self.domain = Object.keys(self.scales);
		
		self.xscale = d3.scalePoint()
			.range([50 , self.width - 50])
			.domain(self.domain);
				
		self.svg = d3.select('#chart')
			.append('svg')
			.attr('class', 'chart')
			.attr('id', 'chart_svg')
			.attr('transform', 'translate(' + xmargin + ', ' + ymargin + ')')
			.attr('width', 1.5 * width + xmargin)
			.attr('height', height + ymargin);
		
		checkbox = self.svg
			.append('g')
			.attr('transform', 'translate(50, 30)')
			.style('opacity', default_opacity);
		
		checkbox.data([true]); // ?
		
		checkbox.append('circle')
			.attr('r', button_radius)
			.attr('fill', '#ffffff')
			.attr('stroke', '#000000')
			.attr('stroke-width', '1px');
			
		checkbox.append('text')
            .attr('text-anchor', 'start')
            .attr('x', button_radius + 10)
            .attr('y', font_size / 2)
            .attr('font-size', font_size)
            .attr('fill', '#000')
            .text('Aggregate');

		let circle = checkbox.append('circle')
			.attr('class', 'indicator')
			.attr('r', button_radius - 5)
			.attr('fill', '#ff0000');
		
		checkbox
			.on('mouseover', function(d)
			{
				if (aggregate && global_length > 1000)
				{
					self.tooltip
						.style('left', (d3.event.pageX + 20) + 'px')
						.style('top', (d3.event.pageY + 30) + 'px')
						.style('display', 'inline')
						.text('bad    idea');
				}

				checkbox.call(highlight_toggle, true, duration/2, 0);
			})
			.on('mouseleave', function(d)
			{
				self.tooltip
					.style('display', 'none');
				checkbox.call(highlight_toggle, false, duration/2, 0);
			})
			.on('click', function(d)
			{
				if (d)
				{
					aggregate = !aggregate;
					let r = aggregate ? button_radius - 5 : 0;
					circle.transition()
						.duration(duration)
						.attr('r', r);
					self.donut.chart_update();
				}
			});
		
		self.axes = self.svg
			.append('g')
			.attr('class', 'axes')
			.style('opacity', default_opacity);
		
		self.lines = self.svg.append('g')
			.attr('class', 'lines')
			.attr('transform', 'translate(0, ' + (button_radius + 5 * font_size) + ')');
		
		self.lines
			.append('rect')
			.attr('width', self.width)
			.attr('height', self.height)
			.attr('fill', '#ffffff')
			.style('opacity', 0);
		
		self.domain.forEach(function(d)
		{			
			let g = self.axes.append('g')
				.attr('class', 'axis ' + classify(d))
				.attr('transform', 'translate(' + self.xscale(d) + ', ' + (button_radius + 5 * font_size) + ')');
				
			g.append('text')
				.attr('x', 0)
				.attr('y', 0)
				.attr('text-anchor', 'middle')
				.attr('font-size', font_size + 'px')
				.attr('fill', '#000')
				.text(d);
		});
				
		self.tooltip = d3.select('body')
			.append('div')
			.attr('class', 'chart tooltip')
			.style('display', 'none');
		
		// for the pathfinding algorithm
		self.xs = self.domain.map(self.xscale);
		self.selected = null;
	}
	
    update(data)
    {
		let self = this;
				
		d3.selectAll('.scale').remove();
		
		let tick_data = {
			title: 		{},
			developer: 	{},
			publisher: 	{}
		}
	
		let interval = Math.ceil(data.length / reasonable_amount);
		// to avoid repeating ticks
		for (let i = 0; i < data.length; i += interval)
		{
			tick_data.title[data[i].title] = true;
			tick_data.developer[data[i].developer] = true;
			tick_data.publisher[data[i].publisher] = true;
		}
		
		self.scales['title']
			.domain(data.map(function(d) { return d.title; }));
		
		let extent = d3.extent(data, function(d) {return d['critic_reviews_count'];});
		self.scales['critic_reviews_count']
			.domain([extent[0] - 1, extent[1] + 1]);
		
		extent = d3.extent(data, function(d) {return d['user_reviews_count'];});
		self.scales['user_reviews_count']
			.domain([extent[0] - 1, extent[1] + 1]);
		
		extent = d3.extent(data, function(d) {return d.sales;});
		self.scales['sales']
			.domain([extent[0] - 1, extent[1] + 1]);
		
		self.scales['developer']
			.domain(data.map(function(d) { return d.developer; }));
	
		self.scales['publisher']
			.domain(data.map(function(d) { return d.publisher; }));
		
		self.domain.forEach(function(d)
		{
			let ticks = d in tick_data ? Object.keys(tick_data[d]) : null;
						
			let axis = d3.axisRight(self.scales[d])
				.tickValues(ticks)
				.tickFormat(function(p)
				{
					let max_length = 20;
					p = '' + p;
					return p.length < max_length ? p : p.slice(0, max_length - 3) + '...';
				});
				
			d3.select('.' + classify(d))
				.call(axis);
		});
		
		let lines = self.lines
			.selectAll("path")
			.data(data, function(d) {return d.title + d.platform;});
		
		lines.exit()
			.remove();

		lines = lines.enter()
			.append('path')
			.attr('fill', 'none')
			.merge(lines);
		
		let lines_arr = [];
		
		lines.each(function(d)
		{
			let line = d3.select(this);
			let datum = line.datum();
			
			datum.trajectory = [];
			
			let path = '';
			
			self.domain.forEach(function(p)
			{
				let x = self.xscale(p);
				let y = self.scales[p](d[p]);
				
				datum.trajectory.push([x, y]);
				
				path += (path.length > 0 ? 'L ' : 'M ') + x + ' ' + y + ' ';
			});
			
			line.attr('d', path);
			lines_arr.push(line);
		})
		.attr('stroke', function(d) {return color(d[global_key]);})
		.attr('stroke-width', '1px')
		.style('opacity', default_opacity);
		
		self.lines.on('mousemove', function()
		{
			// Would be nice to implement some actual spacial partition here
			// Quadtree ?
			// Now it's pretty much 1D 'collision detection'
			
			let mouse = d3.mouse(this);
			let index = 0;
			
			while (++index < self.xs.length - 1 && self.xs[index] < mouse[0]) {}
			
			
			let selected = null;
			let min_distance = pointer_precision;
			
			lines_arr.forEach(function(line)
			{
				let t = line.datum().trajectory;
				let points = [t[index - 1], t[index]];
				let k = (points[1][1] - points[0][1]) / (points[1][0] - points[0][0]);
				let y = points[0][1] + k * (mouse[0] - points[0][0]);
				let dif = mouse[1] > y ? mouse[1] - y : y - mouse[1];
				
				if (dif < min_distance)
				{
					min_distance = dif;
					selected = line;
				}
			});

			if (selected)
			{
				let test_position = d3.event.pageY + tip_offset.y;
				
				self.tooltip
					.style('left', self.width + 'px')
					.style('top', (test_position < max_position ?
						test_position : max_position) + 'px');
				
				if (selected != self.selected)
				{
					if (self.selected)
					{
						self.selected
							.attr('stroke-width', '1px')
							.style('opacity', default_opacity);
					}
					
					let data = selected._groups[0][0].__data__;
					
					let text = ''
					
					Object.keys(data).forEach(function(d)
					{
						if (d != 'trajectory')
						{
							let tmp = '' + data[d];
							if (d === 'sales')
							{
								let info = [tmp.length, '']
								
								let len = tmp.length;
								
								info = 	info[0] < 7 ? [info[0] - 3, 'k'] :
										info[0] < 10 ? [info[0] - 6, 'm'] : 
										[info[0] - 9, 'b'];
										
								tmp = tmp.substr(0, info[0]) + '.' + tmp.substr(info[0], 2) + info[1];
							}
							text += d + ':    ' + tmp + '\n';
						}
					});

					self.tooltip
						.text(text)
						.style('display', 'inline');
					
					let bbox = self.tooltip.node().getBoundingClientRect();
					let tip_height = bbox.bottom - bbox.top;
					max_position = body_bottom - tip_height;
					
					selected
						.attr('stroke-width', '3px')
						.style('opacity', 1);										
				}
			}
			else if (self.selected)
			{
				self.selected
					.attr('stroke-width', '1px')
					.style('opacity', default_opacity);
				
				self.tooltip
					.style('display', 'none');
			}

			self.selected = selected;

		});
	}
}
