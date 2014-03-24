(function(){

  function makeId(id) {
    return 'grid' + id;
  };

  var grid = function(converter) {
    return [
      {
        type: 'lang',
        filter: function(text) {
          this.gridCount = 0;

          return text.replace(/!!grid((.|\n)*?)!!/g, function(match, contents) {
            var params;
            try {
              params = JSON.parse(contents);
            } catch (e) {
              return '';
            }

            var encoded = new Buffer(contents).toString('base64');

            var id = this.gridCount++;
            var lines = [];
            lines.push('<div class="grid" id="' + makeId(id) + '" data="' + encoded + '">');
            lines.push('</div>');
            return lines.join('');
          }.bind(this));
        }.bind(this)
      }
    ];

  };

  // Client-side export
  if (typeof window !== 'undefined' && window.Showdown && window.Showdown.extensions) {
    window.Showdown.extensions.grid = grid;
  }
  // Server-side export
  if (typeof module !== 'undefined') { module.exports = grid; }
}());
