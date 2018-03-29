
let dif = 10;

let legend_margin = 40;
let legend_padding = 5;

class Donut
{
	constructor(data, chart, height = 400)
	{
		let self = this;
        self.chart = chart;

		self.arc = d3.arc().padAngle(0.02);

        self.data = data.slice();
        self.current = data.slice();
        
        self.width = width;
		self.height = height;
        self.radius = self.height / 3;
        self.radius = self.height / 3;

		self.svg = d3.select('#donut')
			.append('svg')
			.attr('transform', 'translate(' + xmargin + ', ' + ymargin + ')')
			.attr('width', width + xmargin)
            .attr('height', height + ymargin);
		
		self.svg.append('text')
            .attr('class', 'label')
            .attr('text-anchor', 'middle')
            .attr('x', self.width / 2)
            .attr('y', 2 * font_size)
            .attr('font-size', font_size + 'px')
            .attr('fill', '#000')
			.attr('xml:space', 'preserve')
            .style('opacity', default_opacity);
            
		self.donut = self.svg.append('g')
            .attr('class', 'donut interactive')
			.attr('transform', function(d, i)
			{
				return 'translate(' + self.width * (1/3) + ', ' + self.height / 2 + ')';
			});
				
        let hole = self.donut
            .append('g')
			.style('opacity', default_opacity);
			
        hole.append('text')
            .text('0')
            .attr('class', 'counter')
            .attr('text-anchor', 'middle')
            .attr('y', -font_size / 2)
            .attr('font-size', font_size + 'px');

        hole.append('text')
            .text('games')
            .attr('text-anchor', 'middle')
            .attr('y', font_size / 2)
            .attr('font-size', font_size + 'px');

		self.legend_height = self.height - 2 * legend_margin;
		self.legend_width = self.width / 3 - 2 * legend_margin;
		
		self.legend = self.svg
			.append('g')
            .attr('class', 'legend interactive')
			.attr('transform', function(d, i)
			{
				return 'translate(' + (self.width - self.legend_width - legend_margin) + ', ' + legend_margin + ')';
			});
		
		self.tooltip = d3.select('body')
			.append('div')
			.attr('class', 'donut tooltip')
			.style('display', 'none');
			
		self.legend.append('rect')
			.attr('width', 2 * self.radius)
			.attr('height', self.legend_height)
			.attr('fill', 'none')
			.attr('stroke', '#000')
			.attr('stroke-width','1px')
			.attr('opacity', default_opacity);
		
		self.legend_scale = d3.scaleBand()
			.range([legend_padding , self.legend_height - legend_padding])
			.domain(range(19))
			.padding(.3);
	}

	update()
    {
        let self = this;
        
        if (filter.platform != '.*')
        {
			if (d3.select('.backbutton').size() == 0)
			{
				let button = self.svg
					.append('g')
					.attr('class', 'backbutton')
					.attr('transform', 'translate(50, 70)')
					.style('opacity', default_opacity);
								
				let circle = button.append('circle')
					.attr('r', 0)
					.attr('fill', '#ff0000')
					.attr('stroke', '#000000')
					.attr('stroke-width', '1px');
				
				circle.transition('enter')
					.duration(duration)
					.attr('r', button_radius);
					
				let label = button.append('text')
		            .attr('text-anchor', 'start')
		            .attr('x', button_radius + 10)
		            .attr('y', font_size / 2)
		            .attr('font-size', '0px')
					.attr('xml:space', 'preserve')    
					.attr('fill', '#000')
		            .text('Go    back');
		        
				label.transition('enter')
					.duration(duration)
		            .attr('font-size', font_size + 'px');
		            
				button
					.on('mouseover', function()
					{
						button.call(highlight_toggle, true, duration/2, 0);
					})
					.on('mouseleave', function()
					{
						button.call(highlight_toggle, false, duration/2, 0);
					})
					.on('click', function()
					{
						aggregation_toggle(true);
						
						if (filter.genre == '.*')
						{
							global_key = 'platform'
							filter.platform = '.*';
							
							circle
								.transition('exit')
								.duration(duration)
								.attr('r', 0);
							
							label
								.transition('exit')
								.duration(duration)
								.attr('font-size', '0px')
								.on('end', function()
								{
									button.remove();
								});
						}
						else
						{
							filter.genre = '.*';						
						}
						
						self.filter();
						self.update();
					});
			}
		}
        
        let data = self.timeline.filter();
        
        global_length = data.length;
        
		data = d3.nest()
			.key(function (d) { return d[global_key]; })
			.entries(data);
		
		let legend = self.legend.selectAll('.legend_entry')
			.data(data, function(d)
			{
				return d.key;
			});

		legend.exit()
			.attr('class', '')
			.attr('pointer-events', 'none')
			.transition('exit')
			.duration(duration)
			.attr('opacity', 0)
			.attr('transform', 'translate(' + legend_padding + ', ' + self.legend_height + ')')
			.remove();
		
		let legend_enter = legend.enter()
			.append('g')
			.attr('pointer-events', 'none')
			.attr('class', function(d)
			{
				return 'legend_entry ' + classify(d.key);
			})
			.attr('opacity', 0)
			.attr('transform', 'translate(' + legend_padding + ', 0)');
		
		legend_enter.on('mouseover', function(d)
			{
				self.highlight(d.key, true, duration / 2, 0);
			})
			.on('mouseleave', function(d)
			{
				self.highlight(d.key, false, duration / 2, duration / 3);
			})
			.on('click', function(d)
			{
				self.click(d.key, d.values);
			});
			
		let rect_dim = self.legend_scale.bandwidth();
		
		legend_enter.append('rect')
			.attr('fill', 'white')
			.attr('width', self.legend_width)
			.attr('height', rect_dim + 2);

		legend_enter.append('rect')
			.attr('stroke', '#000')
			.attr('stroke-width', '1px')
			.attr('fill', function(d) { return color(d.key); })
			.attr('width', rect_dim)
			.attr('height', rect_dim);
		
		legend_enter.append('text')
			.attr('fill', '#000')
			.attr('x', 2 * legend_padding + rect_dim)
			.attr('y', rect_dim)
			.attr('font-size', font_size)
			.text(function(d) { return d.key; } );
			
		legend = legend_enter.merge(legend);

		legend
			.attr('pointer-events', 'none')
			.transition('update')
			.duration(duration)
			.attr('opacity', default_opacity)
			.attr('transform', function(d, i)
			{
				return 'translate(' + legend_padding + ', ' + self.legend_scale(i) + ')';
			})
			.on('end', function()
			{
				legend.attr('pointer-events', null);
			});

		self.svg.select('.label')
			.text('Platform:    ' + (filter.platform === '.*' ? 'All' : filter.platform)
				+ ',    Genre:    ' + (filter.genre === '.*' ? 'All' : filter.genre));
        
        let prev = {};
        
        self.donut.selectAll('path').data().forEach(function(d)
        {
			prev[d.data.key] = {
				'radius': d.current_radius,
				'startAngle': d.current_startAngle,
				'endAngle': d.current_endAngle
			};
		});

        let min = d3.min(data, function (d) { return d.values.length; });
        let max = d3.max(data, function (d) { return d.values.length; });

        let pie = d3.pie()
            .sort(function (a, b) { return d3.ascending(a.key, b.key); })
            ////////////////////////////////////////////////////////////////////////////////////////
            //      f(len) = (dif - 1) * len / (max - min) + (max - dif * min) / (max - min)      //
            //                                                                                    //
            //                          len = min -> f(len) = 1                                   //
            //                          len = max -> f(len) = dif                                 //
            ////////////////////////////////////////////////////////////////////////////////////////
            .value(function (d) 
            {
				let result = max === min ? 1 : ((dif - 1) * d.values.length + max - dif * min) / (max - min);
				return result;
			})(data);

		pie.forEach(function(d)
        {
            if (d.data.key in prev)
            {
                d.current_radius = prev[d.data.key]['radius'];
                d.current_startAngle = prev[d.data.key]['startAngle'];
                d.current_endAngle = prev[d.data.key]['endAngle'];
            }
            else
            {
                d.current_radius = self.radius;
                d.current_startAngle = 0;
                d.current_endAngle = 0;
            }
        });

        let counter = d3.select('.counter')
            .transition('update')
            .duration(duration)
            .tween('text', function (d)
            {
                let that = d3.select(this);
                let interp = d3.interpolate(+that.text(), self.timeline.filtered.length);
                return function (t)
                {
                    that.text(Math.floor(interp(t)));
                }
            });

		let ring = self.donut.selectAll('.ring')
            .data(pie, function (d)
            {
                return d.data.key;
            });

		ring.each(function(d)
        {
			let r = d3.select(this);
			
			r.attr('pointer-events', 'none')
			.transition('update')
			.duration(duration)
			.attrTween('d', self.arc_tween(self.radius, d.startAngle, d.endAngle))
			.on('end', function()
			{
				r.attr('pointer-events', null);
			});
		});

		ring.exit()
		//	.attr('class', '')
			.each(function(d)
			{
				let r = d3.select(this);
				
				r.attr('pointer-events', 'none')
				.transition('exit')
				.duration(duration)
				.attrTween('d', self.arc_tween(self.radius, d.startAngle, d.startAngle))
				.remove();
			});

		ring.enter()
			.append('path')
			.attr('class', function(d)
			{
				return 'ring ' + classify(d.data.key);
			})
			.style('fill', function(d) { return color(d.data.key); } )
			.style('opacity', default_opacity)
			.each(function(d)
			{
				let path = d3.select(this);
						
				path
					.attr('pointer-events', 'none')
					.transition('enter')
					.duration(duration)
					.attrTween('d', self.arc_tween(self.radius, d.startAngle, d.endAngle))
					.on('end', function()
					{
						path.attr('pointer-events', null);
					});
						
				path.on('mouseover', function(d)
				{
					let text = d.data.key + '\n' + d.data.values.length + '   games';
					
					self.highlight(d.data.key, true, duration / 2, 0);
					self.tooltip
						.style('left', (d3.event.pageX + 50) + 'px')
						.style('top', (d3.event.pageY - 50) + 'px')
						.style('display', 'inline')
						.text(text);
				})
				.on('mouseleave', function(d)
				{
					self.highlight(d.data.key, false, duration / 2, duration / 3);
					self.tooltip
						.style('display', 'none');
				})
				.on('click', function(d)
                {
                    self.click(d.data.key, d.data.values);
				});
			});
		
		self.chart_update();
	}
	
	chart_update()
	{
		let self = this;
		
		if (aggregate)
		{
			let aggregated_data = d3.nest()
				.key(function(d) { return d[global_key]; })
				.rollup(function(d)
				{
					let min = d3.min(d, function (p) { return +Date.parse(p.released); });
					let max = d3.max(d, function (p) { return +Date.parse(p.released); });

					min = (new Date(min)).toDateString().split(' ');
					min = min[1] + '   ' + min[2] + '   ' + min[3];
					
					max = (new Date(max)).toDateString().split(' ');
					max = max[1] + '   ' + max[2] + '   ' + max[3];
					
					return {
						'title': d[0][global_key],
						'release    dates': 'from    ' + min + '    to    ' + max,
						'platform': d[0].platform,
						'genre': global_key === 'platform' ? 'A    bunch' : d[0].genre,
						'developer': 'A    bunch',
						'publisher': 'A    bunch',
						'sales': d3.sum(d, function(p) { return p.sales; }),
						'metascore': Math.round(d3.mean(d, function(p) { return p.metascore; }) * 10) / 10,
						'critic_reviews_count': Math.round(d3.mean(d, function(p) { return p['critic_reviews_count']; }) * 10) / 10,
						'userscore': Math.round(d3.mean(d, function(p) { return p.userscore; }) * 10) / 10,
						'user_reviews_count': Math.round(d3.mean(d, function(p) { return p['user_reviews_count']; }) * 10) / 10,
					};
				})
				.entries(self.timeline.filtered)
				.map(function(d) { return d.value; });
						
			self.chart.update(aggregated_data);
		}
		else
		{
			self.chart.update(self.timeline.filtered);
		}
	}
	
	arc_tween(radius, startAngle, endAngle)
	{
		let self = this;
		
		return function(d)
		{
			let r_interp = d3.interpolate(d.current_radius, radius);
			let sa_interp = d3.interpolate(d.current_startAngle, startAngle);
			let ea_interp = d3.interpolate(d.current_endAngle, endAngle);
			
			return function(t)
			{
				d.current_radius = r_interp(t);
				d.current_startAngle = sa_interp(t);
				d.current_endAngle = ea_interp(t);
				
				d.startAngle = d.current_startAngle;
				d.endAngle = d.current_endAngle;
				self.arc.innerRadius(.65 * d.current_radius);
				self.arc.outerRadius(d.current_radius);
				
				return self.arc(d);
			};
		};
	}
	
	click(key, data)
	{		
		//	Interactions HAVE to be disabled, all the rings MUST 
		//	return into non-highlighted state, otherwise donut ends up
		//	completely busted
		
		let self = this;
		disable_all_the_interactions(1.2, function(d)
		{
			filter[global_key] = key;
		
			if (global_key === 'platform')
			{
				global_key = 'genre';
			}
			else
			{
				aggregation_toggle(false);
			}
		
			self.filter();
			self.update();
		});
		
		d3.selectAll('.tooltip')
			.style('display', 'none');
	}
	
	filter()
    {
		let self = this;
		
		self.current = self.data.filter(function(d)
		{
			return d.platform.search('^' + filter.platform + '$') != -1 &&
					d.genre.search('^' + filter.genre + '$') != -1;
		});
	}
	
	highlight(key, arg, duration, delay)
	{
		let self = this;
		self.arc.outerRadius(arg ? 1.15 * self.radius : 1.00 * self.radius);
		
		d3.selectAll('.' + classify(key))
			.call(highlight_toggle, arg, duration, delay)
			.filter('.ring')
			.transition('ring transition')
			.duration(duration)
			.delay(delay)
			.attr('d', self.arc);
	}
}
