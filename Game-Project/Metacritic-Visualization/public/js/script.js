
let color = d3.scaleOrdinal(d3.schemeCategory20);
let default_opacity = 0.6;

let global_key = 'platform';

let font_size = 15;
let duration = 800;
let width = 1300;

let global_length = 0;

let body_bottom = 0;

let xmargin = 20;
let ymargin = 10;

let button_radius = 15;

let checkbox = null;
let aggregate = true;

let filter = {
	platform : '.*',
	genre : '.*'};

function aggregation_toggle(arg)
{
	aggregate = arg;
	checkbox.data([arg]);
	
	let radius = arg ? button_radius - 5 : 0;
	
	checkbox.select('.indicator')
		.transition()
		.duration(duration)
		.attr('r', radius);
}

function highlight_toggle(element, arg, duration, delay)
{
	element.transition('highlight')
		.duration(duration)
		.delay(delay)
		.style('opacity', arg ? 1 : default_opacity);
}

function attr_tween(element, attr, val, duration, delay)
{
	element.transition(attr + val)
		.duration(duration)
		.delay(delay)
		.attr(attr, val);	
}

function disable_all_the_interactions(k, callback = null)
{
	let all = d3.selectAll('.interactive');
	all.attr('pointer-events', 'none');
	setTimeout(function()
	{
		all.attr('pointer-events', null);
		if(callback)
		{
			callback();
		}
	}, k * duration)
}

function range(arg)
{
	let result = [];
	for(let i = 0; i < arg; ++i)
	{
		result.push(i);
	}
	return result;
}

function classify(str)
{
	return 'c' + str.replace(/\s+/g, '');
}

function increase_spaces(str)
{
	result = str;
	
	result = result.replace(' ', '    ');
	result = result.replace('_', '    ');
	return result;
}

let header = d3.select('#header')
	.append('svg')
	.attr('transform', 'translate(' + xmargin + ', ' + ymargin + ')')
	.attr('width', width + xmargin)
    .attr('height', 40 + ymargin)
    .style('opacity', default_opacity);

header
	.append('text')
	.attr('font-size', 1.5 * font_size + 'px')
	.attr('text-anchor', 'middle')
	.attr('x', width / 2)
	.attr('y', 30)
	.attr('xml:space', 'preserve')
	.text('Games    visualization');

d3.json('data/data.json', function(error, data)
{	
	// Specifying the fields order
	data = data.map(function(d)
	{
		return {
			'title': d.title,
			'released': d.released,
			'platform': d.platform,
			'genre': d.genre,
			'developer': d.developer,
			'publisher': d.publisher,
			'sales': +d.sales,
			'metascore': +d.metascore,
			'critic_reviews_count': +d.reviews_count,
			'userscore': +d.userscore,
			'user_reviews_count': +d.user_reviews_count,
			'content_rating': d.rating,
		};
	})
	
	data.sort(function(a, b)
	{
		return +Date.parse(b.released) - +Date.parse(a.released);
	});

    let chart = new Chart();
    let donut = new Donut(data, chart);
    let timeline = new Timeline(donut);
    chart.donut = donut;

    body_bottom = document.body.scrollHeight;
});
