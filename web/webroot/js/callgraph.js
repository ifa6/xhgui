/**
 * Generate a callgraph visualization based on the provided data.
 */
Xhgui.callgraph = function (container, data) {
    var el = d3.select(container),
        width = parseInt(el.style('width'), 10),
        height = 2000;

    var cluster = d3.layout.cluster()
        .size([height, width - 160]);

    var diagonal = d3.svg.diagonal()
        .projection(function (d) { return [d.y, d.x]; });

    var svg = d3.select(container).append('svg')
        .attr('class', 'callgraph')
        .attr('width', width)
        .attr('height', height)
            .append('g').attr('transform','translate(40,0)');

    var nodes = cluster.nodes(data),
        links = cluster.links(nodes);

    var link = svg.selectAll('.link')
        .data(links)
        .enter().append('path')
            .attr('class', 'link')
            .attr('d', diagonal);

    var node = svg.selectAll('.node')
        .data(nodes)
        .enter().append('g')
            .attr('class', 'node')
            .attr('transform', function (d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

    var circle = node.append('circle')
        .attr('r', function (d) {
            return 1.2 * d.value;
        });

    // Set tooltips on circles.
    Xhgui.tooltip(el, {
        bindTo: node,
        positioner: function (d, i) {
            // Use the transform property to
            // find where the node is.
            var transform = this.getAttribute('transform');
            var match = transform.match(/translate\((.*),(.*)\)/);
            var xOffset = parseFloat(match[1]);
            var yOffset = parseFloat(match[2]);

            return {
                // 7 = 1/2 width of arrow, 40 = canvas translate
                x: xOffset + 40 - 7,
                // 30 = fudge factor.
                y: yOffset - 30
            };
        },
        formatter: function (d, i) {
            var label = '<strong>' + d.name +
                '</strong> ' + d.value + '%';
            return label;
        }
    });

    /*
    node.append('text')
        .attr('dx', function (d) {
            return d.children ? -5 : 5;
        })
        .attr('dy', function (d) {
            return d.depth % 2 == 0 ? -12 : 12;
        })
        .style('display', function (d) {
            return d.value > 5 ? 'block' : 'none';
        })
        .style('text-anchor', function (d) {
            return d.children ? 'end' : 'start';
        })
        .text(function (d) {
            return d.name;
        });
        */

};
