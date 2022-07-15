import React from 'react';

let Resource = React.memo((props) => {

  const EXTENSION = /\.[\w{3,4}]+(?=[?]|$)/;
  const URI_SEGMENT = /[^/]+/g;

  let getMediaType = (uri) => {
    try {
      if (/optimized/.test(uri)) return 'image';
      console.log(uri.match(EXTENSION)[0]);
      switch (uri.match(EXTENSION)[0]) {
        case '.gif':
        case '.jpg':
        case '.jpeg':
        case '.png':
        case '.svg':
        case '.webp':
          return 'image';
        default: return null;
      }
    } catch (e) {
      return null;
    }
  };

  let uri = props.href && props.href[0];
  if (!uri) return null;
  console.log(uri);
  let fileName = uri.match(URI_SEGMENT).slice(-1)[0];
  switch (getMediaType(uri)) {
    case 'image': return (
      <div className="p-3">
        <a href={uri} target="_blank" className="cursor-zoom"
          rel="noopener noreferrer">
          <img src={uri} alt="fileName" />
        </a>
      </div>
    );
    default: return (
      <div className="p-3">
        <a href={uri} className="btn btn-light" > {fileName} </a>
      </div>
    );
  }

});

export default Resource;
