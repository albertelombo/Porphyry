import React, {useState} from 'react';

let Resource = React.memo((props) => {

  const EXTENSION = /\.[\w{3,4}]+(?=[?]|$)/;
  const URI_SEGMENT = /[^/]+/g;

  const [rights, setRights] = useState(false);
  const [user, setUser] = useState({user: ''});

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

  function requestSession(options) {
    return props.conf.then(x => {
      options = options || {};
      options.credentials = 'include';
      return fetch(x.services[0] + '/_session', options);
    });
  }

  function fetchSession() {
    requestSession()
      .then(x => x.json())
      .then(x => setUser({user: x.name || x.userCtx.name}))
      .catch(() => setUser({user: ''}));
  }

  let isAuthenticated = () => {
    fetchSession();
    console.log('The user is: ' + user.user);
    if (user.user == '' || user.user == null) {
      return false;
    }
    return true;
  };

  let handleClick = () => {
    if (isAuthenticated()) {
      setRights(true);
    } else {
      alert('Il faut être authentifié pour avoir les paroles');
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
          <br />
          {rights ? <pre>{resource.lyrics}</pre> : <button onClick={handleClick} className="btn btn-primary">Charger les paroles </button> }
          <br />
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
