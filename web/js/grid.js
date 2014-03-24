(function(){

  // expect jQuery as $
  if (!jQuery || $ !== jQuery) {
    console.log('jQuery required!');
    return;
  }
  // expect d3
  if (!d3) {
    console.log('d3.js required!');
    return;
  }

  console.log('grid loaded');

  $(document).ready(function() {
    // decode grid data
    $('.grid').each(function(index, gridDom) {
      $(gridDom).data(JSON.parse(Base64.decode($(gridDom).attr('data'))));
      console.log($(gridDom).data());
    });

    // draw all the grids
    $('.grid').each(function(index, gridDom) {

      var cellSize = 20;
      if ($(gridDom).data().cellSize) {
        cellSize = parseInt($(gridDom).data().cellSize, 10);
      }
      var padding = 4;

      // dimensions: columns x rows
      var dimensions = $(gridDom).data().dimensions.split('x');

      var gridWidth  = cellSize * dimensions[0];
      var gridHeight = cellSize * dimensions[1];

      var boardWidth  = gridWidth  + 2 * padding;
      var boardHeight = gridHeight + 2 * padding;

      $(gridDom).html('');
      var board = d3.select(gridDom).append('svg')
        .attr('width' , boardWidth )
        .attr('height', boardHeight);

      board
        .append('rect')
        .attr('class', 'go-board')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', boardWidth)
        .attr('height', boardHeight)
        ;

      var grid = board.append('g')
        .attr('transform', 'translate(' + padding + ',' + padding + ')');

      var leftEnd   =              cellSize / 2;
      var rightEnd  = gridWidth  - cellSize / 2;
      var topEnd    =              cellSize / 2;
      var bottomEnd = gridHeight - cellSize / 2;

      var yPos = d3.scale.linear().domain([0, dimensions[1]])
        .range([cellSize / 2, gridHeight + cellSize / 2]);
      var xPos = d3.scale.linear().domain([0, dimensions[0]])
        .range([cellSize / 2, gridWidth  + cellSize / 2]);

      var horizontalLineGroup = grid.append('g');
      horizontalLineGroup.selectAll('line')
        .data(d3.range(dimensions[1]))
        .enter().append('line')
        .attr('class', 'go-line')
        .attr('x1', leftEnd)
        .attr('y1', yPos)
        .attr('x2', rightEnd)
        .attr('y2', yPos)
        ;

      var verticalLineGroup = grid.append('g');
      verticalLineGroup.selectAll('line')
        .data(d3.range(dimensions[0]))
        .enter().append('line')
        .attr('class', 'go-line')
        .attr('x1', xPos)
        .attr('y1', topEnd)
        .attr('x2', xPos)
        .attr('y2', bottomEnd)
        ;

      if ($(gridDom).data().stars) {
        var starGroup = grid.append('g');
        starGroup.selectAll('circle')
          .data($(gridDom).data().stars)
          .enter().append('circle')
          .attr('class', 'go-star')
          .attr('cx', function(d) { return xPos(d[0]); })
          .attr('cy', function(d) { return yPos(d[1]); })
          .attr('r', 2.5)
          ;
      }

    });

  });

}());
