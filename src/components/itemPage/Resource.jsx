import React from 'react';

let Resource = React.memo((props) => {

  const EXTENSION = /\.[\w{3,4}]+(?=[?]|$)/;
  const URI_SEGMENT = /[^/]+/g;

  let getResourceType = (resource) => {
    if (typeof resource === 'string') {
      try {
        let uri = resource;
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
    } else {
      return 'object';
    }
  };

  let resource = props.resource && props.resource[0];
  //let uri = props.resource && props.resource[0];
  if (!resource) return null;
  //let fileName = uri.match(URI_SEGMENT).slice(-1)[0];
  switch (getResourceType(resource)) {
    case 'image':
      console.log('on est dans le cas image');
      return (
        <div className="p-3">
          <a href={resource} target="_blank" className="cursor-zoom"
            rel="noopener noreferrer">
            <img src={resource} alt="fileName" />
          </a>
        </div>
      );
    case 'object':
      let videoUri = 'https://www.youtube.com/embed/';
      const END = /\=[\w{1,12}]/ ;
      let videoId = resource.lien[0].split(/\=/)[1];
      console.log(videoId);
      videoUri = videoUri + videoId;
      return (
        <div className="p-3">
          <iframe width="420" height="315"
            src={videoUri} allowFullScreen>
          </iframe>
          <pre>{resource.lyrics}</pre>
          <a href={resource.pic} target="_blank" className="cursor-zoom"
            rel="noopener noreferrer">
            <img src={resource.pic} alt="fileName" />
          </a>
        </div>
      );
    default: return (
      <div className="p-3">
        <a href={resource} className="btn btn-light" >"fileName"</a>
      </div>
    );
  }

});

export default Resource;
