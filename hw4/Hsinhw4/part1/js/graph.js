
class Graph
{
    constructor(data)
    {
        var self = this;
		self.vertices = data.map(function(d)
        {
            return { data: d, x: Math.random() * 1000, y: Math.random * 1000 };
        });
        self.edges = [];
        self.vertices.forEach(function (source)
        {
            source.data.partners.forEach(function (id)
            {
                var target = self.vertices.find(function (d) { return d.data.id === id; });
                if (typeof (target) != 'undefined')
                    self.edges.push({ source: source, target: target });
            });
        });
        self.xscale;
        self.yscale;
        self.force = d3.forceSimulation(self.vertices)
            .velocityDecay(0.2)
            .alphaDecay(0.05);
    }

    sorted(attribute)
    {
        var sorted = this.vertices.slice().sort(function (a, b)
        {
            return +b.data[attribute] - +a.data[attribute];
        });

        sorted = sorted.map(function (d)
        {
            return d.data[attribute];
        });

        return sorted;
    }

    set_scale(range, attribute)
    {
        var scale;

        if (typeof (attribute) === 'undefined')
        {
            scale = d3.scaleLinear().range([100, 100]).domain([0, 0]).clamp(true);
            return scale;
        }

        var sorted = this.sorted(attribute);

        if (d3.select("#fixed").property("checked"))
        {
            scale = d3.scaleBand().range(range).domain(sorted);
        }
        else
        {
            scale = d3.scaleLinear().range(range).domain([sorted[0], sorted[sorted.length - 1]]);
        }
        return scale;
    }

    linear_layout()
    {
        var self = this;
        var attributes = d3.select("select:not([disabled])").node().value.split(" ");

        self.yscale = self.set_scale([10, svg.attr('height') - 10], attributes[0]);
        self.xscale = self.set_scale([svg.attr('width') - 40, 10], attributes[1]);

        self.vertices.forEach(function (d, i)
        {
            d.y = self.yscale(d.data[attributes[0]]);
            d.x = self.xscale(d.data[attributes[1]]);
        });
    }

    circular_layout()
    {
        var self = this;

        var attribute = d3.select("select:not([disabled])").node().value;

        var bgrouped = d3.select("#group").property("checked");

        var grouped, radius;

        if (bgrouped)
        {
            grouped = d3.nest()
                .key(function (d) { return d.data.continent; })
                .entries(this.vertices);
            radius = 100;
        }
        else
        {
            grouped = [{ key: '', values: this.vertices }];
            radius = 210;
        }

        var pies = [];

        grouped.forEach(function (d)
        {
            var pie = d3.pie().value(1)
                .sort(function (a, b) {
                    return +b.data[attribute] - +a.data[attribute];
                })(d.values);

            pies.push(pie);
        });

        var groupie = d3.pie().value(1)(pies);

        groupie.forEach(function (d)
        {
            var main_centroid = bgrouped ? d3.arc().outerRadius(210).innerRadius(210).centroid(d) : [0, 0];

            d.data.forEach(function (pie)
            {
                var centroid = d3.arc().outerRadius(radius).innerRadius(radius).centroid(pie);
                pie.data.x = centroid[0] + main_centroid[0] + svg.attr('width') / 2;
                pie.data.y = centroid[1] + main_centroid[1] + svg.attr('height') / 4; 
            })
        });
    }

    force_layout()
    {
        var self = this;

        var bgrouped = d3.select("#group").property("checked");

        if (d3.select("#group").property("checked"))
        {
            var grouped = d3.nest()
                .key(function (d) { return d.data.continent; })
                .entries(self.vertices);

            var centers = [];

            d3.pie().value(1)(grouped).forEach(function (d, i)
            {
                var centroid = d3.arc().outerRadius(250).innerRadius(250).centroid(d);
                centers.push({ key: d.data.key, value: [centroid[0] + svg.attr('width') / 2, centroid[1] + svg.attr('height') / 4]});
            });

            self.force.nodes(self.vertices)
                .force('x', d3.forceX(function (d)
                {
                    return centers.find(function (c) { return c.key === d.data.continent; }).value[0];
                }))
                .force('y', d3.forceY(function (d)
                {
                    return centers.find(function (c) { return c.key === d.data.continent; }).value[1];
                }))
        }
        else
        {
            self.force.nodes(self.vertices)
                .force('x', d3.forceX(svg.attr('width') / 2))
                .force('y', d3.forceY(svg.attr('height') / 4))
        }

        self.force
            .force('collision', d3.forceCollide().radius(10))
            .alpha(1)
            .on('tick', function () {
                self.draw(0);
            })
            .restart();
    }

    draw(duration)
    {
        svg.selectAll('.link').transition()
            .duration(duration)
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        svg.selectAll('.node').transition()
            .duration(duration)
            .attr("transform", function (d, i)
            {
                return "translate(" + d.x + ", " + d.y + ")";
            });
    }

    update(svg, layout)
    {
        var self = this;
        self.force.stop();

        switch (layout)
        {
            case 'linear':
            case 'scatterplot':
                self.linear_layout();
                break;
            case 'circular':
                self.circular_layout();
                break;
            case 'force':
                self.force_layout();
                break;
            default:
                break;
        };

        var edges = svg.selectAll(".link")
            .data(self.edges)
            .enter()
            .append("line")
            .attr("class", "link");

        var vertices = svg.selectAll(".node")
            .data(self.vertices)
            .enter()
            .append("g")
            .attr("class", "node")
            .on("mouseover", function (d) {
                self.select(d);
            })
            .on("mouseleave", function () {
                self.clean();
            });

        vertices.append("circle").attr("r", 5);

        vertices.append("text").text(function (d) { return d.data.name; })
            .attr("text-anchor", "start")
            .attr("x", 10)
            .attr("y", 3)
            .attr("font-size", "10px");

        self.draw(600);
    }

    select(node)
    {
        var nodes = svg.selectAll('.node')
            .attr('class', 'node not_adjacent');
        var links = svg.selectAll('.link')
            .attr('class', 'link not_adjacent');

        nodes.filter(function (d) {
            return node.data.partners.indexOf(d.data.id) != -1;
        }).attr('class', 'node adjacent');

        links.filter(function (d) {
            return d.source == node;
        }).attr('class', 'link adjacent');
    }

    clean()
    {
        svg.selectAll('.node').attr('class', 'node');
        svg.selectAll('.link').attr('class', 'link');
    }
}